import React from 'react';
import { MapPin, Calendar, User, Phone, Building2, Ruler, Layers, Waves } from 'lucide-react';
import { useAppStore } from '@/store/useStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AreaChartComponent } from '@/components/charts/AreaChart';
import { StatCard } from '@/components/common/StatCard';

const Reservoir: React.FC = () => {
  const { reservoir, capacityCurve } = useAppStore();

  const usagePercent = ((reservoir.currentStorage / reservoir.totalCapacity) * 100).toFixed(1);

  const infoItems = [
    { icon: MapPin, label: '库区位置', value: reservoir.location },
    { icon: Calendar, label: '建成时间', value: reservoir.buildDate },
    { icon: Building2, label: '设计单位', value: reservoir.designCompany },
    { icon: User, label: '责任人', value: `${reservoir.responsiblePerson} (${reservoir.phone})` },
    { icon: Phone, label: '联系电话', value: reservoir.phone }
  ];

  const designParams = [
    { label: '坝型', value: reservoir.damType },
    { label: '设计坝高', value: `${reservoir.damHeight} m` },
    { label: '总库容', value: `${reservoir.totalCapacity} 万m³` },
    { label: '当前库容', value: `${reservoir.currentStorage} 万m³` },
    { label: '调洪库容', value: `${reservoir.floodControlCapacity} 万m³` },
    { label: '防洪标准', value: reservoir.floodStandard },
    { label: '安全等级', value: '正常库' },
    { label: '经纬度', value: `${reservoir.coordinate.lng}, ${reservoir.coordinate.lat}` }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">库区台账</h2>
          <p className="text-sm text-slate-400 mt-1">尾矿库基础档案与设计参数</p>
        </div>
        <StatusBadge status={reservoir.status} text="运行正常" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="总库容"
          value={reservoir.totalCapacity}
          unit="万m³"
          icon={<Layers size={22} />}
        />
        <StatCard
          title="已使用库容"
          value={reservoir.currentStorage}
          unit="万m³"
          status="normal"
          icon={<Waves size={22} />}
        />
        <StatCard
          title="坝高"
          value={reservoir.damHeight}
          unit="m"
          icon={<Ruler size={22} />}
        />
      </div>

      <div className="card-glow">
        <h3 className="section-title">库容使用情况</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">当前库容 {reservoir.currentStorage} 万m³ / {reservoir.totalCapacity} 万m³</span>
            <span className="text-mine-300 font-medium">{usagePercent}%</span>
          </div>
          <div className="h-4 rounded-full bg-mine-950 border border-mine-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-mine-600 to-mine-400 rounded-full transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glow">
          <h3 className="section-title">基础档案</h3>
          <div className="space-y-4">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-mine-800/60 flex items-center justify-center text-mine-300 flex-shrink-0 mt-0.5">
                  <item.icon size={16} />
                </div>
                <div>
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="text-sm text-white mt-0.5">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-glow">
          <h3 className="section-title">主要设计参数</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {designParams.map((param) => (
              <div key={param.label}>
                <div className="text-xs text-slate-500">{param.label}</div>
                <div className="text-sm text-white mt-0.5">{param.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-glow">
        <h3 className="section-title">水位 - 库容关系曲线</h3>
        <AreaChartComponent
          data={capacityCurve.map((c) => ({ name: `${c.waterLevel}m`, value: c.capacity }))}
          color="#3b82f6"
          height={280}
        />
        <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-3">
          {capacityCurve.map((c) => (
            <div key={c.waterLevel} className="p-3 rounded-lg bg-mine-950/60 border border-mine-800 text-center">
              <div className="text-xs text-slate-500">{c.waterLevel}m</div>
              <div className="text-sm text-white font-medium mt-1">{c.capacity}万m³</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reservoir;
