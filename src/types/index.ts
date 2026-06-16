export type StatusLevel = 'normal' | 'warning' | 'danger';

export type AlertLevel = 'info' | 'warning' | 'danger';

export type AlertType = 'dam' | 'seepage' | 'rainfall' | 'patrol';

export type AlertStatus = 'pending' | 'processing' | 'resolved';

export type MonitoringType = 'displacement' | 'settlement' | 'phreatic' | 'seepage' | 'rainfall' | 'beach';

export interface ReservoirInfo {
  id: string;
  name: string;
  location: string;
  buildDate: string;
  designCompany: string;
  totalCapacity: number;
  currentStorage: number;
  damHeight: number;
  damType: string;
  floodStandard: string;
  floodControlCapacity: number;
  status: StatusLevel;
  safetyLevel: 'normal' | 'sick' | 'dangerous' | 'critical';
  coordinate: { lng: number; lat: number };
  responsiblePerson: string;
  phone: string;
}

export interface HistoryData {
  time: string;
  value: number;
}

export interface MonitoringPoint {
  id: string;
  name: string;
  section: string;
  type: MonitoringType;
  value: number;
  unit: string;
  threshold: { warning: number; danger: number };
  status: StatusLevel;
  timestamp: string;
  history: HistoryData[];
}

export interface PatrolRecord {
  id: string;
  inspector: string;
  patrolTime: string;
  location: string;
  checkItems: string[];
  issues: string;
  photos: string[];
  status: 'normal' | 'issue_found' | 'rectified';
  remark?: string;
}

export interface AlertProcessLog {
  time: string;
  action: string;
  operator: string;
  comment?: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  level: AlertLevel;
  title: string;
  description: string;
  time: string;
  status: AlertStatus;
  handler?: string;
  processTime?: string;
  resolveTime?: string;
  processOpinion?: string;
  result?: string;
  logs?: AlertProcessLog[];
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  thumbnail: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  type: 'material' | 'equipment' | 'personnel';
  quantity: number;
  unit: string;
  location: string;
  contact: string;
}

export interface DrillRecord {
  id: string;
  name: string;
  date: string;
  participants: string[];
  duration: string;
  result: string;
  evaluation: 'excellent' | 'good' | 'average' | 'poor';
}

export interface MonitoringRecord {
  id: string;
  type: 'rainfall' | 'beach' | 'phreatic' | 'seepage';
  value: number;
  pointName: string;
  timestamp: string;
  recorder: string;
}
