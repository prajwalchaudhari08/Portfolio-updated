'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Globe } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import NeonButton from '@/components/ui/NeonButton';
import VoiceWaveform from '@/components/ui/VoiceWaveform';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAIVoice } from '@/hooks/useAIVoice';
import type { Profile, SkillCategory, Education, Experience } from '@/types';

const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false });

// Story content for different categories
const storyMeta: Record<string, { title: string; narration: string; subText: string }> = {
  about: {
    title: 'Introduction',
    narration: 'My architecture was designed to bridge the gap between complex logic and human intuition. I operate at the intersection of quality assurance and robust engineering.',
    subText: 'As you navigate through these modules, you\'ll witness a compilation of my core routines, training cycles, and output manifestations.',
  },
  skills: {
    title: 'Skills & Capabilities',
    narration: 'Accessing technical proficiency matrix and algorithmic specializations.',
    subText: 'My neural pathways have been optimized for these specific technological domains...',
  },
  experience: {
    title: 'Work Experience',
    narration: 'Parsing historical employment records and deployed enterprise solutions.',
    subText: 'Analyzing previous operational environments and successful mission parameters...',
  },
  education: {
    title: 'Education & Certifications',
    narration: 'Reviewing foundational knowledge injection and academic certifications.',
    subText: 'Extracting records of formal algorithmic training and structured learning cycles...',
  },
  'ai-journey': {
    title: 'AI Journey',
    narration: 'My exploration of artificial intelligence and AI-assisted development tools.',
    subText: 'Leveraging tools like ChatGPT, Claude, Gemini, and DeepSeek to accelerate development workflows...',
  },
  'startup-vision': {
    title: 'Startup Vision',
    narration: 'Building innovative solutions that solve real-world problems.',
    subText: 'Driven by the vision of creating impactful technology products that scale and transform industries...',
  },
  'future-goals': {
    title: 'Future Goals',
    narration: 'Charting the trajectory toward advanced engineering mastery.',
    subText: 'Continuously optimizing for growth in full-stack development, AI integration, and leadership...',
  },
  'fun-facts': {
    title: 'Fun Facts',
    narration: 'Some interesting data points about the system operator.',
    subText: 'Beyond the code — discovering the human behind the neural network...',
  },
};

