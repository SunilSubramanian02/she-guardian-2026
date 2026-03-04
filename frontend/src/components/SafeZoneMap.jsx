import React, { useState } from 'react';

const SafeZoneMap = () => {
    const [routeStatus, setRouteStatus] = useState('IDLE'); // IDLE, LOADING, FOUND, ERROR

    const handleRouteFinder = async () => {
        setRouteStatus('LOADING');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/route`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start: "Current Location", destination: "Safe Zone" })
            });
            const data = await res.json();

            if (data.success) {
                setRouteStatus('FOUND');
                setTimeout(() => setRouteStatus('IDLE'), 4000); // Reset UI after 4 seconds
            }
        } catch (error) {
            console.error("Route Fetching Error", error);
            setRouteStatus('ERROR');
            setTimeout(() => setRouteStatus('IDLE'), 3000);
        }
    };

    return (
        <section className="glass-card heatmap-card">
            <h2>Safe Zone Heatmap</h2>
            <div className="map-container">
                <div className="mock-map">
                    <div className="zone red-zone" title="High Risk Area"></div>
                    <div className="zone yellow-zone" title="Moderate Risk Area"></div>
                    <div className="zone green-zone" title="Safe Area"></div>
                    <div className={`path-line ${routeStatus === 'FOUND' ? 'active' : ''}`}></div>
                    <div className="pulse-marker"></div>
                </div>
            </div>

            <div className="legend">
                <span className="dot green"></span> Safe
                <span className="dot yellow"></span> Moderate
                <span className="dot red"></span> High Risk
            </div>

            <button
                className="neon-btn btn-route"
                onClick={handleRouteFinder}
                disabled={routeStatus === 'LOADING'}
                style={{
                    color: routeStatus === 'FOUND' ? 'var(--safe-green)' : '',
                    borderColor: routeStatus === 'FOUND' ? 'var(--safe-green)' : '',
                    pointerEvents: routeStatus === 'LOADING' ? 'none' : 'auto'
                }}>
                {routeStatus === 'IDLE' && <><i className="fa-solid fa-route"></i> Find Safest Route</>}
                {routeStatus === 'LOADING' && <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</>}
                {routeStatus === 'FOUND' && <><i className="fa-solid fa-check"></i> Safest Route Found</>}
                {routeStatus === 'ERROR' && <><i className="fa-solid fa-triangle-exclamation"></i> Error Finding Route</>}
            </button>
        </section>
    );
};

export default SafeZoneMap;
