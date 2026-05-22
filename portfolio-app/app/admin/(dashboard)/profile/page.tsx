'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import type { Profile } from '@/types';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => setProfile(d.data))
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save:', e);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 font-mono">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end border-b border-white/10 pb-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Profile</h1>
          <p className="text-sm font-mono text-gray-500">Manage your identity data</p>
        </div>
      </motion.header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassPanel className="p-8 max-w-3xl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">Display Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">Title</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-gray-400">Summary</label>
              <textarea
                rows={4}
                value={profile.summary}
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white resize-none focus:border-amber-500/50 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-mono text-gray-400">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">LinkedIn URL</label>
                <input
                  type="url"
                  value={profile.social?.linkedin || ''}
                  onChange={(e) => setProfile({ ...profile, social: { ...profile.social, linkedin: e.target.value } })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">GitHub URL</label>
                <input
                  type="url"
                  value={profile.social?.github || ''}
                  onChange={(e) => setProfile({ ...profile, social: { ...profile.social, github: e.target.value } })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              {saved && (
                <span className="text-emerald-400 text-sm font-mono self-center animate-fade-in">
                  ✓ Changes saved
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500 hover:text-black font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
