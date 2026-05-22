'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';
import type { SkillCategory } from '@/types';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((d) => {
        setSkills(d.data || []);
        if (d.data?.length > 0) setSelectedCategory(d.data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddSkill = () => {
    if (!newSkill.trim() || !selectedCategory) return;
    setSkills((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategory
          ? { ...cat, skills: [...cat.skills, newSkill.trim()] }
          : cat
      )
    );
    setNewSkill('');
  };

  const handleRemoveSkill = (catId: string, skillIndex: number) => {
    setSkills((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? { ...cat, skills: cat.skills.filter((_, i) => i !== skillIndex) }
          : cat
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skills),
      });
    } catch (e) {
      console.error('Failed to save:', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 font-mono">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading skills...
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
          <h1 className="text-3xl font-bold text-white mb-1">Skills</h1>
          <p className="text-sm font-mono text-gray-500">Manage technical proficiencies</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500 hover:text-black font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save All
        </button>
      </motion.header>

      {/* Add skill */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassPanel className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Add New Skill</h3>
          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500/50 outline-none"
            >
              {skills.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.category}</option>
              ))}
            </select>
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add new skill..."
              className="flex-1 min-w-[200px] bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500/50 outline-none"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500 hover:text-black transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Skills by category */}
      <div className="space-y-4">
        {skills.map((cat, catIndex) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * catIndex + 0.2 }}
          >
            <GlassPanel className="p-5">
              <h4 className="text-sm font-mono text-cyan-400 mb-3 tracking-wider">
                {cat.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, i) => (
                  <div
                    key={`${skill}-${i}`}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:border-rose-500/50 transition-colors"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(cat.id, i)}
                      className="text-gray-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {cat.skills.length === 0 && (
                  <span className="text-gray-600 font-mono text-xs">No skills added</span>
                )}
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
