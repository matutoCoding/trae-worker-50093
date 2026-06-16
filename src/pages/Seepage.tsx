import React, { useState } from 'react';
import { useAppStore } from '@/store/useStore';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AreaChartComponent } from '@/components/charts/AreaChart';
import { LineChartComponent } from '@/components/charts/LineChart';
import { Droplets, Waves, CloudRain, Ruler, AlertTriangle, Plus, X, CheckCircle2, User } from 'lucide-react';

const Seepage: React.FC = () => {
  const {
    phreaticLines, seepageFlows, rainfall, beachLength, dailyRainfall,
    recordMonitoring
  } = useAppStore();

  const [showRecordPanel, setShowRecordPanel] = useState(false);
  const [recordType, setRecordType] = useState<'rainfall' | 'beach' | 'phreatic' | 'seepage'>('rainfall');
  const [recordPointId, setRecordPointId] = useState('');
  const [recordValue, setRecordValue] = useState('');
  const [recordRecorder, setRecordRecorder] = useState('');
  const [recordSuccess, setRecordSuccess] = useState(false);

  const phreaticChartData = phreaticLines.reduce<any[]>((acc, point) => {
    point.history.forEach((h, i) => {
      if (!acc[i]) acc[i] = { time: h.time };
      acc[i][point.name] = h.value;
    });
    return acc;
  }, []);

  const seepageChartData = seepageFlows.reduce<any[]>((acc, point) => {
    point.history.forEach((h, i) => {
      if (!acc[i]) acc[i] = { time: h.time };
      acc[i][point.name] = h.value;
    });
    return acc;
  }, []);

  const typeOptions = [
    { key: 'rainfall', label: '降雨量', icon: CloudRain, unit: 'mm/h' },
    { key: 'beach', label: '干滩长度', icon: Ruler, unit: 'm' },
    { key: 'phreatic', label: '浸润线读数', icon: Droplets, unit: 'm' },
    { key: 'seepage', label: '渗流量', icon: Waves, unit: 'L/s' }
  ] as const;

  const getPointOptions = () => {
    if (recordType === 'phreatic') return phreaticLines;
    if (recordType === 'seepage') return seepageFlows;
    return [];
  };

  const handleSubmitRecord = () => {
    const val = parseFloat(recordValue);
    if (isNaN(val) || val < 0) return;

    const typeCfg = typeOptions.find(t => t.key === recordType)!;
    const pointOptions = getPointOptions();
    const selectedPoint = recordPointId ? pointOptions.find(p => p.id === recordPointId) : null;

    recordMonitoring({
      type: recordType,
      pointId: recordPointId || undefined,
      value: val,
      recorder: recordRecorder.trim() || '系统管理员',
      pointName: selectedPoint?.name || typeCfg.label
    });

    setRecordValue('');
    setRecordRecorder('');
    setRecordPointId('');
    setRecordSuccess(true);
    setTimeout(() => setRecordSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">水位渗流监测</h2>
          <p className="text-sm text-slate-400 mt-1">浸润线、渗流量、降雨量与干滩长度实时监测</p>
        </div>
        <button
          onClick={() => setShowRecordPanel(!showRecordPanel)}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
            showRecordPanel
              ? 'bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30'
              : 'bg-mine-600 hover:bg-mine-500 text-white'
          }`}
        >
          {showRecordPanel ? <X size={16} /> : <Plus size={16} />}
          {showRecordPanel ? '关闭录入' : '监测数据录入'}
        </button>
      </div>

      {showRecordPanel && (
        <div className="card-glow border-mine-500/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0 flex items-center gap-2">
              <Plus size={18} className="text-mine-300" />
              监测数据录入
            </h3>
            {recordSuccess && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 animate-pulse">
                <CheckCircle2 size={14} />
                录入成功，数据已同步
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            {typeOptions.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.key}
                  onClick={() => { setRecordType(opt.key); setRecordPointId(''); }}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                    recordType === opt.key
                      ? 'bg-mine-600/30 border-mine-500 text-white'
                      : 'bg-mine-950/60 border-mine-800 text-slate-400 hover:border-mine-700'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    recordType === opt.key ? 'bg-mine-600 text-white' : 'bg-mine-800 text-slate-400'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-[10px] text-slate-500">单位: {opt.unit}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {(recordType === 'phreatic' || recordType === 'seepage') && (
              <div>
                <label className="text-xs text-slate-500 block mb-1.5">
                  {recordType === 'phreatic' ? '浸润线监测点' : '渗流量监测点'}
                </label>
                <select
                  value={recordPointId}
                  onChange={e => setRecordPointId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-mine-950 border border-mine-800 text-sm text-white outline-none focus:border-mine-500 transition-all"
                >
                  <option value="">请选择监测点</option>
                  {getPointOptions().map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.section || '主坝'})</option>
                  ))}
                </select>
              </div>
            )}
            <div className={recordType === 'phreatic' || recordType === 'seepage' ? '' : 'md:col-span-2'}>
              <label className="text-xs text-slate-500 block mb-1.5">
                数值 ({typeOptions.find(t => t.key === recordType)?.unit})
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={recordValue}
                onChange={e => setRecordValue(e.target.value)}
                placeholder={`请输入${typeOptions.find(t => t.key === recordType)?.label}数值`}
                className="w-full px-3 py-2 rounded-lg bg-mine-950 border border-mine-800 text-sm text-white placeholder-slate-600 outline-none focus:border-mine-500 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1.5 flex items-center gap-1">
                <User size={11} />
                录入人
              </label>
              <input
                type="text"
                value={recordRecorder}
                onChange={e => setRecordRecorder(e.target.value)}
                placeholder="默认系统管理员"
                className="w-full px-3 py-2 rounded-lg bg-mine-950 border border-mine-800 text-sm text-white placeholder-slate-600 outline-none focus:border-mine-500 transition-all"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSubmitRecord}
                disabled={
                  !recordValue ||
                  parseFloat(recordValue) < 0 ||
                  ((recordType === 'phreatic' || recordType === 'seepage') && !recordPointId)
                }
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-mine-600 to-mine-500 hover:from-mine-500 hover:to-mine-400 text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                确认录入
              </button>
            </div>
          </div>

          {(recordType === 'phreatic' || recordType === 'seepage') && recordPointId && (
            <div className="mt-3 p-3 rounded-lg bg-mine-950/60 border border-mine-800 text-xs">
              {(() => {
                const pt = getPointOptions().find(p => p.id === recordPointId);
                if (!pt) return null;
                return (
                  <div className="flex items-center gap-4 flex-wrap text-slate-500">
                    <span>当前读数: <span className="text-white">{pt.value} {pt.unit}</span></span>
                    <span>预警值: <span className="text-amber-400">{pt.threshold.warning}{pt.unit}</span></span>
                    <span>状态: <StatusBadge status={pt.status} /></span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="浸润线最高水位"
          value={Math.max(...phreaticLines.map(p => p.value)).toFixed(1)}
          unit="m"
          status={phreaticLines.some(p => p.status !== 'normal') ? 'warning' : 'normal'}
          icon={<Droplets size={22} />}
        />
        <StatCard
          title="渗流量合计"
          value={seepageFlows.reduce((sum, s) => sum + s.value, 0).toFixed(1)}
          unit="L/s"
          status="normal"
          icon={<Waves size={22} />}
        />
        <StatCard
          title="实时降雨量"
          value={rainfall.value}
          unit={rainfall.unit}
          status={rainfall.status}
          icon={<CloudRain size={22} />}
        />
        <StatCard
          title="干滩长度"
          value={beachLength.value}
          unit={beachLength.unit}
          status={beachLength.status}
          icon={<Ruler size={22} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glow">
          <h3 className="section-title">浸润线水位监测趋势 (24小时)</h3>
          <LineChartComponent
            data={phreaticChartData}
            lines={phreaticLines.map((p, idx) => ({
              key: p.name,
              color: ['#06b6d4', '#3b82f6', '#8b5cf6'][idx],
              name: p.name
            }))}
            height={260}
          />
        </div>

        <div className="card-glow">
          <h3 className="section-title">渗流量监测趋势 (24小时)</h3>
          <LineChartComponent
            data={seepageChartData}
            lines={seepageFlows.map((p, idx) => ({
              key: p.name,
              color: ['#10b981', '#f59e0b'][idx],
              name: p.name
            }))}
            height={260}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glow">
          <h3 className="section-title">近7日降雨量统计 (mm)</h3>
          <AreaChartComponent
            data={dailyRainfall.map(d => ({ name: d.date, value: d.value }))}
            color="#6366f1"
            height={240}
          />
          <div className="mt-3 grid grid-cols-7 gap-2">
            {dailyRainfall.map(d => (
              <div key={d.date} className="text-center p-2 rounded-lg bg-mine-950/50">
                <div className="text-[10px] text-slate-500">{d.date}</div>
                <div className="text-sm text-white font-medium mt-0.5">{d.value}mm</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-glow">
          <h3 className="section-title">浸润线监测点详情</h3>
          <div className="space-y-3">
            {phreaticLines.map(point => (
              <div key={point.id} className={`p-4 rounded-lg bg-mine-950/60 border ${point.status !== 'normal' ? 'border-amber-500/40' : 'border-mine-800'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{point.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{point.section}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{point.timestamp}</span>
                    <StatusBadge status={point.status} />
                  </div>
                </div>
                <div className="flex items-baseline justify-between mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${
                      point.status === 'danger' ? 'text-red-400' :
                      point.status === 'warning' ? 'text-amber-400' : 'text-cyan-400'
                    }`}>
                      {point.value}
                    </span>
                    <span className="text-xs text-slate-400">{point.unit}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    预警值: {point.threshold.warning}m
                  </div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-mine-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${point.status === 'danger' ? 'bg-red-500' : point.status === 'warning' ? 'bg-amber-500' : 'bg-cyan-500'}`}
                    style={{ width: `${Math.min(100, ((point.value - 1490) / 20) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-slate-600">
                  <span>1490m</span>
                  <span>1510m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-glow">
        <h3 className="section-title">渗流量与干滩监测</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {seepageFlows.map(point => (
            <div key={point.id} className="p-4 rounded-lg bg-mine-950/60 border border-mine-800">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">{point.name}</div>
                <StatusBadge status={point.status} />
              </div>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-2xl font-bold text-emerald-400">{point.value}</span>
                <span className="text-xs text-slate-400">{point.unit}</span>
              </div>
              <div className="text-xs text-slate-500 mt-2">{point.timestamp}</div>
            </div>
          ))}
          <div className={`p-4 rounded-lg bg-mine-950/60 border ${beachLength.status !== 'normal' ? 'border-amber-500/40' : 'border-mine-800'}`}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-white">{beachLength.name}</div>
              <StatusBadge status={beachLength.status} />
            </div>
            <div className="flex items-baseline gap-1 mt-3">
              <span className={`text-2xl font-bold ${
                beachLength.status === 'danger' ? 'text-red-400' :
                beachLength.status === 'warning' ? 'text-amber-400' : 'text-mine-300'
              }`}>{beachLength.value}</span>
              <span className="text-xs text-slate-400">{beachLength.unit}</span>
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>更新: {beachLength.timestamp}</span>
              <span>最小预警: {beachLength.threshold.warning}m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seepage;
