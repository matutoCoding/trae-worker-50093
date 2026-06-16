import React, { useState } from 'react';
import { useAppStore } from '@/store/useStore';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LineChartComponent } from '@/components/charts/LineChart';
import { Move, ArrowDown, TrendingUp, AlertTriangle } from 'lucide-react';

const DamMonitoring: React.FC = () => {
  const { damDisplacement, damSettlement } = useAppStore();
  const [activeTab, setActiveTab] = useState<'displacement' | 'settlement'>('displacement');

  const activeData = activeTab === 'displacement' ? damDisplacement : damSettlement;

  const chartData = activeData.reduce<any[]>((acc, point, idx) => {
    point.history.forEach((h, i) => {
      if (!acc[i]) acc[i] = { time: h.time };
      acc[i][point.name] = h.value;
    });
    return acc;
  }, []);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">坝体监测</h2>
        <p className="text-sm text-slate-400 mt-1">坝体位移与沉降实时监测</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="水平位移监测点"
          value={damDisplacement.length}
          unit="个"
          icon={<Move size={22} />}
        />
        <StatCard
          title="沉降监测点"
          value={damSettlement.length}
          unit="个"
          icon={<ArrowDown size={22} />}
        />
        <StatCard
          title="异常测点"
          value={[...damDisplacement, ...damSettlement].filter(p => p.status !== 'normal').length}
          unit="个"
          status="warning"
          icon={<AlertTriangle size={22} />}
        />
        <StatCard
          title="最大累计位移"
          value={Math.max(...damDisplacement.map(p => p.value)).toFixed(1)}
          unit="mm"
          icon={<TrendingUp size={22} />}
        />
      </div>

      <div className="card-glow">
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setActiveTab('displacement')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'displacement'
                ? 'bg-mine-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-mine-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Move size={16} />
              位移监测
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settlement')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settlement'
                ? 'bg-mine-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-mine-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <ArrowDown size={16} />
              沉降监测
            </span>
          </button>
        </div>

        <h3 className="section-title">
          {activeTab === 'displacement' ? '水平位移趋势 (24小时)' : '沉降趋势 (24小时)'}
        </h3>
        <LineChartComponent
          data={chartData}
          lines={activeData.map((p, idx) => ({
            key: p.name,
            color: colors[idx % colors.length],
            name: p.name
          }))}
          height={280}
        />
      </div>

      <div className="card-glow">
        <h3 className="section-title">监测点详情</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>监测点编号</th>
                <th>监测点名称</th>
                <th>所属断面</th>
                <th>监测类型</th>
                <th>当前值</th>
                <th>预警阈值</th>
                <th>状态</th>
                <th>更新时间</th>
              </tr>
            </thead>
            <tbody>
              {activeData.map((point) => (
                <tr key={point.id} className="hover:bg-mine-800/30">
                  <td className="font-mono text-mine-300">{point.id}</td>
                  <td className="font-medium text-white">{point.name}</td>
                  <td className="text-slate-400">{point.section}</td>
                  <td>
                    <span className="text-slate-300">
                      {point.type === 'displacement' ? '水平位移' : '沉降'}
                    </span>
                  </td>
                  <td>
                    <span className={`font-mono font-bold ${
                      point.status === 'danger' ? 'text-red-400' :
                      point.status === 'warning' ? 'text-amber-400' : 'text-white'
                    }`}>
                      {point.value} {point.unit}
                    </span>
                  </td>
                  <td className="text-slate-400">
                    预警: {point.threshold.warning}{point.unit} / 危险: {point.threshold.danger}{point.unit}
                  </td>
                  <td>
                    <StatusBadge status={point.status} />
                  </td>
                  <td className="text-slate-500 text-xs">{point.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeData.map((point, idx) => (
          <div
            key={point.id}
            className={`card-glow ${point.status !== 'normal' ? 'border-amber-500/40' : ''}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-medium text-white">{point.name}</div>
                <div className="text-xs text-slate-500">{point.section}</div>
              </div>
              <StatusBadge status={point.status} />
            </div>
            <div className="flex items-baseline gap-1 mt-3">
              <span className={`text-2xl font-bold ${
                point.status === 'danger' ? 'text-red-400' :
                point.status === 'warning' ? 'text-amber-400' : 'text-white'
              }`}>
                {point.value}
              </span>
              <span className="text-xs text-slate-400">{point.unit}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-mine-950 overflow-hidden">
              <div
                className={`h-full rounded-full ${point.status === 'danger' ? 'bg-red-500' : point.status === 'warning' ? 'bg-amber-500' : 'bg-mine-500'}`}
                style={{ width: `${Math.min((point.value / point.threshold.danger) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
              <span>0</span>
              <span>危险值 {point.threshold.danger}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DamMonitoring;
