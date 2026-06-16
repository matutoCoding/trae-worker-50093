import React from 'react';
import { Mountain, Droplets, Users, AlertTriangle, Activity, CloudRain, Waves, MapPin } from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { StatCard } from '@/components/common/StatCard';
import { LineChartComponent } from '@/components/charts/LineChart';
import { AreaChartComponent } from '@/components/charts/AreaChart';
import { StatusBadge } from '@/components/common/StatusBadge';

const Dashboard: React.FC = () => {
  const {
    reservoir,
    damDisplacement,
    damSettlement,
    phreaticLines,
    seepageFlows,
    rainfall,
    beachLength,
    alerts,
    dailyRainfall
  } = useAppStore();

  const warningPoints = [...damDisplacement, ...damSettlement, ...phreaticLines, ...seepageFlows].filter(
    (p) => p.status !== 'normal'
  ).length;

  const pendingAlerts = alerts.filter((a) => a.status === 'pending' || a.status === 'processing').length;

  const phreaticData = phreaticLines.reduce<any[]>((acc, point) => {
    point.history.forEach((h, i) => {
      if (!acc[i]) acc[i] = { time: h.time };
      acc[i][point.name] = h.value;
    });
    return acc;
  }, []);

  const phreaticMax = Math.max(...phreaticLines.map(p => p.value)).toFixed(1);
  const warningPhreatic = phreaticLines.find(p => p.status !== 'normal');

  const displacementData = damDisplacement.slice(0, 2).reduce<any[]>((acc, point, idx) => {
    point.history.forEach((h, i) => {
      if (!acc[i]) acc[i] = { time: h.time };
      acc[i][point.name] = h.value;
    });
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">系统总览</h2>
          <p className="text-sm text-slate-400 mt-1">{reservoir.name} · {reservoir.location}</p>
        </div>
        <StatusBadge status={reservoir.status} text={reservoir.status === 'normal' ? '运行正常' : '存在预警'} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="当前库水位"
          value="1506.8"
          unit="m"
          status="normal"
          icon={<Mountain size={22} />}
        />
        <StatCard
          title="干滩长度"
          value={beachLength.value}
          unit={beachLength.unit}
          status={beachLength.status}
          icon={<Waves size={22} />}
        />
        <StatCard
          title="库区降雨量"
          value={rainfall.value}
          unit={rainfall.unit}
          status={rainfall.status}
          icon={<CloudRain size={22} />}
          trend="up"
          trendValue="较昨日 +2.1mm"
        />
        <StatCard
          title="渗流量"
          value={(seepageFlows.reduce((sum, s) => sum + s.value, 0)).toFixed(1)}
          unit="L/s"
          status="normal"
          icon={<Droplets size={22} />}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="监测点总数"
          value={damDisplacement.length + damSettlement.length + phreaticLines.length + seepageFlows.length}
          unit="个"
          icon={<Activity size={22} />}
        />
        <StatCard
          title="异常监测点"
          value={warningPoints}
          unit="个"
          status={warningPoints > 0 ? 'warning' : 'normal'}
          icon={<AlertTriangle size={22} />}
        />
        <StatCard
          title="未处理预警"
          value={pendingAlerts}
          unit="条"
          status={pendingAlerts > 0 ? 'warning' : 'normal'}
          icon={<AlertTriangle size={22} />}
        />
        <StatCard
          title="在线摄像头"
          value="7/8"
          unit="路"
          status="normal"
          icon={<MapPin size={22} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">浸润线水位趋势 (全部测点)</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">最高值:</span>
              <span className={warningPhreatic ? 'text-amber-400 font-medium' : 'text-cyan-400 font-medium'}>{phreaticMax}m</span>
              {warningPhreatic && <StatusBadge status={warningPhreatic.status} />}
            </div>
          </div>
          <LineChartComponent
            data={phreaticData}
            lines={phreaticLines.map((p, idx) => ({
              key: p.name,
              color: ['#06b6d4', '#3b82f6', '#8b5cf6'][idx],
              name: p.name
            }))}
            height={220}
          />
        </div>

        <div className="card-glow">
          <h3 className="section-title">坝体位移监测趋势</h3>
          <LineChartComponent
            data={displacementData}
            lines={[
              { key: damDisplacement[0]?.name || 'A01', color: '#3b82f6', name: damDisplacement[0]?.name || 'A01' },
              { key: damDisplacement[1]?.name || 'A02', color: '#10b981', name: damDisplacement[1]?.name || 'A02' }
            ]}
            height={220}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-glow lg:col-span-2">
          <h3 className="section-title">近7日降雨量统计 (mm)</h3>
          <AreaChartComponent
            data={dailyRainfall.map((d) => ({ name: d.date, value: d.value }))}
            color="#6366f1"
            height={200}
          />
        </div>

        <div className="card-glow">
          <h3 className="section-title">最新预警信息</h3>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg bg-mine-950/50 border border-mine-800 hover:border-mine-600/50 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={alert.level} />
                      <span className="text-sm font-medium text-white truncate">{alert.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{alert.description}</p>
                    <p className="text-[11px] text-slate-500 mt-1.5">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
