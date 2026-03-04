import React, { useState } from 'react';
import './index.css';

import SOSButton from './components/SOSButton';
import SafetyScore from './components/SafetyScore';
import SafeZoneMap from './components/SafeZoneMap';
import EmergencyVault from './components/EmergencyVault';
import DefenseTools from './components/DefenseTools';
import EmpowermentHub from './components/EmpowermentHub';

function App() {
  const [simMode, setSimMode] = useState(false);

  const handleSimModeToggle = (e) => {
    setSimMode(e.target.checked);
    if (e.target.checked) {
      document.body.classList.add('sim-mode-active');
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      document.body.classList.remove('sim-mode-active');
    }
  };

  return (
    <>
      <div id="particles-bg"></div>

      {/* Navigation */}
      <header className="glass-nav">
        <div className="logo">
          <i className="fa-solid fa-shield-cat"></i> SHEGUARDIAN <span className="year-badge">2026</span>
        </div>
        <div className="innovation-toggle" title="Innovation Mode">
          <span className="toggle-label">Emergency Sim Mode</span>
          <label className="switch">
            <input type="checkbox" id="sim-mode-toggle" checked={simMode} onChange={handleSimModeToggle} />
            <span className="slider round"></span>
          </label>
        </div>
      </header>

      <main id="main-content">
        {/* 1. Smart SOS Interface */}
        <SOSButton />

        <div className="dashboard-grid">
          {/* 2. & 3. Safety Monitoring */}
          <SafetyScore />
          <SafeZoneMap />

          {/* 4. Vault & Defense */}
          <EmergencyVault />
          <DefenseTools />

          {/* 5. Knowledge Hub */}
          <EmpowermentHub />
        </div>
      </main>

      <footer>
        <p>"Technology should not just connect people — it should protect them."</p>
        <p className="footer-sub">SHEGUARDIAN © 2026 Social Impact Hackathon</p>
      </footer>
    </>
  );
}

export default App;
