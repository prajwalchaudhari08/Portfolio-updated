'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function NeonButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon: Icon,
  disabled = false,
  type = 'button',
}: NeonButtonProps) {
  const base =
    'relative px-6 py-3 rounded-full font-medium tracking-widest uppercase text-sm overflow-hidden group transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    secondary:
      'bg-purple-500/10 text-purple-400 border border-purple-500/50 hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    danger:
      'bg-rose-500/10 text-rose-400 border border-rose-500/50 hover:bg-rose-500/20 hover:shadow-[0_0_20px_rgba(244,63,94,0.5)]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {Icon && (
        <Icon
          size={16}
          className="group-hover:scale-110 transition-transform"
        />
      )}
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
    </button>
  );
}
