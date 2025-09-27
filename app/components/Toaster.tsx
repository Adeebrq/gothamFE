"use client"
import React, { useEffect, useState } from 'react';
import EncryptedTextReveal from './EncryptedTextReveal';

interface ToastProps {
  message: string;
  success: boolean;
  onClose: () => void;
}

export default function Toast({ message, success, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
    
    // Start exit animation after 2.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);
    
    // Remove component after full 3 seconds
    const removeTimer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(onClose, 500); // Allow exit animation to complete
  };

  return (
    <div 
      className={`fixed top-24 right-0 z-50 cursor-pointer transition-all duration-500 ${
        isVisible && !isExiting 
          ? 'translate-x-0 opacity-100' 
          : isExiting 
            ? 'translate-x-full opacity-0' 
            : 'translate-x-full opacity-0'
      }`}
      onClick={handleClick}
      style={{
        animation: isVisible && !isExiting ? 'glitchIn 0.8s ease-out' : undefined
      }}
    >
      <style jsx>{`
        @keyframes glitchIn {
          0% {
            transform: translateX(100%) scale(1);
            opacity: 0;
            filter: hue-rotate(0deg) brightness(1);
          }
          10% {
            transform: translateX(20%) scale(1.05) skew(-2deg);
            opacity: 0.3;
            filter: hue-rotate(90deg) brightness(1.5);
          }
          15% {
            transform: translateX(40%) scale(0.95) skew(1deg);
            opacity: 0.7;
            filter: hue-rotate(180deg) brightness(0.8);
          }
          25% {
            transform: translateX(-10%) scale(1.02) skew(-1deg);
            opacity: 0.9;
            filter: hue-rotate(270deg) brightness(1.2);
            box-shadow: 2px 0 #ff0040, -2px 0 #00ffff;
          }
          35% {
            transform: translateX(5%) scale(0.98) skew(0.5deg);
            opacity: 0.95;
            filter: hue-rotate(45deg) brightness(0.9);
            box-shadow: -1px 0 #ff0040, 1px 0 #00ffff;
          }
          50% {
            transform: translateX(-2%) scale(1.01);
            opacity: 1;
            filter: hue-rotate(0deg) brightness(1);
            box-shadow: 1px 0 rgba(255, 0, 64, 0.5), -1px 0 rgba(0, 255, 255, 0.5);
          }
          65% {
            transform: translateX(1%) scale(0.99);
            filter: brightness(1.1);
          }
          80% {
            transform: translateX(-0.5%) scale(1);
            filter: brightness(0.95);
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
            filter: hue-rotate(0deg) brightness(1);
            box-shadow: none;
          }
        }
      `}</style>
      
      <img 
        src="assets/toastBg.svg" 
        alt="Toast background" 
        className="w-[300px] h-[100px] object-contain"
      />
      
      {/* Content overlay */}
      <div className={`absolute inset-0 text-white p-4 reg-text flex justify-between -top-14 translate-x-[10px] items-center transform -rotate-[2deg] ${success ? 'reg-text' : 'reg-text-red'}`}>
        <span>{message ? <EncryptedTextReveal text={message} duration={500}/> : ""}</span>
      </div>
    </div>
  );
}