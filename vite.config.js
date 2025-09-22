import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'robots.txt'],
            manifest: {
                name: 'OGV-MDB',
                short_name: 'OGV-MDB',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#317EFB',
                icons: [
                    { src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png', },
                    { src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png', },], 
            },
        }),
    ],
});