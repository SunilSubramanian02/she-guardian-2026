import React, { useState, useRef, useEffect } from 'react';

const SOSButton = () => {
    const [status, setStatus] = useState('IDLE'); // IDLE, HOLDING, COUNTDOWN, DISPATCHED, FAILED
    const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
    const [count, setCount] = useState(5);

    const holdTimer = useRef(null);
    const progressTimer = useRef(null);
    const countdownTimer = useRef(null);
    const HOLD_DURATION = 2000; // 2 seconds hold to trigger

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTimeout(holdTimer.current);
            clearInterval(progressTimer.current);
            clearInterval(countdownTimer.current);
        };
    }, []);

    const startHold = (e) => {
        // Prevent default mobile behaviors like context menu
        e.preventDefault();
        if (status !== 'IDLE') return;

        setStatus('HOLDING');
        setHoldProgress(0);

        // Vibrate to acknowledge touch
        if (navigator.vibrate) navigator.vibrate(50);

        const startTime = Date.now();
        progressTimer.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
            setHoldProgress(progress);
        }, 50);

        holdTimer.current = setTimeout(() => {
            clearInterval(progressTimer.current);
            triggerSOS();
        }, HOLD_DURATION);
    };

    const cancelHold = () => {
        if (status === 'HOLDING') {
            clearTimeout(holdTimer.current);
            clearInterval(progressTimer.current);
            setStatus('IDLE');
            setHoldProgress(0);
        }
    };

    const triggerSOS = () => {
        setStatus('COUNTDOWN');
        setCount(5);
        setHoldProgress(100);

        // Shake UI
        document.body.classList.add('shaking');
        setTimeout(() => document.body.classList.remove('shaking'), 1000);

        // Vibrate alert pattern
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);

        let currentCount = 5;
        countdownTimer.current = setInterval(async () => {
            currentCount--;
            if (currentCount > 0) {
                setCount(currentCount);
            } else {
                clearInterval(countdownTimer.current);
                executeDispatch();
            }
        }, 1000);
    };

    const executeDispatch = async () => {
        try {
            // Check if backend URL is available
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            if (!apiUrl) throw new Error("API URL not configured");

            const res = await fetch(`${apiUrl}/api/sos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: "React Frontend App",
                    timestamp: new Date().toISOString()
                })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setStatus('DISPATCHED');
                if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
            } else {
                setStatus('FAILED');
            }
        } catch (error) {
            console.error("SOS Fetch Error", error);
            setStatus('FAILED');
        }
    };

    const cancelSOS = () => {
        clearInterval(countdownTimer.current);
        setStatus('IDLE');
        setHoldProgress(0);
    };

    // SVG Circle styling
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

    return (
        <>
            <section className="flex flex-col items-center justify-center py-12" aria-label="Smart SOS Interface">
                <div className="relative flex flex-col items-center group">
                    {/* Glowing background */}
                    <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${status === 'HOLDING' ? 'bg-pink-600/50 scale-150' : 'bg-red-600/20 scale-100 group-hover:scale-110 group-hover:bg-red-600/30'}`}></div>

                    {/* Progress Circle SVG */}
                    <svg className="absolute w-[180px] h-[180px] -top-[15px] -left-[15px] transform -rotate-90 pointer-events-none" viewBox="0 0 150 150">
                        <circle
                            cx="75" cy="75" r={radius}
                            stroke="rgba(255,16,122,0.2)" strokeWidth="8" fill="none"
                        />
                        <circle
                            cx="75" cy="75" r={radius}
                            stroke="var(--neon-pink)" strokeWidth="8" fill="none"
                            strokeLinecap="round"
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset,
                                transition: 'stroke-dashoffset 0.1s linear'
                            }}
                        />
                    </svg>

                    {/* Main Button */}
                    <button
                        id="sos-btn"
                        className={`relative z-10 w-[150px] h-[150px] rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl overflow-hidden
                            ${status === 'HOLDING' ? 'scale-95 bg-red-700' : 'bg-red-600 hover:bg-red-500 hover:scale-105'}
                            border-4 ${status === 'HOLDING' ? 'border-[#ff107a]' : 'border-red-400'}`}
                        aria-label="Trigger SOS"
                        onPointerDown={startHold}
                        onPointerUp={cancelHold}
                        onPointerLeave={cancelHold}
                        onContextMenu={(e) => e.preventDefault()}
                        style={{ touchAction: 'none' }} // Prevents scrolling while holding on mobile
                    >
                        <span className="text-white text-4xl font-black tracking-widest z-20" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>SOS</span>

                        {/* Pulse rings */}
                        {status === 'IDLE' && (
                            <>
                                <div className="absolute inset-0 rounded-full border border-white/30 animate-[pulse-ring_2s_cubic-bezier(0.215,0.61,0.355,1)_infinite]"></div>
                                <div className="absolute inset-0 rounded-full border border-white/20 animate-[pulse-ring_2s_cubic-bezier(0.215,0.61,0.355,1)_1s_infinite]"></div>
                            </>
                        )}
                    </button>

                    <p className={`mt-8 text-lg font-medium tracking-wide transition-colors ${status === 'HOLDING' ? 'text-neon-pink' : 'text-gray-300'}`}>
                        {status === 'HOLDING' ? 'Keep holding...' : 'Hold for 2 seconds to activate'}
                    </p>
                </div>
            </section>

            {/* SOS Modal */}
            {status !== 'IDLE' && status !== 'HOLDING' && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="glass-card w-full max-w-md p-8 flex flex-col items-center text-center relative overflow-hidden">

                        {/* Animated background flashes */}
                        {status === 'COUNTDOWN' && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"></div>}

                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 text-4xl shadow-lg
                            ${status === 'COUNTDOWN' ? 'bg-red-500/20 text-red-500 animate-bounce' :
                                status === 'DISPATCHED' ? 'bg-green-500/20 text-green-500' :
                                    'bg-pink-500/20 text-pink-500'}`}>
                            {status === 'COUNTDOWN' && <i className="fa-solid fa-triangle-exclamation"></i>}
                            {status === 'DISPATCHED' && <i className="fa-solid fa-shield-check"></i>}
                            {status === 'FAILED' && <i className="fa-solid fa-circle-xmark"></i>}
                        </div>

                        <h2 className={`text-2xl font-bold mb-2 uppercase tracking-wide
                            ${status === 'COUNTDOWN' ? 'text-red-500' :
                                status === 'DISPATCHED' ? 'text-safe-green' :
                                    'text-neon-pink'}`}>
                            {status === 'COUNTDOWN' ? 'EMERGENCY ALERT TRIGGERED' :
                                status === 'DISPATCHED' ? 'ALERTS DISPATCHED' :
                                    'DISPATCH FAILED'}
                        </h2>

                        <p className="text-gray-300 mb-8 px-4">
                            {status === 'COUNTDOWN' ? 'Sending live location to emergency contacts and authorities in...' :
                                status === 'DISPATCHED' ? 'Authorities and emergency contacts have been notified with your live location.' :
                                    'Network error. Please try calling authorities directly using the buttons below.'}
                        </p>

                        {status === 'COUNTDOWN' && (
                            <div className="relative flex items-center justify-center w-32 h-32 mb-8">
                                <span className="text-6xl font-black text-white z-10">{count}</span>
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                                    <circle cx="64" cy="64" r="56" stroke="var(--neon-pink)" strokeWidth="6" fill="none"
                                        strokeDasharray="351.8"
                                        strokeDashoffset={351.8 - (count / 5) * 351.8}
                                        className="transition-all duration-1000 ease-linear" />
                                </svg>
                            </div>
                        )}

                        <div className="w-full flex flex-col gap-3 mb-8">
                            <a href="tel:100" className="glass-btn justify-center py-3 text-lg hover:bg-white/10 hover:border-red-500/50">
                                <i className="fa-solid fa-phone text-red-500"></i> Police: <strong className="ml-1 tracking-wider text-white">100</strong>
                            </a>
                            <a href="tel:181" className="glass-btn justify-center py-3 text-lg hover:bg-white/10 hover:border-pink-500/50">
                                <i className="fa-solid fa-phone text-pink-500"></i> Women Helpline: <strong className="ml-1 tracking-wider text-white">181</strong>
                            </a>
                        </div>

                        <button onClick={cancelSOS} className="text-gray-400 hover:text-white underline underline-offset-4 decoration-gray-600 hover:decoration-white transition-all py-2 px-4">
                            {status === 'COUNTDOWN' ? 'Cancel Alert' : 'Close Dashboard'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default SOSButton;
