import { subDays, format, startOfDay, endOfDay } from 'date-fns';

export interface FunnelStep {
  step: string;
  sessions: number;
  dropOff: number;
  dropOffRate: number;
  conversionRate: number;
  avgTimeOnStep: number; // seconds
}

export interface PagePerformance {
  page: string;
  pageType: 'Landing' | 'Service' | 'Booking' | 'About' | 'Contact' | 'Blog';
  views: number;
  uniqueViews: number;
  avgTimeOnPage: number; // seconds
  bounceRate: number;
  exitRate: number;
  conversions: number;
  conversionRate: number;
}

export interface DeviceBreakdown {
  device: 'Desktop' | 'Mobile' | 'Tablet';
  sessions: number;
  percentage: number;
  bounceRate: number;
  conversionRate: number;
  avgSessionDuration: number; // seconds
  pagesPerSession: number;
}

export interface BrowserBreakdown {
  browser: string;
  sessions: number;
  percentage: number;
  conversionRate: number;
}

export interface UserFlow {
  source: string;
  target: string;
  value: number;
}

export interface HourlyPattern {
  hour: number;
  sessions: number;
  conversions: number;
  conversionRate: number;
}

export interface DailyFunnel {
  date: Date;
  sessions: number;
  servicePageViews: number;
  bookingFormStarts: number;
  bookingCompletions: number;
}

// Main funnel steps
export const generateFunnelData = (): FunnelStep[] => {
  const totalSessions = 25000; // Monthly sessions
  
  return [
    {
      step: 'Website Sessions',
      sessions: totalSessions,
      dropOff: 0,
      dropOffRate: 0,
      conversionRate: 100,
      avgTimeOnStep: 180, // 3 minutes avg session
    },
    {
      step: 'Service Page Views',
      sessions: Math.floor(totalSessions * 0.65), // 65% view service pages
      dropOff: Math.floor(totalSessions * 0.35),
      dropOffRate: 35,
      conversionRate: 65,
      avgTimeOnStep: 120,
    },
    {
      step: 'Booking Form Started',
      sessions: Math.floor(totalSessions * 0.25), // 25% start booking
      dropOff: Math.floor(totalSessions * 0.40),
      dropOffRate: 61.5,
      conversionRate: 38.5,
      avgTimeOnStep: 240,
    },
    {
      step: 'Contact Details Entered',
      sessions: Math.floor(totalSessions * 0.18), // 18% enter details
      dropOff: Math.floor(totalSessions * 0.07),
      dropOffRate: 28,
      conversionRate: 72,
      avgTimeOnStep: 180,
    },
    {
      step: 'Date/Time Selected',
      sessions: Math.floor(totalSessions * 0.12), // 12% select time
      dropOff: Math.floor(totalSessions * 0.06),
      dropOffRate: 33.3,
      conversionRate: 66.7,
      avgTimeOnStep: 150,
    },
    {
      step: 'Booking Completed',
      sessions: Math.floor(totalSessions * 0.08), // 8% complete booking
      dropOff: Math.floor(totalSessions * 0.04),
      dropOffRate: 33.3,
      conversionRate: 66.7,
      avgTimeOnStep: 60,
    },
  ];
};

