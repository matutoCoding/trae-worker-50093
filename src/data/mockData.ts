import type {
  ReservoirInfo,
  MonitoringPoint,
  PatrolRecord,
  Alert,
  Camera,
  EmergencyResource,
  DrillRecord,
  HistoryData
} from '@/types';

const generateHistory = (base: number, variance: number, count = 24): HistoryData[] => {
  const data: HistoryData[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600 * 1000);
    data.push({
      time: `${time.getHours().toString().padStart(2, '0')}:00`,
      value: Number((base + (Math.random() - 0.5) * variance).toFixed(2))
    });
  }
  return data;
};

export const reservoirInfo: ReservoirInfo = {
  id: '1',
  name: '大青山尾矿库',
  location: '云南省昆明市东川区大青山矿区',
  buildDate: '2015-06-01',
  designCompany: '中国瑞林工程技术股份有限公司',
  totalCapacity: 1580,
  currentStorage: 986.5,
  damHeight: 86.5,
  damType: '上游式尾矿堆积坝',
  floodStandard: '500年一遇',
  floodControlCapacity: 320,
  status: 'normal',
  safetyLevel: 'normal',
  coordinate: { lng: 103.123456, lat: 26.123456 },
  responsiblePerson: '张建国',
  phone: '138****8888'
};

export const capacityCurve: { waterLevel: number; capacity: number }[] = [
  { waterLevel: 1420, capacity: 0 },
  { waterLevel: 1440, capacity: 120 },
  { waterLevel: 1460, capacity: 350 },
  { waterLevel: 1480, capacity: 680 },
  { waterLevel: 1500, capacity: 1080 },
  { waterLevel: 1520, capacity: 1580 }
];

export const damDisplacementPoints: MonitoringPoint[] = [
  {
    id: 'DP-001', name: '坝顶A01', section: '主坝断面0+200', type: 'displacement',
    value: 12.5, unit: 'mm', threshold: { warning: 30, danger: 50 }, status: 'normal',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(12, 4)
  },
  {
    id: 'DP-002', name: '坝顶A02', section: '主坝断面0+200', type: 'displacement',
    value: 15.8, unit: 'mm', threshold: { warning: 30, danger: 50 }, status: 'normal',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(15, 5)
  },
  {
    id: 'DP-003', name: '坝坡B01', section: '主坝断面0+400', type: 'displacement',
    value: 35.2, unit: 'mm', threshold: { warning: 30, danger: 50 }, status: 'warning',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(33, 6)
  },
  {
    id: 'DP-004', name: '坝坡B02', section: '主坝断面0+400', type: 'displacement',
    value: 22.1, unit: 'mm', threshold: { warning: 30, danger: 50 }, status: 'normal',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(22, 4)
  }
];

export const damSettlementPoints: MonitoringPoint[] = [
  {
    id: 'DS-001', name: '沉降C01', section: '主坝断面0+200', type: 'settlement',
    value: 28.6, unit: 'mm', threshold: { warning: 50, danger: 80 }, status: 'normal',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(28, 6)
  },
  {
    id: 'DS-002', name: '沉降C02', section: '主坝断面0+200', type: 'settlement',
    value: 42.3, unit: 'mm', threshold: { warning: 50, danger: 80 }, status: 'normal',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(42, 8)
  },
  {
    id: 'DS-003', name: '沉降C03', section: '主坝断面0+400', type: 'settlement',
    value: 65.8, unit: 'mm', threshold: { warning: 50, danger: 80 }, status: 'warning',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(62, 10)
  }
];

