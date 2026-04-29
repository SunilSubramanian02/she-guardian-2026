import React, { useState, useEffect } from 'react';

const RouteTracker = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [status, setStatus] = useState('SAFE'); // SAFE, DEVIATED, SOS
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let timer;
        if (isTracking && status === 'SAFE') {
            timer = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTracking, status]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const simulateDeviation = () => {
        if (!isTracking) return;
        setStatus('DEVIATED');
        if (navigator.vibrate) navigator.vibrate([300, 300, 300]);
        
        // Auto SOS if no response in 10 seconds
        setTimeout(() => {
            setStatus(prev => {
                if (prev === 'DEVIATED') {
                    triggerRouteSOS();
                    return 'SOS';
                }
                return prev;
            });
        }, 10000);
    };

    const confirmSafe = () => {
        setStatus('SAFE');
    };

    const triggerRouteSOS = () => {
        setStatus('SOS');
        alert("ROUTE DEVIATION ALERT! AUTO-SOS DISPATCHED WITH LAST LOCATION!");
    };

    return (
        <div className={`glass-card p-5 mt-6 border-2 transition-all duration-300 ${isTracking ? (status === 'SAFE' ? 'border-safe-green shadow-[0_0_15px_rgba(34,197,94,0.2)]' : status === 'DEVIATED' ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse' : 'border-red-600 bg-red-950/20 shadow-[0_0_30px_rgba(255,0,0,0.4)]') : 'border-transparent'}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <i className="fa-solid fa-route"></i> Route Deviation Tracker
                </h3>
                {isTracking ? (
                    <button onClick={() => { setIsTracking(false); setStatus('SAFE'); setElapsedTime(0); }} className="text-xs bg-gray-200 dark:bg-white/10 px-3 py-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
                        Stop Trip
                    </button>
                ) : (
                    <button onClick={() => setIsTracking(true)} className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 shadow-md transition-colors">
                        Start Trip
                    </button>
                )}
            </div>

            {isTracking && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-[#0f111a] p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${status === 'SAFE' ? 'bg-safe-green shadow-[0_0_8px_rgba(34,197,94,0.8)]' : status === 'DEVIATED' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-red-500 animate-ping'}`}></div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                                <p className={`font-bold text-sm ${status === 'SAFE' ? 'text-safe-green' : status === 'DEVIATED' ? 'text-amber-500' : 'text-red-500'}`}>
                                    {status === 'SAFE' ? 'On Route' : status === 'DEVIATED' ? 'Route Deviated!' : 'SOS TRIGGERED'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Elapsed</p>
                            <p className="font-mono font-bold dark:text-white">{formatTime(elapsedTime)}</p>
                        </div>
                    </div>

                    {status === 'SAFE' && (
                        <button onClick={simulateDeviation} className="w-full text-xs text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors border-dashed">
                            [Demo] Simulate Cab Deviation
                        </button>
                    )}

                    {status === 'DEVIATED' && (
                        <div className="bg-amber-500/10 border border-amber-500 p-4 rounded-xl flex flex-col items-center text-center animate-in zoom-in duration-300">
                            <i className="fa-solid fa-triangle-exclamation text-amber-500 text-3xl mb-2 animate-bounce"></i>
                            <h4 className="font-bold text-amber-500 mb-1">Are you okay?</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">We detected a significant deviation from your route.</p>
                            <div className="flex w-full gap-3">
                                <button onClick={confirmSafe} className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white py-2.5 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                                    I'm Safe
                                </button>
                                <button onClick={triggerRouteSOS} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-bold shadow-lg hover:bg-red-700 transition-colors">
                                    SOS Now
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-3 font-semibold uppercase tracking-wider">Auto-SOS in 10 seconds...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RouteTracker;
