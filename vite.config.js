import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/dicomWeb': {
        target: 'http://localhost:8042/',
        changeOrigin: true,
        // logLevel: 'debug',
        rewrite: (path) => path.replace(/^\/dicomWeb/, ''),
      },
      '/api': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        logLevel: 'debug',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
