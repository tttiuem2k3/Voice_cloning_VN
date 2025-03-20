import { VOICE_ENHANCEMENT_API } from '../configs/endpoints';

export const models = [
    { displayName: "Unet", value: "modified_unet" }
    // { displayName: "CNN", value: "cnn100" },
];

export const fetchVoiceEnhancement = async (formData, modelName) => {
    formData.append("model_type", modelName);

    const response = await fetch(VOICE_ENHANCEMENT_API.DENOISE, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process audio.");
    }

    return response.json();
};
