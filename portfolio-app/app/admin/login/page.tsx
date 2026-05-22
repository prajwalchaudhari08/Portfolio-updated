'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Cpu, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlassPanel from '@/components/ui/GlassPanel';
import NeonButton from '@/components/ui/NeonButton';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-600/10 to-purple-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full border border-amber-500/30 bg-black/50 backdrop-blur flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Cpu className="w-10 h-10 text-amber-400/60 animate-[spin_8s_linear_infinite]" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider">SYS.ADMIN</h1>
          <p className="text-gray-500 font-mono text-xs mt-1 tracking-widest">
            RESTRICTED_ACCESS_TERMINAL
          </p>
        </div>

        <GlassPanel glowing className="p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-3 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm"
            >
              <AlertTriangle size={16} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Admin Identifier
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500/50 focus:bg-amber-950/10 transition-all placeholder:text-gray-600"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Access Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500/50 focus:bg-amber-950/10 transition-all placeholder:text-gray-600"
                placeholder="Enter password"
              />
            </div>

            <NeonButton
              type="submit"
              disabled={loading}
              className="w-full"
              icon={Lock}
              variant="primary"
            >
              {loading ? 'Authenticating...' : 'Authenticate'}
            </NeonButton>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-400 font-mono text-xs tracking-widest transition-colors"
            >
              ← RETURN TO PUBLIC TERMINAL
            </button>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
