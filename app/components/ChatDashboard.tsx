// components/ChatDashboard.tsx
"use client"
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import ChatRoom from './ChatRoom'
import ChatSidebar from './ChatSidebar'
import Header from './header'

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

      <Header />

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