export default function StoryPage() {
  const router = useRouter();
  const params = useParams();
  const category = params.category as string;
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const { speak, stop, isPlaying } = useAIVoice();
  const [dataLoaded, setDataLoaded] = useState(false);

  const meta = storyMeta[category] || storyMeta.about;

  useEffect(() => {
    if (!dataLoaded) return;
    
    let fullText = `${meta.title}. ${meta.narration} ${meta.subText}`;
    
    if (category === 'about' && profile) {
      fullText += ` ${profile.summary}`;
    } else if (category === 'skills' && skills.length > 0) {
      const allSkills = skills.map(s => s.category).join(', ');
      fullText += ` My core skill categories include ${allSkills}.`;
    } else if (category === 'experience' && experience.length > 0) {
      const topRoles = experience.slice(0, 2).map(e => `${e.role} at ${e.company}`).join(', and ');
      fullText += ` Some of my recent roles include ${topRoles}.`;
    } else if (category === 'education' && education.length > 0) {
      const degrees = education.map(e => `${e.degree} from ${e.institution}`).join(', and ');
      fullText += ` I hold ${degrees}.`;
    }

    speak(fullText);
    return () => stop();
  }, [category, dataLoaded, profile, skills, experience, education, meta, speak, stop]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, eduRes, expRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/skills'),
          fetch('/api/education'),
          fetch('/api/experience'),
        ]);
        if (profileRes.ok) {
          const pd = await profileRes.json();
          setProfile(pd.data);
        }
        if (skillsRes.ok) {
          const sd = await skillsRes.json();
          setSkills(sd.data);
        }
        if (eduRes.ok) {
          const ed = await eduRes.json();
          setEducation(ed.data);
        }
        if (expRes.ok) {
          const exd = await expRes.json();
          setExperience(exd.data);
        }
      } catch (e) {
        console.error('Failed to fetch data:', e);
      } finally {
        setDataLoaded(true);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    switch (category) {
      case 'about':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">{profile?.summary}</p>
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
              {['React', 'Next.js', 'Playwright', 'TypeScript', 'Python'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
            {profile && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-sm text-gray-400"><span className="text-cyan-400 font-mono">LOCATION:</span> {profile.location}</p>
                <p className="text-sm text-gray-400"><span className="text-cyan-400 font-mono">EMAIL:</span> {profile.email}</p>
              </div>
            )}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6 pt-2">
            {skills.map((cat) => (
              <div key={cat.id}>
                <h4 className="text-sm font-mono text-cyan-400 mb-2 tracking-wider">{cat.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <div key={skill} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 hover:border-cyan-500/50 hover:bg-cyan-900/20 transition-colors text-sm text-gray-300">
                      <span className="text-cyan-400 text-xs">▹</span>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6 pt-2">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-cyan-500/50 pl-4 relative">
                <div className="absolute w-3 h-3 bg-cyan-400 rounded-full -left-[7px] top-1 shadow-[0_0_10px_#22d3ee]" />
                <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                <p className="text-xs font-mono text-cyan-400 mb-2">{exp.company} | {exp.period}</p>
                <ul className="space-y-1">
                  {exp.achievements.slice(0, 4).map((a, i) => (
                    <li key={i} className="text-gray-400 text-sm leading-relaxed flex gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4 pt-2">
            {education.map((edu) => (
              <div key={edu.id} className="bg-white/5 border border-white/10 p-4 rounded-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h4 className="text-lg font-bold text-purple-400 relative z-10">{edu.degree}</h4>
                <p className="text-sm text-white mb-1 relative z-10">{edu.institution}</p>
                <p className="text-sm text-gray-400 relative z-10">{edu.location}</p>
                <div className="flex justify-between items-center text-xs font-mono text-gray-500 mt-2 relative z-10">
                  <span>{edu.period}</span>
                  <span className="text-cyan-500">{edu.score}</span>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500 font-mono text-sm">
            <p className="mb-4">{meta.subText}</p>
            <div className="border border-dashed border-white/10 rounded-xl p-8">
              MODULE_DATA_LOADING...
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      <Scene simplified={isMobile} className="z-0" />
      <div className="absolute inset-0 bg-grid pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_80%)] pointer-events-none z-[1]" />

      <div className="relative z-10 min-h-screen p-4 md:p-8 lg:p-12 flex flex-col">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6 md:mb-8"
        >
          <NeonButton variant="ghost" onClick={() => router.push('/experience')} icon={ArrowLeft}>
            Back to Hub
          </NeonButton>
          <div className="font-mono text-xs text-cyan-500 border border-cyan-500/30 px-3 py-1 rounded bg-cyan-950/30 backdrop-blur">
            NODE: {category.toUpperCase()} // ACTIVE
          </div>
        </motion.div>

        {/* Main content split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start max-w-7xl mx-auto w-full">
          {/* Left: Visual area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassPanel className="h-[35vh] lg:h-[55vh] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80 z-0" />
              <div className="relative z-10 flex flex-col items-center">
                <Globe className="w-24 h-24 md:w-32 md:h-32 text-white/10 group-hover:text-cyan-500/30 transition-colors duration-1000 animate-[spin_20s_linear_infinite]" />
                <div className="mt-4 text-cyan-400/50 font-mono text-xs tracking-widest bg-black/50 px-3 py-1 rounded backdrop-blur-sm border border-cyan-500/20">
                  VISUAL_FEED_ONLINE
                </div>
              </div>
              {/* Scanning effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scan z-20 pointer-events-none" />
            </GlassPanel>
          </motion.div>

          {/* Right: Story content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              {meta.title}
            </h2>

            <GlassPanel className="p-5 md:p-8 space-y-4 max-h-[55vh] overflow-y-auto custom-scrollbar">
              <p className="text-lg text-gray-300 leading-relaxed font-light">
                &ldquo;{meta.narration}&rdquo;
              </p>
              <p className="text-sm text-gray-500 leading-relaxed italic border-l-2 border-gray-700 pl-4">
                {meta.subText}
              </p>
              <div className="pt-2 border-t border-white/10">
                {renderContent()}
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        {/* Bottom: Waveform + Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 md:mt-8 flex flex-col items-center justify-center space-y-3 w-full max-w-3xl mx-auto"
        >
          <VoiceWaveform isPlaying={isPlaying} />
          <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-center w-full md:w-auto">
            <p className="text-sm md:text-base text-gray-200 font-light">
              <span className="text-cyan-400 font-mono mr-2">&gt;</span>
              {meta.narration.slice(0, 70)}...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
