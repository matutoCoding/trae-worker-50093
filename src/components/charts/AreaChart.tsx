import React from 'react';
import {
  AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface AreaChartProps {
  data: Array<Record<string, any>>;
  dataKey?: string;
  color?: string;
  height?: number;
  xKey?: string;
}

export const AreaChartComponent: React.FC<AreaChartProps> = ({
  data,
  dataKey = 'value',
  color = '#3b82f6',
  height = 240,
  xKey = 'name'
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.3} />
        <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e3a8a' }} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e3a8a' }} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0c1a3a',
            border: '1px solid #1e3a8a',
            borderRadius: 8,
            color: '#e2e8f0',
            fontSize: 12,
          }}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill="url(#areaGradient)" />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};
