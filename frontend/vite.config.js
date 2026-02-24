import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/register_exchange': 'http://127.0.0.1:5000',
      '/history': 'http://127.0.0.1:5000',
      '/uniforms': 'http://127.0.0.1:5000',
      '/import_uniforms': 'http://127.0.0.1:5000',
      '/export_pdf': 'http://127.0.0.1:5000',
    }
  }
})
