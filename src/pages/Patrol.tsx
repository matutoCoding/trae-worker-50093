import React, { useState } from 'react';
import { useAppStore } from '@/store/useStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ClipboardCheck, MapPin, Clock, User, AlertCircle, CheckCircle, Wrench, Camera, FileText } from 'lucide-react';

const Patrol: React.FC = () => {
  const { patrolRecords, floodInspections } = useAppStore();
  const [activeTab, setActiveTab] = useState<'records' | 'flood'>('records');

  const statusConfig = {
    normal: { label: '正常', icon: CheckCircle, color: 'text-emerald-400' },
    issue_found: { label: '发现问题', icon: AlertCircle, color: 'text-amber-400' },
    rectified: { label: '已整改', icon: CheckCircle, color: 'text-cyan-400' }
  };

  const todayCount = patrolRecords.filter(r => r.patrolTime.startsWith('2026-06-17')).length;
  const issueCount = patrolRecords.filter(r => r.status === 'issue_found').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">巡查管理</h2>
        <p className="text-sm text-slate-400 mt-1">人工巡查打卡与排洪设施检查记录</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-mine-700/40 flex items-center justify-center text-mine-300">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-400">今日巡查次数</div>
              <div className="text-2xl font-bold text-white mt-0.5">{todayCount}</div>
            </div>
          </div>
        </div>
        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-400">待处理问题</div>
              <div className="text-2xl font-bold text-amber-400 mt-0.5">{issueCount}</div>
            </div>
          </div>
        </div>
        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-mine-700/40 flex items-center justify-center text-mine-300">
              <FileText size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-400">巡查记录总数</div>
              <div className="text-2xl font-bold text-white mt-0.5">{patrolRecords.length}</div>
            </div>
          </div>
        </div>
        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Wrench size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-400">排洪设施</div>
              <div className="text-2xl font-bold text-white mt-0.5">{floodInspections.length}处</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-glow">
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'records'
                ? 'bg-mine-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-mine-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <ClipboardCheck size={16} />
              巡查记录
            </span>
          </button>
          <button
            onClick={() => setActiveTab('flood')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'flood'
                ? 'bg-mine-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-mine-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Wrench size={16} />
              排洪设施检查
            </span>
          </button>
        </div>

        {activeTab === 'records' && (
          <div className="space-y-4">
            {patrolRecords.map(record => {
              const cfg = statusConfig[record.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={record.id}
                  className="p-5 rounded-xl bg-mine-950/60 border border-mine-800 hover:border-mine-600/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-lg bg-mine-800/60 flex items-center justify-center ${cfg.color}`}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{record.location}</h4>
                          <StatusBadge status={record.status === 'normal' ? 'normal' : record.status === 'rectified' ? 'normal' : 'warning'} text={cfg.label} />
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {record.inspector}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {record.patrolTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {record.location}
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="text-xs text-slate-500 mb-1">检查项目</div>
                          <div className="flex flex-wrap gap-1.5">
                            {record.checkItems.map(item => (
                              <span key={item} className="px-2 py-0.5 rounded text-[11px] bg-mine-800/60 text-slate-300">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-3 p-3 rounded-lg bg-mine-900/60">
                          <div className="text-xs text-slate-500 mb-1">巡查情况</div>
                          <p className={`text-sm ${record.status === 'issue_found' ? 'text-amber-300' : 'text-slate-300'}`}>
                            {record.issues}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'flood' && (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>设施编号</th>
                  <th>设施名称</th>
                  <th>状态</th>
                  <th>最近检查日期</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {floodInspections.map(item => (
                  <tr key={item.id} className="hover:bg-mine-800/30">
                    <td className="font-mono text-mine-300">{item.id}</td>
                    <td className="font-medium text-white">{item.name}</td>
                    <td><StatusBadge status={item.status as any} /></td>
                    <td className="text-slate-400">{item.lastCheck}</td>
                    <td className="text-slate-300">{item.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card-glow">
        <h3 className="section-title">隐患整改跟踪</h3>
        <div className="space-y-3">
          {patrolRecords.filter(r => r.status !== 'normal').map(record => {
            const cfg = statusConfig[record.status];
            return (
              <div key={record.id} className="p-4 rounded-lg bg-mine-950/60 border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={18} className="text-amber-400" />
                    <span className="text-sm font-medium text-white">{record.location}</span>
                  </div>
                  <StatusBadge status={record.status === 'rectified' ? 'normal' : 'warning'} text={cfg.label} />
                </div>
                <p className="text-sm text-slate-300 mt-2">{record.issues}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span>巡查人：{record.inspector}</span>
                  <span>{record.patrolTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Patrol;
