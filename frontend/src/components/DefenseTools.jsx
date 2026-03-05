import React, { useState } from 'react';

const DefenseTools = () => {
    const [callStatus, setCallStatus] = useState('IDLE'); // IDLE, SCHEDULING, INCOMING, ACTIVE
    const [callDelay, setCallDelay] = useState(5);
    const [activeMins, setActiveMins] = useState(0);
    const [activeSecs, setActiveSecs] = useState(0);

    const [droneStatus, setDroneStatus] = useState('IDLE'); // IDLE, LOCATING, EN_ROUTE

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
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-2">
                        <i className="fa-solid fa-shield-halved"></i> Active Defense
                    </h2>
                    <span className="bg-neon-pink/20 border border-neon-pink/40 text-neon-pink text-[0.65rem] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-[0_0_10px_rgba(255,16,122,0.3)]">
                        PRO
                    </span>
                </div>

                {/* Fake Call Tool */}
                <div className="bg-[#0f111a]/50 border border-white/5 rounded-xl p-4 mb-4 hover:border-blue-500/30 transition-colors group/tool relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 opacity-50 group-hover/tool:opacity-100"></div>

                    <div className="flex items-start gap-4 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 text-neon-blue group-hover/tool:scale-110 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                            <i className="fa-solid fa-phone-volume"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white tracking-wide">Fake Incoming Call</h4>
                            <p className="text-xs text-gray-400">Escape uncomfortable situations</p>
                        </div>
                    </div>

                    <button
                        className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2
                            ${callStatus === 'IDLE' ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20' :
                                callStatus === 'SCHEDULING' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse' :
                                    'bg-green-500/20 text-safe-green border border-green-500/30'}`}
                        onClick={handleFakeCall}
                        disabled={callStatus !== 'IDLE'}
                    >
                        {callStatus === 'IDLE' ? <><i className="fa-regular fa-clock"></i> Schedule in 5s</> :
                            callStatus === 'SCHEDULING' ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Incoming in {callDelay}s</> :
                                <><i className="fa-solid fa-phone-volume animate-bounce"></i> Call active...</>}
                    </button>
                </div>

                {/* Drone Link Tool */}
                <div className="bg-[#0f111a]/50 border border-white/5 rounded-xl p-4 hover:border-pink-500/30 transition-colors group/tool relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-400 to-purple-500 opacity-50 group-hover/tool:opacity-100"></div>

                    <div className="flex items-start gap-4 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0 border border-pink-500/20 text-neon-pink group-hover/tool:scale-110 transition-transform shadow-[0_0_15px_rgba(255,16,122,0.1)]">
                            <i className="fa-brands fa-space-awesome"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white tracking-wide">Guardian Drone Link</h4>
                            <p className="text-xs text-gray-400">Deploy automated safety drone</p>
                        </div>
                    </div>

                    {droneStatus === 'IDLE' ? (
                        <button
                            className="w-full py-2.5 bg-pink-500/10 hover:bg-pink-500/20 text-neon-pink border border-pink-500/30 hover:border-pink-500/50 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(255,16,122,0.2)]"
                            onClick={handleDroneLink}
                        >
                            <i className="fa-solid fa-video"></i> Connect Drone
                        </button>
                    ) : (
                        <div className={`relative w-full h-12 rounded-lg border overflow-hidden flex items-center justify-center text-sm font-medium
                            ${droneStatus === 'EN_ROUTE' ? 'border-green-500/30 bg-green-500/10 text-safe-green blur-0' : 'border-pink-500/30 bg-pink-500/10 text-white'}`}>

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

            {/* Fake Call Full Screen Modal */}
            {(callStatus === 'INCOMING' || callStatus === 'ACTIVE') && (
                <div className="fixed inset-0 bg-[#0a0a0f] z-[2000] flex flex-col justify-between items-center py-16 animate-in slide-in-from-bottom-full duration-300">

                    <div className="flex flex-col items-center mt-12 text-center w-full px-8">
                        {/* Caller display */}
                        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 border-2 border-gray-700 shadow-xl relative backdrop-blur-md">
                            <i className="fa-solid fa-user text-4xl text-gray-400"></i>
                            {callStatus === 'INCOMING' && (
                                <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-50"></div>
                            )}
                        </div>

                        <h1 className="text-4xl font-normal text-white mb-2 tracking-wide">Dad</h1>
                        <p className="text-lg text-gray-400 font-light tracking-widest">
                            {callStatus === 'INCOMING' ? 'Mobile' : `${activeMins.toString().padStart(2, '0')}:${activeSecs.toString().padStart(2, '0')}`}
                        </p>
                    </div>

                    <div className="flex justify-between w-full max-w-xs px-6 mb-12">
                        <button
                            className={`flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl
                                ${callStatus === 'ACTIVE' ? 'w-full h-16 bg-red-500 hover:bg-red-400 bg-opacity-90' : 'w-16 h-16 bg-red-500 hover:bg-red-400 bg-opacity-90'}`}
                            onClick={declineCall}
                        >
                            <i className={`fa-solid fa-phone-slash text-2xl text-white ${callStatus === 'ACTIVE' ? '' : 'transform -scale-x-100'}`}></i>
                        </button>

                        {callStatus === 'INCOMING' && (
                            <button
                                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 bg-opacity-90 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-bounce"
                                onClick={answerCall}
                            >
                                <i className="fa-solid fa-phone text-2xl text-white"></i>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default DefenseTools;
