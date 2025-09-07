import React, { useState, useEffect } from 'react';

const NewsBoard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const messages = [
    "BREAKING: Joker wreaks havoc downtown; citizens advised to stay indoors |",
    "GOTHAM POLICE: Increased patrols after recent wave of nighttime burglaries |",
    "BAT SIGNAL: Reminder - report any suspicious activity to the Batphone immediately |",
    "ARKHAM ASYLUM: Dangerous inmates escape; heightened security measures in effect |",
    "TRAFFIC ALERT: Wayne Tower area closed due to emergency response operation |"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 12000); // Changed to match animation duration
    
    return () => clearInterval(interval);
  }, [messages.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  // Create continuous text string
  const currentMessage = messages[currentIndex];
  const repeatedText = `${currentMessage}     ${currentMessage}     ${currentMessage}`;

  return (
    <div className="w-full mx-auto reg-text-red custom-border-all-red"
    >
      <div className="bg-black p-0 rounded"
    style={{backgroundImage: "url(assets/newsboard.svg)"}}
    >
        <div className="h-20 flex items-center overflow-hidden">
          <div className=" text-5xl whitespace-nowrap animate-scroll">
            {repeatedText}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        
        .animate-scroll {
          animation: scroll 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsBoard;