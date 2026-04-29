import React, { useEffect, useState } from 'react';

const SafetyScore = () => {
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    // Environmental mock states
    const [environment, setEnvironment] = useState('STABLE'); // STABLE, NEAR_POLICE, DANGER_ZONE

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://she-guardian-2026.onrender.com';

                const res = await fetch(`${apiUrl}/api/safety-score`);
                const data = await res.json();

                let current = 0;
                // Mocking environmental context based on score
                if (data.score >= 80) {
                    setEnvironment('NEAR_POLICE');
                } else if (data.score <= 65) {
                    setEnvironment('DANGER_ZONE');
                } else {
                    setEnvironment('STABLE');
                }

                const target = data.score;
                const counter = setInterval(() => {
                    current += 2;
                    if (current >= target) {
                        current = target;
                        clearInterval(counter);
                    }
                    setScore(current);
                }, 30);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching safety score", err);
                setError(true);
                setLoading(false);
            }
        };

        fetchScore();
    }, []);

    // Color logic based on environment/score
    const getOrbTheme = () => {
        if (environment === 'NEAR_POLICE') {
            return {
                stroke: "var(--safe-green)",
                glow: "rgba(57,255,20,0.8)",
                animation: "animate-none", // Stable
                statusText: "Police Station Nearby"
            };
        }
        if (environment === 'DANGER_ZONE') {
            return {
                stroke: "var(--neon-pink)", // or orange/red
                glow: "rgba(255,16,122,0.8)",
                animation: "animate-float animate-pulse", // Flicker and low-gravity float
                statusText: "Low-lit / Reported Area"
            };
        }
        return {
            stroke: "#fbbf24", // Amber
            glow: "rgba(251,191,36,0.6)",
            animation: "animate-float",
            statusText: "Standard Zone"
        };
    };

    const theme = getOrbTheme();

    return (
        <section className="glass-card flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto relative overflow-hidden group">
            {/* Dynamic ambient bg glow based on theme */}
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] pointer-events-none transition-all duration-1000"
                style={{ backgroundColor: theme.stroke, opacity: score / 100 * 0.3 }}
            ></div>

            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500 dark:from-blue-400 dark:to-green-400 mb-6 relative z-10">Safety Shield</h2>

            <div className={`relative w-48 h-48 flex items-center justify-center mb-6 transition-all duration-700 ${theme.animation}`}>
                {loading ? (
                    <div className="text-safe-green animate-pulse flex flex-col items-center">
                        <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-2"></i>
                        <span className="text-xs tracking-widest uppercase">Scanning Area...</span>
                    </div>
                ) : error ? (
                    <div className="text-neon-pink flex flex-col items-center text-center">
                        <i className="fa-solid fa-triangle-exclamation text-3xl mb-2"></i>
                        <span className="text-xs">Data Unavailable</span>
                    </div>
                ) : (
                    <>
                        {/* Hexagonal Orb SVG */}
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl" style={{ filter: `drop-shadow(0 0 15px ${theme.glow})` }}>
                            {/* Background Hexagon */}
                            <polygon 
                                points="50,5 90,25 90,75 50,95 10,75 10,25" 
                                fill="rgba(0,0,0,0.4)" 
                                stroke="rgba(255,255,255,0.1)" 
                                strokeWidth="2" 
                            />
                            
                            {/* Inner Glowing Hexagon - Dashboard style */}
                            <polygon 
                                points="50,15 80,32 80,68 50,85 20,68 20,32" 
                                fill="none" 
                                stroke={theme.stroke} 
                                strokeWidth="1.5" 
                                strokeDasharray="300"
                                strokeDashoffset={300 - (score / 100) * 300}
                                className="transition-all duration-1000 ease-out"
                            />
                            
                            {/* Core Inner Fill based on intensity */}
                            <polygon 
                                points="50,25 70,36 70,64 50,75 30,64 30,36" 
                                fill={theme.stroke} 
                                opacity={(score / 100) * 0.4}
                                className="transition-opacity duration-1000"
                            />
                        </svg>

                        <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-5xl font-black text-white" style={{ textShadow: `0 0 10px ${theme.glow}` }}>
                                {score}
                                <span className="text-xl text-white/70 font-medium ml-1">%</span>
                            </span>
                        </div>
                    </>
                )}
            </div>

            <p className="text-lg font-medium mb-4 h-6 relative z-10 transition-colors" style={{ color: theme.stroke }}>
                {!loading && !error && theme.statusText}
            </p>

            <div className="w-full flex justify-between px-4 py-3 bg-gray-50 dark:bg-black/40 backdrop-blur-md rounded-xl border border-gray-100 dark:border-white/10 text-sm transition-colors relative z-10 shadow-inner">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <i className="fa-solid fa-satellite-dish text-blue-500 dark:text-neon-blue"></i> Live Scan
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <i className="fa-solid fa-map-location-dot" style={{ color: theme.stroke }}></i> Tracker On
                </div>
            </div>
        </section>
    );
};

export default SafetyScore;
