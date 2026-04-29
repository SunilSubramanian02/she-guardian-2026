import React from 'react';
import SOSButton from '../components/SOSButton';
import ShadowTracker from '../components/ShadowTracker';
import SafetyScore from '../components/SafetyScore';

const Home = ({ setPanicMode }) => {
    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
            {/* 1. Smart SOS Interface */}
            <SOSButton setPanicMode={setPanicMode} />

            {/* 2. Shadow Tracker (Auto-SOS) */}
            <div className="w-full max-w-md mx-auto">
                <ShadowTracker setPanicMode={setPanicMode} />
            </div>

            {/* 3. Safety Score */}
            <div className="w-full">
                <SafetyScore />
            </div>
        </div>
    );
};

export default Home;
