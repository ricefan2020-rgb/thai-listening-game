import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        zeta: 'tools/zeta-calculator/index.html',
        pattaya: 'tools/pattaya-trip-planner/index.html',
      },
    },
  },
})
