// components/MessageInput.tsx
"use client"
import React, { useState } from 'react'
import { useChat } from '../hooks/useChat'

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const { sendMessage, currentRoom, connected } = useChat()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !currentRoom || !connected) return
    
    sendMessage(message.trim())
    setMessage('')
  }

  const isDisabled = !currentRoom || !connected

  return (
    <div className="p-4 border-t custom-border-top bg-transparent">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isDisabled ? "Join a room to start chatting..." : "Type your message..."}
            disabled={isDisabled}
            className="w-full p-3 pr-12 rounded-lg disabled:bg-transparent disabled:cursor-not-allowed custom-font custom-border"
            maxLength={500}
          />
          {message.length > 0 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {message.length}/500
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isDisabled}
          className="px-6 py-3 bg-transparent hover:bg-[rgba(212,237,255,0.7)] text-white rounded-lg font-medium transition-colors duration-300 ease-in-out disabled:bg-transparent disabled:cursor-not-allowed flex items-center gap-2
           custom-border
          "
        >
          {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg> */}
          Send
        </button>
      </form>
      
      {!connected && (
        <div className="mt-2 text-sm text-amber-600 bg-transparent p-2 rounded">
          ⚠️ Connection lost. Trying to reconnect...
        </div>
      )}
    </div>
  )
}

export default MessageInput
