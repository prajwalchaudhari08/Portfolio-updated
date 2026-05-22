// ==========================================
// Portfolio Data Types
// ==========================================

export interface Profile {
  name: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  social: {
    linkedin: string;
    github: string;
    twitter?: string;
    website?: string;
  };
  resumeUrl: string;
  avatarUrl?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
  color: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  score: string;
  status: string;
  description?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface EmailLog {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'success' | 'failed';
  timestamp: string;
  error?: string;
}

export interface Settings {
  siteName: string;
  siteDescription: string;
  theme: 'dark' | 'light';
  audioEnabled: boolean;
  subtitlesEnabled: boolean;
  particleCount: number;
}

export interface AuthPayload {
  username: string;
  iat: number;
  exp: number;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==========================================
// UI State Types
// ==========================================

export type PublicScreen = 'hero' | 'hub' | 'projects' | 'contact' | string;

export type AdminTab = 
  | 'dashboard' 
  | 'profile' 
  | 'skills' 
  | 'education' 
  | 'experience' 
  | 'projects' 
  | 'emails';

export interface NavigationCard {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}
