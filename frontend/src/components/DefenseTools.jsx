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

        // Store interval internally to clear on decline
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
            }, 5000); // Reset after 5 seconds of being en route
        }, 3000); // takes 3s to locate
    };

    return (
        <>
            <section className="glass-card defense-card flex-col">
                <h2>Active Defense Tools <span className="badge" style={{ fontSize: '0.6rem', background: 'var(--neon-pink)', color: 'white', padding: '2px 6px', borderRadius: '10px', marginLeft: 'auto', letterSpacing: '0.5px' }}>NEW</span></h2>

                <div className="tool-item mt-2 mb-3">
                    <div className="tool-header">
                        <i className="fa-solid fa-phone-volume highlight-blue"></i>
                        <div>
                            <h4>Fake Call Generator</h4>
                            <p className="tool-desc">Escape uncomfortable situations</p>
                        </div>
                    </div>
                    <button className="neon-btn" onClick={handleFakeCall} disabled={callStatus !== 'IDLE'}>
                        {callStatus === 'IDLE' ? 'Schedule in 5s' : callStatus === 'SCHEDULING' ? `Incoming in ${callDelay}s` : 'Call active...'}
                    </button>
                </div>

                <div className="tool-item">
                    <div className="tool-header">
                        <i className="fa-brands fa-space-awesome highlight-pink"></i>
                        <div>
                            <h4>Guardian Drone Link</h4>
                            <p className="tool-desc">Deploy nearest automated safety drone</p>
                        </div>
                    </div>

                    {droneStatus === 'IDLE' ? (
                        <button className="glass-btn btn-drone mt-2" onClick={handleDroneLink} style={{ borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
                            <i className="fa-solid fa-satellite-dish"></i> Connect Drone
                        </button>
                    ) : (
                        <div id="drone-radar" className="radar-container mt-2" style={{
                            borderColor: droneStatus === 'EN_ROUTE' ? 'rgba(0,255,136,0.3)' : 'var(--neon-pink)',
                            background: droneStatus === 'EN_ROUTE' ? 'rgba(0,255,136,0.05)' : 'rgba(255,0,127,0.05)'
                        }}>
                            <div className="radar-sweep" style={{
                                background: droneStatus === 'EN_ROUTE'
                                    ? 'conic-gradient(from 0deg, transparent 70%, rgba(0,255,136,0.4) 100%)'
                                    : 'conic-gradient(from 0deg, transparent 70%, rgba(255,0,127,0.6) 100%)'
                            }}></div>
                            <span className="radar-text" style={{ color: droneStatus === 'EN_ROUTE' ? 'var(--safe-green)' : 'white' }}>
                                {droneStatus === 'LOCATING' ? 'Locating drone...' : 'Drone SG-7 deployed. ETA: 2 mins.'}
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* Fake Call Full Screen Modal */}
            {(callStatus === 'INCOMING' || callStatus === 'ACTIVE') && (
                <div id="fake-call-modal" className="modal-overlay" style={{ zIndex: 2000 }}>
                    <div className="call-modal">
                        <div className="call-info">
                            <h1>Dad</h1>
                            <p>{callStatus === 'INCOMING' ? 'Mobile' : `${activeMins.toString().padStart(2, '0')}:${activeSecs.toString().padStart(2, '0')}`}</p>
                        </div>
                        <div className="call-actions">
                            <button className="call-btn btn-decline" onClick={declineCall} style={{ width: callStatus === 'ACTIVE' ? '100%' : '75px', borderRadius: callStatus === 'ACTIVE' ? '35px' : '50%' }}>
                                <i className="fa-solid fa-phone-slash"></i>
                            </button>
                            {callStatus === 'INCOMING' && (
                                <button className="call-btn btn-answer" onClick={answerCall}>
                                    <i className="fa-solid fa-phone"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DefenseTools;
