'use client';

import dynamic from 'next/dynamic';

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

export default function ProjectsPage() {
  return <ProjectCircuit />;
}
