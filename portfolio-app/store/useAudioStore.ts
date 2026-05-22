'use client';

import { create } from 'zustand';

interface AudioState {
  isMuted: boolean;
  isPlaying: boolean;
  subtitlesVisible: boolean;
  currentSubtitle: string;
  toggleMute: () => void;
  setPlaying: (playing: boolean) => void;
  toggleSubtitles: () => void;
  setSubtitle: (text: string) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isMuted: false,
  isPlaying: false,
  subtitlesVisible: true,
  currentSubtitle: '',
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setPlaying: (playing) => set({ isPlaying: playing }),
  toggleSubtitles: () =>
    set((state) => ({ subtitlesVisible: !state.subtitlesVisible })),
  setSubtitle: (text) => set({ currentSubtitle: text }),
}));
