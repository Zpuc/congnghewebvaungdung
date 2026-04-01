/**
 * URL gốc cho Axios.
 * - **Development (mặc định):** `''` → gọi `/api/...` cùng origin với Vite, đi qua proxy trong `vite.config.ts`
 *   (tránh CORS và lỗi tiền kiểm tra với `Authorization`).
 * - Ghi đè: đặt `VITE_API_BASE_URL` trong `.env.development` (vd: http://localhost:5057) nếu không dùng proxy.
 */
function resolveApiBaseUrl(): string {
  const v = import.meta.env.VITE_API_BASE_URL
  if (v !== undefined && v !== null && String(v).trim() !== '') {
    return String(v).trim()
  }
  if (import.meta.env.DEV) {
    return ''
  }
  return 'http://localhost:5057'
}

export const API_BASE_URL = resolveApiBaseUrl()
