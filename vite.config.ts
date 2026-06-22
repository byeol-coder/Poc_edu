import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project at https://byeol-coder.github.io/Poc_edu/,
// so production assets need the '/Poc_edu/' base. Local dev stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Poc_edu/' : '/',
  plugins: [react()],
}))
