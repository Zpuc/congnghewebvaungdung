import type { UserRole } from './auth'

export type TaiKhoan = {
  maTaiKhoan: string
  tenDangNhap: string
  matKhau?: string
  vaiTro: UserRole
  maBanDoc?: string | null
}

export type CreateTaiKhoanPayload = {
  maTaiKhoan?: string
  tenDangNhap: string
  matKhau: string
  vaiTro: UserRole
  maBanDoc?: string | null
}

export type UpdateTaiKhoanPayload = {
  tenDangNhap: string
  matKhau: string
  vaiTro: UserRole
  maBanDoc?: string | null
}

