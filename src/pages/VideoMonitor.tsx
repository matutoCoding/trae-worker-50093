import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Video, Play, Maximize2, Settings, Camera as CameraIcon, Search, Filter, X } from 'lucide-react';

const VideoMonitor: React.FC = () => {
  const { cameras } = useAppStore();
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filteredCameras = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    return cameras.filter(c => {
      const matchKw = !kw ||
        c.name.toLowerCase().includes(kw) ||
        c.location.toLowerCase().includes(kw) ||
        c.id.toLowerCase().includes(kw);
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchKw && matchStatus;
    });
  }, [cameras, searchKeyword, statusFilter]);

  const onlineCount = cameras.filter(c => c.status === 'online').length;
  const filteredOnline = filteredCameras.filter(c => c.status === 'online').length;

  const selected = (selectedCamera
    ? cameras.find(c => c.id === selectedCamera)
    : filteredCameras[0]) || cameras[0];

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

  const selectedIdx = selected ? cameras.findIndex(c => c.id === selected.id) : 0;

  const clearAll = () => {
    setSearchKeyword('');
    setStatusFilter('all');
  };

  const hasFilter = searchKeyword.trim() !== '' || statusFilter !== 'all';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">视频监控</h2>
          <p className="text-sm text-slate-400 mt-1">库区实时视频监控</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-mine-900 border border-mine-800 flex-1 md:flex-initial min-w-[220px]">
            <Search size={16} className="text-slate-500 flex-shrink-0" />
            <input
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="搜索摄像头名称/位置..."
              className="bg-transparent text-sm text-white placeholder-slate-500 outline-none flex-1 min-w-0"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="text-slate-500 hover:text-slate-300 flex-shrink-0"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-mine-900 rounded-lg border border-mine-800 p-0.5">
            {[
              { key: 'all' as const, label: '全部' },
              { key: 'online' as const, label: '在线' },
              { key: 'offline' as const, label: '离线' }
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setStatusFilter(opt.key)}
                className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                  statusFilter === opt.key
                    ? 'bg-mine-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {hasFilter && (
            <button
              onClick={clearAll}
              className="px-2.5 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-mine-800 flex items-center gap-1 transition-all"
            >
              <X size={13} />
              清空筛选
            </button>
          )}

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-glow">
          <div className="text-xs text-slate-400">摄像头总数</div>
          <div className="flex items-baseline gap-2 mt-1">
            <div className="text-2xl font-bold text-white">{cameras.length}</div>
            {hasFilter && (
              <div className="text-xs text-mine-300">(筛选后 {filteredCameras.length})</div>
            )}
          </div>
        </div>
        <div className="card-glow">
          <div className="text-xs text-slate-400">在线</div>
          <div className="flex items-baseline gap-2 mt-1">
            <div className="text-2xl font-bold text-emerald-400">{onlineCount}</div>
            {hasFilter && (
              <div className="text-xs text-emerald-400/70">({filteredOnline})</div>
            )}
          </div>
        </div>
        <div className="card-glow">
          <div className="text-xs text-slate-400">离线</div>
          <div className="flex items-baseline gap-2 mt-1">
            <div className="text-2xl font-bold text-slate-500">{cameras.length - onlineCount}</div>
            {hasFilter && (
              <div className="text-xs text-slate-500/70">({filteredCameras.length - filteredOnline})</div>
            )}
          </div>
        </div>
        <div className="card-glow">
          <div className="text-xs text-slate-400">在线率</div>
          <div className="text-2xl font-bold text-mine-300 mt-1">
            {cameras.length > 0 ? ((onlineCount / cameras.length) * 100).toFixed(0) : 0}%
          </div>
        </div>
      </div>

      {selected && (
        <div className="card-glow p-3">
          <div className="aspect-video rounded-xl bg-mine-950 overflow-hidden relative group">
            <div className={`w-full h-full bg-gradient-to-br ${cameraColors[selectedIdx % cameraColors.length]} flex items-center justify-center`}>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-mine-800/60 flex items-center justify-center mx-auto mb-4">
                  <CameraIcon size={40} className="text-white/80" />
                </div>
                <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
                <p className="text-sm text-white/60 mt-1">{selected.location}</p>
                {selected.status === 'offline' && (
                  <p className="text-xs text-red-400 mt-2">摄像头当前离线，无法获取画面</p>
                )}
              </div>
            </div>
            {selected.status === 'online' && (
              <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-600/80 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-blink" />
                <span className="text-xs font-medium text-white">LIVE</span>
              </div>
            )}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="text-xs text-white/60 bg-black/30 px-2 py-0.5 rounded">{selected.id}</span>
              <StatusBadge status={selected.status} />
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
      )}

      {hasFilter && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter size={12} />
          <span>
            当前筛选:
            {searchKeyword.trim() && <span className="text-mine-300 ml-1">关键词「{searchKeyword.trim()}」</span>}
            {searchKeyword.trim() && statusFilter !== 'all' && <span className="mx-1">+</span>}
            {statusFilter !== 'all' && (
              <span className={statusFilter === 'online' ? 'text-emerald-400 ml-1' : 'text-slate-500 ml-1'}>
                {statusFilter === 'online' ? '仅在线' : '仅离线'}
              </span>
            )}
            <span className="ml-2">共 {filteredCameras.length} 条结果</span>
          </span>
        </div>
      )}

      {filteredCameras.length === 0 ? (
        <div className="card-glow py-16 text-center">
          <CameraIcon size={48} className="text-slate-600 mx-auto mb-4" />
          <div className="text-sm text-slate-400 mb-2">没有找到匹配的摄像头</div>
          <div className="text-xs text-slate-600 mb-4">尝试修改搜索关键词或清除筛选条件</div>
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-lg bg-mine-600 hover:bg-mine-500 text-white text-xs transition-all"
          >
            清除所有筛选
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredCameras.map((camera) => {
            const idx = cameras.findIndex(c => c.id === camera.id);
            return (
              <div
                key={camera.id}
                onClick={() => setSelectedCamera(camera.id)}
                className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selected?.id === camera.id
                    ? 'border-mine-400 shadow-lg shadow-mine-500/20'
                    : 'border-transparent hover:border-mine-600/50'
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
            );
          })}
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
                {filteredCameras.map(camera => (
                  <tr
                    key={camera.id}
                    onClick={() => setSelectedCamera(camera.id)}
                    className={`hover:bg-mine-800/30 cursor-pointer ${
                      selected?.id === camera.id ? 'bg-mine-800/40' : ''
                    }`}
                  >
                    <td className="font-mono text-mine-300">{camera.id}</td>
                    <td className="font-medium text-white">{camera.name}</td>
                    <td className="text-slate-400">{camera.location}</td>
                    <td><StatusBadge status={camera.status} /></td>
                    <td>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedCamera(camera.id); }}
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
