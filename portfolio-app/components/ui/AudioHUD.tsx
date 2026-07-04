'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Volume2, VolumeX, Subtitles } from 'lucide-react';
import { useAudioStore } from '@/store/useAudioStore';

export default function AudioHUD() {
  const { isMuted, toggleMute, subtitlesVisible, toggleSubtitles } = useAudioStore();
  const pathname = usePathname();

  // Hide audio HUD on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="fixed bottom-6 left-6 flex gap-4 z-50">
      <button
        onClick={toggleMute}
        className={`transition-all duration-300 bg-black/40 p-2.5 rounded-full backdrop-blur border border-white/5 shadow-lg hover:bg-black/60 active:scale-95 flex items-center justify-center ${
          isMuted ? 'text-gray-500 hover:text-rose-400' : 'text-cyan-400 hover:text-cyan-300'
        }`}
        aria-label="Toggle audio"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      <button
        onClick={toggleSubtitles}
        className={`transition-all duration-300 bg-black/40 p-2.5 rounded-full backdrop-blur border border-white/5 shadow-lg hover:bg-black/60 active:scale-95 flex items-center justify-center ${
          subtitlesVisible ? 'text-cyan-400 hover:text-cyan-300' : 'text-gray-500 hover:text-cyan-400'
        }`}
        aria-label="Toggle subtitles"
      >
        <Subtitles size={20} />
      </button>
    </div>
  );
}
