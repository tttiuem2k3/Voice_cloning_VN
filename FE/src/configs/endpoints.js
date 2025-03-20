export const API_BASE_URL = "http://127.0.0.1:8000";
export const USER_API = `${API_BASE_URL}/users`;
export const VOICE_ENHANCEMENT_API = {
    DENOISE: `${API_BASE_URL}/api/v1/voice-enhancement/denoise`,
};
export const SPEAKER_VERIFICATION_API = {
    SIMILARITY: `${API_BASE_URL}/api/v1/speaker-verification/similarity`,
};
export const TEXT_TO_SPEECH_API = {
    GENERATE: `${API_BASE_URL}/api/v1/voice-cloning/tacotron`,
};
