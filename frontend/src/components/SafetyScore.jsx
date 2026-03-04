import React, { useEffect, useState } from 'react';

const SafetyScore = () => {
    const [score, setScore] = useState(0);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/safety-score`)
            .then(res => res.json())
            .then(data => {
                // Animate score from 0 to target
                let current = 0;
                const target = data.score;
                const counter = setInterval(() => {
                    current += 2;
                    if (current >= target) {
                        current = target;
                        clearInterval(counter);
                    }
                    setScore(current);
                }, 40);
            })
            .catch(err => console.error("Error fetching safety score", err));
    }, []);

    return (
        <section className="glass-card flex-col center safety-score-card">
            <h2>Digital Safety Shield</h2>
            <div className="score-meter">
                <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${score}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage" id="score-text">{score}%</text>
                </svg>
            </div>
            <p className="score-message">Your area is currently {score}% Safe</p>
            <div className="score-details">
                <span><i className="fa-regular fa-clock"></i> Time: Low Risk</span>
                <span><i className="fa-solid fa-location-crosshairs"></i> Zone: Safe</span>
            </div>
        </section>
    );
};

export default SafetyScore;
