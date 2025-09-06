import React, { useState, useEffect } from 'react';

const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function getRandomSymbol() {
  return symbols.charAt(Math.floor(Math.random() * symbols.length));
}

function scrambleText(text: string) {
  return text
    .split('')
    .map((char) => (char === ' ' ? ' ' : getRandomSymbol()))
    .join('');
}

const EncryptedTextReveal: React.FC<{ text: string; duration?: number }> = ({
  text,
  duration = 500,
}) => {
  const [displayText, setDisplayText] = useState(scrambleText(text));
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isRevealed) return;

    const interval = setInterval(() => {
      setDisplayText(scrambleText(text));
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplayText(text);
      setIsRevealed(true);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text, duration, isRevealed]);

  return <span>{displayText}</span>;
};

export default EncryptedTextReveal;
