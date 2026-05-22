'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cpu } from 'lucide-react';
import { useAIVoice } from '@/hooks/useAIVoice';

interface QuestionCardProps {
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

export default function QuestionCard({ question, answer, icon }: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { speak, stop } = useAIVoice();

  const handleToggle = () => {
    if (!isOpen) {
      // About to open, start speaking
      speak(answer);
    } else {
      // Closing, stop speaking
      stop();
    }
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`border rounded-xl transition-all duration-500 overflow-hidden backdrop-blur-md ${
        isOpen
          ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
          : 'bg-white/5 border-white/10 hover:border-cyan-500/30 hover:bg-white/10'
      }`}
    >
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'}`}>
            {icon || <Cpu size={20} />}
          </div>
          <h3 className={`text-lg md:text-xl font-medium tracking-wide transition-colors ${isOpen ? 'text-white' : 'text-gray-300'}`}>
            {question}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={isOpen ? 'text-cyan-400' : 'text-gray-500'}
        >
          <ChevronDown size={24} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="px-5 md:px-6 pb-6 pt-2">
              <div className="flex gap-3">
                <div className="w-[2px] bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
                <p className="text-gray-300 leading-relaxed font-light text-base md:text-lg">
                  {answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
