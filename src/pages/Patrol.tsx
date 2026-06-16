import React, { useState } from 'react';
import { useAppStore } from '@/store/useStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  ClipboardCheck, MapPin, Clock, User, AlertCircle, CheckCircle, Wrench, Camera as CameraIcon, FileText,
  Plus, X, Upload, CheckSquare, Square
} from 'lucide-react';

const defaultCheckItems = [
  '坝面外观', '坝体裂缝', '排水设施', '沉降观测', '渗流情况', '护坡',
  '排水沟', '防浪墙', '排洪设施', '安全标识'
];

const Patrol: React.FC = () => {
  const { patrolRecords, floodInspections, addPatrolRecord } = useAppStore();
  const [activeTab, setActiveTab] = useState<'records' | 'flood'>('records');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    inspector: '',
    location: '',
    checkItems: [] as string[],
    issues: '',
    photos: [] as string[],
    photoDesc: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const statusConfig = {
    normal: { label: '正常', icon: CheckCircle, color: 'text-emerald-400' },
    issue_found: { label: '发现问题', icon: AlertCircle, color: 'text-amber-400' },
    rectified: { label: '已整改', icon: CheckCircle, color: 'text-cyan-400' }
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = patrolRecords.filter(r => r.patrolTime.startsWith(today)).length;
  const issueCount = patrolRecords.filter(r => r.status === 'issue_found').length;

  const toggleItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      checkItems: prev.checkItems.includes(item)
        ? prev.checkItems.filter(i => i !== item)
        : [...prev.checkItems, item]
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, reader.result as string].slice(0, 6)
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = () => {
    if (!formData.inspector || !formData.location) {
      alert('请填写巡查人和巡查地点');
      return;
    }
    if (formData.checkItems.length === 0) {
      alert('请至少选择一项检查项目');
      return;
    }
    setSubmitting(true);
    addPatrolRecord({
      inspector: formData.inspector,
      location: formData.location,
      checkItems: formData.checkItems,
      issues: formData.issues || '无异常',
      photos: formData.photos,
      remark: formData.photoDesc || undefined
    });
    setTimeout(() => {
      setSubmitting(false);
      setShowForm(false);
      setFormData({ inspector: '', location: '', checkItems: [], issues: '', photos: [], photoDesc: '' });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">巡查管理</h2>
          <p className="text-sm text-slate-400 mt-1">人工巡查打卡与排洪设施检查记录</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 rounded-lg bg-mine-600 hover:bg-mine-500 text-white text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-mine-600/20"
        >
          <Plus size={18} />
          现场巡查打卡
        </button>
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

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-mine-900 border border-mine-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-mine-900 border-b border-mine-700 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ClipboardCheck size={20} className="text-mine-400" />
                现场巡查打卡
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-mine-800 text-slate-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">巡查人 <span className="text-red-400">*</span></label>
                  <input
                    value={formData.inspector}
                    onChange={e => setFormData(p => ({ ...p, inspector: e.target.value }))}
                    placeholder="请输入姓名"
                    className="w-full px-3 py-2.5 rounded-lg bg-mine-950 border border-mine-700 text-white placeholder-slate-600 outline-none focus:border-mine-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">巡查地点 <span className="text-red-400">*</span></label>
                  <input
                    value={formData.location}
                    onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                    placeholder="主坝坝顶/排洪隧洞/坝脚..."
                    className="w-full px-3 py-2.5 rounded-lg bg-mine-950 border border-mine-700 text-white placeholder-slate-600 outline-none focus:border-mine-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">检查项目 <span className="text-red-400">*</span>（可多选）</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {defaultCheckItems.map(item => {
                    const checked = formData.checkItems.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleItem(item)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg text-left text-sm transition-all ${
                          checked
                            ? 'bg-mine-600/30 border border-mine-500 text-white'
                            : 'bg-mine-950 border border-mine-800 text-slate-300 hover:border-mine-600'
                        }`}
                      >
                        {checked
                          ? <CheckSquare size={16} className="text-mine-400 flex-shrink-0" />
                          : <Square size={16} className="text-slate-600 flex-shrink-0" />
                        }
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">发现问题描述</label>
                <textarea
                  value={formData.issues}
                  onChange={e => setFormData(p => ({ ...p, issues: e.target.value }))}
                  placeholder="无异常可留空"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-mine-950 border border-mine-700 text-white placeholder-slate-600 outline-none focus:border-mine-500 transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">现场照片（最多6张）</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                  {formData.photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-mine-950 border border-mine-700 group">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 p-1 rounded bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {formData.photos.length < 6 && (
                    <label className="aspect-square rounded-lg bg-mine-950 border-2 border-dashed border-mine-700 hover:border-mine-500 flex flex-col items-center justify-center cursor-pointer transition-all text-slate-500 hover:text-mine-400">
                      <Upload size={20} />
                      <span className="text-[10px] mt-1">上传</span>
                      <input type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload} />
                    </label>
                  )}
                </div>
                <input
                  value={formData.photoDesc}
                  onChange={e => setFormData(p => ({ ...p, photoDesc: e.target.value }))}
                  placeholder="照片说明（可选）"
                  className="w-full px-3 py-2 rounded-lg bg-mine-950 border border-mine-700 text-white placeholder-slate-600 outline-none focus:border-mine-500 transition-all text-sm"
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-mine-900 border-t border-mine-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-lg bg-mine-800 hover:bg-mine-700 text-white text-sm transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2.5 rounded-lg bg-mine-600 hover:bg-mine-500 disabled:opacity-60 text-white text-sm font-medium transition-all flex items-center gap-2"
              >
                {submitting && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
                提交打卡
              </button>
            </div>
          </div>
        </div>
      )}

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
            {patrolRecords.length === 0 && (
              <div className="py-16 text-center text-slate-500">
                <ClipboardCheck size={48} className="mx-auto mb-3 opacity-40" />
                <p>暂无巡查记录，点击右上角"现场巡查打卡"开始</p>
              </div>
            )}
            {patrolRecords.map(record => {
              const cfg = statusConfig[record.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={record.id}
                  className="p-5 rounded-xl bg-mine-950/60 border border-mine-800 hover:border-mine-600/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-11 h-11 rounded-lg bg-mine-800/60 flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                        <Icon size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-white">{record.location}</h4>
                          <StatusBadge status={record.status === 'normal' ? 'normal' : record.status === 'rectified' ? 'normal' : 'warning'} text={cfg.label} />
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
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
                          <div className="text-xs text-slate-500 mb-1.5">检查项目</div>
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
                        {record.photos && record.photos.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-slate-500 mb-1.5">现场照片 ({record.photos.length}张)</div>
                            <div className="flex flex-wrap gap-2">
                              {record.photos.map((p, i) => (
                                <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-mine-700">
                                  <img src={p} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {record.remark && (
                          <div className="mt-2 text-xs text-slate-500">说明：{record.remark}</div>
                        )}
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
          {patrolRecords.filter(r => r.status !== 'normal').length === 0 && (
            <div className="py-10 text-center text-slate-500 text-sm">暂无待处理隐患</div>
          )}
          {patrolRecords.filter(r => r.status !== 'normal').map(record => {
            const cfg = statusConfig[record.status];
            return (
              <div key={record.id} className="p-4 rounded-lg bg-mine-950/60 border border-amber-500/30">
                <div className="flex items-center justify-between flex-wrap gap-2">
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
