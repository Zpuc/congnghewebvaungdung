import { isAxiosError } from 'axios'
import { http } from './http'
import type { ApiResponse } from '../types/api'
import type {
  CreateTheLoaiPayload,
  TheLoaiItem,
  UpdateTheLoaiPayload,
} from '../types/the-loai-crud'

function mapApiError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (message) return message
    if (error.response?.status === 400) return 'Dữ liệu thể loại không hợp lệ.'
    if (error.response?.status === 404) return 'Không tìm thấy thể loại.'
  }
  return fallback
}

export async function getAllTheLoaiCrud() {
  try {
    const { data } = await http.get<ApiResponse<TheLoaiItem[]>>('/api/TheLoai')
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được danh sách thể loại'))
  }
}

export async function createTheLoai(payload: CreateTheLoaiPayload) {
  try {
    const { data } = await http.post<ApiResponse<TheLoaiItem>>('/api/TheLoai', payload)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể thêm thể loại'))
  }
}

export async function updateTheLoai(id: string, payload: UpdateTheLoaiPayload) {
  try {
    const { data } = await http.put<ApiResponse<boolean>>(`/api/TheLoai/${id}`, payload)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể cập nhật thể loại'))
  }
}

export async function deleteTheLoai(id: string) {
  try {
    const { data } = await http.delete<ApiResponse<boolean>>(`/api/TheLoai/${id}`)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể xóa thể loại'))
  }
}

