"use client"
import React, { useEffect, useRef, useMemo } from 'react'
import { useChat } from '../hooks/useChat'
import { useAuth } from '../hooks/useAuth'
import EncryptedTextReveal from './EncryptedTextReveal'

interface Message {
  id: string
  sender_id: string
  username: string
  content: string
  sent_at: string
  date: string
}

interface GroupedMessages {
  [date: string]: Message[]
}

const MessageList = () => {
  const { messages, loadingHistory } = useChat()
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const formatDateForDisplay = (dateStr: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Parse the date string - could be either from message.date or formatted from sent_at
    const inputDate = new Date(dateStr);
    
    // Check if it's today
    if (inputDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    // Check if it's yesterday
    if (inputDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    // Return formatted date for older dates
    return inputDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const grouped: GroupedMessages = {}
    
    messages.forEach((message) => {
      // Use the date field that comes from ChatContext
      const messageDate = message.date || new Date(message.sent_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      
      if (!grouped[messageDate]) {
        grouped[messageDate] = []
      }
      grouped[messageDate].push(message)
    })
    
    // Sort dates in ascending order (oldest first)
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      // Parse the date strings back to Date objects for proper sorting
      const dateA = new Date(grouped[a][0].sent_at)
      const dateB = new Date(grouped[b][0].sent_at)
      return dateA.getTime() - dateB.getTime()
    })
    
    const sortedGrouped: GroupedMessages = {}
    sortedDates.forEach(date => {
      sortedGrouped[date] = grouped[date]
    })
    
    return sortedGrouped
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (loadingHistory) {
    return (
      <div className="flex-1 flex items-center justify-center reg-text">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          Loading chat history...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-transparent flex-1 overflow-y-auto p-4 space-y-4 reg-text">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-transparent rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p>No messages yet</p>
            <p className="text-sm">
              <EncryptedTextReveal text="Be the first to say something!" />
            </p>
          </div>
        </div>
      ) : (
        <>
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              {/* Date Header */}
              <div className="flex justify-center sticky top-0 z-10">
                <div className=" px-3 py-1 rounded-sm text-xs font-medium reg-text shadow-sm ">
                  <EncryptedTextReveal text={formatDateForDisplay(date)} />
                </div>
              </div>
              
              {/* Messages for this date */}
              <div className="space-y-4">
                {dateMessages.map((message) => {
                  const isOwnMessage = message.sender_id === user?.userId
                  const messageTime = new Date(message.sent_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  return (
                    <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-2 py-2 rounded-lg custom-border`}>
                        {!isOwnMessage && (
                          <div className="text-xs font-medium">
                            <EncryptedTextReveal text={message.username} />
                          </div>
                        )}
                        <div className="flex flex-row gap-6">
                          <div className="break-words">
                            <EncryptedTextReveal text={message.content} />
                          </div>
                          <div className="text-xs mt-1 bottom-0">
                            <EncryptedTextReveal text={messageTime} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}

export default MessageList