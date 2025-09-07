// components/ChatDashboard.tsx
"use client"
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import { useRouter } from 'next/navigation'
import { useToast } from '../contexts/toastContext'

const Header = () => {
  const { user, logout } = useAuth()
  const { connected, disconnect } = useChat()
  const router= useRouter();
  const { addToast } = useToast();

  const handleHome=()=> {
    router.push("/");
  }

  function authHandler(){
    if(connected){
        disconnect();
        logout();
    }else{
        router.push("/login");
    }
  }

  return (
    <header className="bg-transparent text-white p-0 shadow-lg z-0 custom-border-bottom">
    <img src='/assets/header.svg'  className= "w-full -mt-3" alt="" />
    <div className="flex justify-between items-center -mt-10 ">
      <div className="flex items-center gap-4">
        <img src="/assets/logo.svg"  width= "130px" height="130px" onClick={handleHome}  className="transition-transform duration-300 hover:scale-110" alt="" />
        <div className={`flex items-center reg-text gap-1 px-3 py-1 rounded-full text-sm
          ${connected ? '' : 'reg-text-red'}
            `}>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold reg-text">{ connected ? user?.username : "Unknown"}</p>
          <p className="text-xs text-gray-300 reg-text">
            {user?.master_admin ? 'Admin' : 'User'}
          </p>
        </div>
        <button 
          onClick={authHandler}
          className="bg-transparent hover:bg-transparent px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
            {connected ? (
          <img src="/assets/logout.svg"  width="35px" height="35px" alt="" className='transition-transform duration-300 hover:scale-110' />
            ):(
          <img src="/assets/loginButton.svg"  width="45px" height="45px" alt="" className='transition-transform duration-300 hover:scale-110' />
            )}

        </button>
      </div>
    </div>
  </header>
  )
}

export default Header
