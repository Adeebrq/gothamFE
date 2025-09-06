// pages/login/page.tsx (or wherever your page is)
"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Router } from 'next/router'
import { useRouter } from 'next/navigation'
import Header from '../components/header'
import EncryptedTextReveal from '../components/EncryptedTextReveal'

const Page = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { signin, register, loading, isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/chat')  // Redirect to /chat if logged in
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      return
    }

    try {
      if (isLogin) {
        const result = await signin(username, password)
      } else {
        const result = await register(username, password)
        if (result.success) {
          setIsLogin(true)
          setPassword('')
        }
      }
    } catch (err) {
      // Error handling removed - silently handle errors
    }
  }

  const handleToggle = () => {
    setIsLogin(!isLogin)
    setUsername('')
    setPassword('')
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-black reg-text">
      {/* Header - should be above everything */}
      <div className="relative z-[1000]">
        <Header />
      </div>

      {/* Background Image - behind everything */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-30 z-[1]"
        style={{ backgroundImage: "url(assets/imgBg.png)" }}
      />

      {/* Background Video - behind form but above background image */}
      <video
        autoPlay
        muted
        playsInline
        loop
        className="absolute top-0 left-0 w-full h-full object-cover translate-x-[15%] z-[2]"
      > 
        <source src='/assets/batmanBg.mp4'/>
      </video>
      {/* Main content container - above background elements */}
      <div className="relative z-[100] p-5 max-w-sm mx-auto mt-12 -translate-x-[400px]">
        <div className="relative z-[101] border-2 border-gray-300 p-8 rounded-lg custom-border"
        style={{background: 'url(assets/authModal.svg)', backgroundSize: "cover"}}
        >
          <h1 className="text-center mb-8 text-2xl font-semibold">
  {isLogin ? 
  <EncryptedTextReveal key="login" text="Login" />
  :<EncryptedTextReveal key="register" text="Register" />}
</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-bold">
                <EncryptedTextReveal text=" Username:" />
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                className="relative z-[102] w-full p-3 border border-gray-300 rounded text-base custom-border focus:outline-none focus:ring-2 disabled:cursor-not-allowed"
              />
            </div>
            
            <div className="mb-5">
              <label className="block mb-1 font-bold">
              <EncryptedTextReveal text=" Password:" />
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                className="relative z-[102] w-full p-3 border border-gray-300 rounded text-base  custom-border focus:outline-none focus:ring-2 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`relative z-[102] w-full p-3 rounded text-base mb-4 transition-colors custom-border-all ${
                loading 
                  ? 'bg-[#41c4fc5a] reg-text cursor-not-allowed' 
                  : 'bg-[#41c4fc5a] hover:bg-[#65d1ff9f] text-white cursor-pointer'
              }`}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={handleToggle}
              disabled={loading}
              className="relative z-[102] bg-transparent reg-text border-none cursor-pointer underline text-sm disabled:cursor-not-allowed disabled:text-gray-400"
            >
              {isLogin ? 'Need an account? Register here' : 'Have an account? Login here'}
            </button>
          </div>
        </div>
      <div className='reg-text-red w-full mt-4 justify-center items-center'><EncryptedTextReveal text="Warning: Passwords cannot be reset. Enter carefully." /></div>

      </div>
      
      {/* Footer - should be above background but below form */}
      <img 
        src='/assets/footer.svg' 
        alt="" 
        className="relative z-[50] -bottom-32"
      />
    </div>
  )
}

export default Page