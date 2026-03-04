import React from 'react';

const EmpowermentHub = () => {
    return (
        <section className="glass-card empowerment-card flex-col">
            <h2>Empowerment Hub</h2>
            <div className="hub-buttons">
                <button className="glass-btn hub-btn"
                    onClick={() => alert('Defensive stance, hit vulnerable areas, and shout for help.')}>
                    <i className="fa-solid fa-hand-fist highlight-pink"></i>
                    <span>Defense Tips</span>
                </button>
                <button className="glass-btn hub-btn"
                    onClick={() => alert('Right to Zero FIR, Right to Privacy, Right to free legal aid.')}>
                    <i className="fa-solid fa-scale-balanced highlight-blue"></i>
                    <span>Legal Rights</span>
                </button>
            </div>

            <h3 className="mt-4 sub-heading">Quick Access Helplines</h3>
            <div className="helplines mt-2">
                <button className="alert-btn"><i className="fa-solid fa-phone"></i> Police <span>100</span></button>
                <button className="alert-btn"><i className="fa-solid fa-phone"></i> Women Helpline <span>181</span></button>
                <button className="alert-btn"><i className="fa-solid fa-phone"></i> Cybercrime <span>1930</span></button>
            </div>

            <div className="quote-box mt-auto">
                <p className="inspirational-msg">"You are your best defense. Stay aware, stay strong."</p>
            </div>
        </section>
    );
};

export default EmpowermentHub;
