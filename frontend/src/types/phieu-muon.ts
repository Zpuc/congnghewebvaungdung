export type PhieuMuon = {
  maPhieuMuon: string
  maBanSao: string
  maBanDoc: string
  ngayMuon: string
  hanTra: string
  ngayTraThucTe: string | null
  soLanGiaHan: number
  trangThai: string
}

/** Backend tự sinh mã; các trường dư được gửi cho khớp DTO. */
export type CreatePhieuMuonPayload = {
  maPhieuMuon: string
  maBanSao: string
  maBanDoc: string
  ngayMuon: string
  hanTra: string
  ngayTraThucTe?: string | null
  soLanGiaHan: number
  trangThai: string
}

export type UpdatePhieuMuonPayload = {
  maBanSao: string
  maBanDoc: string
  ngayMuon: string
  hanTra: string
  ngayTraThucTe?: string | null
  soLanGiaHan: number
  trangThai: string
}

export type TraSachVaTinhPhatPayload = {
  maPhieuMuon: string
  ngayTraThucTe: string
}

export type TraSachVaTinhPhatResult = {
  phieuMuon: PhieuMuon | null
  soNgayTre: number
  tienPhat: number
  maPhat: string | null
}
