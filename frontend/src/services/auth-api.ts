import { isAxiosError } from 'axios'
import { http } from './http'
import type { AuthUser, LoginApiResponse, LoginRequest } from '../types/auth'

function normalizeUser(user: NonNullable<LoginApiResponse['data']>['user']): AuthUser {
  return {
    maTaiKhoan: user.maTaiKhoan ?? user.MaTaiKhoan ?? '',
    tenDangNhap: user.tenDangNhap ?? user.TenDangNhap ?? '',
    vaiTro: (user.vaiTro ?? user.VaiTro ?? 'Bạn đọc') as AuthUser['vaiTro'],
    maBanDoc: user.maBanDoc ?? user.MaBanDoc ?? null,
  }
}

export async function loginApi(payload: LoginRequest) {
  try {
    const { data } = await http.post<LoginApiResponse>('/api/DangNhap/login', payload)

    if (!data?.success || !data?.data?.token || !data?.data?.user) {
      throw new Error(data?.message || 'Đăng nhập thất bại')
    }

    return {
      token: data.data.token,
      user: normalizeUser(data.data.user),
      message: data.message,
    }
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Sai tài khoản hoặc mật khẩu, vui lòng nhập lại.')
      }

      const apiMessage = (error.response?.data as { message?: string } | undefined)?.message
      if (apiMessage) {
        throw new Error(apiMessage)
      }
    }

    throw new Error('Không thể đăng nhập, vui lòng thử lại.')
  }
}

