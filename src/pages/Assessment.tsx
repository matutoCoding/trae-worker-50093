import React, { useState } from 'react';
import { useAppStore } from '@/store/useStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AreaChartComponent } from '@/components/charts/AreaChart';
import { ShieldCheck, AlertTriangle, Shield, Clock, CheckCircle, Loader, AlertCircle, FileDown, User, MessageSquare, X } from 'lucide-react';
import type { AlertStatus } from '@/types';

const Assessment: React.FC = () => {
  const { alerts, reservoir, claimAlert, processAlert, resolveAlert } = useAppStore();
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showOpinionModal, setShowOpinionModal] = useState<string | null>(null);
  const [showResolveModal, setShowResolveModal] = useState<string | null>(null);
  const [opinionInput, setOpinionInput] = useState('');
  const [resultInput, setResultInput] = useState('');
  const [handlerInput, setHandlerInput] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const safetyLevelConfig = {
    normal: { label: '正常库', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
    sick: { label: '病库', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
    dangerous: { label: '险库', color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
    critical: { label: '危库', color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30' }
  };

  const levelCfg = safetyLevelConfig[reservoir.safetyLevel as keyof typeof safetyLevelConfig];

  const alertTypeLabels: Record<string, string> = {
    dam: '坝体监测',
    seepage: '渗流监测',
    rainfall: '降雨预警',
    patrol: '巡查发现'
  };

  const statusLabels: Record<AlertStatus, { label: string; icon: any; color: string }> = {
    pending: { label: '待处理', icon: AlertCircle, color: 'text-amber-400' },
    processing: { label: '处理中', icon: Loader, color: 'text-mine-300' },
    resolved: { label: '已处理', icon: CheckCircle, color: 'text-emerald-400' }
  };

  const filteredAlerts = filterLevel === 'all' ? alerts : alerts.filter(a => a.level === filterLevel);

  const pendingCount = alerts.filter(a => a.status === 'pending').length;
  const processingCount = alerts.filter(a => a.status === 'processing').length;
  const warningCount = alerts.filter(a => a.level === 'warning').length;
  const dangerCount = alerts.filter(a => a.level === 'danger').length;

  const riskMatrix = [
    { likelihood: '低', consequence: ['低', '中', '高', '很高'], levels: ['可接受', '可接受', '需关注', '需关注'] },
    { likelihood: '中', consequence: ['可接受', '需关注', '需关注', '不可接受'] },
    { likelihood: '高', consequence: ['需关注', '需关注', '不可接受', '不可接受'] },
    { likelihood: '很高', consequence: ['需关注', '不可接受', '不可接受', '不可接受'] }
  ];

  const riskColors: Record<string, string> = {
    '可接受': 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40',
    '需关注': 'bg-amber-500/30 text-amber-300 border-amber-500/40',
    '不可接受': 'bg-red-500/30 text-red-300 border-red-500/40'
  };

  const alertTrendData = [
    { name: '6-11', value: 2 },
    { name: '6-12', value: 1 },
    { name: '6-13', value: 3 },
    { name: '6-14', value: 2 },
    { name: '6-15', value: 4 },
    { name: '6-16', value: 3 },
    { name: '6-17', value: 4 }
  ];

  const handleClaim = (id: string) => {
    const name = handlerInput.trim() || '管理员';
    claimAlert(id, name);
    setHandlerInput('');
  };

  const handleSubmitOpinion = (id: string) => {
    if (!opinionInput.trim()) return;
    processAlert(id, opinionInput.trim());
    setOpinionInput('');
    setShowOpinionModal(null);
  };

  const handleSubmitResolve = (id: string) => {
    if (!resultInput.trim()) return;
    resolveAlert(id, resultInput.trim());
    setResultInput('');
    setShowResolveModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">安全评估</h2>
          <p className="text-sm text-slate-400 mt-1">安全度等级评估与监测预警管理</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-mine-600 hover:bg-mine-500 text-white text-sm font-medium flex items-center gap-2 transition-all">
          <FileDown size={16} />
          导出评估报告
        </button>
      </div>

      <div className={`card-glow ${levelCfg.border}`}>
        <div className="flex items-center gap-6">
          <div className={`w-24 h-24 rounded-2xl ${levelCfg.bg} border ${levelCfg.border} flex items-center justify-center flex-shrink-0`}>
            <ShieldCheck size={48} className={levelCfg.color} />
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-400 mb-1">尾矿库安全度等级评估结果</div>
            <div className={`text-3xl font-bold ${levelCfg.color} mb-2`}>{levelCfg.label}</div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock size={12} />
              评估时间：2026-06-15 · 评估依据：《尾矿库安全技术规程》AQ2006-2005
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: '坝体稳定', value: '达标', status: 'normal' },
              { label: '防洪能力', value: '达标', status: 'normal' },
              { label: '渗流控制', value: '关注', status: 'warning' },
              { label: '安全管理', value: '达标', status: 'normal' }
            ].map(item => (
              <div key={item.label} className="text-center p-3 rounded-xl bg-mine-950/60 border border-mine-800">
                <div className="text-xs text-slate-500">{item.label}</div>
                <StatusBadge status={item.status as any} text={item.value} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-400">待处理预警</div>
              <div className="text-2xl font-bold text-amber-400 mt-0.5">{pendingCount}</div>
            </div>
          </div>
        </div>
        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-mine-500/15 flex items-center justify-center text-mine-300">
              <Loader size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-400">处理中</div>
              <div className="text-2xl font-bold text-mine-300 mt-0.5">{processingCount}</div>
            </div>
          </div>
        </div>
        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-400">黄色预警</div>
              <div className="text-2xl font-bold text-amber-400 mt-0.5">{warningCount}</div>
            </div>
          </div>
        </div>
        <div className="card-glow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400">
              <Shield size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-400">红色预警</div>
              <div className="text-2xl font-bold text-red-400 mt-0.5">{dangerCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-glow lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">监测预警信息</h3>
            <div className="flex items-center gap-1 bg-mine-900 rounded-lg border border-mine-800 p-0.5">
              {[
                { key: 'all', label: '全部' },
                { key: 'danger', label: '红色' },
                { key: 'warning', label: '黄色' },
                { key: 'info', label: '蓝色' }
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setFilterLevel(item.key)}
                  className={`px-3 py-1 rounded-md text-xs transition-all ${
                    filterLevel === item.key ? 'bg-mine-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filteredAlerts.map(alert => {
              const statusCfg = statusLabels[alert.status];
              const StatusIcon = statusCfg.icon;
              const showLog = expandedLog === alert.id;
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl bg-mine-950/60 border transition-all hover:border-mine-600/50 ${
                    alert.level === 'danger' ? 'border-red-500/30' : alert.level === 'warning' ? 'border-amber-500/30' : 'border-mine-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={alert.level} />
                        <span className="px-2 py-0.5 rounded text-[11px] bg-mine-800 text-slate-300">
                          {alertTypeLabels[alert.type]}
                        </span>
                        <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                      </div>
                      <p className="text-sm text-slate-400 mt-2">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          触发时间: {alert.time}
                        </span>
                        {alert.handler && (
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            处理人：{alert.handler}
                          </span>
                        )}
                        {alert.processTime && <span>认领时间: {alert.processTime}</span>}
                      </div>

                      {alert.processOpinion && (
                        <div className="mt-3 p-3 rounded-lg bg-mine-900/60 border border-mine-800">
                          <div className="flex items-center gap-1 text-xs text-mine-300 mb-1">
                            <MessageSquare size={12} />
                            处理意见
                          </div>
                          <div className="text-sm text-slate-300">{alert.processOpinion}</div>
                        </div>
                      )}

                      {alert.result && alert.resolveTime && (
                        <div className="mt-2 p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/30">
                          <div className="flex items-center gap-1 text-xs text-emerald-400 mb-1">
                            <CheckCircle size={12} />
                            处理结果 · {alert.resolveTime}
                          </div>
                          <div className="text-sm text-slate-200">{alert.result}</div>
                        </div>
                      )}

                      {alert.logs && alert.logs.length > 0 && (
                        <div className="mt-3">
                          <button
                            onClick={() => setExpandedLog(showLog ? null : alert.id)}
                            className="text-xs text-mine-300 hover:text-mine-200 flex items-center gap-1"
                          >
                            {showLog ? '收起' : '查看'}处理日志 ({alert.logs.length})
                          </button>
                          {showLog && (
                            <div className="mt-2 space-y-2 pl-3 border-l-2 border-mine-700">
                              {alert.logs.map((log, i) => (
                                <div key={i} className="text-xs">
                                  <div className="text-slate-400">
                                    <span className="text-mine-300 font-medium">{log.time}</span>
                                    {' · '}
                                    <span className="text-slate-300">{log.operator}</span>
                                    {' · '}
                                    <span>{log.action}</span>
                                  </div>
                                  {log.comment && <div className="text-slate-500 mt-0.5 ml-2">{log.comment}</div>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`flex items-center gap-1 text-xs ${statusCfg.color}`}>
                        <StatusIcon size={14} className={alert.status === 'processing' ? 'animate-spin' : ''} />
                        {statusCfg.label}
                      </span>
                      {alert.status === 'pending' && (
                        <div className="flex flex-col items-end gap-2">
                          <input
                            type="text"
                            value={handlerInput}
                            onChange={e => setHandlerInput(e.target.value)}
                            placeholder="处理人姓名"
                            className="px-2 py-1 rounded text-xs bg-mine-900 border border-mine-700 text-white placeholder-slate-600 outline-none focus:border-mine-500 w-28"
                          />
                          <button
                            onClick={() => handleClaim(alert.id)}
                            className="px-3 py-1 rounded-md text-xs bg-mine-600 hover:bg-mine-500 text-white transition-all"
                          >
                            认领处理
                          </button>
                        </div>
                      )}
                      {alert.status === 'processing' && (
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => setShowOpinionModal(alert.id)}
                            className="px-3 py-1 rounded-md text-xs bg-amber-600 hover:bg-amber-500 text-white transition-all"
                          >
                            {alert.processOpinion ? '修改处理意见' : '填写处理意见'}
                          </button>
                          <button
                            onClick={() => setShowResolveModal(alert.id)}
                            className="px-3 py-1 rounded-md text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                          >
                            标记完成
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {showOpinionModal === alert.id && (
                    <div className="mt-4 p-4 rounded-xl bg-mine-900 border border-mine-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-white">填写处理意见</div>
                        <button onClick={() => { setShowOpinionModal(null); setOpinionInput(''); }} className="text-slate-500 hover:text-slate-300">
                          <X size={14} />
                        </button>
                      </div>
                      <textarea
                        value={opinionInput || alert.processOpinion || ''}
                        onChange={e => setOpinionInput(e.target.value)}
                        placeholder="请输入具体的处理措施和方案..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-mine-950 border border-mine-800 text-sm text-white placeholder-slate-600 outline-none focus:border-mine-500 resize-none"
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={() => { setShowOpinionModal(null); setOpinionInput(''); }}
                          className="px-3 py-1.5 rounded-md text-xs bg-mine-800 hover:bg-mine-700 text-slate-300 transition-all"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleSubmitOpinion(alert.id)}
                          disabled={!opinionInput.trim() && !alert.processOpinion}
                          className="px-3 py-1.5 rounded-md text-xs bg-amber-600 hover:bg-amber-500 text-white transition-all disabled:opacity-50"
                        >
                          提交意见
                        </button>
                      </div>
                    </div>
                  )}

                  {showResolveModal === alert.id && (
                    <div className="mt-4 p-4 rounded-xl bg-mine-900 border border-mine-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-white">确认处理完成</div>
                        <button onClick={() => { setShowResolveModal(null); setResultInput(''); }} className="text-slate-500 hover:text-slate-300">
                          <X size={14} />
                        </button>
                      </div>
                      <textarea
                        value={resultInput}
                        onChange={e => setResultInput(e.target.value)}
                        placeholder="请输入处理结果说明..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-mine-950 border border-mine-800 text-sm text-white placeholder-slate-600 outline-none focus:border-mine-500 resize-none"
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={() => { setShowResolveModal(null); setResultInput(''); }}
                          className="px-3 py-1.5 rounded-md text-xs bg-mine-800 hover:bg-mine-700 text-slate-300 transition-all"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleSubmitResolve(alert.id)}
                          disabled={!resultInput.trim()}
                          className="px-3 py-1.5 rounded-md text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50"
                        >
                          确认完成
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-glow">
            <h3 className="section-title">预警趋势 (近7日)</h3>
            <AreaChartComponent
              data={alertTrendData}
              color="#f59e0b"
              height={180}
            />
          </div>

          <div className="card-glow">
            <h3 className="section-title">风险矩阵</h3>
            <div className="text-xs text-slate-500 mb-3">后果严重程度 →</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="p-1.5 text-slate-500 font-normal"></th>
                    {['低', '中', '高', '很高'].map(c => (
                      <th key={c} className="p-1.5 text-slate-400 font-normal text-center">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {riskMatrix.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5 text-slate-400">
                        {idx === 0 && <div className="writing-mode-vertical">可能性↓</div>}
                        {row.likelihood}
                      </td>
                      {row.levels.map((level, lidx) => (
                        <td key={lidx} className="p-1">
                          <div className={`p-2 rounded text-center border ${riskColors[level]}`}>
                            {level}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/40" />
                可接受
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/40" />
                需关注
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/40" />
                不可接受
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
