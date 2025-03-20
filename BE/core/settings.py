import os
from dotenv import load_dotenv

load_dotenv()
DEVICE = "cpu"
MODEL_PATHS = {
    "LstmSpeakerEncoder": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\speaker_encoder\lstm\lstm_speaker_encoder.pt",
    "TransformerSpeakerEncoder": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\speaker_encoder\transformer\transformer_speaker_encoder.pt",
    "ModifiedUNet": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_enhancement\denoise\modified_unet.keras",
    "UNet": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_enhancement\denoise\unet.keras",
    "UNetPlusPlus": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_enhancement\denoise\Unet_plusplus.keras",
    "UNet100": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_enhancement\denoise\unet-100%-data.keras",
    "CNN50": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_enhancement\denoise\cnn-50%-data.keras",
    "CNN100": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_enhancement\denoise\cnn-100%-data.keras",
    "EN_TACOTRON": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_cloning\EN_TACOTRON.pt",
    "VI_TACOTRON": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_cloning\VI_TACOTRON.pt",
    "Mel2Mag": r"D:\Code\AI_project\Voice_cloning_VN\MODEL\voice_cloning\MEL_to_MAG_MODEL.pt",
}

ACRONYMS_FILEPATH = "core/utils/text2sequence/vn/text_bank/acronyms.json"
BASE_NUMBERS_FILEPATH = "core/utils/text2sequence/vn/text_bank/base_numbers.json"
DATE_PREFIXES_FILEPATH = "core/utils/text2sequence/vn/text_bank/date_prefixes.json"
FINAL_CONSONANTS_FILEPATH = "core/utils/text2sequence/vn/text_bank/final_consonants.json"
HEAD_CONSONANTS_FILEPATH = "core/utils/text2sequence/vn/text_bank/head_consonants.json"
LETTERS_FILEPATH = "core/utils/text2sequence/vn/text_bank/letters.json"
NUMBER_LEVELS_FILEPATH = "core/utils/text2sequence/vn/text_bank/number_levels.json"
SAME_PHONEMES_FILEPATH = "core/utils/text2sequence/vn/text_bank/same_phonemes.json"
SYMBOLS_FILEPATH = "core/utils/text2sequence/vn/text_bank/symbols.json"
TONES_FILEPATH = "core/utils/text2sequence/vn/text_bank/tones.json"
UNITS_FILEPATH = "core/utils/text2sequence/vn/text_bank/units.json"
VOWELS_FILEPATH = "core/utils/text2sequence/vn/text_bank/vowels.json"

TTS_STOP_THRESHOLD = -3.4

EN_TACOTRON_PARAMS = {
    "embed_dims": 512, 
    "num_chars": 66, 
    "encoder_dims": 256, 
    "decoder_dims": 128, 
    "n_mels": 80, 
    "fft_bins": 80, 
    "postnet_dims": 512, 
    "encoder_K": 5, 
    "lstm_dims": 1024, 
    "postnet_K": 5, 
    "num_highways": 4,
    "dropout": 0.5, 
    "stop_threshold": TTS_STOP_THRESHOLD, 
    "speaker_embedding_size": 256
}

VI_TACOTRON_PARAMS = {
    "embed_dims": 512, 
    "num_chars": 93, 
    "encoder_dims": 256, 
    "decoder_dims": 128, 
    "n_mels": 80, 
    "fft_bins": 80, 
    "postnet_dims": 512, 
    "encoder_K": 5, 
    "lstm_dims": 1024, 
    "postnet_K": 5, 
    "num_highways": 4,
    "dropout": 0.5, 
    "stop_threshold": TTS_STOP_THRESHOLD, 
    "speaker_embedding_size": 256
}