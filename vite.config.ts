import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'static-public',
  server: {
    hmr: {
      port: 24733,
    },
    proxy: {
      '/api': {
        target: 'https://my-aicompliance.yangdengkui01.workers.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
