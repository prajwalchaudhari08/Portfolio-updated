'use client';

import { create } from 'zustand';
import type { AdminTab } from '@/types';

interface UIState {
  activeSection: string;
  adminTab: AdminTab;
  sidebarOpen: boolean;
  isLoading: boolean;
  setActiveSection: (section: string) => void;
  setAdminTab: (tab: AdminTab) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeSection: 'hero',
  adminTab: 'dashboard',
  sidebarOpen: true,
  isLoading: false,
  setActiveSection: (section) => set({ activeSection: section }),
  setAdminTab: (tab) => set({ adminTab: tab }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
