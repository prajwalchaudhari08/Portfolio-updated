'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GitBranch, Globe } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import NeonButton from '@/components/ui/NeonButton';
import { useIsMobile } from '@/hooks/useMediaQuery';
import type { Project } from '@/types';

const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false });

export default function ProjectsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data.data);
        }
      } catch (e) {
        console.error('Failed to fetch projects:', e);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      <Scene simplified={isMobile} className="z-0" />
      <div className="absolute inset-0 bg-grid pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_80%)] pointer-events-none z-[1]" />

      <div className="relative z-10 min-h-screen p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <NeonButton variant="ghost" onClick={() => router.push('/experience')} icon={ArrowLeft}>
              Return
            </NeonButton>
            <div className="font-mono text-xs text-purple-400 border border-purple-500/30 px-3 py-1 rounded bg-purple-950/30 backdrop-blur">
              MODULES: {projects.length} DEPLOYED
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
          >
            Deployed Modules
          </motion.h1>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.2 }}
              >
                <GlassPanel glowing className="group flex flex-col h-full hover:scale-[1.02] transition-transform duration-300">
                  {/* Image area */}
                  <div className="h-48 bg-gradient-to-br from-zinc-900 to-zinc-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                          <Globe className="w-8 h-8 text-white/20 animate-[spin_15s_linear_infinite]" />
                        </div>
                      </div>
                    )}
                    {/* Featured badge */}
                    {project.featured && (
                      <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] font-mono">
                        FEATURED
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm flex-1 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto border-t border-white/10 pt-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {project.techStack.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase font-mono text-cyan-400 px-2 py-1 bg-cyan-500/10 rounded border border-cyan-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-[10px] font-mono text-gray-500 px-2 py-1">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 text-gray-500 ml-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <GitBranch size={16} className="hover:text-white transition-colors cursor-pointer" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Globe size={16} className="hover:text-white transition-colors cursor-pointer" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
