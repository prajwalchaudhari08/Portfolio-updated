'use client';

import { create } from 'zustand';

interface SceneState {
  activeNode: string | null;
  cameraPosition: [number, number, number];
  lightColor: string;
  transitioning: boolean;
  particleCount: number;
  setActiveNode: (node: string | null) => void;
  setCameraPosition: (pos: [number, number, number]) => void;
  setLightColor: (color: string) => void;
  setTransitioning: (transitioning: boolean) => void;
  setParticleCount: (count: number) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  activeNode: null,
  cameraPosition: [0, 0, 5],
  lightColor: '#22d3ee',
  transitioning: false,
  particleCount: 500,
  setActiveNode: (node) => set({ activeNode: node }),
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  setLightColor: (color) => set({ lightColor: color }),
  setTransitioning: (transitioning) => set({ transitioning }),
  setParticleCount: (count) => set({ particleCount: count }),
}));
