import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Mountain,
  Droplets,
  ClipboardCheck,
  ShieldAlert,
  Video,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Mountain as MountainIcon
} from 'lucide-react';
import { useAppStore } from '@/store/useStore';

const navItems = [
  { path: '/dashboard', label: '系统总览', icon: LayoutDashboard },
  { path: '/reservoir', label: '库区台账', icon: Database },
  { path: '/dam-monitoring', label: '坝体监测', icon: Mountain },
  { path: '/seepage', label: '水位渗流', icon: Droplets },
  { path: '/patrol', label: '巡查管理', icon: ClipboardCheck },
  { path: '/emergency', label: '应急预案', icon: ShieldAlert },
  { path: '/video', label: '视频监控', icon: Video },
  { path: '/assessment', label: '安全评估', icon: ShieldCheck }
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, reservoir } = useAppStore();

  return (
    <aside
      className={`h-screen bg-mine-950/95 backdrop-blur-sm border-r border-mine-800 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-mine-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-mine-500 to-mine-700 flex items-center justify-center flex-shrink-0">
            <MountainIcon size={20} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <span className="text-sm font-bold text-white">尾矿库监测</span>
              <span className="text-[10px] text-mine-300">安全管理平台</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 py-4 overflow-y-auto flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''} ${
              sidebarCollapsed ? 'justify-center px-2' : ''
            }`
          }
          >
            <item.icon size={20} />
            {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
        </nav>
      </div>

      <div className="p-3 border-t border-mine-800">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-400 hover:bg-mine-800/50 hover:text-white transition-all"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!sidebarCollapsed && <span className="text-xs">收起侧栏</span>}
        </button>
        {!sidebarCollapsed && (
          <div className="mt-3 p-3 rounded-lg bg-mine-900 border border-mine-800">
            <div className="text-[10px] text-slate-500 mb-1">当前库区</div>
            <div className="text-sm font-medium text-white truncate">{reservoir.name}</div>
          </div>
        )}
      </div>
    </aside>
  );
};
