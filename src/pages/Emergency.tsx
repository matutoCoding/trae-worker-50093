import React, { useState } from 'react';
import { useAppStore } from '@/store/useStore';
import { ShieldAlert, Package, Users, Truck, Map, FileText, Clock, Award, Star, AlertTriangle } from 'lucide-react';

const Emergency: React.FC = () => {
  const { emergencyResources, drillRecords } = useAppStore();
  const [activeTab, setActiveTab] = useState<'plan' | 'resources' | 'route' | 'drill'>('plan');

  const typeLabels = {
    material: { label: '应急物资', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/15' },
    equipment: { label: '应急设备', icon: Truck, color: 'text-mine-300', bg: 'bg-mine-500/15' },
    personnel: { label: '应急人员', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/15' }
  };

  const evalLabels = {
    excellent: { label: '优秀', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    good: { label: '良好', color: 'text-mine-300', bg: 'bg-mine-500/15' },
    average: { label: '一般', color: 'text-amber-400', bg: 'bg-amber-500/15' },
    poor: { label: '较差', color: 'text-red-400', bg: 'bg-red-500/15' }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">应急预案</h2>
          <p className="text-sm text-slate-400 mt-1">溃坝应急预案管理与应急资源</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-sm font-medium flex items-center gap-2 transition-all">
          <AlertTriangle size={16} />
          启动应急响应
        </button>
      </div>

      <div className="card-glow border-red-500/30 bg-gradient-to-br from-red-900/20 to-mine-900/60">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
            <ShieldAlert size={26} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">大青山尾矿库溃坝应急预案</h3>
            <p className="text-sm text-slate-400 mt-1">版本号：V2.0 · 更新日期：2026-03-15 · 审批人：张建国</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2.5 py-1 rounded-full text-xs bg-mine-700/50 text-slate-300">Ⅳ级响应</span>
              <span className="px-2.5 py-1 rounded-full text-xs bg-mine-700/50 text-slate-300">Ⅲ级响应</span>
              <span className="px-2.5 py-1 rounded-full text-xs bg-mine-700/50 text-slate-300">Ⅱ级响应</span>
              <span className="px-2.5 py-1 rounded-full text-xs bg-mine-700/50 text-slate-300">Ⅰ级响应</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-glow">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {[
            { key: 'plan', label: '预案内容', icon: FileText },
            { key: 'resources', label: '应急资源', icon: Package },
            { key: 'route', label: '疏散路线', icon: Map },
            { key: 'drill', label: '演练记录', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  activeTab === tab.key
                    ? 'bg-mine-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-mine-800/50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'plan' && (
          <div className="space-y-4">
            {[
              {
                title: '一、总则',
                content: '为有效应对大青山尾矿库溃坝事故，规范应急响应程序，最大限度减少人员伤亡和财产损失，保障周边人民群众生命财产安全，根据《安全生产法》《尾矿库安全监督管理规定》等法律法规，制定本预案。'
              },
              {
                title: '二、风险分析',
                content: '大青山尾矿库为上游式尾矿堆积坝，总库容1580万m³，坝高86.5m。主要风险包括：超标准洪水导致漫顶溃坝、坝体失稳滑坡、渗流破坏管涌、地震等地质灾害引发溃坝等。'
              },
              {
                title: '三、组织机构',
                content: '成立应急指挥部，由矿长任总指挥，安全副矿长任副总指挥，下设抢险救援组、医疗救护组、后勤保障组、通讯联络组、治安警戒组、善后处理组等6个专业组。'
              },
              {
                title: '四、预警与响应',
                content: '根据险情严重程度，应急响应分为Ⅳ级（蓝色）、Ⅲ级（黄色）、Ⅱ级（橙色）、Ⅰ级（红色）四个等级，分别对应不同的险情级别和响应措施。'
              },
              {
                title: '五、应急处置',
                content: '险情发生后，立即启动相应级别响应，组织坝体抢险加固，疏散下游受威胁群众，开展人员搜救，控制险情发展，及时上报政府和监管部门。'
              }
            ].map(section => (
              <div key={section.title} className="p-4 rounded-xl bg-mine-950/50 border border-mine-800">
                <h4 className="text-sm font-semibold text-white mb-2">{section.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
            {Object.keys(typeLabels).map(type => {
              const items = emergencyResources.filter(r => r.type === type);
              const cfg = typeLabels[type as keyof typeof typeLabels];
              const Icon = cfg.icon;
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center ${cfg.color}`}>
                      <Icon size={16} />
                    </div>
                    <h4 className="text-sm font-semibold text-white">{cfg.label}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map(item => (
                      <div key={item.id} className="p-4 rounded-xl bg-mine-950/50 border border-mine-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">{item.name}</span>
                          <span className={`text-lg font-bold ${cfg.color}`}>
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-xs text-slate-500">
                          <p>存放位置：{item.location}</p>
                          <p>联系人：{item.contact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'route' && (
          <div className="space-y-4">
            <div className="aspect-[16/9] rounded-xl bg-mine-950/50 border border-mine-800 flex items-center justify-center">
              <div className="text-center">
                <Map size={48} className="text-mine-500 mx-auto mb-3" />
                <p className="text-sm text-slate-400">疏散路线示意图</p>
                <p className="text-xs text-slate-600 mt-1">（实际项目中接入GIS地图服务）</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: '安置点A - 东川一中', capacity: '可容纳2000人', distance: '距库区3.2km' },
                { name: '安置点B - 铜都街道办', capacity: '可容纳1500人', distance: '距库区4.5km' },
                { name: '安置点C - 汤丹镇政府', capacity: '可容纳1000人', distance: '距库区6.8km' }
              ].map(point => (
                <div key={point.name} className="p-4 rounded-xl bg-mine-950/50 border border-mine-800">
                  <h4 className="text-sm font-semibold text-white">{point.name}</h4>
                  <div className="mt-2 space-y-1 text-xs text-slate-400">
                    <p>容纳能力：{point.capacity}</p>
                    <p>距离：{point.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'drill' && (
          <div className="space-y-4">
            {drillRecords.map(drill => {
              const evalCfg = evalLabels[drill.evaluation];
              return (
                <div key={drill.id} className="p-5 rounded-xl bg-mine-950/50 border border-mine-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-white">{drill.name}</h4>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock size={12} />{drill.date}</span>
                        <span>时长：{drill.duration}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${evalCfg.bg} ${evalCfg.color} flex items-center gap-1`}>
                      <Star size={12} fill="currentColor" />
                      {evalCfg.label}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-slate-500 mb-1.5">参与单位</div>
                    <div className="flex flex-wrap gap-1.5">
                      {drill.participants.map(p => (
                        <span key={p} className="px-2.5 py-1 rounded-full text-[11px] bg-mine-800/60 text-slate-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-mine-900/60">
                    <div className="text-xs text-slate-500 mb-1">演练结果</div>
                    <p className="text-sm text-slate-300">{drill.result}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Emergency;
