import { SPEAKER_VERIFICATION_API } from '../configs/endpoints';

export const models = [
    // { displayName: "LSTM", value: "lstm" },
    { displayName: "Transformer", value: "transformer" },
];

export const compareSpeakers = async (formData, modelType) => {
    formData.append("model_type", modelType);

    const response = await fetch(SPEAKER_VERIFICATION_API.SIMILARITY, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to compare speakers.");
    }

    return response.json();
};
