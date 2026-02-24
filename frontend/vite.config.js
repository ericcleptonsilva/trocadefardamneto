import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/register_exchange.php': 'http://127.0.0.1:8000',
      '/history.php': 'http://127.0.0.1:8000',
      '/uniforms.php': 'http://127.0.0.1:8000',
      '/import_uniforms.php': 'http://127.0.0.1:8000',
      '/export_pdf.php': 'http://127.0.0.1:8000',
    }
  }
})
