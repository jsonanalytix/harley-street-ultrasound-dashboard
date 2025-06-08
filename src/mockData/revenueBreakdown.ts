import { subMonths, format } from 'date-fns';

// Revenue by Modality
export const revenueByModality = [
  { name: 'Ultrasound', value: 285000, percentage: 42, count: 1890 },
  { name: 'X-Ray', value: 156000, percentage: 23, count: 1560 },
  { name: 'MRI', value: 189000, percentage: 28, count: 630 },
  { name: 'CT', value: 47000, percentage: 7, count: 188 },
];

// Revenue by Clinician
export const revenueByClinicianData = [
  { name: 'Dr. Sarah Collins', revenue: 125000, scans: 520, avgRevenue: 240, trend: 12.5 },
  { name: 'Dr. Michael Roberts', revenue: 98000, scans: 490, avgRevenue: 200, trend: -5.2 },
  { name: 'Dr. Emma Wilson', revenue: 87000, scans: 435, avgRevenue: 200, trend: 8.3 },
  { name: 'Dr. James Thompson', revenue: 76000, scans: 380, avgRevenue: 200, trend: 15.7 },
  { name: 'Dr. Lisa Chen', revenue: 65000, scans: 433, avgRevenue: 150, trend: -2.1 },
  { name: 'Dr. David Kumar', revenue: 58000, scans: 290, avgRevenue: 200, trend: 22.3 },
  { name: 'Dr. Amanda Foster', revenue: 52000, scans: 347, avgRevenue: 150, trend: 6.8 },
  { name: 'Dr. Thomas Anderson', revenue: 45000, scans: 225, avgRevenue: 200, trend: -10.5 },
  { name: 'Dr. Rachel Green', revenue: 38000, scans: 253, avgRevenue: 150, trend: 18.9 },
  { name: 'Dr. John Smith', revenue: 33000, scans: 165, avgRevenue: 200, trend: 4.2 },
];

// Revenue by Location
export const revenueByLocation = [
  { name: 'Harley Street Main', revenue: 412000, percentage: 61 },
  { name: 'Marylebone', revenue: 135000, percentage: 20 },
  { name: 'Fitzrovia', revenue: 88000, percentage: 13 },
  { name: 'Mobile Unit', revenue: 42000, percentage: 6 },
];

// Revenue by Payer Type
export const revenueByPayerType = [
  { name: 'Self-Pay', value: 338000, percentage: 50 },
  { name: 'Private Insurance', value: 236000, percentage: 35 },
  { name: 'Corporate', value: 67000, percentage: 10 },
  { name: 'NHS', value: 36000, percentage: 5 },
];

// Monthly Revenue Trend
export const generateMonthlyRevenueTrend = () => {
  const months = 12;
  const data = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const baseRevenue = 55000 + Math.random() * 15000;
    
    data.push({
      month: format(date, 'MMM yyyy'),
      revenue: Math.round(baseRevenue),
      ultrasound: Math.round(baseRevenue * 0.42),
      xray: Math.round(baseRevenue * 0.23),
      mri: Math.round(baseRevenue * 0.28),
      ct: Math.round(baseRevenue * 0.07),
    });
  }
  
  return data;
};

// Revenue by Day of Week
export const revenueByDayOfWeek = [
  { day: 'Monday', revenue: 142000, avgScans: 52 },
  { day: 'Tuesday', revenue: 138000, avgScans: 48 },
  { day: 'Wednesday', revenue: 145000, avgScans: 50 },
  { day: 'Thursday', revenue: 135000, avgScans: 47 },
  { day: 'Friday', revenue: 98000, avgScans: 35 },
  { day: 'Saturday', revenue: 19000, avgScans: 8 },
  { day: 'Sunday', revenue: 0, avgScans: 0 },
];

// KPIs
export const revenueKPIs = {
  totalRevenue: 677000,
  monthlyGrowth: 8.5,
  avgRevenuePerScan: 161,
  avgRevenuePerDay: 22567,
  topModality: 'Ultrasound',
  topLocation: 'Harley Street Main',
}; 