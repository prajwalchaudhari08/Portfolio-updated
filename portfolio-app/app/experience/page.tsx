'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Terminal,
  Code,
  Cpu,
  Briefcase,
  GraduationCap,
  Mail,
  Activity,
} from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import { useIsMobile } from '@/hooks/useMediaQuery';

const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false });

const cards = [
  { id: 'about', title: 'About Me', icon: Terminal, color: 'text-cyan-400', glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]' },
  { id: 'projects', title: 'Projects', icon: Code, color: 'text-purple-400', glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]' },
  { id: 'skills', title: 'Skills', icon: Cpu, color: 'text-emerald-400', glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]' },
  { id: 'experience', title: 'Experience', icon: Briefcase, color: 'text-amber-400', glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]' },
  { id: 'education', title: 'Education', icon: GraduationCap, color: 'text-blue-400', glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]' },
  { id: 'contact', title: 'Contact', icon: Mail, color: 'text-rose-400', glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]' },
];

export default function ExperienceHub() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleSelect = (id: string) => {
    if (id === 'projects') {
      router.push('/projects');
    } else if (id === 'contact') {
      router.push('/contact');
    } else {
      router.push(`/experience/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* 3D Background */}
      <Scene simplified={isMobile} className="z-0" />

      {/* Grid + Vignette */}
      <div className="absolute inset-0 bg-grid pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_100%)] pointer-events-none z-[1]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden py-16 px-4">
        {/* Central Core */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative flex items-center justify-center mb-8"
        >
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-white/5 bg-black/80 backdrop-blur flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)] z-20">
            <Activity className="w-8 h-8 md:w-10 md:h-10 text-gray-500 animate-pulse" />
          </div>
          <div className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full border border-white/[0.03] animate-[spin_30s_linear_infinite_reverse]" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-neon-gradient">
            What would you like to explore?
          </h1>
          <p className="text-gray-500 font-mono text-xs md:text-sm tracking-widest">
            SELECT A QUERY NODE TO PROCEED
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 max-w-5xl w-full">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.5 }}
            >
              <GlassPanel
                glowing
                onClick={() => handleSelect(card.id)}
                className={`p-4 md:p-6 flex flex-col items-center justify-center text-center group hover:scale-105 transition-all duration-300 ${card.glow} min-h-[120px] md:min-h-[140px]`}
              >
                <card.icon
                  className={`w-7 h-7 md:w-9 md:h-9 mb-3 ${card.color} group-hover:scale-110 transition-transform duration-300`}
                />
                <span className="text-xs md:text-sm font-semibold tracking-wider text-gray-300 group-hover:text-white transition-colors">
                  {card.title}
                </span>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        {/* Back to hero */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={() => router.push('/')}
          className="mt-12 text-gray-600 hover:text-gray-400 font-mono text-xs tracking-widest transition-colors"
        >
          ← RETURN TO MAIN TERMINAL
        </motion.button>
      </div>
    </div>
  );
}
