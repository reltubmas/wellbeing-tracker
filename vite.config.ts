import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: change this to '/YOUR-REPO-NAME/' if your repo name is different
export default defineConfig({
  plugins: [react()],
  base: '/wellbeing-tracker/'
})
