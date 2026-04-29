import React from 'react';

const StealthExit = () => {
    const triggerStealthExit = () => {
        // window.location.replace removes the current page from the session history,
        // meaning the user cannot use the back button to navigate back to the safety app.
        window.location.replace('https://news.google.com');
    };

    return (
        <button
            onClick={triggerStealthExit}
            className="fixed top-4 right-4 z-50 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 opacity-50 hover:opacity-100 transition-all duration-200"
            aria-label="Exit to News"
            title="Weather / News"
        >
            {/* Discreet Cloud/Sun icon that looks like a weather widget trigger */}
            <i className="fa-solid fa-cloud-sun text-xl"></i>
        </button>
    );
};

export default StealthExit;