export const phreaticPoints: MonitoringPoint[] = [
  {
    id: 'PH-001', name: '浸润线P1', section: '主坝断面0+200', type: 'phreatic',
    value: 1496.8, unit: 'm', threshold: { warning: 1500, danger: 1505 }, status: 'normal',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(1496, 2)
  },
  {
    id: 'PH-002', name: '浸润线P2', section: '主坝断面0+200', type: 'phreatic',
    value: 1498.2, unit: 'm', threshold: { warning: 1500, danger: 1505 }, status: 'normal',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(1498, 2)
  },
  {
    id: 'PH-003', name: '浸润线P3', section: '主坝断面0+400', type: 'phreatic',
    value: 1501.5, unit: 'm', threshold: { warning: 1500, danger: 1505 }, status: 'warning',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(1501, 2)
  }
];

export const seepagePoints: MonitoringPoint[] = [
  {
    id: 'SP-001', name: '渗流量S1', section: '坝脚', type: 'seepage',
    value: 12.8, unit: 'L/s', threshold: { warning: 25, danger: 40 }, status: 'normal',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(13, 4)
  },
  {
    id: 'SP-002', name: '渗流量S2', section: '坝脚', type: 'seepage',
    value: 8.5, unit: 'L/s', threshold: { warning: 25, danger: 40 }, status: 'normal',
    timestamp: '2026-06-17 08:00:00', history: generateHistory(8, 3)
  }
];

export const rainfallData: MonitoringPoint = {
  id: 'RF-001', name: '库区降雨量', section: '库区', type: 'rainfall',
  value: 8.6, unit: 'mm/h', threshold: { warning: 30, danger: 50 }, status: 'normal',
  timestamp: '2026-06-17 08:00:00', history: generateHistory(5, 6)
};

export const beachLengthData: MonitoringPoint = {
  id: 'BL-001', name: '干滩长度', section: '库区', type: 'beach',
  value: 156, unit: 'm', threshold: { warning: 100, danger: 60 }, status: 'normal',
  timestamp: '2026-06-17 08:00:00', history: generateHistory(150, 20)
};

export const patrolRecords: PatrolRecord[] = [
  {
    id: 'PTR-001', inspector: '李安全', patrolTime: '2026-06-17 07:30:00',
    location: '主坝坝顶', checkItems: ['坝面外观', '排水设施', '沉降观测'],
    issues: '无异常', photos: [], status: 'normal'
  },
  {
    id: 'PTR-002', inspector: '王巡查', patrolTime: '2026-06-17 06:00:00',
    location: '排洪隧洞进口', checkItems: ['隧洞结构', '拦污栅', '启闭设备'],
    issues: '拦污栅有少量杂物堆积，已清理', photos: [], status: 'rectified'
  },
  {
    id: 'PTR-003', inspector: '张监测', patrolTime: '2026-06-16 18:00:00',
    location: '坝脚渗流区', checkItems: ['渗流量', '渗流水质', '坝脚稳定'],
    issues: '渗流量略有上升，建议加强监测', photos: [], status: 'issue_found'
  },
  {
    id: 'PTR-004', inspector: '李安全', patrolTime: '2026-06-16 14:00:00',
    location: '副坝', checkItems: ['坝面', '排水沟', '护坡'],
    issues: '无异常', photos: [], status: 'normal'
  }
];

export const floodInspectionItems = [
  { id: 'F1', name: '溢洪道', status: 'normal', lastCheck: '2026-06-16', remark: '通畅无堵塞' },
  { id: 'F2', name: '排洪隧洞', status: 'normal', lastCheck: '2026-06-17', remark: '结构完好' },
  { id: 'F3', name: '拦水坝', status: 'normal', lastCheck: '2026-06-15', remark: '运行正常' },
  { id: 'F4', name: '截水沟', status: 'warning', lastCheck: '2026-06-14', remark: '局部有淤积需清理' }
];

