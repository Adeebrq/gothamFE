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

// Create a consistent initial scramble for SSR
function createInitialScramble(text: string) {
  return text
    .split('')
    .map((char, index) => (char === ' ' ? ' ' : symbols.charAt(index % symbols.length)))
    .join('');
}

const EncryptedTextReveal: React.FC<{ text: string; duration?: number }> = ({
  text,
  duration = 500,
}) => {
  const [displayText, setDisplayText] = useState(createInitialScramble(text));
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isRevealed) return;

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
  }, [text, duration, isRevealed, isMounted]);

  return <span>{displayText}</span>;
};

export default EncryptedTextReveal;
