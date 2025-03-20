import { useState } from "react";
import { generateSpeech } from "../api/textToSpeech";
import useAudioRecorder from "./useAudioRecorder";

const useTextToSpeech = () => {
    const [rawAudio, setRawAudio] = useState(null);
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState("vi");

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
            if (file.size > 5 * 1024 * 1024) { // 5MB
                alert("File size must be less than 5MB");
                e.target.value = '';
                return;
            }

            const allowedTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg'];
            if (!allowedTypes.includes(file.type)) {
                alert(`Please select a valid audio file (WAV, MP3, or OGG)`);
                e.target.value = '';
                return;
            }

            setRawAudio(file);
            setRecordedAudio(null); // Reset recorded audio when file is uploaded
        }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const handleSubmit = async (e,denoise) => {
        e.preventDefault();
        const audioToProcess = rawAudio || recordedAudio;
        
        if (!audioToProcess && !text) {
            alert("Please upload an audio file, record audio, or enter text.");
            return;
        }

        const formData = new FormData();
        if (audioToProcess) formData.append("audio", audioToProcess);
        if (text) formData.append("text", text);
        formData.append("lang", language);
        formData.append("denoise", denoise);
        try {
            setIsLoading(true);
            const data = await generateSpeech(formData);
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
        text,
        result,
        isLoading,
        isRecording,
        hasPermission,
        language,
        handleFileChange,
        handleTextChange,
        handleLanguageChange,
        handleSubmit,
        startRecording,
        stopRecording,
        requestMicrophonePermission
    };
};

export default useTextToSpeech;
