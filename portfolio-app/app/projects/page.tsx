'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { LayoutGrid, Gamepad2, ArrowLeft, ExternalLink, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlassPanel from '@/components/ui/GlassPanel';
import NeonButton from '@/components/ui/NeonButton';
import { useIsMobile } from '@/hooks/useMediaQuery';
import type { Project } from '@/types';

// Load the 3D Scene background
const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false });

// Load the 3D circuit client-side only (Three.js requires DOM)
const ProjectCircuit = dynamic(
  () => import('@/components/3d/ProjectCircuit'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-t-transparent border-purple-500 animate-spin"
          />
          <p className="text-gray-400 font-mono text-sm tracking-widest">INITIALISING CIRCUIT...</p>
        </div>
      </div>
    ),
  }
);

// Custom inline SVG for Github to avoid dependency issues with lucide-react brand icons
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className="w-3.5 h-3.5"
    {...props}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'normal' | 'game'>('normal');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const isGameView = viewMode === 'game';

  return isGameView ? (
    <ProjectCircuit onReturn={() => setViewMode('normal')} />
  ) : (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden relative">
      {/* 3D Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Scene simplified={isMobile} />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 py-16">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 pb-6 border-b border-white/10">
          <div>
            <NeonButton variant="ghost" onClick={() => router.push('/experience')} icon={ArrowLeft}>
              Back to Hub
            </NeonButton>
            <h1 className="text-4xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              Projects Showcase
            </h1>
            <p className="text-gray-400 font-light mt-1 text-sm">
              Explore my portfolio works and system designs.
            </p>
          </div>

          {/* View Toggle */}
          <div className="bg-black/60 border border-white/10 p-1.5 rounded-full flex gap-1.5 backdrop-blur-md self-start sm:self-auto shadow-[0_0_20px_rgba(0,191,255,0.05)]">
            <button
              onClick={() => setViewMode('normal')}
              className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider flex items-center gap-2 transition-all duration-300 ${
                !isGameView
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <LayoutGrid size={14} />
              GRID VIEW
            </button>
            <button
              onClick={() => setViewMode('game')}
              className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider flex items-center gap-2 transition-all duration-300 ${
                isGameView
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              <Gamepad2 size={14} />
              GAME VIEW
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500 font-mono">
            <div className="w-10 h-10 border-2 border-t-transparent border-cyan-500 rounded-full animate-spin mr-3" />
            LOADING PROJECTS...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <GlassPanel glowing className="h-full flex flex-col p-6 hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex justify-between items-start mb-4">
                    {project.featured ? (
                      <span className="text-[10px] font-bold uppercase tracking-[2px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        ★ Featured
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase tracking-[2px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                        Project
                      </span>
                    )}
                    <Code size={18} className="text-gray-600" />
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-white hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm font-light mb-6 flex-grow leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-white/10 mt-auto">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <GithubIcon />
                        GitHub →
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink size={14} />
                        Live Demo →
                      </a>
                    )}
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
