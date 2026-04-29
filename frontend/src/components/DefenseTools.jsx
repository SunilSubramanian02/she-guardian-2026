import React, { useState, useRef, useEffect } from 'react';

const DefenseTools = () => {
    const [callStatus, setCallStatus] = useState('IDLE'); // IDLE, SCHEDULING, INCOMING, ACTIVE
    const [callDelay, setCallDelay] = useState(5);
    const [activeMins, setActiveMins] = useState(0);
    const [activeSecs, setActiveSecs] = useState(0);

    const [droneStatus, setDroneStatus] = useState('IDLE'); // IDLE, LOCATING, EN_ROUTE
    
    // Audio ref for fake call
    const audioRef = useRef(null);

    useEffect(() => {
        // Pre-load audio. We'll use a placeholder path, and if it fails, we fall back to speech synthesis.
        audioRef.current = new Audio('/audio/fake_call.mp3');
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    // FAKE CALL LOGIC
    const handleFakeCall = () => {
        setCallStatus('SCHEDULING');
        let countdown = 5;
        const callInterval = setInterval(() => {
            countdown--;
            setCallDelay(countdown);
            if (countdown <= 0) {
                clearInterval(callInterval);
                setCallStatus('INCOMING');
                if (navigator.vibrate) navigator.vibrate([1000, 500, 1000, 500, 1000]);
            }
        }, 1000);
    };

    const answerCall = () => {
        setCallStatus('ACTIVE');
        if (navigator.vibrate) navigator.vibrate(0);

        // Attempt to play audio file, fallback to Web Speech API
        if (audioRef.current) {
            audioRef.current.play().catch((e) => {
                console.warn("Audio file not found or blocked. Using Speech Synthesis fallback.", e);
                const utterance = new SpeechSynthesisUtterance("Hey, I'm just 2 minutes away. I can see you now.");
                utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes('Google UK English Male') || v.lang.includes('en'));
                utterance.rate = 0.9;
                utterance.pitch = 1;
                speechSynthesis.speak(utterance);
            });
        }

        let secs = 0;
        const activeCallInterval = setInterval(() => {
            secs++;
            setActiveMins(Math.floor(secs / 60));
            setActiveSecs(secs % 60);
        }, 1000);

        window.activeCallTimer = activeCallInterval;
    };

    const declineCall = () => {
        setCallStatus('IDLE');
        if (navigator.vibrate) navigator.vibrate(0);
        if (window.activeCallTimer) clearInterval(window.activeCallTimer);
        
        // Stop audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        speechSynthesis.cancel(); // Stop fallback speech

        setActiveMins(0);
        setActiveSecs(0);
        setCallDelay(5);
    };

    // DRONE LOGIC
    const handleDroneLink = () => {
        setDroneStatus('LOCATING');
        setTimeout(() => {
            setDroneStatus('EN_ROUTE');
            setTimeout(() => {
                setDroneStatus('IDLE');
            }, 5000);
        }, 3000);
    };

    return (
        <>
            <section className="glass-card flex flex-col p-6 w-full relative group">
                {/* Glowing bg orb */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-colors duration-500"></div>

                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 flex items-center gap-2">
                        <i className="fa-solid fa-shield-halved text-purple-500 dark:text-transparent"></i> Active Defense
                    </h2>
                    <span className="bg-neon-pink/20 border border-neon-pink/40 text-neon-pink text-[0.65rem] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-[0_0_10px_rgba(255,16,122,0.3)]">
                        PRO
                    </span>
                </div>

                {/* Fake Call Tool */}
                <div className="bg-white/50 dark:bg-[#0f111a]/50 border border-gray-200 dark:border-white/5 rounded-xl p-4 mb-4 hover:border-blue-400 dark:hover:border-blue-500/30 transition-colors group/tool relative overflow-hidden shadow-sm dark:shadow-none">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 opacity-80 dark:opacity-50 group-hover/tool:opacity-100"></div>

                    <div className="flex items-start gap-4 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-500/20 text-blue-500 dark:text-neon-blue group-hover/tool:scale-110 transition-transform dark:shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                            <i className="fa-solid fa-phone-volume"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white tracking-wide">Fake Incoming Call</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Escape uncomfortable situations</p>
                        </div>
                    </div>

                    <button
                        className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2
                            ${callStatus === 'IDLE' ? 'bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white border border-gray-300 dark:border-white/10 dark:hover:border-white/20' :
                                callStatus === 'SCHEDULING' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30 animate-pulse' :
                                    'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-safe-green border border-green-300 dark:border-green-500/30'}`}
                        onClick={handleFakeCall}
                        disabled={callStatus !== 'IDLE'}
                    >
                        {callStatus === 'IDLE' ? <><i className="fa-regular fa-clock"></i> Schedule in 5s</> :
                            callStatus === 'SCHEDULING' ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Incoming in {callDelay}s</> :
                                <><i className="fa-solid fa-phone-volume animate-bounce"></i> Call active...</>}
                    </button>
                </div>

                {/* Drone Link Tool */}
                <div className="bg-white/50 dark:bg-[#0f111a]/50 border border-gray-200 dark:border-white/5 rounded-xl p-4 hover:border-pink-400 dark:hover:border-pink-500/30 transition-colors group/tool relative overflow-hidden shadow-sm dark:shadow-none">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400 to-purple-500 opacity-80 dark:opacity-50 group-hover/tool:opacity-100"></div>

                    <div className="flex items-start gap-4 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center shrink-0 border border-pink-200 dark:border-pink-500/20 text-pink-500 dark:text-neon-pink group-hover/tool:scale-110 transition-transform dark:shadow-[0_0_15px_rgba(255,16,122,0.1)]">
                            <i className="fa-brands fa-space-awesome"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white tracking-wide">Guardian Drone Link</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Deploy automated safety drone</p>
                        </div>
                    </div>

                    {droneStatus === 'IDLE' ? (
                        <button
                            className="w-full py-2.5 bg-pink-50 hover:bg-pink-100 dark:bg-pink-500/10 dark:hover:bg-pink-500/20 text-pink-600 dark:text-neon-pink border border-pink-200 dark:border-pink-500/30 hover:border-pink-300 dark:hover:border-pink-500/50 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 dark:hover:shadow-[0_0_15px_rgba(255,16,122,0.2)]"
                            onClick={handleDroneLink}
                        >
                            <i className="fa-solid fa-video"></i> Connect Drone
                        </button>
                    ) : (
                        <div className={`relative w-full h-12 rounded-lg border overflow-hidden flex items-center justify-center text-sm font-medium
                            ${droneStatus === 'EN_ROUTE' ? 'border-green-300 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-safe-green blur-0' : 'border-pink-300 dark:border-pink-500/30 bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-white'}`}>

                            {/* Radar sweep animation */}
                            <div className="absolute inset-0 opacity-30 mix-blend-screen"
                                style={{
                                    background: droneStatus === 'EN_ROUTE'
                                        ? 'conic-gradient(from 0deg at 50% 50%, transparent 70%, #39ff14 100%)'
                                        : 'conic-gradient(from 0deg at 50% 50%, transparent 70%, #ff107a 100%)',
                                    animation: 'spin 2s linear infinite'
                                }}
                            ></div>

                            <span className="relative z-10 flex items-center gap-2">
                                {droneStatus === 'LOCATING' ? <><i className="fa-solid fa-satellite-dish animate-pulse"></i> Locating drone...</> :
                                    <><i className="fa-solid fa-location-crosshairs animate-ping"></i> Drone SG-7 deployed. ETA: 2 mins.</>}
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* Fake Call Full Screen Modal - Antigravity UI */}
            {(callStatus === 'INCOMING' || callStatus === 'ACTIVE') && (
                <div className="fixed inset-0 z-[3000] flex flex-col justify-between items-center py-16 bg-black/80 backdrop-blur-3xl animate-in slide-in-from-bottom-full duration-500 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]">
                    
                    {/* Glowing ambient background depending on status */}
                    <div className={`absolute top-1/4 w-full h-[50vh] blur-[100px] rounded-full pointer-events-none opacity-20 transition-all duration-1000 ${callStatus === 'INCOMING' ? 'bg-neon-blue' : 'bg-safe-green'}`}></div>

                    <div className="flex flex-col items-center mt-12 text-center w-full px-8 relative z-10">
                        {/* Caller display */}
                        <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] relative">
                            <i className="fa-solid fa-user-shield text-5xl text-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"></i>
                            {callStatus === 'INCOMING' && (
                                <>
                                    <div className="absolute inset-0 rounded-full border border-neon-blue animate-[ping_2s_ease-out_infinite] opacity-50 shadow-[0_0_15px_rgba(0,240,255,0.8)]"></div>
                                    <div className="absolute inset-0 rounded-full border border-neon-blue animate-[ping_2.5s_ease-out_infinite] opacity-30 shadow-[0_0_15px_rgba(0,240,255,0.5)]"></div>
                                </>
                            )}
                            {callStatus === 'ACTIVE' && (
                                <div className="absolute inset-0 rounded-full border border-safe-green opacity-80 shadow-[0_0_30px_rgba(57,255,20,0.5)]"></div>
                            )}
                        </div>

                        <h1 className="text-4xl font-light text-white mb-3 tracking-widest drop-shadow-md">Emergency Contact</h1>
                        <p className="text-xl text-neon-blue font-mono tracking-widest shadow-neon-blue drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">
                            {callStatus === 'INCOMING' ? 'Incoming Call...' : `${activeMins.toString().padStart(2, '0')}:${activeSecs.toString().padStart(2, '0')}`}
                        </p>
                    </div>

                    <div className="flex justify-evenly w-full max-w-sm px-6 mb-12 relative z-10 gap-8">
                        {/* Decline Button */}
                        <button
                            className={`relative flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95
                                ${callStatus === 'ACTIVE' ? 'w-full h-16 bg-red-600/80 border border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.6)]' : 'w-20 h-20 bg-red-600/80 border border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.6)]'}`}
                            onClick={declineCall}
                        >
                            <i className="fa-solid fa-phone-slash text-2xl text-white drop-shadow-lg"></i>
                        </button>

                        {/* Accept Button */}
                        {callStatus === 'INCOMING' && (
                            <button
                                className="relative w-20 h-20 rounded-full bg-safe-green/80 border border-safe-green flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(57,255,20,0.8)] animate-bounce"
                                onClick={answerCall}
                            >
                                <div className="absolute inset-0 rounded-full bg-safe-green animate-ping opacity-30"></div>
                                <i className="fa-solid fa-phone text-2xl text-white drop-shadow-lg"></i>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default DefenseTools;
