import { http } from './http'
import type { ApiResponse } from '../types/api'
import type { TheLoai } from '../types/the-loai'

export async function getAllTheLoai() {
  const { data } = await http.get<ApiResponse<TheLoai[]>>('/api/TheLoai')
  return data
}

