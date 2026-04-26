import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite' // Tambahkan ini


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
