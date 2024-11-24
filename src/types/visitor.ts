export interface VisitorData {
  timestamp: Date;
  visitorsEntering: number;
  visitorsLeaving: number;
  menEntering: number;
  menLeaving: number;
  womenEntering: number;
  womenLeaving: number;
  groupEntering: number;
  groupLeaving: number;
  passersby: number;
}

export interface DailyData {
  date: Date;
  visitors: number;
  passersby: number;
  captureRate: number;
}

export interface ProcessedData {
  hourlyData: VisitorData[];
  dailyData: DailyData[];
  totalVisitors: number;
  captureRate: number;
  averageVisitDuration: number;
  peakHours: Array<{
    time: string;
    percentage: number;
  }>;
}