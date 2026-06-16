import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { StatusLevel } from '@/types';
import { StatusBadge } from './StatusBadge';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status?: StatusLevel;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  status,
  trend,
  trendValue,
  icon,
  onClick
}) => {
  return (
    <div
      className={`card-glow hover:border-mine-500/50 transition-all cursor-pointer ${onClick ? '' : 'cursor-default'}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-400 mb-1">{title}</div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
            {unit && <span className="text-sm text-slate-400">{unit}</span>}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {status && <StatusBadge status={status} />}
            {trend && trendValue && (
              <span className={`flex items-center text-xs ${trend === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>
                {trend === 'up' ? <TrendingUp size={14} className="mr-0.5" /> : <TrendingDown size={14} className="mr-0.5" />}
                {trendValue}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="w-11 h-11 rounded-lg bg-mine-700/40 flex items-center justify-center text-mine-300">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
