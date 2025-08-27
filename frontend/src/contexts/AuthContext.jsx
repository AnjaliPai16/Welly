"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      try {
        // Verify token with backend
        const response = await authAPI.getMe()
        // getMe returns user data directly on success
        if (response && response._id) {
          setUser(response)
        } else {
          // Token is invalid, clear storage
          logout()
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        logout()
      }
    }
    setLoading(false)
  }

  const login = async (credentials) => {
    try {
      setError("")
      const response = await authAPI.login(credentials)
      
      // Backend returns { token, user } directly on success
      if (response.token && response.user) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        setUser(response.user)
        return { success: true }
      } else {
        setError(response.message || 'Login failed')
        return { success: false, message: response.message }
      }
    } catch (error) {
      setError(error.message || 'Login failed')
      return { success: false, message: error.message }
    }
  }

  const register = async (userData) => {
    try {
      setError("")
      const response = await authAPI.register(userData)
      
      // Backend returns { token, user } directly on success
      if (response.token && response.user) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        setUser(response.user)
        return { success: true }
      } else {
        setError(response.message || 'Registration failed')
        return { success: false, message: response.message }
      }
    } catch (error) {
      setError(error.message || 'Registration failed')
      return { success: false, message: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setError("")
  }

  const clearError = () => {
    setError("")
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
