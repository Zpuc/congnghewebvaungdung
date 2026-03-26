import { http } from './http'
import { isAxiosError } from 'axios'
import type { ApiResponse } from '../types/api'
import type {
  CreateTaiKhoanPayload,
  TaiKhoan,
  UpdateTaiKhoanPayload,
} from '../types/tai-khoan'

function mapApiError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (message) return message
    if (error.response?.status === 400) {
      return 'Dữ liệu tài khoản không hợp lệ. Vui lòng kiểm tra lại.'
    }
    if (error.response?.status === 404) {
      return 'Không tìm thấy tài khoản.'
    }
  }
  return fallback
}

export async function getAllTaiKhoan() {
  try {
    const { data } = await http.get<ApiResponse<TaiKhoan[]>>('/api/TaiKhoan')
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được danh sách tài khoản'))
  }
}

export async function createTaiKhoan(payload: CreateTaiKhoanPayload) {
  try {
    const { data } = await http.post<ApiResponse<TaiKhoan>>('/api/TaiKhoan', payload)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể tạo tài khoản'))
  }
}

export async function updateTaiKhoan(id: string, payload: UpdateTaiKhoanPayload) {
  try {
    const { data } = await http.put<ApiResponse<boolean>>(`/api/TaiKhoan/${id}`, payload)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể cập nhật tài khoản'))
  }
}

export async function deleteTaiKhoan(id: string) {
  try {
    const { data } = await http.delete<ApiResponse<boolean>>(`/api/TaiKhoan/${id}`)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể xóa tài khoản'))
  }
}

export async function registerReaderTaiKhoan(payload: {
  hoTen: string
  email: string
  dienThoai: string
  matKhau: string
}) {
  try {
    const { data } = await http.post<ApiResponse<TaiKhoan>>(
      '/api/TaiKhoan/register-reader',
      payload,
    )
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể tạo tài khoản bạn đọc'))
  }
}

