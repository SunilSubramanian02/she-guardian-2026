import React, { useState } from 'react';

const SOSButton = () => {
    const [status, setStatus] = useState('IDLE'); // IDLE, COUNTDOWN, DISPATCHED, FAILED
    const [count, setCount] = useState(5);

    const triggerSOS = async () => {
        setStatus('COUNTDOWN');
        setCount(5);

        // Shake UI
        document.body.classList.add('shaking');
        setTimeout(() => document.body.classList.remove('shaking'), 1000);

        // Vibrate
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);

        let currentCount = 5;
        const timer = setInterval(async () => {
            currentCount--;
            if (currentCount > 0) {
                setCount(currentCount);
            } else {
                clearInterval(timer);
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sos`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            location: "React Frontend App",
                            timestamp: new Date().toISOString()
                        })
                    });
                    const data = await res.json();
                    if (data.success) {
                        setStatus('DISPATCHED');
                        if (navigator.vibrate) navigator.vibrate([500]);
                    } else {
                        setStatus('FAILED');
                    }
                } catch (error) {
                    console.error("SOS Fetch Error", error);
                    setStatus('FAILED');
                }
            }
        }, 1000);
    };

    const cancelSOS = () => {
        setStatus('IDLE');
    };

    return (
        <>
            <section className="sos-section" aria-label="Smart SOS Interface">
                <div className="sos-container">
                    <button id="sos-btn" className="sos-orb" aria-label="Trigger SOS" onClick={triggerSOS}>
                        <span className="sos-text">SOS</span>
                        <div className="pulse-ring"></div>
                        <div className="pulse-ring delay"></div>
                    </button>
                    <p className="sos-instruction">Hold/Tap in emergency</p>
                </div>
            </section>

            {/* SOS Modal */}
            {status !== 'IDLE' && (
                <div id="sos-modal" className="modal-overlay" role="dialog" aria-modal="true">
                    <div className="modal-content glass-card alert-state">
                        <div className="warning-icon">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>

                        <h2 className="alert-title" style={{ color: status === 'DISPATCHED' ? 'var(--safe-green)' : status === 'FAILED' ? 'var(--neon-pink)' : '' }}>
                            {status === 'COUNTDOWN' ? 'EMERGENCY ALERT TRIGGERED' : status === 'DISPATCHED' ? 'ALERTS DISPATCHED' : 'DISPATCH FAILED'}
                        </h2>

                        <p className="alert-sim-text">
                            {status === 'COUNTDOWN' ? 'Simulated alert sending to emergency contacts & nearby authorities...' :
                                status === 'DISPATCHED' ? 'Authorities and emergency contacts have been notified.' : 'Network error. Try calling directly.'}
                        </p>

                        <div className="countdown-circle">
                            <span>
                                {status === 'COUNTDOWN' ? count : status === 'DISPATCHED' ? <i className='fa-solid fa-check'></i> : <i className='fa-solid fa-xmark'></i>}
                            </span>
                            {status === 'COUNTDOWN' && (
                                <svg>
                                    <circle r="40" cx="50" cy="50"></circle>
                                </svg>
                            )}
                        </div>

                        <div className="emergency-numbers">
                            <p><i className="fa-solid fa-phone phone-icon"></i> Police: <strong>100</strong></p>
                            <p><i className="fa-solid fa-phone phone-icon"></i> Women Helpline: <strong>181</strong></p>
                            <p><i className="fa-solid fa-phone phone-icon"></i> Cybercrime: <strong>1930</strong></p>
                        </div>

                        <button id="cancel-sos" className="glass-btn cancel-btn" onClick={cancelSOS}>
                            {status === 'COUNTDOWN' ? 'CANCEL ALERT (Simulated)' : 'CLOSE'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default SOSButton;
