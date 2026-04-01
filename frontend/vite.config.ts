import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Gọi /api từ browser tới cùng origin (5173) → Vite chuyển tiếp sang Xử lý API.
      // Tránh CORS/preflight và một số lỗi lạ khi gắn Authorization cross-origin.
      '/api': {
        target: 'http://localhost:5057',
        changeOrigin: true,
      },
    },
  },
})
