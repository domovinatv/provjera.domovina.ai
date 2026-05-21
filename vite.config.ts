import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Base path: "/adhd-provjera/" za GitHub Pages, "/" za lokalno i custom hosting.
const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'ADHD.provjera — DOMOVINA.ai',
        short_name: 'ADHD.provjera',
        description:
          'Offline samoprocjena simptoma ADHD-a u odraslih prema ASRS v1.1 (WHO / Harvard). Dio DOMOVINA.ai ekosustava.',
        theme_color: '#002F6C',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        scope: base,
        start_url: base,
        lang: 'hr',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache samo woff2 (modern fallback), preskačemo woff koji su duplikati.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
