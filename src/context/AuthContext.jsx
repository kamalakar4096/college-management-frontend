import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (e) {
      localStorage.clear()
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password })

    // ✅ Handle ApiResponse wrapper: { success, data: { accessToken, userId, ... } }
    const loginData = res?.data || res

    const accessToken = loginData.accessToken

    const userData = {
      id: loginData.userId,          // ✅ use 'id' not 'userId'
      userId: loginData.userId,      // keep for backward compat
      name: loginData.name,
      email: loginData.email,
      role: loginData.role,
      departmentId: loginData.departmentId,
    }

    console.log('USER after login:', JSON.stringify(userData))

    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(accessToken)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      loading,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}