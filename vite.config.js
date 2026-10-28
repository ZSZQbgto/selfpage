import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Actions sets VITE_BASE to the correct sub-path (e.g. /selfpage/).
// Locally it stays at "/", so `npm run dev` and `npm run preview` just work.
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
})
