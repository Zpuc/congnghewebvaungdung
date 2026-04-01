import axios, { type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../config/env'
import { getAuthToken } from './auth-storage'

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

/** JWT thường có 3 phần (header.payload.sig); token hỏng trong storage có thể làm auth middleware phản hồi lạ. */
function isLikelyJwt(token: string) {
  const parts = token.split('.')
  return parts.length >= 3 && parts.every((p) => p.length > 0)
}

/** Khôi phục pathname cho request (kể cả baseURL rỗng + url `/api/...`). */
function requestPathname(config: InternalAxiosRequestConfig): string {
  const base = (config.baseURL ?? '').replace(/\/$/, '')
  const path = config.url ?? ''
  const combined = path.startsWith('http://') || path.startsWith('https://')
    ? path
    : `${base}/${path.replace(/^\//, '')}`
  const noQuery = combined.split('?')[0]
  try {
    return new URL(noQuery, 'http://localhost').pathname
  } catch {
    const p = noQuery.startsWith('/') ? noQuery : `/${noQuery}`
    return p.split('?')[0]
  }
}

/** GET kệ sách là [AllowAnonymous] — không gửi Bearer để tránh xung đột khi token hết hạn/sai. */
function isAnonymousKeSachRead(config: InternalAxiosRequestConfig) {
  if ((config.method ?? 'get').toLowerCase() !== 'get') return false
  const p = requestPathname(config)
  return p === '/api/KeSach' || /^\/api\/KeSach\/[^/]+$/.test(p)
}

http.interceptors.request.use((config) => {
  const raw = getAuthToken()
  const token = raw?.trim()
  if (token && isLikelyJwt(token) && !isAnonymousKeSachRead(config)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

