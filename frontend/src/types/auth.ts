export type UserRole = 'Quản trị' | 'Thủ thư' | 'Bạn đọc'

export type AuthUser = {
  maTaiKhoan: string
  tenDangNhap: string
  vaiTro: UserRole
  maBanDoc?: string | null
}

export type LoginRequest = {
  tenDangNhap: string
  matKhau: string
}

export type LoginApiResponse = {
  success: boolean
  message: string
  data?: {
    token: string
    user: {
      maTaiKhoan?: string
      MaTaiKhoan?: string
      tenDangNhap?: string
      TenDangNhap?: string
      vaiTro?: UserRole
      VaiTro?: UserRole
      maBanDoc?: string | null
      MaBanDoc?: string | null
    }
  }
}

