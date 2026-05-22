'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Loader2 } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import type { EmailLog } from '@/types';

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EmailLog | null>(null);

  useEffect(() => {
    fetch('/api/emails')
      .then((r) => r.json())
      .then((d) => setEmails(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500 font-mono"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Email Logs</h1>
          <p className="text-sm font-mono text-gray-500">Contact form submissions // {emails.length} total</p>
        </div>
      </motion.header>

      {/* Selected email detail */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                <p className="text-sm text-cyan-400 font-mono">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-sm font-mono">Close</button>
            </div>
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 mb-3">
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="flex justify-between text-xs font-mono text-gray-500">
              <span>{new Date(selected.timestamp).toLocaleString()}</span>
              <span className={selected.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}>
                {selected.status.toUpperCase()}
              </span>
            </div>
            {selected.error && (
              <p className="text-xs text-rose-400 mt-2 font-mono">Error: {selected.error}</p>
            )}
          </GlassPanel>
        </motion.div>
      )}

      {/* Emails table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassPanel className="overflow-hidden">
          {emails.length === 0 ? (
            <div className="text-center py-16 text-gray-600 font-mono text-sm">
              No messages received yet
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-4 text-xs font-mono text-gray-400 font-normal">TIMESTAMP</th>
                  <th className="p-4 text-xs font-mono text-gray-400 font-normal">SENDER</th>
                  <th className="p-4 text-xs font-mono text-gray-400 font-normal">EMAIL</th>
                  <th className="p-4 text-xs font-mono text-gray-400 font-normal">STATUS</th>
                  <th className="p-4 text-xs font-mono text-gray-400 font-normal text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-gray-300 font-mono">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm text-white">{log.name}</td>
                    <td className="p-4 text-sm text-gray-400 font-mono">{log.email}</td>
                    <td className="p-4 text-sm">
                      {log.status === 'success' ? (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs">
                          Delivered
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-xs">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelected(log)} className="text-gray-500 hover:text-white transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </GlassPanel>
      </motion.div>
    </div>
  );
}
