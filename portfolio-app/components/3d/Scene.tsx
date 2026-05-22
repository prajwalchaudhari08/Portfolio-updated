'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import ParticleField from './ParticleField';
import AIOrb from './AIOrb';
import DynamicLighting from './DynamicLighting';

interface SceneProps {
  className?: string;
  simplified?: boolean;
}

export default function Scene({ className = '', simplified = false }: SceneProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, simplified ? 1 : 2]}
        gl={{ 
          antialias: !simplified, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <DynamicLighting />
          <ParticleField count={simplified ? 200 : 500} />
          <AIOrb />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
