import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron/simple'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        // Electron main process entry point
        entry: 'electron/main.ts',
      },
      preload: {
        // Electron preload script entry point
        input: 'electron/preload.ts',
      },
      // Polyfill Electron & Node.js API cho Renderer process 
      renderer: {},
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})