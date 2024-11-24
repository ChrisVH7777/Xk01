import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { DailyData } from '../types/visitor';

interface DailyCaptureChartProps {
  data: DailyData[];
}

export function DailyCaptureChart({ data }: DailyCaptureChartProps) {
  const chartData = data.map(day => ({
    date: format(day.date, 'MMM dd'),
    captureRate: day.captureRate,
    visitors: day.visitors,
    passersby: day.passersby,
  }));

  // Calculate max values for dynamic scaling
  const maxVisitors = Math.max(...data.map(d => Math.max(d.visitors, d.passersby)));
  const yAxisMax = Math.ceil(maxVisitors * 1.1 / 100) * 100; // Round up to nearest hundred with 10% padding

  return (
    <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary-900">Daily Overview</h2>
        <div className="text-sm text-secondary-600">
          During opening hours only
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              yAxisId="left"
              orientation="left"
              stroke="#16a34a"
              domain={[0, yAxisMax]}
              label={{ value: 'Visitors & Passersby', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6366f1"
              domain={[0, 100]}
              unit="%"
              label={{ value: 'Capture Rate', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'captureRate') return [`${value.toFixed(2)}%`, 'Capture Rate'];
                return [value.toLocaleString(), name];
              }}
            />
            <Legend />
            <Bar 
              dataKey="visitors" 
              fill="#16a34a" 
              yAxisId="left"
              name="Visitors"
              barSize={20}
            />
            <Bar 
              dataKey="passersby" 
              fill="#64748b" 
              yAxisId="left"
              name="Passersby"
              barSize={20}
            />
            <Line 
              type="monotone" 
              dataKey="captureRate" 
              stroke="#6366f1" 
              yAxisId="right"
              name="Capture Rate"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-secondary-600">
        <p>* Capture rate is calculated as visitors / (visitors + passersby) during opening hours</p>
      </div>
    </div>
  );
}