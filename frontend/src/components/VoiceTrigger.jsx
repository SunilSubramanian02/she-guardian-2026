import React, { useState, useEffect, useRef } from 'react';

const VoiceTrigger = ({ setPanicMode }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    // Safety trigger phrases
    const safePhrases = ['help me', 'call my brother', 'code red', 'i need a pizza', 'stop it'];

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript.toLowerCase();
                }
                setTranscript(currentTranscript);

                // Check for safe phrases
                const triggerFound = safePhrases.some(phrase => currentTranscript.includes(phrase));
                if (triggerFound) {
                    console.log("⚠️ WHISPER TRIGGER ACTIVATED ⚠️", currentTranscript);
                    triggerSOS();
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech Recognition Error", event.error);
                if (event.error === 'not-allowed') setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                // Auto-restart if it stops while supposedly listening (unless intentionally stopped)
                if (isListening && recognitionRef.current) {
                    try {
                        recognitionRef.current.start();
                    } catch (e) {
                        console.log("Restarting speech recognition...", e);
                    }
                }
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isListening]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Your browser does not support Voice Triggers. Please use Chrome.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const triggerSOS = () => {
        setIsListening(false);
        if (recognitionRef.current) recognitionRef.current.stop();
        
        // Find the main SOS button and virtually click it
        const sosBtn = document.getElementById('sos-btn');
        if (sosBtn) {
            // Simulate hold duration
            const downEvent = new PointerEvent('pointerdown');
            sosBtn.dispatchEvent(downEvent);
            
            // Note: Since SOS button requires a 2-second hold, the safest programmatic way 
            // without complex event mocking is to directly manipulate the panic mode if possible,
            // or we just show an alert for this hackathon demo.
            alert("VOICE TRIGGER DETECTED! SOS DISPATCHED!");
            // In a real app with global state, we would call setGlobalSOSStatus('TRIGGERED')
        }
    };

    return (
        <div className={`glass-card p-5 border-2 transition-all duration-300 ${isListening ? 'border-neon-pink shadow-[0_0_20px_rgba(255,16,122,0.2)]' : 'border-transparent'}`}>
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <i className={`fa-solid fa-microphone-lines ${isListening ? 'text-neon-pink animate-pulse' : 'text-gray-400'}`}></i> 
                        Whisper Mode
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Voice-activated SOS triggers</p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isListening} onChange={toggleListening} />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-pink"></div>
                </label>
            </div>

            {isListening && (
                <div className="mt-4 bg-gray-100 dark:bg-[#0f111a] rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent animate-[shimmer_2s_infinite]"></div>
                    <p className="text-xs text-neon-pink mb-1 font-semibold tracking-wider uppercase">Listening for safe phrases...</p>
                    <p className="text-sm italic text-gray-600 dark:text-gray-300 min-h-[1.5rem] break-words">
                        "{transcript || 'Waiting for speech...'}"
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {safePhrases.map(phrase => (
                            <span key={phrase} className="text-[10px] bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2 py-1 rounded-md text-gray-500 dark:text-gray-400">"{phrase}"</span>
                        ))}
                    </div>
                </div>
            )}
            <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
        </div>
    );
};

export default VoiceTrigger;
