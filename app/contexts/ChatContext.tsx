// contexts/ChatContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

interface Message {
  id: string
  chatroom_id: string
  sender_id: string
  username: string
  content: string
  sent_at: string
}

interface ChatContextType {
  // Connection state
  ws: WebSocket | null
  connected: boolean
  
  // Room state
  currentRoom: string | null
  currentRoomName: string | null
  
  // Messages
  messages: Message[]
  loadingHistory: boolean
  
  // Actions
  joinRoom: (roomId: string, roomName: string) => void
  sendMessage: (content: string) => void
  loadChatHistory: (roomId: string, limit?: number) => void
  
  // Connection management
  connect: () => void
  disconnect: () => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const [currentRoomName, setCurrentRoomName] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  
  const { token, user } = useAuth()
  const wsRef = useRef<WebSocket | null>(null)
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL

  useEffect(() => {
    if (currentRoom) {
      loadChatHistory(currentRoom)
    }
  }, [currentRoom])

  // WebSocket connection function
  const connect = () => {
    if (!token || !wsUrl || wsRef.current?.readyState === WebSocket.OPEN) return
    
    console.log('Connecting to WebSocket:', `${wsUrl}?token=${token}`)
    
    const websocket = new WebSocket(`${wsUrl}?token=${token}`)
    
    websocket.onopen = () => {
      console.log('WebSocket connected successfully')
      setConnected(true)
    }
    
    websocket.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data)
        console.log('WebSocket message received:', { type, payload })
        
        switch(type) {
          case 'connected':
            console.log('WebSocket connection confirmed:', payload.message)
            break
            
          case 'joined':
            setCurrentRoom(payload.roomId)
            console.log(`Successfully joined room: ${payload.roomId}`)
            break
            
          case 'message':
            setMessages(prev => [...prev, payload])
            break
            
          case 'error':
            console.error('WebSocket error received:', payload.message)
            break
            
          default:
            console.log('Unknown message type:', type)
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }
    
    websocket.onclose = (event) => {
      setConnected(false)
      console.log('WebSocket disconnected:', event.code, event.reason)
      
      // Handle auth errors
      if (event.code === 4001) {
        console.error('WebSocket authentication failed')
      }
    }
    
    websocket.onerror = (error) => {
      console.error('WebSocket connection error:', error)
      setConnected(false)
    }
    
    setWs(websocket)
    wsRef.current = websocket
  }

  // Join room function - matches your backend WebSocket logic
  const joinRoom = (roomId: string, roomName: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected. Cannot join room.')
      return
    }
    
    console.log(`Attempting to join room: ${roomName} (${roomId})`)
    
    // Clear previous messages when switching rooms
    setMessages([])
    setCurrentRoomName(roomName)
    
    ws.send(JSON.stringify({
      type: 'join',
      payload: { roomId, roomName }
    }))
  }

  // Send message function - matches your backend message handling
  const sendMessage = (content: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected. Cannot send message.')
      return
    }
    
    if (!currentRoom) {
      console.error('No room joined. Cannot send message.')
      return
    }
    
    if (!content.trim()) {
      console.error('Message content is empty.')
      return
    }
    
    // Generate message ID (matches your backend expectation)
    const messageId = crypto.randomUUID()
    
    console.log('Sending message:', { messageId, content })
    
    ws.send(JSON.stringify({
      type: 'message',
      payload: { messageId, content }
    }))
  }

  // Load chat history - matches your backend chat-history endpoint
  const loadChatHistory = async (roomId: string, limit = 50) => {
    if (!token) return
    
    setLoadingHistory(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BE_SERVER}/v1/rooms/${roomId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.type === 'success') {
          setMessages(data.messages)
          console.log(`Loaded ${data.messages.length} messages for room ${roomId}`)
        } else {
          console.error('Failed to load chat history:', data.message)
        }
      } else {
        console.error('Chat history request failed:', response.status)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  // Disconnect function
  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setWs(null)
    setConnected(false)
    setCurrentRoom(null)
    setCurrentRoomName(null)
    setMessages([])
  }

  // Auto-connect when token is available
  useEffect(() => {
    if (token && !connected && wsUrl) {
      console.log('Token available, attempting WebSocket connection...')
      connect()
    }
  }, [token, connected, wsUrl])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const value: ChatContextType = {
    ws,
    connected,
    currentRoom,
    currentRoomName,
    messages,
    loadingHistory,
    joinRoom,
    sendMessage,
    loadChatHistory,
    connect,
    disconnect
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatContext
