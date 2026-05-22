'use client';

import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  setAuthenticated: (authenticated: boolean, username?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  username: null,
  setAuthenticated: (authenticated, username) =>
    set({ isAuthenticated: authenticated, username: username || null }),
  logout: () => set({ isAuthenticated: false, username: null }),
}));
