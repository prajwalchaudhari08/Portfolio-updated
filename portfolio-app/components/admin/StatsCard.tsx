'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import GlassPanel from '@/components/ui/GlassPanel';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
}: StatsCardProps) {
  return (
    <GlassPanel className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm font-mono text-gray-500">{label}</p>
    </GlassPanel>
  );
}
