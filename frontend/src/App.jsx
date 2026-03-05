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
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply dark mode class to HTML root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSimModeToggle = (e) => {
    setSimMode(e.target.checked);
    if (e.target.checked) {
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${simMode ? 'bg-red-50 dark:bg-[#1a0505]' : 'bg-[var(--bg-primary)]'}`}>

      {/* Advanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMwYTBhMGYiPjwvcmVjdD48cGF0aCBkPSJNMCAwbDhfOFpNOCAwbC04IDgiIHN0cm9rZT0iIzFhMWEyNCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9zdmc+')] opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/80 to-[#0a0a0f]"></div>

        {/* Dynamic Glowing Orbs - Brighter in light mode, deeper in dark mode */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] dark:blur-[120px] mix-blend-normal dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-[100px] dark:blur-[120px] mix-blend-normal dark:mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[80px] dark:blur-[100px] mix-blend-normal dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '5s' }}></div>

        {simMode && <div className="absolute inset-0 bg-red-500/10 dark:bg-red-900/15 mix-blend-normal dark:mix-blend-overlay transition-opacity duration-1000"></div>}
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-[var(--glass-border)] px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-lg transition-colors duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-pink flex items-center justify-center p-[2px] shadow-md dark:shadow-none">
            <div className="w-full h-full bg-white dark:bg-gray-950 rounded-[10px] flex items-center justify-center transition-colors">
              <i className="fa-solid fa-shield-cat text-transparent bg-clip-text bg-gradient-to-br from-neon-blue to-neon-pink text-lg"></i>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-widest text-gray-800 dark:text-white flex items-center gap-2 transition-colors">
            SHE<span className="font-light text-gray-500 dark:text-gray-400">GUARDIAN</span>
            <span className="text-[0.6rem] bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/10 tracking-widest transition-colors">2026</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <i className="fa-solid fa-sun hover:text-yellow-400 transition-colors"></i> : <i className="fa-solid fa-moon hover:text-indigo-500 transition-colors"></i>}
          </button>

          {/* Sim Mode Toggle */}
          <div className="flex items-center gap-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] px-4 py-2 rounded-full backdrop-blur-md shadow-sm">
            <span className={`text-xs font-bold tracking-widest uppercase transition-colors ${simMode ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
              Simulation
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={simMode} onChange={handleSimModeToggle} />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
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

      <footer className="relative z-10 border-t border-[var(--glass-border)] mt-12 py-8 text-center bg-white/40 dark:bg-black/40 backdrop-blur-sm transition-colors">
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-400 dark:from-gray-400 dark:to-gray-200 font-medium italic mb-2">
          "Technology should not just connect people — it should protect them."
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 tracking-widest uppercase">
          SHEGUARDIAN © 2026 Social Impact Hackathon
        </p>
      </footer>

      {/* 6. AI Chatbot Widget */}
      <AIChatbot />

    </div>
  );
}

export default App;
