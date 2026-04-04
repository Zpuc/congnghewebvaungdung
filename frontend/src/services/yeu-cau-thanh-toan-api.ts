import { isAxiosError } from 'axios'
import { http } from './http'
import type { ApiResponse } from '../types/api'
import type { DuyetThanhToanPhatResult, YeuCauThanhToanPhat } from '../types/yeu-cau-thanh-toan'

type YcRaw = Partial<{
  maYeuCau: string
  MaYeuCau: string
  maPhat: string
  MaPhat: string
  maBanDoc: string
  MaBanDoc: string
  soTien: number
  SoTien: number
  hinhThuc: string
  HinhThuc: string
  ghiChu: string | null
  GhiChu: string | null
  trangThai: string
  TrangThai: string
  ngayTao: string
  NgayTao: string
  maThanhToan: string | null
  MaThanhToan: string | null
}>

function normalizeYc(item: YcRaw): YeuCauThanhToanPhat {
  const maTt = item.maThanhToan ?? item.MaThanhToan
  return {
    maYeuCau: item.maYeuCau ?? item.MaYeuCau ?? '',
    maPhat: item.maPhat ?? item.MaPhat ?? '',
    maBanDoc: item.maBanDoc ?? item.MaBanDoc ?? '',
    soTien: Number(item.soTien ?? item.SoTien ?? 0),
    hinhThuc: item.hinhThuc ?? item.HinhThuc ?? '',
    ghiChu: item.ghiChu ?? item.GhiChu ?? null,
    trangThai: item.trangThai ?? item.TrangThai ?? '',
    ngayTao: item.ngayTao ?? item.NgayTao ?? '',
    maThanhToan: maTt === undefined || maTt === null ? null : String(maTt),
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

export async function listYeuCauCuaToi(): Promise<YeuCauThanhToanPhat[]> {
  try {
    const { data } = await http.get<ApiResponse<YcRaw[]>>('/api/YeuCauThanhToanPhat/cua-toi')
    const list = assertSuccess(data, 'Không tải được yêu cầu thanh toán.')
    return (Array.isArray(list) ? list : []).map(normalizeYc)
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được yêu cầu thanh toán'))
  }
}

export async function listYeuCauChoDuyet(): Promise<YeuCauThanhToanPhat[]> {
  try {
    const { data } = await http.get<ApiResponse<YcRaw[]>>('/api/YeuCauThanhToanPhat/cho-duyet')
    const list = assertSuccess(data, 'Không tải danh sách chờ duyệt.')
    return (Array.isArray(list) ? list : []).map(normalizeYc)
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải danh sách chờ duyệt'))
  }
}

export async function taoYeuCauThanhToan(body: {
  maPhat: string
  hinhThuc: string
  ghiChu?: string
}): Promise<YeuCauThanhToanPhat> {
  try {
    const { data } = await http.post<ApiResponse<YcRaw>>('/api/YeuCauThanhToanPhat', body)
    const row = assertSuccess(data, 'Không gửi được yêu cầu.')
    return normalizeYc(row)
  } catch (error) {
    throw new Error(mapApiError(error, 'Không gửi được yêu cầu thanh toán'))
  }
}

type DuyetRaw = Partial<{
  maThanhToan: string
  MaThanhToan: string
  maYeuCau: string
  MaYeuCau: string
  maPhat: string
  MaPhat: string
}>

export async function duyetYeuCauThanhToan(maYeuCau: string): Promise<DuyetThanhToanPhatResult> {
  try {
    const { data } = await http.post<ApiResponse<DuyetRaw>>(
      `/api/YeuCauThanhToanPhat/${encodeURIComponent(maYeuCau)}/duyet`,
    )
    const row = assertSuccess(data, 'Duyệt không thành công.')
    return {
      maThanhToan: row.maThanhToan ?? row.MaThanhToan ?? '',
      maYeuCau: row.maYeuCau ?? row.MaYeuCau ?? '',
      maPhat: row.maPhat ?? row.MaPhat ?? '',
    }
  } catch (error) {
    throw new Error(mapApiError(error, 'Duyệt thanh toán thất bại'))
  }
}
