import React from 'react';
import {
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface LineChartProps {
  data: Array<Record<string, any>>;
  lines: { key: string; color: string; name: string }[];
  height?: number;
  yAxisLabel?: string;
  xKey?: string;
}

export const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  lines,
  height = 240,
  yAxisLabel,
  xKey = 'time'
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          {lines.map((line, idx) => (
            <linearGradient key={idx} id={`gradient-${line.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={line.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={line.color} stopOpacity={0} />
            </linearGradient>
          ))}
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
          labelStyle={{ color: '#e2e8f0' }}
        />
        {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />}
        {lines.map((line, idx) => (
          <Line
            key={idx}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
            name={line.name}
            activeDot={{ r: 4, fill: line.color }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
