import React from 'react';
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
        <div className="text-to-speech">
            <h1>Text to Speech</h1>
            <form onSubmit={handleSubmit} className="upload-form">
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
                        <option value="en">English</option>
                        <option value="vi">Vietnamese</option>
                    </select>
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Submit"}
                </button>
            </form>

            {result && (
                <div className="results">
                    <h2>Results</h2>
                    
                    {/* Processing Info */}
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

                    {/* Base Audio */}
                    <div className="section">
                        <h3>Base Audio</h3>
                        <audio controls src={`data:audio/wav;base64,${result.base64_audio}`} />
                        <div className="audio-info">
                            <p>Original synthesized audio from the model</p>
                        </div>
                    </div>

                    {/* Mel2mag Audio */}
                    <div className="section">
                        <h3>Mel2mag Audio</h3>
                        <audio controls src={`data:audio/wav;base64,${result.base64_mel2mag_audio}`} />
                        <div className="audio-info">
                            <p>Audio reconstructed from mel2mag spectrogram</p>
                        </div>
                    </div>

                    {/* Spectrograms */}
                    <div className="spectrograms-container">
                        <h3>Spectrograms Analysis</h3>
                        
                        {/* Base Mel Spectrogram */}
                        <div className="section spectrogram-section">
                            <h4>Base Mel Spectrogram</h4>
                            <div className="image-container">
                                <img
                                    src={`data:image/png;base64,${result.base64_mel_spec}`}
                                    alt="Base Mel Spectrogram"
                                />
                            </div>
                            <div className="spectrogram-info">
                                <p>Initial mel-spectrogram</p>
                            </div>
                        </div>

                        {/* Base Mag Spectrogram */}
                        <div className="section spectrogram-section">
                            <h4>Base Mag Spectrogram</h4>
                            <div className="image-container">
                                <img
                                    src={`data:image/png;base64,${result.base64_mag_spec}`}
                                    alt="Base Mag Spectrogram"
                                />
                            </div>
                            <div className="spectrogram-info">
                                <p>Base magnitude spectrogram</p>
                            </div>
                        </div>

                        {/* Mel2mag Mag Spectrogram */}
                        <div className="section spectrogram-section">
                            <h4>Mel2mag Mag Spectrogram</h4>
                            <div className="image-container">
                                <img
                                    src={`data:image/png;base64,${result.base64_mel2mag_mag_spec}`}
                                    alt="Mel2mag Mag Spectrogram"
                                />
                            </div>
                            <div className="spectrogram-info">
                                <p>Mel2mag magnitude spectrogram</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextToSpeech;
