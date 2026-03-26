import { isAxiosError } from 'axios'
import { http } from './http'
import type { ApiResponse } from '../types/api'
import type { BanDoc, CreateBanDocPayload, UpdateBanDocPayload } from '../types/ban-doc'

type BanDocRaw = Partial<{
  maBanDoc: string
  MaBanDoc: string
  hoTen: string
  HoTen: string
  soThe: string
  SoThe: string
  email: string
  Email: string
  dienThoai: string
  DienThoai: string
  hanThe: string
  HanThe: string
  trangThaiThe: string
  TrangThaiThe: string
  duNo: number
  DuNo: number
}>

function normalizeBanDoc(item: BanDocRaw): BanDoc {
  return {
    maBanDoc: item.maBanDoc ?? item.MaBanDoc ?? '',
    hoTen: item.hoTen ?? item.HoTen ?? '',
    soThe: item.soThe ?? item.SoThe ?? '',
    email: item.email ?? item.Email ?? '',
    dienThoai: item.dienThoai ?? item.DienThoai ?? '',
    hanThe: item.hanThe ?? item.HanThe ?? '',
    trangThaiThe: item.trangThaiThe ?? item.TrangThaiThe ?? '',
    duNo: item.duNo ?? item.DuNo ?? 0,
  }
}

function mapApiError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (message) return message
    if (error.response?.status === 404) {
      return 'Không tìm thấy bạn đọc. Dữ liệu có thể đã bị xóa hoặc chưa tồn tại.'
    }
    if (error.response?.status === 400) {
      return 'Dữ liệu bạn đọc không hợp lệ. Vui lòng kiểm tra lại.'
    }
  }
  return fallback
}

export async function getAllBanDoc() {
  try {
    const { data } = await http.get<ApiResponse<BanDocRaw[]>>('/api/BanDoc')
    return {
      ...data,
      data: (data.data ?? []).map(normalizeBanDoc),
    }
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được danh sách bạn đọc'))
  }
}

export async function createBanDoc(payload: CreateBanDocPayload) {
  try {
    const { data } = await http.post<ApiResponse<BanDoc>>('/api/BanDoc', payload)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể thêm bạn đọc'))
  }
}

export async function updateBanDoc(id: string, payload: UpdateBanDocPayload) {
  try {
    const { data } = await http.put<ApiResponse<boolean>>(`/api/BanDoc/${id}`, payload)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể cập nhật bạn đọc'))
  }
}

export async function deleteBanDoc(id: string) {
  try {
    const { data } = await http.delete<ApiResponse<boolean>>(`/api/BanDoc/${id}`)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể xóa bạn đọc'))
  }
}

