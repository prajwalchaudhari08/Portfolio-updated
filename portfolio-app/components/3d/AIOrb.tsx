'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function AIOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.15;
    }
    if (glowRef.current) {
      const scale = 1.8 + Math.sin(t * 2) * 0.15;
      glowRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[1.5, 32, 32]}>
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main orb */}
      <Sphere ref={meshRef} args={[0.8, 64, 64]}>
        <MeshDistortMaterial
          color="#0e7490"
          emissive="#22d3ee"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* Inner core */}
      <Sphere args={[0.3, 32, 32]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
      </Sphere>

      {/* Orbit ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.4} />
      </mesh>

      {/* Second ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.4, 0.008, 16, 100]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
