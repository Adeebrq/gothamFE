// components/ChatDashboard.tsx
"use client"
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import ChatRoom from './ChatRoom'
import ChatSidebar from './ChatSidebar'

const ChatDashboard = () => {
  const { user, logout } = useAuth()
  const { connected } = useChat()

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-400">Gotham Chat</h1>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              connected ? 'bg-green-600' : 'bg-red-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-300' : 'bg-red-300'
              }`}></div>
              {connected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user?.username}</p>
              <p className="text-xs text-gray-300">
                {user?.master_admin ? 'Admin' : 'User'}
              </p>
            </div>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar />
        <ChatRoom />
      </div>
    </div>
  )
}

export default ChatDashboard
