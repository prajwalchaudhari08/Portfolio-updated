'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layout,
  Users,
  Briefcase,
  Code,
  GraduationCap,
  Cpu,
  Server,
  Lock,
  Eye,
  LogOut,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', href: '/admin', icon: Layout, label: 'Overview' },
  { id: 'profile', href: '/admin/profile', icon: Users, label: 'Profile' },
  { id: 'skills', href: '/admin/skills', icon: Cpu, label: 'Skills' },
  { id: 'experience', href: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { id: 'education', href: '/admin/education', icon: GraduationCap, label: 'Education' },
  { id: 'projects', href: '/admin/projects', icon: Code, label: 'Projects' },
  { id: 'emails', href: '/admin/emails', icon: Server, label: 'Email Logs' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <div className="w-64 bg-black/80 border-r border-white/10 flex flex-col min-h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-500" /> SYS.ADMIN
        </h2>
        <div className="text-xs font-mono text-gray-500 mt-1">
          SECURE_CONNECTION: ESTABLISHED
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-white transition-colors border border-white/10 rounded-lg hover:bg-white/5"
        >
          <Eye size={16} /> View Portfolio
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-rose-400/60 hover:text-rose-400 transition-colors border border-transparent rounded-lg hover:bg-rose-500/10 hover:border-rose-500/20"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
