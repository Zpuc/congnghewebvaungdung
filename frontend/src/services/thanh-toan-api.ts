import { isAxiosError } from 'axios'
import { http } from './http'
import type { ApiResponse } from '../types/api'
import type { ThanhToan } from '../types/thanh-toan'

type TtRaw = Partial<{
  maThanhToan: string | null
  MaThanhToan: string | null
  maBanDoc: string
  MaBanDoc: string
  ngayThanhToan: string
  NgayThanhToan: string
  soTien: number
  SoTien: number
  hinhThuc: string
  HinhThuc: string
  ghiChu: string | null
  GhiChu: string | null
}>

function normalizeTt(item: TtRaw): ThanhToan {
  const ma = item.maThanhToan ?? item.MaThanhToan
  return {
    maThanhToan: ma === undefined || ma === null ? null : String(ma),
    maBanDoc: item.maBanDoc ?? item.MaBanDoc ?? '',
    ngayThanhToan: item.ngayThanhToan ?? item.NgayThanhToan ?? '',
    soTien: Number(item.soTien ?? item.SoTien ?? 0),
    hinhThuc: item.hinhThuc ?? item.HinhThuc ?? '',
    ghiChu: item.ghiChu ?? item.GhiChu ?? null,
  }
}

function mapApiError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const body = error.response?.data as { message?: string; Message?: string } | undefined
    const message = body?.message ?? body?.Message
    if (message) return message
  }
  return fallback
}

function assertSuccess<T>(res: ApiResponse<T> | undefined, fallback: string): T {
  if (!res?.success) {
    throw new Error(res?.message ?? fallback)
  }
  if (res.data === undefined || res.data === null) {
    throw new Error(res.message ?? fallback)
  }
  return res.data
}

export async function getAllThanhToan(): Promise<ThanhToan[]> {
  try {
    const { data } = await http.get<ApiResponse<TtRaw[]>>('/api/ThanhToan')
    const list = assertSuccess(data, 'Không tải được danh sách thanh toán.')
    return (Array.isArray(list) ? list : []).map(normalizeTt)
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được danh sách thanh toán'))
  }
}
