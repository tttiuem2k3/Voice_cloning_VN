import React, { useState } from "react";
import useSpeakerVerification from "../../../hooks/useSpeakerVerification";
import { models } from "../../../api/speakerVerification";
import "./SpeakerVerification.css";

const SpeakerVerification = () => {
    const {
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
    } = useSpeakerVerification();

    const [denoise, setDenoise] = useState(false);

    const handleDenoiseChange = (e) => {
        setDenoise(e.target.checked);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e, denoise);
    };

    const handleFirstRecordMouseDown = async () => {
        try {
            if (hasPermission === null) {
                await requestMicrophonePermission();
            }
            await startRecordingFirst();
        } catch (error) {
            alert("Please grant microphone permissions to record audio.");
        }
    };

    const handleSecondRecordMouseDown = async () => {
        try {
            if (hasPermission === null) {
                await requestMicrophonePermission();
            }
            await startRecordingSecond();
        } catch (error) {
            alert("Please grant microphone permissions to record audio.");
        }
    };

    const similarityScore = result?.similarity_score;

    return (
        <div className="speaker-verification">
            <h1>Speaker Verification</h1>
            <form onSubmit={handleFormSubmit} className="upload-form">
                <div className="speaker-section">
                    <h2>First Speaker</h2>
                    <div className="input-methods">
                        <div className="upload-section">
                            <label className="file-input-label">
                                Upload Audio (WAV, MP3, OGG - Max 5MB)
                            </label>
                            <div className="file-input-container">
                                <label htmlFor="first-audio" className="choose-file-button">
                                    Choose File
                                </label>
                                <span className="file-name">
                                    {firstAudio ? firstAudio.name : 'No file chosen'}
                                </span>
                                <input
                                    type="file"
                                    id="first-audio"
                                    accept=".wav,.mp3,.ogg"
                                    onChange={handleFirstAudioChange}
                                    disabled={isLoading || isRecordingFirst}
                                />
                            </div>
                            <div className="file-info">
                                Supported formats: WAV, MP3, OGG
                                <br />
                                Maximum file size: 5MB
                            </div>
                        </div>
                        <div className="record-section">
                            <button
                                type="button"
                                className={`record-button ${isRecordingFirst ? 'recording' : ''}`}
                                onMouseDown={handleFirstRecordMouseDown}
                                onMouseUp={stopRecordingFirst}
                                onMouseLeave={stopRecordingFirst}
                                disabled={isLoading}
                            >
                                {isRecordingFirst ? 'Recording...' : 'Hold to Record'}
                            </button>
                            {firstRecordedAudio && (
                                <div className="recorded-audio">
                                    <audio controls src={URL.createObjectURL(firstRecordedAudio)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="speaker-section">
                    <h2>Second Speaker</h2>
                    <div className="input-methods">
                        <div className="upload-section">
                            <label className="file-input-label">
                                Upload Audio (WAV, MP3, OGG - Max 5MB)
                            </label>
                            <div className="file-input-container">
                                <label htmlFor="second-audio" className="choose-file-button">
                                    Choose File
                                </label>
                                <span className="file-name">
                                    {secondAudio ? secondAudio.name : 'No file chosen'}
                                </span>
                                <input
                                    type="file"
                                    id="second-audio"
                                    accept=".wav,.mp3,.ogg"
                                    onChange={handleSecondAudioChange}
                                    disabled={isLoading || isRecordingSecond}
                                />
                            </div>
                            <div className="file-info">
                                Supported formats: WAV, MP3, OGG
                                <br />
                                Maximum file size: 5MB
                            </div>
                        </div>
                        <div className="record-section">
                            <button
                                type="button"
                                className={`record-button ${isRecordingSecond ? 'recording' : ''}`}
                                onMouseDown={handleSecondRecordMouseDown}
                                onMouseUp={stopRecordingSecond}
                                onMouseLeave={stopRecordingSecond}
                                disabled={isLoading}
                            >
                                {isRecordingSecond ? 'Recording...' : 'Hold to Record'}
                            </button>
                            {secondRecordedAudio && (
                                <div className="recorded-audio">
                                    <audio controls src={URL.createObjectURL(secondRecordedAudio)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="model-select">Select Model:</label>
                    <select 
                        id="model-select" 
                        value={modelType} 
                        onChange={handleModelChange}
                        disabled={isLoading}
                    >
                        {models.map((model) => (
                            <option key={model.value} value={model.value}>
                                {model.displayName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="checkbox-section">
                    <label>
                        <input
                            type="checkbox"
                            checked={denoise}
                            onChange={handleDenoiseChange}
                        />
                        Denoise Audio
                    </label>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading || (!firstAudio && !firstRecordedAudio) || (!secondAudio && !secondRecordedAudio)}
                    className="submit-button"
                >
                    {isLoading ? 'Processing...' : 'Compare Speakers'}
                </button>
            </form>

            {result && (
                <div className="results">
                    <h2>Results</h2>
                    <div className="similarity-score">
                        <h3>{(result.similarity_score * 100).toFixed(2)}% Similar</h3>
                        <div className="progress-bar-container">
                            <div className="scale-marks">
                                <span>0</span>
                                <span>20</span>
                                <span>40</span>
                                <span>60</span>
                                <span>80</span>
                                <span>100</span>
                            </div>
                            <div 
                                className="progress-bar" 
                                style={{ '--progress-width': `${(result.similarity_score * 100)}%` }}
                            >
                                <span className="progress-label">
                                    {(result.similarity_score * 100).toFixed(2)}%
                                </span>
                            </div>
                        </div>
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
                    </div>
                    <div className="audio-comparison">
                        <div className="audio-section">
                            <h3>First Speaker</h3>
                            <div className="audio-player">
                                <p>Original Audio:</p>
                                <audio 
                                    controls 
                                    src={firstAudio ? URL.createObjectURL(firstAudio) : ""} 
                                />
                            </div>
                            <div className="audio-player">
                                <p>Audio after silence removal:</p>
                                <audio 
                                    controls 
                                    src={`data:audio/wav;base64,${result.first_clean_audio}`} 
                                />
                            </div>
                            <div className="spectrogram">
                                <p>Mel Spectrogram:</p>
                                <img 
                                    src={`data:image/png;base64,${result.first_mel_spectrogram}`}
                                    alt="First Speaker Mel Spectrogram"
                                />
                            </div>
                        </div>
                        <div className="audio-section">
                            <h3>Second Speaker</h3>
                            <div className="audio-player">
                                <p>Original Audio:</p>
                                <audio 
                                    controls 
                                    src={secondAudio ? URL.createObjectURL(secondAudio) : ""} 
                                />
                            </div>
                            <div className="audio-player">
                                <p>Audio after silence removal:</p>
                                <audio 
                                    controls 
                                    src={`data:audio/wav;base64,${result.second_clean_audio}`} 
                                />
                            </div>
                            <div className="spectrogram">
                                <p>Mel Spectrogram:</p>
                                <img 
                                    src={`data:image/png;base64,${result.second_mel_spectrogram}`}
                                    alt="Second Speaker Mel Spectrogram"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpeakerVerification;