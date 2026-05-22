'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Play, Download, Mail, Volume2, VolumeX, Subtitles, GraduationCap, Briefcase, Code, Rocket, Lock } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import AnimatedText from '@/components/ui/AnimatedText';
import LoadingScreen from '@/components/ui/LoadingScreen';
import QuestionCard from '@/components/ui/QuestionCard';
import { useAudioStore } from '@/store/useAudioStore';
import { useAIVoice } from '@/hooks/useAIVoice';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';

const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false });

export default function HomePage() {
  const [showLoading, setShowLoading] = useState(true);
  const { isMuted, toggleMute, subtitlesVisible, toggleSubtitles } = useAudioStore();
  const { speak } = useAIVoice();
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleExplore = () => {
    speak("what would you like to explore?");
    router.push('/experience');
  };

  const skills = [
    'React.js', 'Next.js', 'Tailwind CSS', 'Node.js', 
    'TypeScript', 'MongoDB', 'AI Integrations'
  ];

  const questions = [
    {
      question: "What is your educational background?",
      answer: "I completed my education in Computer Science and continuously improve my technical expertise through real-world development experience and modern technologies.",
      icon: <GraduationCap size={20} />
    },
    {
      question: "What projects have you worked on?",
      answer: "I have developed scalable web applications, admin dashboards, AI-integrated platforms, timesheet systems, and interactive portfolio experiences using modern frontend and backend technologies.",
      icon: <Rocket size={20} />
    },
    {
      question: "What is your professional experience?",
      answer: "I have experience working on full-stack development projects, building responsive user interfaces, API integrations, database management, and optimizing application performance.",
      icon: <Briefcase size={20} />
    },
    {
      question: "What are your technical skills?",
      answer: "Frontend: React.js, Next.js, Tailwind CSS\nBackend: Node.js, Express.js\nDatabase: MongoDB, MySQL\nTools: Git, REST APIs, Firebase, AI Integrations",
      icon: <Code size={20} />
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden relative scroll-smooth">
      {/* Loading Screen */}
      {showLoading && (
        <div onAnimationEnd={() => setShowLoading(false)} className="fixed inset-0 z-[100] pointer-events-none">
          <LoadingScreen />
        </div>
      )}

      {/* Fixed 3D Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Scene simplified={isMobile} />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_100%)]" />
        <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
        <div className="absolute top-0 right-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/10 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 pb-32">
        
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center text-center pt-20 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-cyan-500 text-xs md:text-sm mb-6 tracking-widest border border-cyan-500/30 px-4 py-1.5 rounded-full bg-cyan-950/30 backdrop-blur inline-block shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            SYS.INIT // IDENTITY VERIFIED
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tighter"
          >
            <AnimatedText text="Ask Me Anything" speed={80} delay={1000} />
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-xl md:text-2xl lg:text-3xl font-light mb-6 tracking-wide text-neon-gradient"
          >
            Interactive AI Portfolio Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-base md:text-lg text-gray-400 font-light mb-12 max-w-2xl leading-relaxed mx-auto"
          >
            Welcome to my digital portfolio experience. Discover my education, projects, skills, and professional journey through an interactive AI-powered interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1 }}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4"
          >
            <NeonButton onClick={handleExplore} icon={Play}>
              Explore Portfolio
            </NeonButton>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <NeonButton variant="ghost" icon={Download}>
                Download Resume
              </NeonButton>
            </a>
            <NeonButton variant="ghost" onClick={() => window.location.href = 'mailto:contact@example.com'} icon={Mail}>
              Contact Me
            </NeonButton>
          </motion.div>
        </section>

        {/* Featured Skills Section */}
        <section className="py-12 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-sm font-mono text-cyan-400 tracking-widest mb-6">FEATURED_SKILLS // MODULES</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:border-cyan-500/50 hover:bg-cyan-900/20 hover:text-white transition-all duration-300 backdrop-blur cursor-default shadow-[0_0_15px_rgba(34,211,238,0)] hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Interactive Questions Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              Suggested Interactions
            </h3>
            <p className="text-gray-400 font-light max-w-xl mx-auto">
              Select a query below to access my personal databanks. The integrated AI assistant will process and vocalize the response.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {questions.map((q, i) => (
              <QuestionCard
                key={i}
                question={q.question}
                answer={q.answer}
                icon={q.icon}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Admin Login Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => router.push('/admin/login')}
          className="text-gray-500 hover:text-cyan-400 transition-colors bg-black/40 px-3 py-1.5 rounded-full backdrop-blur border border-white/10 flex items-center gap-2 text-xs font-mono group"
        >
          <Lock size={14} className="group-hover:text-cyan-400" />
          <span className="hidden sm:inline">ADMIN</span>
        </button>
      </div>

      {/* Bottom HUD */}
      <div className="fixed bottom-6 left-6 flex gap-4 z-50">
        <button
          onClick={toggleMute}
          className="text-gray-500 hover:text-cyan-400 transition-colors bg-black/40 p-2 rounded-full backdrop-blur border border-white/5"
          aria-label="Toggle audio"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          onClick={toggleSubtitles}
          className="text-gray-500 hover:text-cyan-400 transition-colors bg-black/40 p-2 rounded-full backdrop-blur border border-white/5"
          aria-label="Toggle subtitles"
        >
          <Subtitles
            size={20}
            className={subtitlesVisible ? 'text-cyan-400' : ''}
          />
        </button>
      </div>
    </div>
  );
}
