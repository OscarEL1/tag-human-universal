import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Motor de Tailwind v4
import { VitePWA } from 'vite-plugin-pwa'

// Recrear __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Habilitar el procesamiento de CSS profesional
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192x192.svg', 'icons/icon-512x512.svg', 'icons/apple-touch-icon.svg'],
      manifest: {
        name: 'Tag Human Universal',
        short_name: 'TagHuman',
        description: 'Plataforma de gestión de acceso y asistencia Tag Human Universal',
        theme_color: '#0052CC',
        background_color: '#1A1A1A',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 horas
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      // Permite usar '@' para referenciar la carpeta 'src'
      // Esto arregla los errores de importación de los componentes UI
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Habilitar acceso externo para Docker
    strictPort: true,
    port: 5173,
    watch: {
      usePolling: true, // Necesario para detectar cambios en Windows/WSL2
    },
  },
})