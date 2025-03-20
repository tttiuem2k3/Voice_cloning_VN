import { useState } from "react";
import { fetchVoiceEnhancement } from "../api/voiceEnhancement";
import { VOICE_ENHANCEMENT_DEFAULT_MODEL } from "../configs/constant";
import { MAX_FILE_SIZE } from "../configs/constant";
import useAudioRecorder from "./useAudioRecorder";

const useVoiceEnhancement = () => {
    const [rawAudio, setRawAudio] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modelName, setModelName] = useState(VOICE_ENHANCEMENT_DEFAULT_MODEL);
    const { 
        isRecording, 
        recordedAudio, 
        hasPermission,
        startRecording, 
        stopRecording, 
        setRecordedAudio,
        requestMicrophonePermission 
    } = useAudioRecorder();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                alert(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB. Your file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                e.target.value = '';
                return;
            }

            const allowedTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg'];
            if (!allowedTypes.includes(file.type)) {
                alert(`Please select a valid audio file (WAV, MP3, or OGG). Your file: ${file.name} (${file.type})`);
                e.target.value = '';
                return;
            }

            setRawAudio(file);
            setRecordedAudio(null); // Reset recorded audio when file is uploaded
        }
    };

    const handleModelChange = (e) => {
        setModelName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const audioToProcess = rawAudio || recordedAudio;
        
        if (!audioToProcess) {
            alert("Please upload an audio file or record audio.");
            return;
        }

        const formData = new FormData();
        formData.append("audio", audioToProcess);

        try {
            setIsLoading(true);
            const data = await fetchVoiceEnhancement(formData, modelName);
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        rawAudio,
        recordedAudio,
        result,
        isLoading,
        isRecording,
        hasPermission,
        modelName,
        handleFileChange,
        handleModelChange,
        handleSubmit,
        startRecording,
        stopRecording,
        requestMicrophonePermission
    };
};

export default useVoiceEnhancement;
