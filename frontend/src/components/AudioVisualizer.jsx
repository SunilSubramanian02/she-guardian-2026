import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const AudioVisualizer = ({ isActive }) => {
    const [audioData, setAudioData] = useState(new Uint8Array(0));
    const [recordingStatus, setRecordingStatus] = useState('Standby'); // Standby, Recording, Processing, Error
    
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationFrameRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => {
        if (isActive) {
            startAudio();
        } else {
            stopAudio();
        }

        return () => {
            stopAudio();
        };
    }, [isActive]);

    const startAudio = async () => {
        try {
            setRecordingStatus('Initializing...');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            streamRef.current = stream;

            // Setup Web Audio API for visualization
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 64; // Gives us 32 frequency bins
            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current.connect(analyserRef.current);

            // Setup MediaRecorder for background recording
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            
            mediaRecorderRef.current.onstop = sendAudioToBackend;
            mediaRecorderRef.current.start(1000); // Collect data in 1s chunks
            setRecordingStatus('Recording');

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                if (!analyserRef.current) return;
                analyserRef.current.getByteFrequencyData(dataArray);
                setAudioData(new Uint8Array(dataArray));
                animationFrameRef.current = requestAnimationFrame(draw);
            };

            draw();

        } catch (error) {
            console.error('Error accessing microphone:', error);
            setRecordingStatus('Microphone Access Denied');
        }
    };

    const stopAudio = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        
        // Stop MediaRecorder
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            setRecordingStatus('Processing AI Analysis...');
            mediaRecorderRef.current.stop(); // Triggers onstop -> sendAudioToBackend
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        setAudioData(new Uint8Array(0));
    };

    const sendAudioToBackend = async () => {
        if (audioChunksRef.current.length === 0) return;

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = []; // reset

        const formData = new FormData();
        formData.append('audio', audioBlob, 'sos-audio.webm');
        formData.append('timestamp', new Date().toISOString());

        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/audio-analysis`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok && data.success) {
                console.log('Gemini Analysis Result:', data.analysis);
                setRecordingStatus('Danger Analysis Complete');
            } else {
                setRecordingStatus('Analysis Failed');
            }
        } catch (error) {
            console.error('Error sending audio:', error);
            setRecordingStatus('Upload Error');
        }
    };

    // We only want to show a subset of bins to look clean and futuristic
    const displayBins = Array.from(audioData).slice(0, 24);

    return (
        <div className="w-full flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-xl border border-neon-blue/20 rounded-2xl shadow-[0_0_40px_rgba(0,240,255,0.1)] relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-neon-blue/5 animate-pulse pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-6">
                <div className={`w-3 h-3 rounded-full ${recordingStatus === 'Recording' ? 'bg-red-500 animate-ping' : 'bg-neon-blue'}`}></div>
                <span className="text-neon-blue font-mono tracking-widest text-sm uppercase shadow-neon-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
                    {recordingStatus}
                </span>
            </div>

            <div className="flex items-end justify-center gap-1.5 h-32 w-full max-w-md px-4">
                {displayBins.map((value, index) => {
                    // Normalize value for height
                    const height = isActive ? Math.max((value / 255) * 100, 5) : 5;
                    
                    return (
                        <motion.div
                            key={index}
                            className="w-full max-w-[12px] bg-neon-blue rounded-t-sm"
                            style={{
                                boxShadow: '0 0 10px rgba(0,240,255,0.8), 0 0 20px rgba(0,240,255,0.4)'
                            }}
                            animate={{
                                height: `${height}%`,
                                opacity: isActive ? 0.7 + (value / 255) * 0.3 : 0.3
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 20,
                                mass: 0.5
                            }}
                        />
                    );
                })}
            </div>
            
            <p className="mt-6 text-xs text-neon-blue/70 font-mono text-center max-w-xs">
                Capturing environmental audio for AI danger analysis and evidence preservation.
            </p>
        </div>
    );
};

export default AudioVisualizer;
