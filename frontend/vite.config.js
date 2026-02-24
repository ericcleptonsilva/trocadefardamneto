import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/register_exchange': 'http://localhost:5000',
      '/history': 'http://localhost:5000',
      '/uniforms': 'http://localhost:5000',
      '/import_uniforms': 'http://localhost:5000',
      '/export_pdf': 'http://localhost:5000',
    }
  }
})