export const alerts: Alert[] = [
  {
    id: 'ALT-001', type: 'dam', level: 'warning',
    title: '坝坡B01水平位移接近预警值',
    description: '主坝断面0+400处坝坡B01监测点水平位移达35.2mm，超过黄色预警阈值30mm，请关注。',
    time: '2026-06-17 07:45:00', status: 'processing', handler: '张工程师'
  },
  {
    id: 'ALT-002', type: 'seepage', level: 'warning',
    title: '浸润线P3水位偏高',
    description: '主坝断面0+400处P3测压管水位1501.5m，超过预警值1500m，持续关注。',
    time: '2026-06-17 06:30:00', status: 'processing', handler: '李工程师'
  },
  {
    id: 'ALT-003', type: 'patrol', level: 'info',
    title: '巡查发现问题待复核',
    description: '坝脚渗流区巡查发现渗流量略有上升，需技术部门复核。',
    time: '2026-06-16 18:30:00', status: 'pending'
  },
  {
    id: 'ALT-004', type: 'dam', level: 'info',
    title: '沉降C03累计沉降偏大',
    description: '主坝断面0+400沉降C03累计沉降65.8mm，接近预警值，需加强观测频率。',
    time: '2026-06-16 10:00:00', status: 'resolved', handler: '王工程师'
  }
];

export const cameras: Camera[] = [
  { id: 'CAM-001', name: '主坝全景', location: '主坝坝顶', status: 'online', thumbnail: 'dam1' },
  { id: 'CAM-002', name: '坝脚渗流区', location: '主坝坝脚', status: 'online', thumbnail: 'dam2' },
  { id: 'CAM-003', name: '溢洪道', location: '溢洪道进口', status: 'online', thumbnail: 'spillway' },
  { id: 'CAM-004', name: '排洪隧洞', location: '隧洞出口', status: 'online', thumbnail: 'tunnel' },
  { id: 'CAM-005', name: '库区全景', location: '库区北侧', status: 'online', thumbnail: 'reservoir' },
  { id: 'CAM-006', name: '副坝', location: '副坝', status: 'offline', thumbnail: 'subdam' },
  { id: 'CAM-007', name: '尾矿排放口', location: '库区东岸', status: 'online', thumbnail: 'discharge' },
  { id: 'CAM-008', name: '办公楼', location: '厂区办公楼', status: 'online', thumbnail: 'office' }
];

export const emergencyResources: EmergencyResource[] = [
  { id: 'ER-001', name: '编织袋', type: 'material', quantity: 5000, unit: '条', location: '应急物资仓库', contact: '赵主任 138****1111' },
  { id: 'ER-002', name: '砂石料', type: 'material', quantity: 500, unit: 'm³', location: '料场', contact: '赵主任 138****1111' },
  { id: 'ER-003', name: '挖掘机', type: 'equipment', quantity: 3, unit: '台', location: '设备停放场', contact: '钱队长 138****2222' },
  { id: 'ER-004', name: '推土机', type: 'equipment', quantity: 2, unit: '台', location: '设备停放场', contact: '钱队长 138****2222' },
  { id: 'ER-005', name: '应急救援队伍', type: 'personnel', quantity: 30, unit: '人', location: '矿区', contact: '孙队长 138****3333' },
  { id: 'ER-006', name: '医疗救护组', type: 'personnel', quantity: 8, unit: '人', location: '矿区医院', contact: '李院长 138****4444' }
];

export const drillRecords: DrillRecord[] = [
  {
    id: 'DR-001', name: '2026年上半年溃坝应急演练',
    date: '2026-05-15', participants: ['应急救援队', '生产部', '安全部', '周边村民'],
    duration: '3小时', result: '演练科目全部完成', evaluation: 'good'
  },
  {
    id: 'DR-002', name: '2025年下半年应急演练',
    date: '2025-11-20', participants: ['应急救援队', '安全部'],
    duration: '2.5小时', result: '成功完成', evaluation: 'excellent'
  }
];

export const dailyRainfallStats = [
  { date: '06-11', value: 2.5 },
  { date: '06-12', value: 0 },
  { date: '06-13', value: 5.8 },
  { date: '06-14', value: 12.3 },
  { date: '06-15', value: 18.6 },
  { date: '06-16', value: 8.2 },
  { date: '06-17', value: 8.6 }
];
