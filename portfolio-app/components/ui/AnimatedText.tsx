'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  speed?: number;
  glitch?: boolean;
  delay?: number;
}

export default function AnimatedText({
  text,
  className = '',
  speed = 50,
  glitch = false,
  delay = 0,
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started]);

  return (
    <span className={`${className} ${glitch ? 'animate-glitch' : ''}`}>
      {displayText}
      {displayText.length < text.length && started && (
        <span className="animate-pulse text-cyan-400">▊</span>
      )}
    </span>
  );
}
