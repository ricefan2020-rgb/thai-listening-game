import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: process.env.PAGES_BASE || '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        zeta: 'tools/zeta-calculator/index.html',
        thailand: 'tools/thailand-trip-planner/index.html',
      },
    },
  },
})
