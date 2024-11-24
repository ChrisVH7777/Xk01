import { parse, format, startOfDay, endOfDay } from 'date-fns';
import { VisitorData, ProcessedData, DailyData } from '../types/visitor';
import { isWithinOpeningHours } from './dateUtils';

export async function fetchAndProcessData(): Promise<ProcessedData> {
  const response = await fetch('https://raw.githubusercontent.com/JFT51/ExRest/refs/heads/main/ikxe.csv');
  const text = await response.text();
  
  const rows = text.split('\n').slice(1); // Skip header
  const data: VisitorData[] = rows
    .filter(row => row.trim())
    .map(row => {
      const [timestamp, entering, leaving, menEntering, menLeaving, 
             womenEntering, womenLeaving, groupEntering, groupLeaving, passersby] = row.split(',');
      
      return {
        timestamp: parse(timestamp, 'dd/MM/yyyy H:mm', new Date()),
        visitorsEntering: parseInt(entering),
        visitorsLeaving: parseInt(leaving),
        menEntering: parseInt(menEntering),
        menLeaving: parseInt(menLeaving),
        womenEntering: parseInt(womenEntering),
        womenLeaving: parseInt(womenLeaving),
        groupEntering: parseInt(groupEntering),
        groupLeaving: parseInt(groupLeaving),
        passersby: parseInt(passersby)
      };
    });

  // Filter data for opening hours only
  const openingHoursData = data.filter(entry => isWithinOpeningHours(entry.timestamp));

  // Calculate metrics
  const totalVisitors = openingHoursData.reduce((sum, entry) => sum + entry.visitorsEntering, 0);
  const totalPassersby = openingHoursData.reduce((sum, entry) => sum + entry.passersby, 0);
  const captureRate = Number(((totalVisitors / (totalVisitors + totalPassersby)) * 100).toFixed(2));

  // Calculate daily data
  const dailyData = openingHoursData.reduce((acc, entry) => {
    const day = format(entry.timestamp, 'yyyy-MM-dd');
    if (!acc[day]) {
      acc[day] = {
        date: startOfDay(entry.timestamp),
        visitors: 0,
        passersby: 0,
        captureRate: 0
      };
    }
    acc[day].visitors += entry.visitorsEntering;
    acc[day].passersby += entry.passersby;
    return acc;
  }, {} as Record<string, DailyData>);

  // Calculate capture rate for each day
  Object.values(dailyData).forEach(day => {
    day.captureRate = Number(((day.visitors / (day.visitors + day.passersby)) * 100).toFixed(2));
  });

  // Calculate peak hours
  const hourlyTraffic = openingHoursData.reduce((acc, entry) => {
    const hour = format(entry.timestamp, 'HH:mm');
    acc[hour] = (acc[hour] || 0) + entry.visitorsEntering;
    return acc;
  }, {} as Record<string, number>);

  const peakHours = Object.entries(hourlyTraffic)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([time, count]) => ({
      time: format(parse(time, 'HH:mm', new Date()), 'h:mm a'),
      percentage: Number((count / Math.max(...Object.values(hourlyTraffic)) * 100).toFixed(2))
    }));

  return {
    hourlyData: openingHoursData,
    dailyData: Object.values(dailyData),
    totalVisitors,
    captureRate,
    averageVisitDuration: 45,
    peakHours
  };
}