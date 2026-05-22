'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  const phase = Math.min(Math.floor(progress / 25), 4);

  const phases = [
    'INITIALIZING NEURAL CORE...',
    'LOADING IDENTITY MATRIX...',
    'CALIBRATING VISUAL CORTEX...',
    'ESTABLISHING UPLINK...',
    'SYSTEM READY',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 600);
          return 100;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);


  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
        >
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Central logo pulse */}
          <div className="relative mb-12">
            <div className="w-20 h-20 rounded-full border border-cyan-500/30 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 animate-pulse flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-[40px] animate-pulse" />
          </div>

          {/* Phase text */}
          <div className="font-mono text-cyan-400 text-sm tracking-[0.3em] mb-8 h-6">
            {phases[phase]}
          </div>

          {/* Progress bar */}
          <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Progress text */}
          <div className="font-mono text-gray-600 text-xs mt-4 tracking-widest">
            {Math.floor(progress)}% LOADED
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
