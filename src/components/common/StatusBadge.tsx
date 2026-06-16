import React from 'react';
import type { StatusLevel, AlertLevel } from '@/types';

interface StatusBadgeProps {
  status: StatusLevel | AlertLevel | 'online' | 'offline';
  text?: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  normal: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', label: '正常' },
  warning: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400 animate-blink', label: '预警' },
  danger: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400 animate-blink', label: '危险' },
  info: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', dot: 'bg-cyan-400', label: '提示' },
  online: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', label: '在线' },
  offline: { bg: 'bg-slate-500/15', text: 'text-slate-400', dot: 'bg-slate-400', label: '离线' }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {
  const cfg = statusConfig[status] || statusConfig.normal;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {text || cfg.label}
    </span>
  );
};
