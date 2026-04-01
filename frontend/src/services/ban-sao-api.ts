import { isAxiosError } from 'axios'
import { http } from './http'
import type { ApiResponse } from '../types/api'
import type { BanSao, CreateBanSaoPayload, UpdateBanSaoPayload } from '../types/ban-sao'

type BanSaoRaw = Partial<{
  maBanSao: string
  MaBanSao: string
  maVach: string
  MaVach: string
  maSach: string
  MaSach: string
  maKe: string
  MaKe: string
  soLuong: number
  SoLuong: number
  trangThai: string
  TrangThai: string
}>

function normalizeBanSao(item: BanSaoRaw): BanSao {
  return {
    maBanSao: item.maBanSao ?? item.MaBanSao ?? '',
    maVach: item.maVach ?? item.MaVach ?? '',
    maSach: item.maSach ?? item.MaSach ?? '',
    maKe: item.maKe ?? item.MaKe ?? null,
    soLuong: item.soLuong ?? item.SoLuong ?? 0,
    trangThai: item.trangThai ?? item.TrangThai ?? null,
  }
}

function mapApiError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (message) return message
    if (error.response?.status === 404) {
      return 'Không tìm thấy bản sao. Dữ liệu có thể đã bị xóa hoặc chưa tồn tại.'
    }
    if (error.response?.status === 400) {
      return 'Dữ liệu bản sao không hợp lệ. Vui lòng kiểm tra lại.'
    }
  }
  return fallback
}

export async function getAllBanSao() {
  try {
    const { data } = await http.get<ApiResponse<BanSaoRaw[]>>('/api/BanSao')
    return {
      ...data,
      data: (data.data ?? []).map(normalizeBanSao),
    }
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được danh sách bản sao'))
  }
}

export async function createBanSao(payload: CreateBanSaoPayload) {
  try {
    const { data } = await http.post<ApiResponse<BanSao>>('/api/BanSao', payload)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể thêm bản sao'))
  }
}

export async function updateBanSao(id: string, payload: UpdateBanSaoPayload) {
  try {
    const { data } = await http.put<ApiResponse<boolean>>(`/api/BanSao/${id}`, payload)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể cập nhật bản sao'))
  }
}

export async function deleteBanSao(id: string) {
  try {
    const { data } = await http.delete<ApiResponse<boolean>>(`/api/BanSao/${id}`)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể xóa bản sao'))
  }
}
