import React, { useState } from 'react';

const SafeZoneMap = () => {
    const [routeStatus, setRouteStatus] = useState('IDLE'); // IDLE, LOADING, FOUND, ERROR

    const handleRouteFinder = async () => {
        setRouteStatus('LOADING');

        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://she-guardian-2026.onrender.com';

            const res = await fetch(`${apiUrl}/api/route`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start: "Current Location", destination: "Safe Zone" })
            });

            if (!res.ok) throw new Error("Network response was not ok");

            const data = await res.json();

            if (data.success) {
                setRouteStatus('FOUND');
                setTimeout(() => setRouteStatus('IDLE'), 4000);
            } else {
                throw new Error("Route not found");
            }
        } catch (error) {
            console.error("Route Fetching Error", error);
            setRouteStatus('ERROR');
            setTimeout(() => setRouteStatus('IDLE'), 3000);
        }
    };

    return (
        <section className="glass-card p-6 w-full relative overflow-hidden group">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-map-location-dot"></i> Safe Zone Heatmap
            </h2>

            <div className="w-full h-48 rounded-xl bg-[#0f111a] border border-white/10 relative overflow-hidden shadow-inner mb-4">
                {/* Abstract Data Map Background */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                }}></div>

                {/* Map Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                {/* Heatmap Zones */}
                <div className="absolute top-[20%] left-[60%] w-24 h-24 bg-red-600/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute top-[50%] left-[20%] w-32 h-32 bg-amber-500/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-[10%] right-[15%] w-40 h-40 bg-green-500/20 rounded-full blur-2xl"></div>

                {/* Animated Route Path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: routeStatus === 'FOUND' ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
                    <path
                        d="M 50,150 Q 80,120 120,130 T 200,80 T 280,100"
                        fill="none"
                        stroke="var(--safe-green)"
                        strokeWidth="4"
                        strokeDasharray="4,8"
                        className="animate-[dash_1s_linear_infinite] drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]"
                    />
                    <style>{`@keyframes dash { to { stroke-dashoffset: -12; } }`}</style>
                </svg>

                {/* Current Location Marker */}
                <div className="absolute bottom-8 left-12 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-blue-400 absolute animate-ping"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>

                {/* Destination Marker */}
                {routeStatus === 'FOUND' && (
                    <div className="absolute top-16 right-16 w-5 h-5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] z-10 flex items-center justify-center animate-in zoom-in duration-500">
                        <i className="fa-solid fa-shield-halved text-white text-[10px]"></i>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 mb-6 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]"></span> Safe</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.6)]"></span> Moderate</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.6)]"></span> High Risk</span>
            </div>

            <button
                className={`w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 border backdrop-blur-sm
                    ${routeStatus === 'IDLE' ? 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''}
                    ${routeStatus === 'LOADING' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 cursor-wait' : ''}
                    ${routeStatus === 'FOUND' ? 'bg-green-500/20 text-safe-green border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : ''}
                    ${routeStatus === 'ERROR' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                `}
                onClick={handleRouteFinder}
                disabled={routeStatus === 'LOADING'}
            >
                {routeStatus === 'IDLE' && <><i className="fa-solid fa-route"></i> Find Safest Route</>}
                {routeStatus === 'LOADING' && <><i className="fa-solid fa-satellite-dish animate-pulse"></i> Analyzing Live Data...</>}
                {routeStatus === 'FOUND' && <><i className="fa-solid fa-shield-check"></i> Safest Route Generated</>}
                {routeStatus === 'ERROR' && <><i className="fa-solid fa-triangle-exclamation"></i> Network Error - Try Again</>}
            </button>
        </section>
    );
};

export default SafeZoneMap;
