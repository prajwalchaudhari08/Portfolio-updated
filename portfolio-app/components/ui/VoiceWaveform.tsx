'use client';

import React, { useMemo } from 'react';

interface VoiceWaveformProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export default function VoiceWaveform({
  isPlaying,
  barCount = 40,
  className = '',
}: VoiceWaveformProps) {
  const bars = useMemo(() => {
    // Deterministic pseudo-random to prevent hydration mismatch
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed + 1) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: barCount }).map((_, i) => ({
      delay: pseudoRandom(i) * 0.8,
      height: pseudoRandom(i + 100) * 100,
      duration: 0.5 + pseudoRandom(i + 200) * 0.5,
    }));
  }, [barCount]);

  return (
    <div
      className={`flex items-end justify-center h-12 gap-[2px] w-full overflow-hidden mask-linear-fade ${className}`}
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`w-1 md:w-1.5 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t transition-all duration-300 ${
            isPlaying ? 'animate-wave' : ''
          }`}
          style={{
            animationDelay: `${bar.delay}s`,
            height: isPlaying ? `${bar.height}%` : '3px',
            animationDuration: `${bar.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
