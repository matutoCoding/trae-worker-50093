import { create } from 'zustand';
import type {
  ReservoirInfo,
  MonitoringPoint,
  PatrolRecord,
  Alert,
  Camera,
  EmergencyResource,
  DrillRecord
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
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  updateAlertStatus: (id: string, status: Alert['status'], handler?: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  reservoir: reservoirInfo,
  capacityCurve,
  damDisplacement: damDisplacementPoints,
  damSettlement: damSettlementPoints,
  phreaticLines: phreaticPoints,
  seepageFlows: seepagePoints,
  rainfall: rainfallData,
  beachLength: beachLengthData,
  patrolRecords,
  floodInspections: floodInspectionItems,
  alerts,
  cameras,
  emergencyResources,
  drillRecords,
  dailyRainfall: dailyRainfallStats,
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  updateAlertStatus: (id, status, handler) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, status, handler: handler || a.handler } : a
      )
    }))
}));
