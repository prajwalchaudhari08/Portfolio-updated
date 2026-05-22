'use client';

import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
  onClick?: () => void;
}

export default function GlassPanel({
  children,
  className = '',
  glowing = false,
  onClick,
}: GlassPanelProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative backdrop-blur-xl bg-black/40 border border-white/10 
        rounded-2xl overflow-hidden transition-all duration-500
        ${glowing ? 'shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:border-purple-500/30' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
