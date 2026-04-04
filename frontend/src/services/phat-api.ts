import { isAxiosError } from 'axios'
import { http } from './http'
import type { Phat } from '../types/phat'

type PhatRaw = Partial<{
  maPhat: string
  MaPhat: string
  maPhieuMuon: string
  MaPhieuMuon: string
  soTien: number
  SoTien: number
  lyDo: string
  LyDo: string
  ngayTinh: string
  NgayTinh: string
  trangThai: string
  TrangThai: string
  maThanhToan: string | null
  MaThanhToan: string | null
}>

function normalizePhat(item: PhatRaw): Phat {
  const maThanhToan = item.maThanhToan ?? item.MaThanhToan
  return {
    maPhat: item.maPhat ?? item.MaPhat ?? '',
    maPhieuMuon: item.maPhieuMuon ?? item.MaPhieuMuon ?? '',
    soTien: Number(item.soTien ?? item.SoTien ?? 0),
    lyDo: item.lyDo ?? item.LyDo ?? '',
    ngayTinh: item.ngayTinh ?? item.NgayTinh ?? '',
    trangThai: item.trangThai ?? item.TrangThai ?? '',
    maThanhToan: maThanhToan === undefined || maThanhToan === null ? null : String(maThanhToan),
  }
}

function mapApiError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (message) return message
    if (error.response?.status === 404) {
      return 'Không tìm thấy bản ghi phạt.'
    }
  }
  return fallback
}

/** Backend trả về mảng PhatDTO trực tiếp (không bọc ApiResponse). */
export async function getAllPhat(): Promise<{ data: Phat[] }> {
  try {
    const { data } = await http.get<PhatRaw[]>('/api/Phat')
    const list = Array.isArray(data) ? data : []
    return { data: list.map(normalizePhat) }
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được danh sách phạt'))
  }
}

/** Phạt của bạn đọc đang đăng nhập (`GET /api/Phat/cua-toi`). */
export async function getPhatCuaToi(): Promise<Phat[]> {
  try {
    const { data } = await http.get<PhatRaw[]>('/api/Phat/cua-toi')
    const list = Array.isArray(data) ? data : []
    return list.map(normalizePhat)
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được danh sách phạt của bạn'))
  }
}
