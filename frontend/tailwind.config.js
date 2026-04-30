/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-pink': 'var(--neon-pink)',
                'neon-blue': 'var(--neon-blue)',
                'safe-green': 'var(--safe-green)',
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
            }
        },
    },
    plugins: [],
}
