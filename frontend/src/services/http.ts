import axios from 'axios'
import { API_BASE_URL } from '../config/env'
import { getAuthToken } from './auth-storage'

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

