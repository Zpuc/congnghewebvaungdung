export type Sach = {
  maSach: string
  tieuDe: string
  tacGia: string
  namXuatBan?: number | null
  maTheLoai?: string | null
  theLoai?: string | null
  ngonNgu?: string | null
  tomTat?: string | null
  anhBiaUrl?: string | null
}

export type CreateSachPayload = {
  tieuDe: string
  tacGia: string
  namXuatBan?: number | null
  maTheLoai?: string | null
  ngonNgu?: string | null
  tomTat?: string | null
}

export type UpdateSachPayload = {
  tieuDe: string
  tacGia: string
  namXuatBan?: number | null
  maTheLoai?: string | null
  ngonNgu?: string | null
  tomTat?: string | null
}

