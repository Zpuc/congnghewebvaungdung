/** Khớp CHECK `ThanhToan.HinhThuc` trong DB. */
export const HINH_THUC_THANH_TOAN_OPTIONS = [
  'Tiền mặt',
  'Thẻ',
  'Chuyển khoản',
  'Ví điện tử',
] as const

export type YeuCauThanhToanPhat = {
  maYeuCau: string
  maPhat: string
  maBanDoc: string
  soTien: number
  hinhThuc: string
  ghiChu: string | null
  trangThai: string
  ngayTao: string
  maThanhToan: string | null
}

export type DuyetThanhToanPhatResult = {
  maThanhToan: string
  maYeuCau: string
  maPhat: string
}
