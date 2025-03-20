import base64
import time
from io import BytesIO
from fastapi import APIRouter, UploadFile, File, Form
import io
import soundfile as sf
from text_to_speech_pro.gen_audio import generate_speech_pro
from fastapi.responses import JSONResponse
import tempfile
import os

from voice_enhancement.services.denoise import predict_denoised_audio
from voice_enhancement.models import VoiceEnhancementModelManager

router = APIRouter(prefix="/voice-cloning")
denoise_manager = VoiceEnhancementModelManager()

@router.post("/tacotron")
async def text2speech_model1(
    text: str = Form(...), audio: UploadFile = File(...), lang: str = Form(...), denoise: bool = Form(False)
):
    start_time = time.time()

    # Tạo file tạm cho âm thanh gốc
    temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    temp_audio.write(await audio.read())
    temp_audio.close()
    print("Denoise Audio:", denoise)

    try:
        reference_audio = temp_audio.name  # Mặc định dùng file gốc

        if denoise:
            print("Denoising audio...")
            denoise_model = denoise_manager.get_model("modified_unet")

            # Đọc dữ liệu từ file tạm
            with open(temp_audio.name, "rb") as f:
                audio_bytes = f.read()

            # Xử lý khử nhiễu
            denoised_audio_bytes = predict_denoised_audio(audio_bytes, denoise_model).output_audio.getvalue()

            # Lưu âm thanh đã khử nhiễu vào file tạm khác
            temp_denoised_audio = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
            temp_denoised_audio.write(denoised_audio_bytes)
            temp_denoised_audio.close()
            reference_audio = temp_denoised_audio.name  # Cập nhật đường dẫn file khử nhiễu

        # Gọi model
        data = generate_speech_pro(input_text=text, reference_audio=reference_audio, lang=lang)

        # Kiểm tra nếu model trả về None
        if data is None:
            raise ValueError("Lỗi: Model generate_speech_pro() trả về None")

        data["duration"] = time.time() - start_time

    finally:
        os.remove(temp_audio.name)  # Xóa file âm thanh gốc
        if denoise:
            os.remove(reference_audio)  # Xóa file âm thanh khử nhiễu

    return JSONResponse(content=data)


