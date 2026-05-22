'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DynamicLighting() {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.3) * 4;
      light1Ref.current.position.y = Math.cos(t * 0.5) * 2;
      light1Ref.current.intensity = 1.5 + Math.sin(t) * 0.5;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(t * 0.4) * 4;
      light2Ref.current.position.z = Math.sin(t * 0.3) * 4;
      light2Ref.current.intensity = 1.5 + Math.cos(t * 1.5) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#ffffff" />
      <pointLight
        ref={light1Ref}
        position={[3, 2, 4]}
        intensity={2}
        color="#22d3ee"
        distance={15}
        decay={2}
      />
      <pointLight
        ref={light2Ref}
        position={[-3, -2, 3]}
        intensity={2}
        color="#a855f7"
        distance={15}
        decay={2}
      />
      <pointLight
        position={[0, 0, -5]}
        intensity={0.5}
        color="#f59e0b"
        distance={10}
        decay={2}
      />
    </>
  );
}
