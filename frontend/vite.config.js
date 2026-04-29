import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SheGuardian',
        short_name: 'SheGuardian',
        description: 'Advanced AI Women\'s Safety Companion',
        theme_color: '#030014',
        background_color: '#030014',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'vite.svg', // Placeholder
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
