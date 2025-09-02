// components/ChatSidebar.tsx
"use client"
import React, { useState } from 'react'
import { useChat } from '../hooks/useChat'

const ChatSidebar = () => {
  const [newRoomName, setNewRoomName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { joinRoom, currentRoomName, connected } = useChat()

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return
    
    const roomId = crypto.randomUUID()
    joinRoom(roomId, newRoomName.trim())
    setNewRoomName('')
    setShowCreateForm(false)
  }

  const handleJoinTestRoom = () => {
    const publicRoomId = '60435625-7026-4210-8c44-7368ed064c51';
    joinRoom(publicRoomId, 'General Chat')
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Rooms</h2>
        {currentRoomName && (
          <p className="text-sm text-gray-500 mt-1">
            Current: <span className="text-blue-600 font-medium">{currentRoomName}</span>
          </p>
        )}
      </div>

      {/* Room List */}
      <div className="flex-1 p-4">
        {/* Quick Join Buttons */}
        <div className="space-y-2 mb-6">
          <button
            onClick={handleJoinTestRoom}
            disabled={!connected}
            className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-medium text-blue-800">General Chat</div>
            <div className="text-xs text-blue-600">Public room</div>
          </button>
          
          <button
            onClick={() => joinRoom(crypto.randomUUID(), 'Random Room')}
            disabled={!connected}
            className="w-full p-3 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-medium text-green-800">Random Room</div>
            <div className="text-xs text-green-600">Join random chat</div>
          </button>
        </div>

        {/* Create New Room */}
        <div className="border-t border-gray-200 pt-4">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              disabled={!connected}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Room
              </div>
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateRoom}
                  disabled={!newRoomName.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewRoomName('')
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <div>Status: {connected ? '🟢 Online' : '🔴 Offline'}</div>
          <div>Server: Gotham BE</div>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar
