import time
from io import BytesIO
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from enum import Enum
import base64

from speaker_verification.models import TRANSFORMER_SPEAKER_ENCODER, LSTM_SPEAKER_ENCODER
from speaker_verification.services.verifications import calculate_cosine_similarity
from voice_enhancement.services.denoise import predict_denoised_audio
from voice_enhancement.models import VoiceEnhancementModelManager

router = APIRouter(prefix="/speaker-verification")

class ModelType(str, Enum):
    TRANSFORMER = "transformer"
    LSTM = "lstm"

denoise_manager = VoiceEnhancementModelManager()

@router.post("/similarity")
async def compare_utterances(
    first_audio: UploadFile = File(...),
    second_audio: UploadFile = File(...),
    model_type: ModelType = Form(...),
    denoise: bool = Form(False)
):
    try:
        start_time = time.time()
        
        if model_type == ModelType.TRANSFORMER:
            model = TRANSFORMER_SPEAKER_ENCODER.model
        else:
            model = LSTM_SPEAKER_ENCODER.model
        
        # Read audio files
        first_audio_bytes = await first_audio.read()
        second_audio_bytes = await second_audio.read()

        # Denoise if the flag is set
        if denoise:
            print("Denoising audio...")
            denoise_model = denoise_manager.get_model("modified_unet")
            first_audio_bytes = predict_denoised_audio(first_audio_bytes, denoise_model).output_audio.getvalue()
            second_audio_bytes = predict_denoised_audio(second_audio_bytes, denoise_model).output_audio.getvalue()
        
        # Get similarity score and visualizations
        (similarity, mel_viz1, mel_viz2), (clean_audio1, clean_audio2) = calculate_cosine_similarity(
            model,
            BytesIO(first_audio_bytes),
            BytesIO(second_audio_bytes),
            model_type=model_type,
        )
        
        return JSONResponse(
            content={
                "similarity_score": similarity,
                "first_clean_audio": base64.b64encode(clean_audio1.read()).decode('utf-8'),
                "second_clean_audio": base64.b64encode(clean_audio2.read()).decode('utf-8'),
                "first_mel_spectrogram": base64.b64encode(mel_viz1).decode('utf-8'),
                "second_mel_spectrogram": base64.b64encode(mel_viz2).decode('utf-8'),
                "duration": time.time() - start_time,
                "model_type": model_type,
                "msg": "successful",
            },
            status_code=200,
        )
    except Exception as e:
        return JSONResponse(
            content={
                "error": str(e),
                "msg": "failed",
                "duration": time.time() - start_time,
            },
            status_code=500,
        )
