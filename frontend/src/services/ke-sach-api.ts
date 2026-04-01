import { isAxiosError } from 'axios'
import { http } from './http'
import type { ApiResponse } from '../types/api'
import type { CreateKeSachPayload, KeSach, UpdateKeSachPayload } from '../types/ke-sach'

type KeSachRaw = Partial<{
  maKe: string
  MaKe: string
  viTri: string
  ViTri: string
}>

function normalizeKeSach(item: KeSachRaw): KeSach {
  return {
    maKe: item.maKe ?? item.MaKe ?? '',
    viTri: item.viTri ?? item.ViTri ?? '',
  }
}

/** Đọc message / validation từ body ASP.NET (ProblemDetails, ResponseDTO, v.v.). */
function messageFromResponseData(data: unknown): string | undefined {
  if (data == null || typeof data !== 'object') return undefined
  const o = data as Record<string, unknown>
  if (typeof o.message === 'string' && o.message.trim()) return o.message.trim()
  if (typeof o.title === 'string' && o.title.trim()) return o.title.trim()
  const errs = o.errors
  if (errs != null && typeof errs === 'object' && !Array.isArray(errs)) {
    for (const v of Object.values(errs)) {
      if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string') return v[0]
      if (typeof v === 'string' && v.trim()) return v.trim()
    }
  }
  return undefined
}

function mapApiError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = messageFromResponseData(error.response?.data)
    if (message) return message
    if (error.response?.status === 404) {
      return 'Không tìm thấy kệ sách. Dữ liệu có thể đã bị xóa hoặc chưa tồn tại.'
    }
    if (error.response?.status === 400) {
      return 'Dữ liệu kệ sách không hợp lệ. Vui lòng kiểm tra lại.'
    }
  }
  return fallback
}

export async function getAllKeSach() {
  try {
    const { data } = await http.get<ApiResponse<KeSachRaw[]>>('/api/KeSach')
    return {
      ...data,
      data: (data.data ?? []).map(normalizeKeSach),
    }
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được danh sách kệ sách'))
  }
}

export async function createKeSach(payload: CreateKeSachPayload) {
  try {
    const body = {
      maKe: payload.maKe?.trim() || undefined,
      viTri: payload.viTri.trim(),
    }
    const { data } = await http.post<ApiResponse<KeSachRaw>>('/api/KeSach', body)
    return {
      ...data,
      data: data.data ? normalizeKeSach(data.data) : undefined,
    }
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể thêm kệ sách'))
  }
}

export async function updateKeSach(maKe: string, payload: UpdateKeSachPayload) {
  try {
    const { data } = await http.put<ApiResponse<boolean>>(`/api/KeSach/${encodeURIComponent(maKe)}`, {
      viTri: payload.viTri.trim(),
    })
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể cập nhật kệ sách'))
  }
}

export async function deleteKeSach(maKe: string) {
  try {
    const { data } = await http.delete<ApiResponse<boolean>>(`/api/KeSach/${encodeURIComponent(maKe)}`)
    return data
  } catch (error) {
    throw new Error(mapApiError(error, 'Không thể xóa kệ sách'))
  }
}
