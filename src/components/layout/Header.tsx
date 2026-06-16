import React, { useState, useEffect } from 'react';
import { Bell, User, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { StatusBadge } from '../common/StatusBadge';

export const Header: React.FC = () => {
  const { reservoir, alerts } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingAlerts = alerts.filter((a) => a.status !== 'resolved').length;

  const formatTime = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <header className="h-16 bg-mine-950/90 backdrop-blur-sm border-b border-mine-800 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">矿山尾矿库安全监测系统</h1>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock size={14} />
          <span className="font-mono">{formatTime(currentTime)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <StatusBadge status={reservoir.status} text="安全等级：正常库" />
        <div className="h-6 w-px bg-mine-700" />
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-mine-800/50 transition-all">
          <Bell size={20} />
          {pendingAlerts > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white font-bold">
              {pendingAlerts}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-mine-700 flex items-center justify-center text-mine-200">
            <User size={16} />
          </div>
          <div className="text-sm">
            <div className="text-white font-medium">管理员</div>
          </div>
        </div>
      </div>
    </header>
  );
};
