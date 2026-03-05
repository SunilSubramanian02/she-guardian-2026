import React, { useEffect, useState } from 'react';

const SafetyScore = () => {
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://she-guardian-2026.onrender.com';

                const res = await fetch(`${apiUrl}/api/safety-score`);
                const data = await res.json();

                let current = 0;
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

    // Color logic based on score
    const getStrokeColor = () => {
        if (score >= 80) return "var(--safe-green)";
        if (score >= 50) return "#fbbf24"; // amber-400
        return "var(--neon-pink)";
    };

    return (
        <section className="glass-card flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto relative overflow-hidden group">
            {/* Ambient bg glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-safe-green/5 rounded-full blur-3xl group-hover:bg-safe-green/10 transition-colors"></div>

            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 mb-6">Digital Safety Shield</h2>

            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                {/* Outer decorative ring */}
                <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-2 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]"></div>

                {loading ? (
                    <div className="text-safe-green animate-pulse flex flex-col items-center">
                        <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-2"></i>
                        <span className="text-xs tracking-widest uppercase">Scanning</span>
                    </div>
                ) : error ? (
                    <div className="text-neon-pink flex flex-col items-center text-center">
                        <i className="fa-solid fa-triangle-exclamation text-3xl mb-2"></i>
                        <span className="text-xs">Data Unavailable</span>
                    </div>
                ) : (
                    <>
                        {/* SVG Circular Progress */}
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">
                            <path
                                className="text-white/10"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                stroke={getStrokeColor()}
                                strokeWidth="3"
                                strokeDasharray={`${score}, 100`}
                                fill="none"
                                strokeLinecap="round"
                                className="transition-all duration-100 ease-out"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>

                        <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-4xl font-black text-white drop-shadow-md">
                                {score}
                                <span className="text-xl text-gray-400 font-medium ml-0.5">%</span>
                            </span>
                        </div>
                    </>
                )}
            </div>

            <p className="text-lg font-medium text-gray-200 mb-4 h-6">
                {!loading && !error && (
                    <>Your area is currently <span style={{ color: getStrokeColor() }}>{score >= 80 ? 'Safe' : score >= 50 ? 'Moderate' : 'Risky'}</span></>
                )}
            </p>

            <div className="w-full flex justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/5 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                    <i className="fa-regular fa-clock text-blue-400"></i> Time: Low Risk
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <i className="fa-solid fa-location-crosshairs text-safe-green"></i> Zone: Safe
                </div>
            </div>
        </section>
    );
};

export default SafetyScore;
