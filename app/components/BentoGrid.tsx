"use client"
import React from 'react'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'

const BentoGrid = () => {
  return (
    <div className="w-full custom-border-top  custom-border-bottom">
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 gap-0 relative">
        <header className="col-span-1 sm:col-span-2 w-full ml-18 pt-6 absolute translate-y-20 z-50 reg-text glitch-text">
          <h2 className="text-4xl font-semibold tracking-wide">never miss a beat, Stay in Sync with Gothams Criminals</h2>
        </header>
      <video
      autoPlay
      muted
      playsInline
      loop
      className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      > <source src='/bg2.mp4'/></video>

        <RiveCard 
          fileName="card1.riv" 
          containerClassName="h-105 rounded-lg bg-transparent overflow-hidden shadow-lg -translate-x-[280px] relative z-20"
          riveClassName="w-full h-full bg-none"
        />
        <RiveCard 
          fileName="card22.riv" 
          containerClassName="h-106 w-[120%] rounded-lg bg-transparent overflow-hidden shadow-lg -translate-x-[630px] relative z-10"
          riveClassName="w-full h-full w-[120%] bg-none"
        />
        <RiveCard 
          fileName="card3.riv" 
          containerClassName="h-100 w-[100%] rounded-lg bg-transparent overflow-hidden shadow-lg translate-x-[55px] relative z-49"
          riveClassName="w-full h-full bg-none"
        />
        <RiveCard 
          fileName="card4.riv" 
          containerClassName="h-135 w-[100%] rounded-lg bg-transparent overflow-hidden shadow-lg -translate-x-[275px] -translate-y-[121px] relative z-40"
          riveClassName="w-full h-full bg-none"
        />
      </div>
    </div>
  )
}

interface RiveCardProps {
  fileName: string
  containerClassName?: string
  riveClassName?: string
}

const RiveCard: React.FC<RiveCardProps> = ({ 
  fileName, 
  containerClassName = "h-64 rounded-lg bg-transparent overflow-hidden",
  riveClassName = "w-auto h-auto border border-amber-500"
}) => {
  const { rive, RiveComponent } = useRive({
    src: `/${fileName}`,
    stateMachines: "State Machine 1",
    autoplay: true,
  })

  const hoverInput = useStateMachineInput(rive, "State Machine 1", "Hover", false)

  return (
    <div 
      className={containerClassName}
      style={{ pointerEvents: 'auto' }}
    >
      <RiveComponent
        className={riveClassName}
        style={{ pointerEvents: 'auto' }}
        onMouseEnter={() => {
          if (hoverInput) hoverInput.value = true
        }}
        onMouseLeave={() => {
          if (hoverInput) hoverInput.value = false
        }}
      />
    </div>
  )
}

export default BentoGrid