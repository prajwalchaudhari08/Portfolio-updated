'use client';

import React from 'react';
import { useAudioStore } from '@/store/useAudioStore';

export default function AIAvatar() {
  const { isPlaying } = useAudioStore();

  return (
    <div className="fixed bottom-24 right-6 md:bottom-6 md:right-6 z-50 flex items-end gap-4 pointer-events-none">
      <div className="relative pointer-events-auto group">
        <div 
          className={`w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 transition-all duration-500 shadow-lg ${
            isPlaying 
              ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]' 
              : 'border-cyan-900/50 shadow-none hover:border-cyan-700/80'
          }`}
        >
          <img 
            src="/avatar.png" 
            alt="AI Avatar"
            className={`w-full h-full object-cover transition-all duration-500 ${
              isPlaying ? 'scale-110' : 'scale-100 grayscale-[0.2]'
            }`}
          />
        </div>
        
        {/* Status indicator */}
        <div 
          className={`absolute bottom-0 right-1 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-zinc-950 transition-colors ${
            isPlaying ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse' : 'bg-gray-600'
          }`} 
        />

        {/* Optional glowing rings when playing */}
        {isPlaying && (
          <>
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
          </>
        )}
      </div>
    </div>
  );
}
