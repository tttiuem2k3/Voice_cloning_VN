import React, { useState } from 'react';
import useTextToSpeech from '../../../hooks/useTextToSpeech';
import './TextToSpeech.css';

const TextToSpeech = () => {
    const {
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
    } = useTextToSpeech();

    const [denoise, setDenoise] = useState(false);

    const handleDenoiseChange = (e) => {
        setDenoise(e.target.checked);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e, denoise);
    };

    return (
        <div className="text-to-speech">
            <h1>Text to Speech</h1>
            <form onSubmit={handleFormSubmit} className="upload-form">
                <div className="form-group">
                    <label>Choose your input method:</label>
                    <div className="input-methods">
                        <div className="upload-section">
                            <label htmlFor="audio-upload" className="file-input-label">
                                Upload Audio (WAV, MP3, OGG - Max 5MB)
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
                                Maximum file size: 5MB
                            </small>
                        </div>
                        <div className="record-section">
                            <button
                                type="button"
                                className={`record-button ${isRecording ? 'recording' : ''}`}
                                onMouseDown={startRecording}
                                onMouseUp={stopRecording}
                                onMouseLeave={stopRecording}
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
                    <label htmlFor="text-input">Enter Text:</label>
                    <textarea
                        id="text-input"
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Type your text here..."
                        rows="4"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="language-select">Select Language:</label>
                    <select 
                        id="language-select" 
                        value={language} 
                        onChange={handleLanguageChange}
                        disabled={isLoading || isRecording}
                    >
                        <option value="vi">Vietnamese</option>
                        <option value="en">English</option>
                    </select>
                </div>

                <div className="form-group">
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
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Submit"}
                </button>
            </form>

            {result && (
                <div className="results">
                    <h2>Results</h2>
                    
                    <div className="processing-info">
                        <div className="info-item">
                            <span className="info-label">Duration:</span>
                            <span className="info-value">{result.duration.toFixed(2)}s</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Language:</span>
                            <span className="info-value">{result.lang}</span>
                        </div>
                    </div>

                    <div className="section">
                        <h3>Audio generated</h3>
                        <audio controls src={`data:audio/wav;base64,${result.base64_audio}`} />
                        <div className="audio-info">
                            <p>Processed Text: {result.process_text}</p>
                        </div>
                    </div>                    
                </div>
            )}
        </div>
    );
};

export default TextToSpeech;
