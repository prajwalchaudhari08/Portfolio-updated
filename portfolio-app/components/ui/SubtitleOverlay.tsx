'use client';

import React from 'react';
import { useAudioStore } from '@/store/useAudioStore';

export default function SubtitleOverlay() {
  const { subtitlesVisible, currentSubtitle } = useAudioStore();

  if (!subtitlesVisible || !currentSubtitle) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
      <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-center">
        <p className="text-sm md:text-base text-gray-200 font-light">
          <span className="text-cyan-400 font-mono mr-2">&gt;</span>
          {currentSubtitle}
        </p>
      </div>
    </div>
  );
}
