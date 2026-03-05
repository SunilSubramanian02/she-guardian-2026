import React, { useState } from 'react';
import './index.css';

import SOSButton from './components/SOSButton';
import SafetyScore from './components/SafetyScore';
import SafeZoneMap from './components/SafeZoneMap';
import EmergencyVault from './components/EmergencyVault';
import DefenseTools from './components/DefenseTools';
import EmpowermentHub from './components/EmpowermentHub';
import AIChatbot from './components/AIChatbot';

function App() {
  const [simMode, setSimMode] = useState(false);

  const handleSimModeToggle = (e) => {
    setSimMode(e.target.checked);
    if (e.target.checked) {
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${simMode ? 'bg-[#1a0505]' : 'bg-gray-950'}`}>

      {/* Animated Background Layout */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/10 rounded-full blur-[120px]"></div>
        {simMode && <div className="absolute inset-0 bg-red-900/10 transition-opacity duration-1000"></div>}
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-pink flex items-center justify-center p-[2px]">
            <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
              <i className="fa-solid fa-shield-cat text-transparent bg-clip-text bg-gradient-to-br from-neon-blue to-neon-pink text-lg"></i>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-widest text-white flex items-center gap-2">
            SHE<span className="font-light text-gray-400">GUARDIAN</span>
            <span className="text-[0.6rem] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full border border-white/10 tracking-widest">2026</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          <span className={`text-xs font-bold tracking-widest uppercase transition-colors ${simMode ? 'text-red-400' : 'text-gray-400'}`}>
            Simulated Emergency
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={simMode} onChange={handleSimModeToggle} />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-6xl flex flex-col gap-8">

        {/* Sim Mode Banner */}
        {simMode && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
            <i className="fa-solid fa-triangle-exclamation text-red-500 text-xl animate-pulse"></i>
            <div>
              <p className="font-bold">Emergency Simulation Mode Active</p>
              <p className="text-sm opacity-80">Alerts triggered right now will not contact real authorities.</p>
            </div>
          </div>
        )}

        {/* 1. Smart SOS Interface */}
        <SOSButton />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Dashboard Grid */}

          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* 2. Safety Score */}
              <SafetyScore />

              {/* 3. Knowledge Hub */}
              <EmpowermentHub />
            </div>

            {/* 4. Safe Zone Heatmap spanning full width of its column */}
            <SafeZoneMap />
          </div>

          <div className="flex flex-col gap-6">
            {/* 5. Defense Tools & Vault */}
            <DefenseTools />
            <EmergencyVault />
          </div>

        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 mt-12 py-8 text-center bg-black/40 backdrop-blur-sm">
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200 font-medium italic mb-2">
          "Technology should not just connect people — it should protect them."
        </p>
        <p className="text-xs text-gray-500 tracking-widest uppercase">
          SHEGUARDIAN © 2026 Social Impact Hackathon
        </p>
      </footer>

      {/* 6. AI Chatbot Widget */}
      <AIChatbot />

    </div>
  );
}

export default App;
