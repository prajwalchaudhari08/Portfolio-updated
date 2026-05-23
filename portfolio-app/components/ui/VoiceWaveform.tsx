'use client';

import React, { useEffect, useState } from 'react';

interface VoiceWaveformProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

interface BarConfig {
  delay: number;
  duration: number;
  height: number;
}

// Deterministic seeded pseudo-random — same result every call for a given seed.
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateBars(count: number): BarConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    delay: seededRandom(i) * 0.8,
    duration: 0.5 + seededRandom(i + 200) * 0.5,
    height: seededRandom(i + 100) * 100,
  }));
}

export default function VoiceWaveform({
  isPlaying,
  barCount = 40,
  className = '',
}: VoiceWaveformProps) {
  // Start with null so the server renders plain flat bars (no inline animation styles).
  // After mount the real values are applied — client-only, so there is no hydration mismatch.
  const [bars, setBars] = useState<BarConfig[] | null>(null);

  useEffect(() => {
    setBars(generateBars(barCount));
  }, [barCount]);

  return (
    <div
      className={`flex items-end justify-center h-12 gap-[2px] w-full overflow-hidden mask-linear-fade ${className}`}
    >
      {Array.from({ length: barCount }, (_, i) => {
        const bar = bars?.[i];
        return (
          <div
            key={i}
            suppressHydrationWarning
            className={`w-1 md:w-1.5 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t transition-all duration-300 ${
              isPlaying && bar ? 'animate-wave' : ''
            }`}
            style={
              bar
                ? {
                    animationDelay: `${bar.delay}s`,
                    animationDuration: `${bar.duration}s`,
                    height: isPlaying ? `${bar.height}%` : '3px',
                  }
                : { height: '3px' }
            }
          />
        );
      })}
    </div>
  );
}
