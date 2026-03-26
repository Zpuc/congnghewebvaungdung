import type { UserRole } from '../types/auth'

export function getRoleHomePath(role: UserRole) {
  if (role === 'Quản trị') return '/admin'
  if (role === 'Thủ thư') return '/thu-thu'
  return '/ban-doc'
}

