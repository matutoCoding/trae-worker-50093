import { create } from 'zustand';
import type {
  ReservoirInfo,
  MonitoringPoint,
  PatrolRecord,
  Alert,
  Camera,
  EmergencyResource,
  DrillRecord,
  MonitoringRecord,
  StatusLevel
} from '@/types';
import {
  reservoirInfo,
  damDisplacementPoints,
  damSettlementPoints,
  phreaticPoints,
  seepagePoints,
  rainfallData,
  beachLengthData,
  patrolRecords,
  alerts,
  cameras,
  emergencyResources,
  drillRecords,
  floodInspectionItems,
  capacityCurve,
  dailyRainfallStats
} from '@/data/mockData';

const STORAGE_KEY = 'mine-monitor-store-v1';

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return defaultValue;
};

const saveToStorage = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

const nowStr = () => new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');

const nowStrFull = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const calcStatus = (value: number, threshold: { warning: number; danger: number }, reverse = false): StatusLevel => {
  if (reverse) {
    if (value <= threshold.danger) return 'danger';
    if (value <= threshold.warning) return 'warning';
    return 'normal';
  }
  if (value >= threshold.danger) return 'danger';
  if (value >= threshold.warning) return 'warning';
  return 'normal';
};

interface PersistedState {
  patrolRecords: PatrolRecord[];
  alerts: Alert[];
  damDisplacement: MonitoringPoint[];
  damSettlement: MonitoringPoint[];
  phreaticLines: MonitoringPoint[];
  seepageFlows: MonitoringPoint[];
  rainfall: MonitoringPoint;
  beachLength: MonitoringPoint;
  dailyRainfall: { date: string; value: number }[];
  monitoringRecords: MonitoringRecord[];
}

const defaultPersisted: PersistedState = {
  patrolRecords: patrolRecords.map(r => ({ logs: [], ...r } as any)),
  alerts: alerts.map(a => ({ ...a, logs: [] })),
  damDisplacement: damDisplacementPoints,
  damSettlement: damSettlementPoints,
  phreaticLines: phreaticPoints,
  seepageFlows: seepagePoints,
  rainfall: rainfallData,
  beachLength: beachLengthData,
  dailyRainfall: dailyRainfallStats,
  monitoringRecords: []
};
const loaded = loadFromStorage<Partial<PersistedState>>(STORAGE_KEY, {});
const persisted: PersistedState = {
  ...defaultPersisted,
  ...loaded,
  patrolRecords: loaded.patrolRecords ?? defaultPersisted.patrolRecords,
  alerts: loaded.alerts ?? defaultPersisted.alerts,
  damDisplacement: loaded.damDisplacement ?? defaultPersisted.damDisplacement,
  damSettlement: loaded.damSettlement ?? defaultPersisted.damSettlement,
  phreaticLines: loaded.phreaticLines ?? defaultPersisted.phreaticLines,
  seepageFlows: loaded.seepageFlows ?? defaultPersisted.seepageFlows,
  rainfall: loaded.rainfall ?? defaultPersisted.rainfall,
  beachLength: loaded.beachLength ?? defaultPersisted.beachLength,
  dailyRainfall: loaded.dailyRainfall ?? defaultPersisted.dailyRainfall,
  monitoringRecords: loaded.monitoringRecords ?? defaultPersisted.monitoringRecords
};

interface AppState {
  reservoir: ReservoirInfo;
  capacityCurve: { waterLevel: number; capacity: number }[];
  damDisplacement: MonitoringPoint[];
  damSettlement: MonitoringPoint[];
  phreaticLines: MonitoringPoint[];
  seepageFlows: MonitoringPoint[];
  rainfall: MonitoringPoint;
  beachLength: MonitoringPoint;
  patrolRecords: PatrolRecord[];
  floodInspections: typeof floodInspectionItems;
  alerts: Alert[];
  cameras: Camera[];
  emergencyResources: EmergencyResource[];
  drillRecords: DrillRecord[];
  dailyRainfall: { date: string; value: number }[];
  monitoringRecords: MonitoringRecord[];
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  addPatrolRecord: (record: Omit<PatrolRecord, 'id' | 'patrolTime' | 'status'>) => void;
  claimAlert: (id: string, handler: string) => void;
  processAlert: (id: string, opinion: string) => void;
  resolveAlert: (id: string, result: string) => void;
  recordMonitoring: (params: {
    type: 'rainfall' | 'beach' | 'phreatic' | 'seepage';
    pointId?: string;
    pointName?: string;
    value: number;
    recorder: string;
  }) => void;
}

const persist = (state: Partial<PersistedState>) => {
  const current = loadFromStorage<PersistedState>(STORAGE_KEY, {} as any);
  saveToStorage({ ...current, ...state });
};

