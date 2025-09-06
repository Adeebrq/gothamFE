// components/ChatSidebar.tsx
"use client"
import React, { useEffect, useState } from 'react'
import { useChat } from '../hooks/useChat'
import EncryptedTextReveal from './EncryptedTextReveal'

const ChatSidebar = () => {
  const [newRoomName, setNewRoomName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const { joinRoom, currentRoomName, connected } = useChat()

  const crimeData = [
    {"log": "01:45 | Break in at Wayne Enterprises, possible Joker hint"},
    {"log": "02:10 | Armed robbery at Ace Chemicals, Poison Ivy suspected"},
    {"log": "02:35 | Disturbance near Arkham Asylum, Street thugs"},
    {"log": "03:00 | Potential Joker sighting spotted downtown"},
    {"log": "03:15 | Hostage situation at Gotham Central Bank, Penguin involved"},
    {"log": "03:45 | Suspicious package found at City Hall, beware Clayface"},
    {"log": "04:05 | Mugging in Crime Alley, possible Black Mask gang"},
    {"log": "04:20 | Car chase near Narrows Bridge, chase may involve Two-Face"},
    {"log": "04:45 | Drug bust at Blackgate Prison, Street thugs"},
    {"log": "05:00 | Riot escalating in Old Gotham district, Scarecrow fears"},
    {"log": "69:00 | Are you still reading this? Beware the Bat..."}
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogIndex((prev) => {
        // When we reach the end of the original array, reset to 0
        // This will happen after the duplicated content is shown
        if (prev >= crimeData.length * 2 - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [crimeData.length]);

  // Create doubled array for seamless infinite scroll
  const doubledCrimeData = [...crimeData, ...crimeData];

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

  useEffect(()=>{
    if(connected){
        setTimeout(()=>{
    joinRoom('60435625-7026-4210-8c44-7368ed064c51', 'General Chat')
        }, 1000)
    }
  },[connected])

  return (
    <div className="w-80 bg-transparent border-r border-gray-200 flex flex-col reg-text -mt-[2px]">
      {/* Sidebar Header */}
      <div className="p-4 custom-border-all relative">
        {/* <img src="/assets/cornor.svg" className='absolute bottom-0 right-0 w-12 h-12 -mr-6.5 -mb-6.5 z-100' alt="" /> */}
        {/* <img src="/assets/cornor.svg" className='absolute top-0 right-0 w-12 h-12 -mr-6.5 -mt-6.5 z-100' alt="" /> */}
        <h2 className="text-lg font-semibold">Rooms</h2>
        {currentRoomName && (
          <p className="text-sm ">
            Current: <span><EncryptedTextReveal text={currentRoomName}/></span>
          </p>
        )}
      </div>

      {/* Room List */}
      <div className="flex-1 p-4 reg-text">
        {/* Quick Join Buttons */}
        <div className="space-y-2 mb-6 ">
          <button
            onClick={handleJoinTestRoom}
            disabled={!connected}
            className="w-full p-3 text-left reg-text custom-border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="font-medium"><EncryptedTextReveal text="General Chat"/></div>
            <div className="text-xs"><EncryptedTextReveal text="Public room"/></div>
          </button>
          
          <button
            disabled={connected}
            className="w-full mt-2  p-3 text-left reg-text custom-border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div ><EncryptedTextReveal text="Create new room"/></div>
            <div><EncryptedTextReveal text="Coming soon..."/></div>
          </button>
        </div>
      </div>

      <div className="p-0 custom-border-top bg-transparent relative">
      <video
      autoPlay
      muted
      playsInline
      loop
      className="w-[1080px] h-auto "
      > <source src='/assets/map4.mp4'/></video>
      </div>

      {/* Connection Status */}
      <div className="p-3.5 custom-border-top bg-transparent relative">
        {/* <img src="/assets/cornor.svg" className='absolute top-0 right-0 w-12 h-12 -mr-6.5 -mt-6.5 z-100' alt="" /> */}
        <div className="text-xs reg-text">
          <EncryptedTextReveal text="Police surveillance: ACTIVE"/>
          <div className="mt-2 h-8 overflow-hidden">
            <div 
              className={`${currentLogIndex >= crimeData.length ? 'transition-none' : 'transition-transform duration-500 ease-in-out'}`}
              style={{ 
                transform: `translateY(-${(currentLogIndex % crimeData.length) * 32}px)` 
              }}
            >
              {doubledCrimeData.map((item, index) => {
                const isCurrentlyVisible = index === (currentLogIndex % doubledCrimeData.length);
                return (
                  <div key={index} className="h-8 reg-text-red font-black">
                    {isCurrentlyVisible ? (
                      <EncryptedTextReveal 
                        key={`visible-${currentLogIndex}`}
                        text={item.log}
                        duration={500}
                      />
                    ) : (
                      <span>{item.log}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar