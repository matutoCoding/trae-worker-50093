import React, { useState } from 'react';
import { useAppStore } from '@/store/useStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Video, Play, Maximize2, Settings, Camera as CameraIcon, Search, Filter } from 'lucide-react';

const VideoMonitor: React.FC = () => {
  const { cameras } = useAppStore();
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const onlineCount = cameras.filter(c => c.status === 'online').length;
  const selected = cameras.find(c => c.id === selectedCamera) || cameras[0];

  const cameraColors = [
    'from-blue-900/40 to-mine-900',
    'from-emerald-900/40 to-mine-900',
    'from-amber-900/40 to-mine-900',
    'from-purple-900/40 to-mine-900',
    'from-cyan-900/40 to-mine-900',
    'from-rose-900/40 to-mine-900',
    'from-indigo-900/40 to-mine-900',
    'from-teal-900/40 to-mine-900'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">视频监控</h2>
          <p className="text-sm text-slate-400 mt-1">库区实时视频监控</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-mine-900 border border-mine-800">
            <Search size={16} className="text-slate-500" />
            <input
              type="text"
              placeholder="搜索摄像头..."
              className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-40"
            />
          </div>
          <div className="flex items-center bg-mine-900 rounded-lg border border-mine-800 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'grid' ? 'bg-mine-600 text-white' : 'text-slate-400'}`}
            >
              网格
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'list' ? 'bg-mine-600 text-white' : 'text-slate-400'}`}
            >
              列表
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card-glow">
          <div className="text-xs text-slate-400">摄像头总数</div>
          <div className="text-2xl font-bold text-white mt-1">{cameras.length}</div>
        </div>
        <div className="card-glow">
          <div className="text-xs text-slate-400">在线</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{onlineCount}</div>
        </div>
        <div className="card-glow">
          <div className="text-xs text-slate-400">离线</div>
          <div className="text-2xl font-bold text-slate-500 mt-1">{cameras.length - onlineCount}</div>
        </div>
        <div className="card-glow">
          <div className="text-xs text-slate-400">在线率</div>
          <div className="text-2xl font-bold text-mine-300 mt-1">
            {((onlineCount / cameras.length) * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="card-glow p-3">
        <div className="aspect-video rounded-xl bg-mine-950 overflow-hidden relative group">
          <div className={`w-full h-full bg-gradient-to-br ${cameraColors[cameras.findIndex(c => c.id === selected?.id) % cameraColors.length]} flex items-center justify-center`}>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-mine-800/60 flex items-center justify-center mx-auto mb-4">
                <CameraIcon size={40} className="text-white/80" />
              </div>
              <h3 className="text-lg font-semibold text-white">{selected?.name}</h3>
              <p className="text-sm text-white/60 mt-1">{selected?.location}</p>
            </div>
          </div>
          {selected?.status === 'online' && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-600/80 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-blink" />
              <span className="text-xs font-medium text-white">LIVE</span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <StatusBadge status={selected?.status || 'offline'} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
                  <Play size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
                  <Settings size={18} />
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cameras.map((camera, idx) => (
            <div
              key={camera.id}
              onClick={() => setSelectedCamera(camera.id)}
              className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                selectedCamera === camera.id ? 'border-mine-400 shadow-lg shadow-mine-500/20' : 'border-transparent hover:border-mine-600/50'
              }`}
            >
              <div className={`aspect-video bg-gradient-to-br ${cameraColors[idx % cameraColors.length]} relative`}>
                <div className="w-full h-full flex items-center justify-center">
                  <CameraIcon size={28} className="text-white/60" />
                </div>
                {camera.status === 'online' && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-blink" />
                    <span className="text-[10px] font-medium text-white">LIVE</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <StatusBadge status={camera.status} />
                </div>
              </div>
              <div className="p-3 bg-mine-900">
                <div className="text-sm font-medium text-white truncate">{camera.name}</div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">{camera.location}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-glow">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>编号</th>
                  <th>摄像头名称</th>
                  <th>安装位置</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {cameras.map(camera => (
                  <tr key={camera.id} className="hover:bg-mine-800/30">
                    <td className="font-mono text-mine-300">{camera.id}</td>
                    <td className="font-medium text-white">{camera.name}</td>
                    <td className="text-slate-400">{camera.location}</td>
                    <td><StatusBadge status={camera.status} /></td>
                    <td>
                      <button
                        onClick={() => setSelectedCamera(camera.id)}
                        className="px-3 py-1.5 rounded-md text-xs bg-mine-600 hover:bg-mine-500 text-white transition-all flex items-center gap-1"
                      >
                        <Video size={12} />
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMonitor;