export const useAppStore = create<AppState>((set, get) => ({
  reservoir: reservoirInfo,
  capacityCurve,
  damDisplacement: persisted.damDisplacement,
  damSettlement: persisted.damSettlement,
  phreaticLines: persisted.phreaticLines,
  seepageFlows: persisted.seepageFlows,
  rainfall: persisted.rainfall,
  beachLength: persisted.beachLength,
  patrolRecords: persisted.patrolRecords,
  floodInspections: floodInspectionItems,
  alerts: persisted.alerts,
  cameras,
  emergencyResources,
  drillRecords,
  dailyRainfall: persisted.dailyRainfall,
  monitoringRecords: persisted.monitoringRecords,
  sidebarCollapsed: false,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  addPatrolRecord: (record) => {
    const newRecord: PatrolRecord = {
      id: 'PTR-' + Date.now(),
      patrolTime: nowStrFull(),
      status: (record.issues && record.issues !== '无异常' && record.issues.length > 0) ? 'issue_found' : 'normal',
      ...record
    };
    const patrolRecords = [newRecord, ...get().patrolRecords];
    set({ patrolRecords });
    persist({ patrolRecords });
  },

  claimAlert: (id, handler) => {
    const time = nowStrFull();
    const alerts = get().alerts.map(a =>
      a.id === id ? {
        ...a,
        status: 'processing' as const,
        handler,
        processTime: time,
        logs: [
          ...(a.logs || []),
          { time, action: '认领处理', operator: handler }
        ]
      } : a
    );
    set({ alerts });
    persist({ alerts });
  },

  processAlert: (id, opinion) => {
    const time = nowStrFull();
    const alerts = get().alerts.map(a =>
      a.id === id ? {
        ...a,
        processOpinion: opinion,
        logs: [
          ...(a.logs || []),
          { time, action: '填写处理意见', operator: a.handler || '处理人', comment: opinion }
        ]
      } : a
    );
    set({ alerts });
    persist({ alerts });
  },

  resolveAlert: (id, result) => {
    const time = nowStrFull();
    const alerts = get().alerts.map(a =>
      a.id === id ? {
        ...a,
        status: 'resolved' as const,
        resolveTime: time,
        result,
        logs: [
          ...(a.logs || []),
          { time, action: '处理完成', operator: a.handler || '处理人', comment: result }
        ]
      } : a
    );
    set({ alerts });
    persist({ alerts });
  },

  recordMonitoring: ({ type, pointId, pointName, value, recorder }) => {
    const time = nowStrFull();
    const record: MonitoringRecord = {
      id: 'MR-' + Date.now(),
      type,
      value,
      pointName: pointName || pointId || type,
      timestamp: time,
      recorder
    };
    const monitoringRecords = [record, ...get().monitoringRecords];
    const hour = new Date().getHours();
    const timeKey = `${String(hour).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
    const historyPush = (arr: MonitoringPoint['history']) => {
      const copy = [...arr];
      copy.shift();
      copy.push({ time: timeKey, value });
      return copy;
    };

    const s = get();
    let damDisplacement = s.damDisplacement;
    let damSettlement = s.damSettlement;
    let phreaticLines = s.phreaticLines;
    let seepageFlows = s.seepageFlows;
    let rainfall = s.rainfall;
    let beachLength = s.beachLength;
    let dailyRainfall = s.dailyRainfall;

    if (type === 'rainfall') {
      rainfall = {
        ...rainfall,
        value,
        timestamp: time,
        status: calcStatus(value, rainfall.threshold),
        history: historyPush(rainfall.history)
      };
      const todayKey = `${String(new Date().getMonth()+1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')}`;
      dailyRainfall = dailyRainfall.map(d => d.date === todayKey ? { ...d, value: d.value + value } : d);
      if (!dailyRainfall.find(d => d.date === todayKey)) {
        dailyRainfall = [...dailyRainfall.slice(1), { date: todayKey, value }];
      }
    } else if (type === 'beach') {
      beachLength = {
        ...beachLength,
        value,
        timestamp: time,
        status: calcStatus(value, beachLength.threshold, true),
        history: historyPush(beachLength.history)
      };
    } else if (type === 'phreatic' && pointId) {
      phreaticLines = phreaticLines.map(p =>
        p.id === pointId ? {
          ...p,
          value,
          timestamp: time,
          status: calcStatus(value, p.threshold),
          history: historyPush(p.history)
        } : p
      );
    } else if (type === 'seepage' && pointId) {
      seepageFlows = seepageFlows.map(p =>
        p.id === pointId ? {
          ...p,
          value,
          timestamp: time,
          status: calcStatus(value, p.threshold),
          history: historyPush(p.history)
        } : p
      );
    }

    set({
      damDisplacement, damSettlement, phreaticLines, seepageFlows,
      rainfall, beachLength, dailyRainfall, monitoringRecords
    });
    persist({
      damDisplacement, damSettlement, phreaticLines, seepageFlows,
      rainfall, beachLength, dailyRainfall, monitoringRecords
    });
  }
}));
