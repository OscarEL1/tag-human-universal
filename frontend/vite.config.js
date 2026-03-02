import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Motor de Tailwind v4

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Habilitar el procesamiento de CSS profesional
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