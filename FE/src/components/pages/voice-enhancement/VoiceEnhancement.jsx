import React from "react";
import useVoiceEnhancement from "../../../hooks/useVoiceEnhancement";
import { models } from "../../../api/voiceEnhancement";
import { MAX_FILE_SIZE } from "../../../configs/constant";
import "./VoiceEnhancement.css";

const VoiceEnhancement = () => {
    const {
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
    } = useVoiceEnhancement();

    const handleRecordMouseDown = async () => {
        try {
            if (hasPermission === null) {
                await requestMicrophonePermission();
            }
            await startRecording();
        } catch (error) {
            alert("Please grant microphone permissions to record audio. You may need to refresh the page after allowing access.");
        }
    };

    const handleRecordMouseUp = () => {
        stopRecording();
    };

    return (
        <div className="voice-enhancement">
            <h1>Voice Enhancement</h1>
            <form onSubmit={handleSubmit} className="upload-form">
                <div className="form-group">
                    <label>Choose your input method:</label>
                    <div className="input-methods">
                        <div className="upload-section">
                            <label htmlFor="audio-upload" className="file-input-label">
                                Upload Audio (WAV, MP3, OGG - Max {MAX_FILE_SIZE / (1024 * 1024)}MB)
                            </label>
                            <input
                                type="file"
                                id="audio-upload"
                                accept=".wav,.mp3,.ogg,audio/wav,audio/mpeg,audio/mp3,audio/ogg"
                                onChange={handleFileChange}
                                disabled={isLoading || isRecording}
                            />
                            <small className="file-info">
                                Supported formats: WAV, MP3, OGG
                                <br />
                                Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                            </small>
                        </div>
                        
                        <div className="record-section">
                            <button
                                type="button"
                                className={`record-button ${isRecording ? 'recording' : ''}`}
                                onMouseDown={handleRecordMouseDown}
                                onMouseUp={handleRecordMouseUp}
                                onMouseLeave={handleRecordMouseUp}
                                disabled={isLoading}
                            >
                                {isRecording ? 'Recording...' : hasPermission === false ? 'Microphone Access Denied' : 'Hold to Record'}
                            </button>
                            {recordedAudio && (
                                <div className="recorded-audio">
                                    <p>Recorded Audio:</p>
                                    <audio controls src={URL.createObjectURL(recordedAudio)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="model-select">Select Model:</label>
                    <select 
                        id="model-select" 
                        value={modelName} 
                        onChange={handleModelChange}
                        disabled={isLoading || isRecording}
                    >
                        {models.map((model) => (
                            <option key={model.value} value={model.value}>
                                {model.displayName}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={isLoading || isRecording}>
                    {isLoading ? "Processing..." : "Submit"}
                </button>
            </form>

            {result && (
                <div className="results">
                    <h2>Results</h2>
                    <div className="processing-info">
                        <div className="info-item">
                            <span className="info-label">Processing Time:</span>
                            <span className="info-value">{result.duration.toFixed(2)}s</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Model Used:</span>
                            <span className="info-value">{result.model_type}</span>
                        </div>
                    </div>
                    <div className="section_all">
                        <div className="section">
                            <h3>Input Audio</h3>
                            <audio controls src={rawAudio ? URL.createObjectURL(rawAudio) : ""} />
                            <h3>Voice + Noise</h3>
                            <img
                                src={`data:image/png;base64,${result.wave_voice_noise}`}
                                alt="Waveform Voice + Noise"
                            />
                        </div>
                        <div className="section">
                            <h3>Noise Reduction Audio</h3>
                            <audio controls src={`data:audio/wav;base64,${result.audio_base64}`} />
                            <h3>Predicted Noise</h3>
                            <img
                                src={`data:image/png;base64,${result.wave_predicted_noise}`}
                                alt="Waveform Predicted Noise"
                            />
                            
                        </div>   
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceEnhancement;
