import React from 'react';
import EmergencyVault from '../components/EmergencyVault';

const VaultPage = () => {
    return (
        <div className="flex flex-col gap-6 w-full animate-in slide-in-from-right-8 fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white px-2">Emergency Contacts</h2>
            <EmergencyVault />
        </div>
    );
};

export default VaultPage;
