export type BanSao = {
  maBanSao: string
  maVach: string
  maSach: string
  maKe?: string | null
  soLuong: number
  trangThai?: string | null
}

export type CreateBanSaoPayload = {
  maVach: string
  maSach: string
  maKe?: string | null
  soLuong: number
  trangThai?: string | null
}

export type UpdateBanSaoPayload = {
  maVach: string
  maSach: string
  maKe?: string | null
  soLuong: number
  trangThai?: string | null
}
