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
    
    console.log('FULL RES DATA:', JSON.stringify(res.data))
    
    const loginData = res?.data?.data || res?.data || res
    
    console.log('LOGIN DATA:', JSON.stringify(loginData))
    console.log('NAME:', loginData.name)
    console.log('ROLE:', loginData.role)
    
    const accessToken = loginData.accessToken

    const userData = {
      id: loginData.userId,
      userId: loginData.userId,
      name: loginData.name,
      email: loginData.email,
      role: loginData.role,
      departmentId: loginData.departmentId,
    }

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