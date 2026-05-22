'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Loader2 } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import type { Education } from '@/types';

export default function AdminEducationPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Education | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ degree: '', institution: '', location: '', period: '', score: '', status: 'Completed', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const r = await fetch('/api/education');
      const d = await r.json();
      setItems(d.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/education/${editing.id}` : '/api/education';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setEditing(null);
    setForm({ degree: '', institution: '', location: '', period: '', score: '', status: 'Completed', description: '' });
    fetchData();
  };

  const handleEdit = (item: Education) => {
    setEditing(item);
    setForm({ degree: item.degree, institution: item.institution, location: item.location, period: item.period, score: item.score, status: item.status, description: item.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this education record?')) return;
    await fetch(`/api/education/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500 font-mono"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Education</h1>
          <p className="text-sm font-mono text-gray-500">Manage academic records</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ degree: '', institution: '', location: '', period: '', score: '', status: 'Completed', description: '' }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500 hover:text-black transition-colors font-mono text-sm">
          <Plus size={16} /> Add Education
        </button>
      </motion.header>

      {/* Form Modal */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{editing ? 'Edit' : 'Add'} Education</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Degree" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none" />
              <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Institution" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none" />
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none" />
              <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="Period (e.g., 2022 – 2024)" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none" />
              <input value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} placeholder="Score (e.g., CGPA: 7.71)" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none" />
              <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} placeholder="Status" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500/50 outline-none" />
            </div>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" rows={2} className="w-full mt-4 bg-black/50 border border-white/10 rounded-lg p-3 text-white resize-none focus:border-purple-500/50 outline-none" />
            <div className="flex justify-end mt-4">
              <button onClick={handleSave} className="px-6 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500 hover:text-black font-bold rounded-lg transition-colors">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <GlassPanel className="p-4 flex items-center justify-between group hover:border-amber-500/30">
              <div>
                <h4 className="font-bold text-white text-lg">{item.degree}</h4>
                <div className="text-sm font-mono text-gray-400 mt-1">{item.institution} // {item.period}</div>
                <div className="text-xs text-cyan-500 mt-0.5">{item.score}</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(item)} className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded border border-transparent hover:border-cyan-500/30 transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded border border-transparent hover:border-rose-500/30 transition-colors"><Trash2 size={16} /></button>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
