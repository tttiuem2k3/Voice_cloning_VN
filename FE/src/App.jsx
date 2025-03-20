import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import VoiceEnhancement from "./components/pages/voice-enhancement/VoiceEnhancement";
import SpeakerVerification from "./components/pages/speaker-verification/SpeakerVerification";
import TextToSpeechPro from "./components/pages/text-to-speech/TextToSpeech_Pro";
import Home from './components/Home';

const App = () => {
    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/text-to-speech" element={<TextToSpeechPro />} />
                    <Route path="/voice-enhancement" element={<VoiceEnhancement />} />
                    <Route path="/speaker-verification" element={<SpeakerVerification />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;