// Page performance data
export const generatePagePerformance = (): PagePerformance[] => {
  const pages = [
    { page: '/', pageType: 'Landing' as const, baseViews: 25000 },
    { page: '/services/pregnancy-scans', pageType: 'Service' as const, baseViews: 8500 },
    { page: '/services/early-pregnancy', pageType: 'Service' as const, baseViews: 6200 },
    { page: '/services/anomaly-scan', pageType: 'Service' as const, baseViews: 4800 },
    { page: '/services/4d-scan', pageType: 'Service' as const, baseViews: 3200 },
    { page: '/book-appointment', pageType: 'Booking' as const, baseViews: 6250 },
    { page: '/services/breast-screening', pageType: 'Service' as const, baseViews: 2800 },
    { page: '/services/gynae-scans', pageType: 'Service' as const, baseViews: 2400 },
    { page: '/about-us', pageType: 'About' as const, baseViews: 3500 },
    { page: '/contact', pageType: 'Contact' as const, baseViews: 2100 },
    { page: '/blog/pregnancy-guide', pageType: 'Blog' as const, baseViews: 1800 },
    { page: '/services/msk-ultrasound', pageType: 'Service' as const, baseViews: 1600 },
  ];
  
  return pages.map(({ page, pageType, baseViews }) => {
    const uniqueViews = Math.floor(baseViews * (0.75 + Math.random() * 0.15));
    const bounceRate = pageType === 'Landing' ? 35 + Math.random() * 10 :
                      pageType === 'Service' ? 25 + Math.random() * 15 :
                      pageType === 'Booking' ? 15 + Math.random() * 10 :
                      30 + Math.random() * 20;
    
    const exitRate = pageType === 'Booking' ? 45 + Math.random() * 15 :
                    pageType === 'Service' ? 35 + Math.random() * 15 :
                    bounceRate + Math.random() * 10;
    
    const avgTimeOnPage = pageType === 'Service' ? 120 + Math.random() * 60 :
                         pageType === 'Booking' ? 240 + Math.random() * 120 :
                         pageType === 'Blog' ? 180 + Math.random() * 120 :
                         60 + Math.random() * 60;
    
    const conversions = pageType === 'Service' ? Math.floor(baseViews * (0.02 + Math.random() * 0.03)) :
                       pageType === 'Booking' ? Math.floor(baseViews * (0.3 + Math.random() * 0.1)) :
                       pageType === 'Landing' ? Math.floor(baseViews * (0.008 + Math.random() * 0.004)) :
                       0;
    
    return {
      page,
      pageType,
      views: baseViews,
      uniqueViews,
      avgTimeOnPage,
      bounceRate: Math.round(bounceRate * 10) / 10,
      exitRate: Math.round(exitRate * 10) / 10,
      conversions,
      conversionRate: Math.round((conversions / baseViews) * 1000) / 10,
    };
  }).sort((a, b) => b.views - a.views);
};

// Device breakdown
export const generateDeviceBreakdown = (): DeviceBreakdown[] => {
  const totalSessions = 25000;
  const mobilePercentage = 55;
  const desktopPercentage = 38;
  const tabletPercentage = 7;
  
  return [
    {
      device: 'Mobile',
      sessions: Math.floor(totalSessions * mobilePercentage / 100),
      percentage: mobilePercentage,
      bounceRate: 42.5,
      conversionRate: 6.2,
      avgSessionDuration: 145,
      pagesPerSession: 3.2,
    },
    {
      device: 'Desktop',
      sessions: Math.floor(totalSessions * desktopPercentage / 100),
      percentage: desktopPercentage,
      bounceRate: 28.3,
      conversionRate: 10.5,
      avgSessionDuration: 220,
      pagesPerSession: 4.8,
    },
    {
      device: 'Tablet',
      sessions: Math.floor(totalSessions * tabletPercentage / 100),
      percentage: tabletPercentage,
      bounceRate: 35.7,
      conversionRate: 8.3,
      avgSessionDuration: 185,
      pagesPerSession: 3.9,
    },
  ];
};

// Browser breakdown
export const generateBrowserBreakdown = (): BrowserBreakdown[] => {
  const totalSessions = 25000;
  const browsers = [
    { browser: 'Chrome', percentage: 48, baseConversion: 8.5 },
    { browser: 'Safari', percentage: 28, baseConversion: 9.2 },
    { browser: 'Edge', percentage: 12, baseConversion: 7.8 },
    { browser: 'Firefox', percentage: 8, baseConversion: 7.2 },
    { browser: 'Other', percentage: 4, baseConversion: 5.5 },
  ];
  
  return browsers.map(({ browser, percentage, baseConversion }) => ({
    browser,
    sessions: Math.floor(totalSessions * percentage / 100),
    percentage,
    conversionRate: baseConversion + (Math.random() - 0.5) * 2,
  }));
};

