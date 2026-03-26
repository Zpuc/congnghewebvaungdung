import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { UserRole } from '../types/auth'
import { useAuth } from '../auth/AuthContext'
import { getRoleHomePath } from '../auth/role-utils'

type ProtectedRouteProps = {
  allowRoles?: UserRole[]
  children: ReactNode
}

export function ProtectedRoute({ allowRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowRoles && !allowRoles.includes(user.vaiTro)) {
    return <Navigate to={getRoleHomePath(user.vaiTro)} replace />
  }

  return <>{children}</>
}

