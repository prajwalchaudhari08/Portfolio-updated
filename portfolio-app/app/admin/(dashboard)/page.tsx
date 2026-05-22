'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Mail, Activity, Terminal } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import GlassPanel from '@/components/ui/GlassPanel';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    emails: 0,
    skills: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, emailRes, skillRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/emails'),
          fetch('/api/skills'),
        ]);
        const proj = projRes.ok ? await projRes.json() : { data: [] };
        const email = emailRes.ok ? await emailRes.json() : { data: [] };
        const skill = skillRes.ok ? await skillRes.json() : { data: [] };
        setStats({
          projects: proj.data?.length || 0,
          emails: email.data?.length || 0,
          skills: skill.data?.reduce((acc: number, cat: { skills: string[] }) => acc + cat.skills.length, 0) || 0,
        });
      } catch (e) {
        console.error('Failed to fetch stats:', e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end border-b border-white/10 pb-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-sm font-mono text-gray-500">
            System Overview // All Modules Operational
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded font-mono text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            API ONLINE
          </div>
        </div>
      </motion.header>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          label="Total Projects"
          value={stats.projects}
          icon={Code}
          color="text-blue-400"
          bgColor="bg-blue-400/10"
        />
        <StatsCard
          label="Messages Received"
          value={stats.emails}
          icon={Mail}
          color="text-emerald-400"
          bgColor="bg-emerald-400/10"
        />
        <StatsCard
          label="Total Skills"
          value={stats.skills}
          icon={Activity}
          color="text-purple-400"
          bgColor="bg-purple-400/10"
        />
        <StatsCard
          label="System Status"
          value="Online"
          icon={Terminal}
          color="text-amber-400"
          bgColor="bg-amber-400/10"
        />
      </motion.div>

      {/* Activity placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassPanel className="p-6 h-64 flex items-center justify-center flex-col text-gray-600 border-dashed border-2 border-white/5">
          <Activity className="w-12 h-12 mb-3 opacity-50" />
          <p className="font-mono text-sm">TRAFFIC_VISUALIZATION // OPERATIONAL</p>
          <p className="font-mono text-xs text-gray-700 mt-1">Data collection in progress...</p>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
