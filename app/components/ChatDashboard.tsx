// components/ChatDashboard.tsx
"use client"
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import ChatRoom from './ChatRoom'
import ChatSidebar from './ChatSidebar'
// import video from '/assets/bg.mp4'
// app/public/assets/bg.mp4

const ChatDashboard = () => {
  const { user, logout } = useAuth()
  const { connected } = useChat()

  return (
    <div className="h-screen flex flex-col bg-transparent relative overflow-hidden">
       <div
    className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
    style={{backgroundImage: "url(assets/imgBg.png)", opacity: 0.4}}
  ></div>

      <video
      autoPlay
      muted
      playsInline
      loop
      className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      > <source src='/assets/bg.mp4'/></video>

      <header className="bg-transparent text-white p-0 shadow-lg z-0 custom-border-bottom">
        <img src='/assets/header.svg'  className= "w-full -mt-3" alt="" />
        <div className="flex justify-between items-center -mt-10 ">
          <div className="flex items-center gap-4">
            <img src="/assets/logo.svg"  width= "130px" height="130px"   className="transition-transform duration-300 hover:scale-110" alt="" />
            {/* <h1 className="text-2xl font-bold text-blue-400 custom-font reg-text">Gotham Chat</h1> */}
            <div className={`flex items-center reg-text gap-1 px-3 py-1 rounded-full text-sm`}>
              {connected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold reg-text">{user?.username}</p>
              <p className="text-xs text-gray-300 reg-text">
                {user?.master_admin ? 'Admin' : 'User'}
              </p>
            </div>
            <button 
              onClick={logout}
              className="bg-transparent hover:bg-transparent px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <img src="/assets/logout.svg"  width="35px" height="35px" alt="" className='transition-transform duration-300 hover:scale-110' />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar />
        <ChatRoom />
      </div>
      <img src='/assets/footer.svg'  className= "top-10 " alt="" />

    </div>
  )
}

export default ChatDashboard
