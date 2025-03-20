import { useState, useRef } from 'react';

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    const requestMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            stream.getTracks().forEach(track => track.stop());
            setHasPermission(true);
            return true;
        } catch (error) {
            console.error('Error requesting microphone permission:', error);
            setHasPermission(false);
            return false;
        }
    };

    const startRecording = async () => {
        if (hasPermission === null) {
            const permitted = await requestMicrophonePermission();
            if (!permitted) {
                throw new Error('Microphone permission denied');
            }
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            streamRef.current = stream;
            audioContextRef.current = new AudioContext({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(stream);
            const destination = audioContextRef.current.createMediaStreamDestination();
            source.connect(destination);

            mediaRecorderRef.current = new MediaRecorder(destination.stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                
                // Convert to 16kHz WAV
                const arrayBuffer = await audioBlob.arrayBuffer();
                const audioContext = new AudioContext({ sampleRate: 16000 });
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                
                const offlineContext = new OfflineAudioContext({
                    numberOfChannels: 1,
                    length: audioBuffer.duration * 16000,
                    sampleRate: 16000
                });

                const source = offlineContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(offlineContext.destination);
                source.start();

                const renderedBuffer = await offlineContext.startRendering();
                const wav = audioBufferToWav(renderedBuffer);
                const finalBlob = new Blob([wav], { type: 'audio/wav' });
                
                setRecordedAudio(finalBlob);
                streamRef.current.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            throw new Error('Failed to start recording');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Helper function to convert AudioBuffer to WAV
    const audioBufferToWav = (buffer) => {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2;
        const buffer16Bit = new ArrayBuffer(44 + length);
        const view = new DataView(buffer16Bit);
        const channels = [];
        let sample;
        let offset = 0;
        let pos = 0;

        // Write WAV header
        setUint32(0x46464952);                         // "RIFF"
        setUint32(36 + length);                        // file length - 8
        setUint32(0x45564157);                         // "WAVE"
        setUint32(0x20746d66);                         // "fmt " chunk
        setUint32(16);                                 // length = 16
        setUint16(1);                                  // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(buffer.sampleRate);
        setUint32(buffer.sampleRate * 2 * numOfChan);  // avg. bytes/sec
        setUint16(numOfChan * 2);                      // block-align
        setUint16(16);                                 // 16-bit
        setUint32(0x61746164);                         // "data" - chunk
        setUint32(length);                             // chunk length

        // Write interleaved data
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        while (pos < buffer.length) {
            for (let i = 0; i < numOfChan; i++) {
                sample = Math.max(-1, Math.min(1, channels[i][pos]));
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                view.setInt16(44 + offset, sample, true); 
                offset += 2;
            }
            pos++;
        }

        return buffer16Bit;

        function setUint16(data) {
            view.setUint16(pos, data, true);
            pos += 2;
        }

        function setUint32(data) {
            view.setUint32(pos, data, true);
            pos += 4;
        }
    };

    return {
        isRecording,
        recordedAudio,
        hasPermission,
        startRecording,
        stopRecording,
        setRecordedAudio,
        requestMicrophonePermission
    };
};

export default useAudioRecorder; 