// contexts/AuthContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {useRouter} from 'next/navigation'

interface User {
  userId: string
  username: string
  master_admin: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  signin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router= useRouter();

  const homePage= ()=> router.push('/');

  const domain = process.env.NEXT_PUBLIC_BE_SERVER
  console.log('Backend domain:', domain)

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      try {
        const decoded = JSON.parse(atob(savedToken.split('.')[1]))
        const nowSeconds = Math.floor(Date.now() / 1000)
        if (decoded.exp && decoded.exp <= nowSeconds) {
          localStorage.removeItem('token')
        } else {
          setToken(savedToken)
          setUser({
            userId: decoded.userId,
            username: decoded.username,
            master_admin: decoded.master_admin
          })
        }
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const signin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      const response = await fetch(`${domain}/v1/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok && data.res === true && data.jwtToken) {
        const decoded = JSON.parse(atob(data.jwtToken.split('.')[1]))
        const nowSeconds = Math.floor(Date.now() / 1000)
        if (decoded.exp && decoded.exp <= nowSeconds) {
          setLoading(false)
          return { success: false, error: 'Received expired token' }
        }
        
        setToken(data.jwtToken)
        setUser({
          userId: decoded.userId,
          username: decoded.username,
          master_admin: decoded.master_admin
        })
        
        localStorage.setItem('token', data.jwtToken)
        
        setLoading(false)
        return { success: true }
      } else {
        setLoading(false)
        return { 
          success: false, 
          error: data.message || 'Sign in failed' 
        }
      }
    } catch (error) {
      setLoading(false)
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }


  const register = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      const response = await fetch(`${domain}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok && data.res === true) {
        setLoading(false)
        return { success: true }
      } else {
        setLoading(false)
        return { 
          success: false, 
          error: data.message || 'Registration failed' 
        }
      }
    } catch (error) {
      setLoading(false)
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      }
    }
  }


  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    homePage();
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    signin,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
