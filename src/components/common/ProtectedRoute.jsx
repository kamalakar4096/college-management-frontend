import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ROLE_HOME = {
  ADMIN: '/admin',
  DEAN: '/dean',
  HOD: '/hod',
  FACULTY: '/faculty',
  STUDENT: '/student',
}

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={ROLE_HOME[user?.role] || '/login'} replace />
  }

  return children
}

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) return null

  if (isAuthenticated && user?.role) {
    return <Navigate to={ROLE_HOME[user.role]} replace />
  }

  return children
}