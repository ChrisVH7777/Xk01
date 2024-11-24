import React from 'react';
import { Card } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function DashboardCard({ title, value, icon, trend }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-secondary-600 font-medium">{title}</h3>
        {icon && <div className="text-primary-600">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-secondary-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-primary-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="text-secondary-400 ml-1">vs last week</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}