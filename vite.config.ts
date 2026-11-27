import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves the site from https://jetsyyy.github.io/JethroMandalonesPortfolio/,
// so production builds (and `vite preview` of them) need that sub-path. Local dev stays at the root.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/JethroMandalonesPortfolio/' : '/',
  plugins: [react(), tailwindcss()],
  build: { chunkSizeWarningLimit: 1000 }, // 3D scene is lazy-loaded on its own
}))
