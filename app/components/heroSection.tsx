"use client"
import React from 'react'
import EncryptedTextReveal from './EncryptedTextReveal'
import { useRouter } from 'next/navigation'

const HeroSection = () => {
    const router = useRouter();
  return (
    <div className="relative min-h-screen">
      <video
        autoPlay
        muted
        playsInline
        loop
        className="absolute top-0 left-0 w-full h-full object-cover -z-10 overflow-hidden"
      > 
        <source src='/assets/heroBg.MP4'/>
      </video>
      
      {/* Large screens - preserve existing layout */}
      <div className='hidden lg:block translate-x-[100%] translate-y-[40%] w-[700px]'>
        <div className='reg-text text-6xl my-4'>
          <div className="glitch-text">
            <EncryptedTextReveal text="Connect in the Shadows."/>
          </div>
          <br/>
          <div className="glitch-text">
            <EncryptedTextReveal text="Chat Like the Dark Knight." />
          </div>
        </div>
        <div className='reg-text text-sm '>
          <div className="glitch-text">
            <EncryptedTextReveal text= "Step into the Batcave with Secure, anonymous, and powerful conversations for those who watch over their city."/>
          </div>
        </div>
        <button
          onClick={() => router.push("/login")}
          className={`mt-10 relative z-[102] p-3 rounded text-base mb-4 transition-colors reg-text custom-border-all bg-[#41c4fc5a] hover:bg-[#65d1ff9f] text-white cursor-pointer`}
        >
          Enter Gotham's Chatroom
        </button>
      </div>

      {/* Medium screens (tablets) */}
      <div className='hidden md:block lg:hidden px-6 py-8 flex flex-col justify-center min-h-screen'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='reg-text text-4xl md:text-5xl my-4 leading-tight'>
            <div className="glitch-text">
              <EncryptedTextReveal text="Connect in the Shadows."/>
            </div>
            <br/>
            <div className="glitch-text">
              <EncryptedTextReveal text="Chat Like the Dark Knight." />
            </div>
          </div>
          <div className='reg-text text-base md:text-lg mt-6 mb-8 max-w-xl mx-auto'>
            <div className="glitch-text">
              <EncryptedTextReveal text= "Step into the Batcave with Secure, anonymous, and powerful conversations for those who watch over their city."/>
            </div>
          </div>
          <button
            onClick={() => router.push("/login")}
            className={`relative z-[102] px-6 py-4 rounded text-lg transition-colors reg-text custom-border-all bg-[#41c4fc5a] hover:bg-[#65d1ff9f] text-white cursor-pointer`}
          >
            Enter Gotham's Chatroom
          </button>
        </div>
      </div>

      <div className='block md:hidden px-4 py-6 flex flex-col justify-center min-h-screen'>
        <div className='text-center'>
          <div className='reg-text text-2xl sm:text-3xl my-4 leading-tight'>
            <div className="glitch-text">
              <EncryptedTextReveal text="Connect in the Shadows."/>
            </div>
            <br/>
            <div className="glitch-text">
              <EncryptedTextReveal text="Chat Like the Dark Knight." />
            </div>
          </div>
          <div className='reg-text text-sm sm:text-base mt-4 mb-6 px-2'>
            <div className="glitch-text">
              <EncryptedTextReveal text= "Step into the Batcave with Secure, anonymous, and powerful conversations for those who watch over their city."/>
            </div>
          </div>
          <button
            onClick={() => router.push("/login")}
            className={`relative z-[102] px-4 py-3 rounded text-base transition-colors reg-text custom-border-all bg-[#41c4fc5a] hover:bg-[#65d1ff9f] text-white cursor-pointer w-full max-w-xs`}
          >
            Enter Gotham's Chatroom
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection