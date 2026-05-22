'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import type { Project } from '@/types';

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', techStack: '', image: '', githubUrl: '', liveUrl: '', featured: false });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const r = await fetch('/api/projects');
      const d = await r.json();
      setItems(d.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/projects/${editing.id}` : '/api/projects';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      }),
    });
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', description: '', techStack: '', image: '', githubUrl: '', liveUrl: '', featured: false });
    fetchData();
  };

  const handleEdit = (item: Project) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      techStack: item.techStack.join(', '),
      image: item.image || '',
      githubUrl: item.githubUrl || '',
      liveUrl: item.liveUrl || '',
      featured: item.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500 font-mono"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Projects</h1>
          <p className="text-sm font-mono text-gray-500">Manage deployed modules</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ title: '', description: '', techStack: '', image: '', githubUrl: '', liveUrl: '', featured: false }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-lg hover:bg-amber-500 hover:text-black transition-colors font-mono text-sm">
          <Plus size={16} /> Add Project
        </button>
      </motion.header>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{editing ? 'Edit' : 'Add'} Project</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project Title" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none" />
              <input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="Tech Stack (comma separated)" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none" />
              <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="GitHub URL" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none" />
              <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="Live Demo URL" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none" />
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 outline-none" />
              <label className="flex items-center gap-3 px-3 py-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                <span className="text-sm text-gray-400">Featured Project</span>
              </label>
            </div>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full mt-4 bg-black/50 border border-white/10 rounded-lg p-3 text-white resize-none focus:border-amber-500/50 outline-none" />
            <div className="flex justify-end mt-4">
              <button onClick={handleSave} className="px-6 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500 hover:text-black font-bold rounded-lg transition-colors">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </GlassPanel>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <GlassPanel className="p-4 flex items-center gap-4 group hover:border-amber-500/30">
              <div className="w-16 h-16 bg-zinc-900 rounded border border-white/10 flex items-center justify-center text-gray-600 flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white">{item.title}</h4>
                  {item.featured && (
                    <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">FEATURED</span>
                  )}
                </div>
                <p className="text-xs font-mono text-cyan-400 mt-1">[{item.techStack.join(', ')}]</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(item)} className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded border border-white/5 hover:border-cyan-500/30 transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded border border-white/5 hover:border-rose-500/30 transition-colors"><Trash2 size={16} /></button>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
