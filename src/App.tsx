import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  TrendingUp,
  Bell,
  UserCircle,
  Search,
  BarChart,
  Settings,
} from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { VisitorChart } from './components/VisitorChart';
import { DailyCaptureChart } from './components/DailyCaptureChart';
import { fetchAndProcessData } from './utils/dataProcessor';
import { ProcessedData } from './types/visitor';

function App() {
  const [data, setData] = useState<ProcessedData | null>(null);

  useEffect(() => {
    fetchAndProcessData().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-secondary-600">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-secondary-900">RestaurantIQ</span>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-4">
              <a href="#" className="px-3 py-2 text-primary-600 bg-primary-50 rounded-md flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </a>
              <a href="#" className="px-3 py-2 text-secondary-600 hover:text-secondary-900 rounded-md flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                <span>Analytics</span>
              </a>
              <a href="#" className="px-3 py-2 text-secondary-600 hover:text-secondary-900 rounded-md flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
              </div>
              <button className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg">
                <UserCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">Restaurant Analytics</h1>
          <p className="text-secondary-600">Track your visitor metrics and performance</p>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyCaptureChart data={data.dailyData} />
          
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-2">
            <DashboardCard
              title="Total Visitors Today"
              value={data.totalVisitors}
              icon={<Users className="h-6 w-6" />}
              trend={{ value: 12, isPositive: true }}
            />
            <DashboardCard
              title="Average Visit Duration"
              value={`${data.averageVisitDuration}m`}
              icon={<Clock className="h-6 w-6" />}
              trend={{ value: 5, isPositive: true }}
            />
            <DashboardCard
              title="Capture Rate"
              value={`${data.captureRate}%`}
              icon={<TrendingUp className="h-6 w-6" />}
              trend={{ value: 3, isPositive: false }}
            />
          </div>

          <VisitorChart data={data.hourlyData} />
          
          {/* Peak Hours Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Peak Hours</h2>
            <div className="space-y-4">
              {data.peakHours.map((peak) => (
                <div key={peak.time}>
                  <div className="flex justify-between mb-1">
                    <span className="text-secondary-600">{peak.time}</span>
                    <span className="text-secondary-900 font-medium">{peak.percentage}%</span>
                  </div>
                  <div className="h-2 bg-secondary-100 rounded-full">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${peak.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;