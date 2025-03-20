import { TEXT_TO_SPEECH_API } from "../configs/endpoints";

export const generateSpeech = async (formData) => {
    const response = await fetch(TEXT_TO_SPEECH_API.GENERATE, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Text-to-speech generation failed");
    }

    return response.json();
};
