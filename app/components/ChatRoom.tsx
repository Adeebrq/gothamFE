// components/ChatRoom.tsx
"use client"
import React from 'react'
import { useChat } from '../hooks/useChat'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

const ChatRoom = () => {
  const { currentRoom, currentRoomName, connected } = useChat()

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-transparent reg-text">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-transparent rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold  mb-2">Welcome to Gotham Chat</h3>
          <p className=" mb-6">Select a room from the sidebar to start chatting</p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {connected ? 'Connected and ready to chat' : 'Connecting...'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-transparent reg-text">
      {/* Room Header */}
      <div className="p-4 border-b custom-border-bottom bg-transparent z-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold ">#{currentRoomName}</h2>
            <p className="text-sm">Room ID: {currentRoom.slice(0, 8)}...</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2.5 h-2.5 rounded-full status ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {connected ? 'Live' : 'Reconnecting...'}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <MessageList />
      
      {/* Message Input */}
      <MessageInput />
    </div>
  )
}

export default ChatRoom
