#---------------------- Tải mô hình và lưu------------------------
# import os
# from huggingface_hub import snapshot_download

# # Tạo thư mục lưu mô hình nếu chưa có
# model_dir = r".\Model"


# # Tải dữ liệu unidic (nếu cần)
# os.system("python -m unidic download")

# print(" > Tải mô hình...")
# snapshot_download(repo_id="thinhlpg/viXTTS",
#                   repo_type="model",
#                   local_dir=model_dir)
#-------------------------------------------------------------------
import os
import string
import unicodedata
from datetime import datetime
from pprint import pprint
import simpleaudio as sa
import torch
import torchaudio
from tqdm import tqdm
from underthesea import sent_tokenize
from unidecode import unidecode
from vinorm import TTSnorm
import io
import base64
import numpy as np
import soundfile as sf
from io import BytesIO
import re

from core.utils.text2sequence.vn.normalizers import TextNormalizer
from text_to_speech_pro.TTS.tts.configs.xtts_config import XttsConfig
from text_to_speech_pro.TTS.tts.models.xtts import Xtts

def clear_gpu_cache():
    if torch.cuda.is_available():
        torch.cuda.empty_cache()


def load_model(xtts_checkpoint, xtts_config, xtts_vocab):
    clear_gpu_cache()
    if not xtts_checkpoint or not xtts_config or not xtts_vocab:
        return "You need to run the previous steps or manually set the `XTTS checkpoint path`, `XTTS config path`, and `XTTS vocab path` fields !!"
    config = XttsConfig()
    config.load_json(xtts_config)
    XTTS_MODEL = Xtts.init_from_config(config)
    print("Loading XTTS model! ")
    XTTS_MODEL.load_checkpoint(config,
                               checkpoint_path=xtts_checkpoint,
                               vocab_path=xtts_vocab,
                               use_deepspeed=False)
    if torch.cuda.is_available():
        XTTS_MODEL.cuda()

    print("Model Loaded!")
    return XTTS_MODEL


def get_file_name(text, max_char=50):
    filename = text[:max_char]
    filename = filename.lower()
    filename = filename.replace(" ", "_")
    filename = filename.translate(str.maketrans("", "", string.punctuation.replace("_", "")))
    filename = unidecode(filename)
    current_datetime = datetime.now().strftime("%m%d%H%M%S")
    filename = f"{current_datetime}_{filename}"
    return filename


def calculate_keep_len(text, lang):
    if lang in ["ja", "zh-cn"]:
        return -1

    word_count = len(text.split())
    num_punct = (
        text.count(".")
        + text.count("!")
        + text.count("?")
        + text.count(",")
    )

    if word_count < 5:
        return 15000 * word_count + 2000 * num_punct
    elif word_count < 10:
        return 13000 * word_count + 2000 * num_punct
    return -1


def normalize_vietnamese_text(text):
    replacements = {
        r"\.\.": ".",   # Thay ".." bằng "."
        r"!\.": "!",    # Thay "!." bằng "!"
        r"\?\.": "?",   # Thay "?." bằng "?"
        r" \.": ".",    # Thay " ." bằng "."
        r" ,": ",",     # Thay " ," bằng ","
        r'"': "",       # Xóa dấu "
        r"'": "",       # Xóa dấu '
        r"\bAI\b": "Ây Ai",   # Thay "AI" bằng "Ây Ai"
        r"\bA\.I\b": "Ây Ai"  # Thay "A.I" bằng "Ây Ai"
    }

    for pattern, replacement in replacements.items():
        text = re.sub(pattern, replacement, text)
        
    text_normalizer = TextNormalizer()
    text_process = text_normalizer.normalize(text)
    return text_process



