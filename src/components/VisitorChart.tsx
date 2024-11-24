import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Users, Clock, UserCheck } from 'lucide-react';
import { VisitorData } from '../types/visitor';

interface VisitorChartProps {
  data: VisitorData[];
}

export function VisitorChart({ data }: VisitorChartProps) {
  const chartData = data.map(entry => ({
    time: format(entry.timestamp, 'HH:mm'),
    entering: entry.visitorsEntering,
    leaving: entry.visitorsLeaving,
    passersby: entry.passersby
  }));

  // Calculate max values for dynamic scaling
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.entering, d.leaving, d.passersby))
  );
  const yAxisMax = Math.ceil(maxValue * 1.1 / 10) * 10; // Round up to nearest ten with 10% padding

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-secondary-900">Visitor Traffic</h2>
        <select className="bg-secondary-50 border border-secondary-200 rounded-md px-3 py-1.5 text-sm">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, yAxisMax]} />
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="entering" stroke="#16a34a" name="Entering" />
            <Line type="monotone" dataKey="leaving" stroke="#dc2626" name="Leaving" />
            <Line type="monotone" dataKey="passersby" stroke="#6b7280" name="Passersby" />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 rounded-lg bg-primary-50">
          <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-sm text-secondary-600">Total Visitors</p>
          <p className="text-xl font-bold text-secondary-900">
            {data.reduce((sum, entry) => sum + entry.visitorsEntering, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center p-4 rounded-lg bg-primary-50">
          <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-sm text-secondary-600">Avg. Time</p>
          <p className="text-xl font-bold text-secondary-900">45m</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-primary-50">
          <UserCheck className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <p className="text-sm text-secondary-600">Capture Rate</p>
          <p className="text-xl font-bold text-secondary-900">
            {Math.round((data.reduce((sum, entry) => sum + entry.visitorsEntering, 0) /
              (data.reduce((sum, entry) => sum + entry.visitorsEntering + entry.passersby, 0))) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}