import React, { useState, useEffect, useRef } from 'react';
import { requestMaxBrightness, releaseWakeLock, startStrobeLight } from '../utils/hardwareApis';

const ShadowTracker = ({ setPanicMode }) => {
    const [isTracking, setIsTracking] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
    const [lastLocation, setLastLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const countdownIntervalRef = useRef(null);
    const locationIntervalRef = useRef(null);
    const SOS_TIMEOUT = 600; // 10 minutes
    const LOCATION_INTERVAL = 120000; // 2 minutes in ms

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTracking();
        };
    }, []);

    const startTracking = () => {
        // Request WakeLock to prevent browser throttling of background timers
        requestMaxBrightness();
        
        setIsTracking(true);
        setTimeRemaining(SOS_TIMEOUT);
        setErrorMsg('');
        
        // Immediately grab location
        captureLocation();

        // Start countdown timer
        countdownIntervalRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    triggerAutoSOS();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Start location capture interval (every 2 mins)
        locationIntervalRef.current = setInterval(() => {
            captureLocation();
        }, LOCATION_INTERVAL);
    };

    const stopTracking = () => {
        setIsTracking(false);
        releaseWakeLock();
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
        setTimeRemaining(SOS_TIMEOUT);
        setLastLocation(null);
    };

    const checkInSafe = () => {
        // Reset the timer
        setTimeRemaining(SOS_TIMEOUT);
        // Vibrate to confirm
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const captureLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
                    setLastLocation(coords);
                    console.log(`[SHADOW TRACKER] Coordinates captured: ${coords}`);
                },
                (error) => {
                    console.error("Error capturing location:", error);
                    setErrorMsg("GPS signal lost. Attempting to use last known location.");
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setErrorMsg("Geolocation is not supported by this browser.");
        }
    };

    const triggerAutoSOS = async () => {
        stopTracking(); // Stop intervals
        
        // Activate Global Panic Mode
        if (setPanicMode) setPanicMode(true);
        startStrobeLight();
        document.body.classList.add('shaking');
        setTimeout(() => document.body.classList.remove('shaking'), 1000);
        if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 1000]);

        console.error("!!! SHADOW TRACKER TIMEOUT: TRIGGERING AUTO-SOS !!!");

        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const locationStr = lastLocation ? `GPS: ${lastLocation}` : "Unknown Location (Shadow Tracker Timeout)";
            
            const res = await fetch(`${apiUrl}/api/sos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: locationStr,
                    timestamp: new Date().toISOString(),
                    type: "AUTO_SHADOW_TIMEOUT"
                })
            });
            const data = await res.json();
            console.log("Auto-SOS Dispatch Result:", data);
        } catch (error) {
            console.error("Auto-SOS Fetch Error", error);
        }
    };

    // Formatting MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Calculate urgency colors based on time remaining
    const getUrgencyColor = () => {
        if (timeRemaining > 300) return 'text-safe-green'; // > 5 mins
        if (timeRemaining > 60) return 'text-yellow-400'; // 1-5 mins
        return 'text-neon-pink animate-pulse'; // < 1 min
    };

    return (
        <div className="w-full">
            {!isTracking ? (
                <button 
                    onClick={startTracking}
                    className="w-full py-4 glass-card flex flex-col items-center justify-center gap-2 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
                        <i className="fa-solid fa-user-ninja"></i>
                    </div>
                    <span className="font-bold tracking-wide dark:text-white">Start Shadow Tracker</span>
                    <p className="text-xs text-gray-500 text-center px-4">
                        Auto-triggers SOS if you don't check in every 10 minutes. Captures location every 2 mins.
                    </p>
                </button>
            ) : (
                <div className="w-full relative overflow-hidden glass-card p-6 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                    {/* Active Radar Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                         style={{
                             background: 'conic-gradient(from 0deg at 50% 50%, transparent 70%, #a855f7 100%)',
                             animation: 'spin 4s linear infinite'
                         }}
                    ></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                            </span>
                            <h3 className="font-bold text-purple-600 dark:text-purple-400 tracking-widest uppercase text-sm">
                                Shadow Tracking Active
                            </h3>
                        </div>

                        <div className={`text-6xl font-black font-mono tracking-widest my-4 drop-shadow-md ${getUrgencyColor()}`}>
                            {formatTime(timeRemaining)}
                        </div>

                        {errorMsg && <p className="text-xs text-red-400 mb-4">{errorMsg}</p>}
                        {lastLocation && <p className="text-xs text-gray-500 font-mono mb-4">Last fix: {lastLocation}</p>}

                        <div className="flex w-full gap-4 mt-2">
                            <button 
                                onClick={stopTracking}
                                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold tracking-wide hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Stop
                            </button>
                            <button 
                                onClick={checkInSafe}
                                className="flex-[2] py-3 px-4 rounded-xl border border-safe-green bg-safe-green/20 text-safe-green font-bold tracking-widest uppercase hover:bg-safe-green hover:text-white transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] active:scale-95"
                            >
                                I'm Safe (Reset)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShadowTracker;
