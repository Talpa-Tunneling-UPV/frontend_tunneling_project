import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: 'ws://localhost:8000',
          ws: true,
          changeOrigin: true,
        }
      }
    }
  }
})
