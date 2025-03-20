import { useState } from "react";
import { compareSpeakers } from "../api/speakerVerification";
import { MAX_FILE_SIZE } from "../configs/constant";
import useAudioRecorder from "./useAudioRecorder";

const useSpeakerVerification = () => {
    const [firstAudio, setFirstAudio] = useState(null);
    const [secondAudio, setSecondAudio] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modelType, setModelType] = useState("transformer");

    const {
        isRecording: isRecordingFirst,
        recordedAudio: firstRecordedAudio,
        hasPermission,
        startRecording: startRecordingFirst,
        stopRecording: stopRecordingFirst,
        requestMicrophonePermission
    } = useAudioRecorder();

    const {
        isRecording: isRecordingSecond,
        recordedAudio: secondRecordedAudio,
        startRecording: startRecordingSecond,
        stopRecording: stopRecordingSecond
    } = useAudioRecorder();

    const validateAudioFile = (file, inputName) => {
        if (file.size > MAX_FILE_SIZE) {
            alert(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB. Your ${inputName}: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
            return false;
        }

        const allowedTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg'];
        if (!allowedTypes.includes(file.type)) {
            alert(`Please select a valid audio file (WAV, MP3, or OGG). Your ${inputName}: ${file.name} (${file.type})`);
            return false;
        }
        return true;
    };

    const handleFirstAudioChange = (e) => {
        const file = e.target.files[0];
        if (file && validateAudioFile(file, "first audio")) {
            setFirstAudio(file);
        } else {
            e.target.value = '';
        }
    };

    const handleSecondAudioChange = (e) => {
        const file = e.target.files[0];
        if (file && validateAudioFile(file, "second audio")) {
            setSecondAudio(file);
        } else {
            e.target.value = '';
        }
    };

    const handleModelChange = (e) => {
        setModelType(e.target.value);
    };

    const handleSubmit = async (e, denoise) => {
        e.preventDefault();
        const audioToProcessFirst = firstRecordedAudio || firstAudio;
        const audioToProcessSecond = secondRecordedAudio || secondAudio;

        if (!audioToProcessFirst || !audioToProcessSecond) {
            alert("Please provide both audio inputs.");
            return;
        }

        const formData = new FormData();
        formData.append("first_audio", audioToProcessFirst);
        formData.append("second_audio", audioToProcessSecond);
        formData.append("denoise", denoise);

        try {
            setIsLoading(true);
            const data = await compareSpeakers(formData, modelType);
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        firstAudio,
        secondAudio,
        firstRecordedAudio,
        secondRecordedAudio,
        result,
        isLoading,
        isRecordingFirst,
        isRecordingSecond,
        hasPermission,
        modelType,
        handleFirstAudioChange,
        handleSecondAudioChange,
        handleModelChange,
        handleSubmit,
        startRecordingFirst,
        stopRecordingFirst,
        startRecordingSecond,
        stopRecordingSecond,
        requestMicrophonePermission
    };
};

export default useSpeakerVerification; 