// pages/login/page.tsx (or wherever your page is)
"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Router } from 'next/router'
import { useRouter } from 'next/navigation'


const Page = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { signin, register, loading, isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/chat')  // Redirect to /chat if logged in
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')



    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      if (isLogin) {
        const result = await signin(username, password)
        if (result.success) {
          setSuccess('Login successful!')
        } else {
          setError(result.error || 'Login failed')
        }
      } else {
        const result = await register(username, password)
        if (result.success) {
          setSuccess('Registration successful! Please login.')
          setIsLogin(true)
          setPassword('')
        } else {
          setError(result.error || 'Registration failed')
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  const handleToggle = () => {
    setIsLogin(!isLogin)
    setError('')
    setSuccess('')
    setUsername('')
    setPassword('')
  }



  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto' }}>
      <div style={{ border: '2px solid #ccc', padding: '30px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          {isLogin ? 'Login' : 'Register'}
        </h1>


        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: '#e8f5e8',
              color: '#2e7d32',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              border: '1px solid #c8e6c9'
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '15px'
            }}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleToggle}
            disabled={loading}
            style={{
              backgroundColor: 'transparent',
              color: '#007bff',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
          </button>
        </div>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
          <p>Testing connection to: {process.env.NEXT_PUBLIC_BE_SERVER}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  )
}

export default Page
