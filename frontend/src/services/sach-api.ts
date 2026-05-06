import { http } from './http'
import { isAxiosError } from 'axios'
import type { ApiResponse } from '../types/api'
import type { CreateSachPayload, Sach, UpdateSachPayload } from '../types/sach'

function mapApiError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (message) return message
    if (error.response?.status === 400) {
      return 'Dữ liệu sách không hợp lệ. Vui lòng kiểm tra lại thông tin.'
    }
  }
  return fallback
}

export async function getAllSach() {
  try {
    const { data } = await http.get<ApiResponse<Sach[]>>('/api/Sach')
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được danh sách sách'))
  }
}

export async function getSachById(id: string) {
  try {
    const { data } = await http.get<ApiResponse<Sach>>(`/api/Sach/${id}`)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được thông tin sách'))
  }
}

export async function createSach(payload: CreateSachPayload) {
  try {
    const { data } = await http.post<ApiResponse<Sach>>('/api/Sach', payload)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể thêm sách'))
  }
}

export async function createSachWithImage(formData: FormData) {
  try {
    const { data } = await http.post<ApiResponse<Sach>>('/api/Sach/create-with-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể thêm sách với ảnh'))
  }
}

export async function updateSach(id: string, payload: UpdateSachPayload) {
  try {
    const { data } = await http.put<ApiResponse<boolean>>(`/api/Sach/${id}`, payload)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể cập nhật sách'))
  }
}

export async function uploadSachImage(maSach: string, file: File) {
  try {
    const formData = new FormData()
    formData.append('MaSach', maSach)
    formData.append('Image', file)

    const { data } = await http.post<{ imageUrl: string }>('/api/Sach/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể tải ảnh lên'))
  }
}

export async function deleteSach(id: string) {
  try {
    const { data } = await http.delete<ApiResponse<boolean>>(`/api/Sach/${id}`)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể xóa sách'))
  }
}