// User flow for Sankey diagram
export const generateUserFlow = (): UserFlow[] => {
  const totalSessions = 25000;
  
  return [
    // Entry sources to landing
    { source: 'Organic Search', target: 'Homepage', value: 8500 },
    { source: 'Paid Search', target: 'Homepage', value: 4500 },
    { source: 'Direct', target: 'Homepage', value: 3500 },
    { source: 'Social Media', target: 'Homepage', value: 2000 },
    { source: 'Referral', target: 'Homepage', value: 1500 },
    { source: 'Organic Search', target: 'Service Pages', value: 3000 },
    { source: 'Paid Search', target: 'Service Pages', value: 2000 },
    
    // From homepage
    { source: 'Homepage', target: 'Service Pages', value: 12000 },
    { source: 'Homepage', target: 'About Us', value: 2500 },
    { source: 'Homepage', target: 'Exit', value: 5500 },
    
    // From service pages
    { source: 'Service Pages', target: 'Booking Form', value: 6250 },
    { source: 'Service Pages', target: 'Other Service', value: 4000 },
    { source: 'Service Pages', target: 'Exit', value: 6750 },
    
    // From booking form
    { source: 'Booking Form', target: 'Booking Complete', value: 2000 },
    { source: 'Booking Form', target: 'Exit', value: 4250 },
    
    // Other paths
    { source: 'About Us', target: 'Service Pages', value: 1500 },
    { source: 'About Us', target: 'Exit', value: 1000 },
  ];
};

// Hourly pattern data
export const generateHourlyPattern = (): HourlyPattern[] => {
  const patterns = [];
  const peakHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  
  for (let hour = 0; hour < 24; hour++) {
    const isPeak = peakHours.includes(hour);
    const isWeekend = hour >= 10 && hour <= 16;
    
    const baseSessions = isPeak ? 1500 + Math.random() * 500 : 
                        hour < 6 || hour > 22 ? 50 + Math.random() * 50 :
                        300 + Math.random() * 200;
    
    const sessions = Math.floor(baseSessions);
    const conversions = Math.floor(sessions * (isPeak ? 0.09 : 0.06) * (0.8 + Math.random() * 0.4));
    
    patterns.push({
      hour,
      sessions,
      conversions,
      conversionRate: Math.round((conversions / sessions) * 1000) / 10,
    });
  }
  
  return patterns;
};

// Daily funnel trends
export const generateDailyFunnelTrends = (): DailyFunnel[] => {
  const trends: DailyFunnel[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const baseSessions = isWeekend ? 600 : 900;
    const sessions = baseSessions + Math.floor((Math.random() - 0.5) * 200);
    
    trends.push({
      date,
      sessions,
      servicePageViews: Math.floor(sessions * (0.6 + Math.random() * 0.1)),
      bookingFormStarts: Math.floor(sessions * (0.2 + Math.random() * 0.1)),
      bookingCompletions: Math.floor(sessions * (0.06 + Math.random() * 0.04)),
    });
  }
  
  return trends;
};

// High intent pages
export const highIntentPages = [
  { page: '/book-appointment', score: 95, avgTimeToConversion: 4.5 },
  { page: '/services/early-pregnancy', score: 82, avgTimeToConversion: 12.3 },
  { page: '/services/anomaly-scan', score: 78, avgTimeToConversion: 15.7 },
  { page: '/services/4d-scan', score: 75, avgTimeToConversion: 18.2 },
  { page: '/contact', score: 68, avgTimeToConversion: 22.5 },
  { page: '/services/pregnancy-scans', score: 65, avgTimeToConversion: 25.8 },
];

// Exit pages analysis
export const exitPages = [
  { page: '/book-appointment', exits: 4250, exitRate: 68, reason: 'Form abandonment' },
  { page: '/', exits: 5500, exitRate: 22, reason: 'Natural browsing end' },
  { page: '/services/pregnancy-scans', exits: 2125, exitRate: 25, reason: 'Information gathering' },
  { page: '/about-us', exits: 1000, exitRate: 28.6, reason: 'Trust validation' },
  { page: '/contact', exits: 630, exitRate: 30, reason: 'Alternative contact method' },
];

// Session duration distribution
export const sessionDurationDistribution = [
  { duration: '0-10s', sessions: 2500, percentage: 10 },
  { duration: '11-30s', sessions: 3750, percentage: 15 },
  { duration: '31-60s', sessions: 5000, percentage: 20 },
  { duration: '1-3m', sessions: 7500, percentage: 30 },
  { duration: '3-5m', sessions: 3750, percentage: 15 },
  { duration: '5-10m', sessions: 2000, percentage: 8 },
  { duration: '10m+', sessions: 500, percentage: 2 },
];

// KPIs
export const websiteFunnelKPIs = {
  overallConversionRate: 8.0,
  avgDropOffRate: 35.2,
  mobileConversionRate: 6.2,
  desktopConversionRate: 10.5,
  avgSessionDuration: 180, // seconds
  bounceRate: 35.2,
  avgPagesPerSession: 3.8,
  formAbandonmentRate: 68,
}; 