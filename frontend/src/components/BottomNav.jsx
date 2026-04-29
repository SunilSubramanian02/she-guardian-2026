import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: 'fa-solid fa-house', label: 'Home' },
        { path: '/map', icon: 'fa-solid fa-map-location-dot', label: 'Map' },
        { path: '/defense', icon: 'fa-solid fa-shield-halved', label: 'Defense' },
        { path: '/vault', icon: 'fa-solid fa-address-book', label: 'Vault' },
        { path: '/hub', icon: 'fa-solid fa-book-open', label: 'Learn' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
            <div className="max-w-md mx-auto px-6 py-3 flex justify-between items-center relative">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-14 transition-all duration-300 relative group ${isActive ? 'text-neon-pink drop-shadow-[0_0_8px_rgba(255,16,122,0.6)]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <div className={`text-xl mb-1 transition-transform duration-300 ${isActive ? '-translate-y-1 scale-110' : 'group-hover:scale-110'}`}>
                                <i className={item.icon}></i>
                            </div>
                            <span className={`text-[0.65rem] font-medium tracking-wide transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                                {item.label}
                            </span>
                            
                            {/* Active Indicator Dot */}
                            {isActive && (
                                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-neon-pink shadow-[0_0_5px_rgba(255,16,122,1)]"></span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
