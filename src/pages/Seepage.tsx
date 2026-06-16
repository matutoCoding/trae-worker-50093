import React from 'react';
import { useAppStore } from '@/store/useStore';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AreaChartComponent } from '@/components/charts/AreaChart';
import { LineChartComponent } from '@/components/charts/LineChart';
import { Droplets, Waves, CloudRain, Ruler, AlertTriangle } from 'lucide-react';

const Seepage: React.FC = () => {
  const { phreaticLines, seepageFlows, rainfall, beachLength, dailyRainfall } = useAppStore();

  const phreaticChartData = phreaticLines.reduce<any[]>((acc, point, idx) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">水位渗流监测</h2>
        <p className="text-sm text-slate-400 mt-1">浸润线、渗流量、降雨量与干滩长度实时监测</p>
      </div>

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
                  <StatusBadge status={point.status} />
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
                    style={{ width: `${((point.value - 1490) / 20) * 100}%` }}
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
          <div className="p-4 rounded-lg bg-mine-950/60 border border-mine-800">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-white">{beachLength.name}</div>
              <StatusBadge status={beachLength.status} />
            </div>
            <div className="flex items-baseline gap-1 mt-3">
              <span className="text-2xl font-bold text-mine-300">{beachLength.value}</span>
              <span className="text-xs text-slate-400">{beachLength.unit}</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">最小预警: {beachLength.threshold.warning}m</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seepage;
