import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Determine proxy target based on mode
  let proxyTarget = 'https://opensourcematcher.onrender.com'
  if (mode === 'development') {
    proxyTarget = 'http://localhost:8000'
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})