'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Activity, RotateCcw, AlertTriangle } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import NeonButton from '@/components/ui/NeonButton';

type FormStatus = 'idle' | 'sending' | 'success' | 'failed';

export default function ContactForm() {
  const contactEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'prajwalchaudhari89@gmail.com';
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('failed');
      }
    } catch {
      setStatus('failed');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <GlassPanel glowing className="p-8 md:p-12 relative overflow-hidden max-w-2xl w-full">
      {/* Background flare */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />

      <h2 className="text-3xl font-bold mb-2 text-white">Get in Touch</h2>
      <p className="text-gray-400 mb-8 font-mono text-sm">
        Direct contact: {contactEmail}
      </p>

      <AnimatePresence mode="wait">
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50">
              <Activity className="text-emerald-400 w-10 h-10 animate-pulse" />
            </div>
            <h3 className="text-2xl text-emerald-400 font-bold mb-3">
              Message Sent Securely
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Thank you for reaching out. Your secure message has been successfully delivered.
            </p>
            <NeonButton onClick={resetForm} icon={RotateCcw}>
              Initiate New Transfer
            </NeonButton>
          </motion.div>
        )}

        {status === 'failed' && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/50">
              <AlertTriangle className="text-rose-400 w-10 h-10" />
            </div>
            <h3 className="text-2xl text-rose-400 font-bold mb-3">
              Transmission Failed
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Connection interrupted. Please retry the uplink sequence.
            </p>
            <NeonButton onClick={resetForm} variant="danger" icon={RotateCcw}>
              Retry Connection
            </NeonButton>
          </motion.div>
        )}

        {(status === 'idle' || status === 'sending') && (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6 relative z-10"
          >
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                FULL NAME
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/20 transition-all placeholder:text-gray-600 font-light"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                EMAIL ADDRESS
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/20 transition-all placeholder:text-gray-600 font-light"
                placeholder="name@domain.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                HOW CAN WE HELP?
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/20 transition-all resize-none placeholder:text-gray-600 font-light"
                placeholder="Type your message here..."
              />
            </div>

            <NeonButton
              type="submit"
              disabled={status === 'sending'}
              className="w-full"
              icon={status === 'sending' ? Activity : Send}
              variant={status === 'sending' ? 'secondary' : 'primary'}
            >
              {status === 'sending'
                ? 'SENDING...'
                : 'SEND MESSAGE'}
            </NeonButton>
          </motion.form>
        )}
      </AnimatePresence>
    </GlassPanel>
  );
}
