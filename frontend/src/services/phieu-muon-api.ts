import { isAxiosError } from 'axios'
import { http } from './http'
import type { ApiResponse } from '../types/api'
import type {
  CreatePhieuMuonPayload,
  PhieuMuon,
  TraSachVaTinhPhatPayload,
  TraSachVaTinhPhatResult,
  UpdatePhieuMuonPayload,
} from '../types/phieu-muon'

type PhieuMuonRaw = Partial<{
  maPhieuMuon: string
  MaPhieuMuon: string
  maBanSao: string
  MaBanSao: string
  maBanDoc: string
  MaBanDoc: string
  ngayMuon: string
  NgayMuon: string
  hanTra: string
  HanTra: string
  ngayTraThucTe: string | null
  NgayTraThucTe: string | null
  soLanGiaHan: number
  SoLanGiaHan: number
  trangThai: string
  TrangThai: string
}>

function normalizePhieuMuon(item: PhieuMuonRaw): PhieuMuon {
  const nt = item.ngayTraThucTe ?? item.NgayTraThucTe
  return {
    maPhieuMuon: item.maPhieuMuon ?? item.MaPhieuMuon ?? '',
    maBanSao: item.maBanSao ?? item.MaBanSao ?? '',
    maBanDoc: item.maBanDoc ?? item.MaBanDoc ?? '',
    ngayMuon: item.ngayMuon ?? item.NgayMuon ?? '',
    hanTra: item.hanTra ?? item.HanTra ?? '',
    ngayTraThucTe: nt === undefined || nt === null || nt === '' ? null : String(nt),
    soLanGiaHan: item.soLanGiaHan ?? item.SoLanGiaHan ?? 0,
    trangThai: item.trangThai ?? item.TrangThai ?? '',
  }
}

function mapEnvelope<T>(data: ApiResponse<T>, fallback: string): ApiResponse<T> {
  if (!data.success) {
    throw new Error(data.message || fallback)
  }
  return data
}

function mapApiError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; Message?: string; title?: string }
      | undefined
    const msg = data?.message ?? data?.Message ?? data?.title
    if (msg) return String(msg)
    if (error.response?.status === 404) {
      return 'Không tìm thấy phiếu mượn.'
    }
    if (error.response?.status === 400) {
      return 'Dữ liệu phiếu mượn không hợp lệ.'
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      return 'Bạn cần đăng nhập quyền Thủ thư / Quản trị để thực hiện thao tác này.'
    }
  }
  return fallback
}

export async function getAllPhieuMuon() {
  try {
    const { data } = await http.get<ApiResponse<PhieuMuonRaw[]>>('/api/PhieuMuon')
    const ok = mapEnvelope(data, 'Không tải được danh sách phiếu mượn')
    return {
      ...ok,
      data: (ok.data ?? []).map(normalizePhieuMuon),
    }
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tải được danh sách phiếu mượn'))
  }
}

export async function createPhieuMuon(payload: CreatePhieuMuonPayload) {
  try {
    const { data } = await http.post<ApiResponse<PhieuMuonRaw>>('/api/PhieuMuon', payload)
    const ok = mapEnvelope(data, 'Không tạo được phiếu mượn')
    return {
      ...ok,
      data: ok.data ? normalizePhieuMuon(ok.data) : null,
    }
  } catch (error) {
    throw new Error(mapApiError(error, 'Không tạo được phiếu mượn'))
  }
}

export async function updatePhieuMuon(id: string, payload: UpdatePhieuMuonPayload) {
  try {
    const { data } = await http.put<ApiResponse<boolean>>(`/api/PhieuMuon/${encodeURIComponent(id)}`, payload)
    return mapEnvelope(data, 'Không cập nhật được phiếu mượn')
  } catch (error) {
    throw new Error(mapApiError(error, 'Không cập nhật được phiếu mượn'))
  }
}

export async function deletePhieuMuon(id: string) {
  try {
    const { data } = await http.delete<ApiResponse<boolean>>(`/api/PhieuMuon/${encodeURIComponent(id)}`)
    return mapEnvelope(data, 'Không xóa được phiếu mượn')
  } catch (error) {
    throw new Error(mapApiError(error, 'Không xóa được phiếu mượn'))
  }
}

type TraSachResultRaw = Partial<{
  phieuMuon: PhieuMuonRaw
  PhieuMuon: PhieuMuonRaw
  soNgayTre: number
  SoNgayTre: number
  tienPhat: number
  TienPhat: number
  maPhat: string | null
  MaPhat: string | null
}>

export async function traSachVaTinhPhat(payload: TraSachVaTinhPhatPayload) {
  try {
    const { data } = await http.post<ApiResponse<TraSachResultRaw>>(
      '/api/PhieuMuon/tra-sach-va-tinh-phat',
      {
        maPhieuMuon: payload.maPhieuMuon,
        ngayTraThucTe: payload.ngayTraThucTe,
      },
    )
    const ok = mapEnvelope(data, 'Trả sách thất bại')
    const raw = ok.data
    if (!raw) {
      throw new Error('Phản hồi trả sách không có dữ liệu')
    }
    const pmRaw = raw.phieuMuon ?? raw.PhieuMuon
    const result: TraSachVaTinhPhatResult = {
      phieuMuon: pmRaw ? normalizePhieuMuon(pmRaw) : null,
      soNgayTre: raw.soNgayTre ?? raw.SoNgayTre ?? 0,
      tienPhat: Number(raw.tienPhat ?? raw.TienPhat ?? 0),
      maPhat: (raw.maPhat ?? raw.MaPhat) ?? null,
    }
    return { ...ok, data: result }
  } catch (error) {
    throw new Error(mapApiError(error, 'Trả sách & tính phạt thất bại'))
  }
}