def run_tts(XTTS_MODEL, lang, tts_text, speaker_audio_file,
            normalize_text= True,
            verbose=False,
            output_chunks=False):
    """
    Run text-to-speech (TTS) synthesis using the provided XTTS_MODEL.

    Args:
        XTTS_MODEL: A pre-trained TTS model.
        lang (str): The language of the input text.
        tts_text (str): The text to be synthesized into speech.
        speaker_audio_file (str): Path to the audio file of the speaker to condition the synthesis on.
        normalize_text (bool, optional): Whether to normalize the input text. Defaults to True.
        verbose (bool, optional): Whether to print verbose information. Defaults to False.
        output_chunks (bool, optional): Whether to save synthesized speech chunks separately. Defaults to False.

    Returns:
        str: Path to the synthesized audio file.
    """

    if XTTS_MODEL is None or not speaker_audio_file:
        return "You need to run the previous step to load the model !!", None, None

    output_dir = "./text_to_speech_pro/output"
    os.makedirs(output_dir, exist_ok=True)

    gpt_cond_latent, speaker_embedding = XTTS_MODEL.get_conditioning_latents(
        audio_path=speaker_audio_file,
        gpt_cond_len=XTTS_MODEL.config.gpt_cond_len,
        max_ref_length=XTTS_MODEL.config.max_ref_len,
        sound_norm_refs=XTTS_MODEL.config.sound_norm_refs,
    )

    if normalize_text and lang == "vi":
        tts_text = normalize_vietnamese_text(tts_text)

    if lang in ["ja", "zh-cn"]:
        tts_texts = tts_text.split("。")
    else:
        tts_texts = sent_tokenize(tts_text)

    if verbose:
        print("Text for TTS:")
        pprint(tts_texts)

    wav_chunks = []
    for text in tqdm(tts_texts):
        if text.strip() == "":
            continue

        wav_chunk = XTTS_MODEL.inference(
            text=text,
            language=lang,
            gpt_cond_latent=gpt_cond_latent,
            speaker_embedding=speaker_embedding,
            temperature=0.3,
            length_penalty=1.0,
            repetition_penalty=10.0,
            top_k=30,
            top_p=0.85,
        )

        # Quick hack for short sentences
        keep_len = calculate_keep_len(text, lang)
        wav_chunk["wav"] = torch.tensor(wav_chunk["wav"][:keep_len])

        if output_chunks:
            out_path = os.path.join(output_dir, f"{get_file_name(text)}.wav")
            torchaudio.save(out_path, wav_chunk["wav"].unsqueeze(0), 24000)
            if verbose:
                print(f"Saved chunk to {out_path}")

        wav_chunks.append(wav_chunk["wav"])

    out_wav = torch.cat(wav_chunks, dim=0).unsqueeze(0)
    out_path = os.path.join(output_dir, f"{get_file_name(tts_text)}.wav")
    torchaudio.save(out_path, out_wav, 24000)

    if verbose:
        print(f"Saved final file to {out_path}")

    return out_path

# ---------Call mô hình-------------------
language_code_map = {
    "Tiếng Việt": "vi",
    "Tiếng Anh": "en",
    "Tiếng Tây Ban Nha": "es",
    "Tiếng Pháp": "fr",
    "Tiếng Đức": "de",
    "Tiếng Ý": "it",
    "Tiếng Bồ Đào Nha": "pt",
    "Tiếng Ba Lan": "pl",
    "Tiếng Thổ Nhĩ Kỳ": "tr",
    "Tiếng Nga": "ru",
    "Tiếng Hà Lan": "nl",
    "Tiếng Séc": "cs",
    "Tiếng Ả Rập": "ar",
    "Tiếng Trung (giản thể)": "zh-cn",
    "Tiếng Nhật": "ja",
    "Tiếng Hungary": "hu",
    "Tiếng Hàn": "ko",
    "Tiếng Hindi": "hi"
}

print("> Đang nạp mô hình text to speech...")
vixtts_model = None
try:
    if not vixtts_model:
        vixtts_model = load_model(xtts_checkpoint=r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_cloning\t2s_pro_model\model.pth",
                                xtts_config=r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_cloning\t2s_pro_model\config.json",
                                xtts_vocab=r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_cloning\t2s_pro_model\vocab.json")
except:
    vixtts_model = load_model(xtts_checkpoint=r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_cloning\t2s_pro_model\model.pth",
                                xtts_config=r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_cloning\t2s_pro_model\config.json",
                                xtts_vocab=r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_cloning\t2s_pro_model\vocab.json")

print("> Đã nạp mô hình text to speech thành công!")

# Hàm sinh audio text - to - speech
def generate_speech_pro(input_text,reference_audio,lang):
    normalize_text = True
    verbose = True
    output_chunks = True

    if not os.path.exists(reference_audio):
        print("⚠️ Bạn chưa tải file âm thanh lên. Hãy chọn giọng khác hoặc tải file của bạn lên. ⚠️")
        return None

    # Gọi mô hình để tạo tệp âm thanh
    audio_file = run_tts(vixtts_model,
                         lang=lang,
                         tts_text=input_text,
                         speaker_audio_file=reference_audio,
                         normalize_text=normalize_text,
                         verbose=verbose,
                         output_chunks=output_chunks)

    if isinstance(reference_audio, BytesIO):
        reference_audio.seek(0)  # Đảm bảo con trỏ ở đầu
    else:
        if not os.path.exists(reference_audio):
            print("⚠️ Bạn chưa tải file âm thanh lên. Hãy chọn giọng khác hoặc tải file của bạn lên. ⚠️")
            return None

    # Đọc file WAV vừa tạo
    audio_data, samplerate = sf.read(audio_file)

    # Ghi vào buffer
    audio_buffer = io.BytesIO()
    sf.write(audio_buffer, audio_data, samplerate=samplerate, format='WAV')
    audio_buffer.seek(0)

    # Chuyển thành base64
    base64_audio = base64.b64encode(audio_buffer.read()).decode("utf-8")
    process_text = input_text
    if lang =="vi":
        process_text  =   normalize_vietnamese_text(input_text)
    return {
        "base64_audio": base64_audio,
        "lang": lang,
        "process_text": process_text
    }

