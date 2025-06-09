import { subDays, format, startOfWeek, subWeeks } from 'date-fns';

export interface CancellationRecord {
  id: string;
  patientId: string;
  patientSegment: 'New Patient' | 'Regular' | 'VIP' | 'Insurance' | 'Corporate' | 'Embassy';
  appointmentDate: Date;
  cancellationDate?: Date;
  service: string;
  serviceCategory: string;
  clinician: string;
  timeSlot: string;
  appointmentValue: number;
  cancellationType: 'Cancellation' | 'No-show' | 'Late Cancellation';
  leadTimeHours?: number;
  reason?: string;
  rebookedRevenue?: number;
}

export interface ServiceCancellationRate {
  service: string;
  category: string;
  totalAppointments: number;
  cancellations: number;
  noShows: number;
  lateCancellations: number;
  cancellationRate: number;
  noShowRate: number;
  totalLostRevenue: number;
  averageLeadTime: number;
}

export interface TimeSlotAnalysis {
  timeSlot: string;
  totalAppointments: number;
  cancellations: number;
  noShows: number;
  cancellationRate: number;
  noShowRate: number;
  lostRevenue: number;
}

export interface PatientSegmentAnalysis {
  segment: string;
  totalAppointments: number;
  cancellations: number;
  noShows: number;
  cancellationRate: number;
  noShowRate: number;
  avgLeadTime: number;
  lostRevenue: number;
  riskScore: 'Low' | 'Medium' | 'High';
}

export interface WeeklyCancellationTrend {
  week: string;
  cancellations: number;
  noShows: number;
  lateCancellations: number;
  lostRevenue: number;
  recoveredRevenue: number;
  netLoss: number;
}

// Service categories and their average values
const serviceData = [
  { service: 'Early Pregnancy Scan', category: 'Pregnancy', avgValue: 150 },
  { service: 'Dating Scan (12 weeks)', category: 'Pregnancy', avgValue: 180 },
  { service: 'Anomaly Scan (20 weeks)', category: 'Pregnancy', avgValue: 200 },
  { service: 'Growth Scan', category: 'Pregnancy', avgValue: 160 },
  { service: '4D Baby Scan', category: 'Pregnancy', avgValue: 250 },
  { service: 'Breast Screening', category: 'Breast', avgValue: 180 },
  { service: 'Breast Lump Assessment', category: 'Breast', avgValue: 220 },
  { service: 'Pelvic Ultrasound', category: 'Gynae', avgValue: 180 },
  { service: 'Transvaginal Scan', category: 'Gynae', avgValue: 200 },
  { service: 'Fertility Assessment', category: 'Gynae', avgValue: 250 },
  { service: 'Shoulder Ultrasound', category: 'MSK', avgValue: 180 },
  { service: 'Knee Ultrasound', category: 'MSK', avgValue: 180 },
  { service: 'Hip Screening (Baby)', category: 'Paediatric', avgValue: 150 },
  { service: 'Testicular Ultrasound', category: 'Male', avgValue: 160 },
  { service: 'Prostate Assessment', category: 'Male', avgValue: 200 },
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

const clinicians = [
  'Dr. Kate Hawtin', 'Dr. Ayman Mahfouz', 'Ms. Heba Alkutbi', 
  'Dr. Hela Sbano', 'Dr. Sophie Pattison', 'Dr. Nikhil Patel',
  'Dr. Shayan Ahmed', 'Dr. Trevor Gaunt'
];

const cancellationReasons = [
  'Personal emergency', 'Illness', 'Work conflict', 'Transportation issues',
  'Financial reasons', 'Forgot appointment', 'Weather', 'Family emergency',
  'Changed mind', 'Found alternative provider', 'Insurance issues'
];

// Generate cancellation records
export const generateCancellationRecords = (): CancellationRecord[] => {
  const records: CancellationRecord[] = [];
  let recordId = 1000;
  
  // Generate records for the last 90 days
  for (let daysAgo = 0; daysAgo < 90; daysAgo++) {
    const date = subDays(new Date(), daysAgo);
    const dayOfWeek = date.getDay();
    
    // Skip Sundays
    if (dayOfWeek === 0) continue;
    
    // Base number of appointments per day
    const baseAppointments = dayOfWeek === 6 ? 20 : 40;
    const dailyAppointments = baseAppointments + Math.floor(Math.random() * 10);
    
    // Generate appointments for the day
    for (let i = 0; i < dailyAppointments; i++) {
      const service = serviceData[Math.floor(Math.random() * serviceData.length)];
      const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      const clinician = clinicians[Math.floor(Math.random() * clinicians.length)];
      
      // Determine if this appointment was cancelled/no-show
      const isCancelled = Math.random() < 0.15; // 15% overall cancellation/no-show rate
      
      if (isCancelled) {
        const patientSegments = ['New Patient', 'Regular', 'VIP', 'Insurance', 'Corporate', 'Embassy'];
        const segmentWeights = [0.25, 0.35, 0.05, 0.20, 0.10, 0.05]; // New patients more likely to cancel
        const randomValue = Math.random();
        let cumulativeWeight = 0;
        let selectedSegment = 'Regular';
        
        for (let j = 0; j < patientSegments.length; j++) {
          cumulativeWeight += segmentWeights[j];
          if (randomValue < cumulativeWeight) {
            selectedSegment = patientSegments[j];
            break;
          }
        }
        
        // Determine cancellation type
        let cancellationType: 'Cancellation' | 'No-show' | 'Late Cancellation';
        let leadTimeHours: number | undefined;
        let cancellationDate: Date | undefined;
        
        const typeRandom = Math.random();
        if (typeRandom < 0.1) {
          // No-show (10% of cancellations)
          cancellationType = 'No-show';
        } else if (typeRandom < 0.3) {
          // Late cancellation (20% of cancellations)
          cancellationType = 'Late Cancellation';
          leadTimeHours = Math.floor(Math.random() * 6); // 0-6 hours notice
          cancellationDate = subDays(date, leadTimeHours / 24);
        } else {
          // Regular cancellation (70% of cancellations)
          cancellationType = 'Cancellation';
          leadTimeHours = 24 + Math.floor(Math.random() * 168); // 1-7 days notice
          cancellationDate = subDays(date, leadTimeHours / 24);
        }
        
        // Calculate if appointment was rebooked
        const wasRebooked = cancellationType === 'Cancellation' && leadTimeHours! > 48 && Math.random() < 0.6;
        const rebookedRevenue = wasRebooked ? service.avgValue : undefined;
        
        records.push({
          id: `CAN-${recordId++}`,
          patientId: `PAT-${Math.floor(Math.random() * 5000)}`,
          patientSegment: selectedSegment as any,
          appointmentDate: date,
          cancellationDate,
          service: service.service,
          serviceCategory: service.category,
          clinician,
          timeSlot,
          appointmentValue: service.avgValue,
          cancellationType,
          leadTimeHours,
          reason: cancellationType !== 'No-show' ? 
            cancellationReasons[Math.floor(Math.random() * cancellationReasons.length)] : 
            undefined,
          rebookedRevenue,
        });
      }
    }
  }
  
  return records;
};

// Calculate service cancellation rates
export const calculateServiceCancellationRates = (records: CancellationRecord[]): ServiceCancellationRate[] => {
  const serviceStats = new Map<string, {
    totalAppointments: number;
    cancellations: number;
    noShows: number;
    lateCancellations: number;
    totalRevenue: number;
    lostRevenue: number;
    leadTimes: number[];
    category: string;
  }>();
  
  // Initialize stats for all services
  serviceData.forEach(service => {
    serviceStats.set(service.service, {
      totalAppointments: Math.floor(200 + Math.random() * 300), // Simulated total appointments
      cancellations: 0,
      noShows: 0,
      lateCancellations: 0,
      totalRevenue: 0,
      lostRevenue: 0,
      leadTimes: [],
      category: service.category,
    });
  });
  
  // Process cancellation records
  records.forEach(record => {
    const stats = serviceStats.get(record.service);
    if (stats) {
      if (record.cancellationType === 'Cancellation') {
        stats.cancellations++;
        if (record.leadTimeHours) stats.leadTimes.push(record.leadTimeHours);
      } else if (record.cancellationType === 'No-show') {
        stats.noShows++;
      } else if (record.cancellationType === 'Late Cancellation') {
        stats.lateCancellations++;
      }
      
      if (!record.rebookedRevenue) {
        stats.lostRevenue += record.appointmentValue;
      }
    }
  });
  
  // Convert to array and calculate rates
  return Array.from(serviceStats.entries()).map(([service, stats]) => ({
    service,
    category: stats.category,
    totalAppointments: stats.totalAppointments,
    cancellations: stats.cancellations,
    noShows: stats.noShows,
    lateCancellations: stats.lateCancellations,
    cancellationRate: ((stats.cancellations + stats.lateCancellations) / stats.totalAppointments) * 100,
    noShowRate: (stats.noShows / stats.totalAppointments) * 100,
    totalLostRevenue: stats.lostRevenue,
    averageLeadTime: stats.leadTimes.length > 0 ? 
      stats.leadTimes.reduce((a, b) => a + b, 0) / stats.leadTimes.length : 0,
  })).sort((a, b) => b.totalLostRevenue - a.totalLostRevenue);
};

// Analyze cancellations by time slot
export const analyzeTimeSlots = (records: CancellationRecord[]): TimeSlotAnalysis[] => {
  const slotStats = new Map<string, {
    totalAppointments: number;
    cancellations: number;
    noShows: number;
    lostRevenue: number;
  }>();
  
  // Initialize all time slots
  timeSlots.forEach(slot => {
    slotStats.set(slot, {
      totalAppointments: Math.floor(150 + Math.random() * 100), // Simulated total
      cancellations: 0,
      noShows: 0,
      lostRevenue: 0,
    });
  });
  
  // Process records
  records.forEach(record => {
    const stats = slotStats.get(record.timeSlot);
    if (stats) {
      if (record.cancellationType === 'No-show') {
        stats.noShows++;
      } else {
        stats.cancellations++;
      }
      if (!record.rebookedRevenue) {
        stats.lostRevenue += record.appointmentValue;
      }
    }
  });
  
  return Array.from(slotStats.entries()).map(([timeSlot, stats]) => ({
    timeSlot,
    totalAppointments: stats.totalAppointments,
    cancellations: stats.cancellations,
    noShows: stats.noShows,
    cancellationRate: (stats.cancellations / stats.totalAppointments) * 100,
    noShowRate: (stats.noShows / stats.totalAppointments) * 100,
    lostRevenue: stats.lostRevenue,
  }));
};

// Analyze by patient segment
export const analyzePatientSegments = (records: CancellationRecord[]): PatientSegmentAnalysis[] => {
  const segments = ['New Patient', 'Regular', 'VIP', 'Insurance', 'Corporate', 'Embassy'];
  const segmentStats = new Map<string, {
    totalAppointments: number;
    cancellations: number;
    noShows: number;
    leadTimes: number[];
    lostRevenue: number;
  }>();
  
  // Initialize segments
  segments.forEach(segment => {
    const baseAppointments = {
      'New Patient': 800,
      'Regular': 1200,
      'VIP': 200,
      'Insurance': 600,
      'Corporate': 400,
      'Embassy': 300,
    };
    
    segmentStats.set(segment, {
      totalAppointments: baseAppointments[segment as keyof typeof baseAppointments] + Math.floor(Math.random() * 100),
      cancellations: 0,
      noShows: 0,
      leadTimes: [],
      lostRevenue: 0,
    });
  });
  
  // Process records
  records.forEach(record => {
    const stats = segmentStats.get(record.patientSegment);
    if (stats) {
      if (record.cancellationType === 'No-show') {
        stats.noShows++;
      } else {
        stats.cancellations++;
        if (record.leadTimeHours) stats.leadTimes.push(record.leadTimeHours);
      }
      if (!record.rebookedRevenue) {
        stats.lostRevenue += record.appointmentValue;
      }
    }
  });
  
  return segments.map(segment => {
    const stats = segmentStats.get(segment)!;
    const cancellationRate = ((stats.cancellations + stats.noShows) / stats.totalAppointments) * 100;
    
    let riskScore: 'Low' | 'Medium' | 'High';
    if (cancellationRate < 10) riskScore = 'Low';
    else if (cancellationRate < 20) riskScore = 'Medium';
    else riskScore = 'High';
    
    return {
      segment,
      totalAppointments: stats.totalAppointments,
      cancellations: stats.cancellations,
      noShows: stats.noShows,
      cancellationRate: (stats.cancellations / stats.totalAppointments) * 100,
      noShowRate: (stats.noShows / stats.totalAppointments) * 100,
      avgLeadTime: stats.leadTimes.length > 0 ?
        stats.leadTimes.reduce((a, b) => a + b, 0) / stats.leadTimes.length : 0,
      lostRevenue: stats.lostRevenue,
      riskScore,
    };
  }).sort((a, b) => (b.cancellationRate + b.noShowRate) - (a.cancellationRate + a.noShowRate));
};

// Generate weekly trends
export const generateWeeklyTrends = (records: CancellationRecord[]): WeeklyCancellationTrend[] => {
  const trends: WeeklyCancellationTrend[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekRecords = records.filter(r => 
      r.appointmentDate >= weekStart && r.appointmentDate <= weekEnd
    );
    
    const cancellations = weekRecords.filter(r => r.cancellationType === 'Cancellation').length;
    const noShows = weekRecords.filter(r => r.cancellationType === 'No-show').length;
    const lateCancellations = weekRecords.filter(r => r.cancellationType === 'Late Cancellation').length;
    
    const lostRevenue = weekRecords
      .filter(r => !r.rebookedRevenue)
      .reduce((sum, r) => sum + r.appointmentValue, 0);
    
    const recoveredRevenue = weekRecords
      .filter(r => r.rebookedRevenue)
      .reduce((sum, r) => sum + (r.rebookedRevenue || 0), 0);
    
    trends.push({
      week: format(weekStart, 'MMM dd'),
      cancellations,
      noShows,
      lateCancellations,
      lostRevenue,
      recoveredRevenue,
      netLoss: lostRevenue - recoveredRevenue,
    });
  }
  
  return trends;
};

// KPIs
export const cancellationKPIs = {
  totalLostRevenue: 126890,
  avgMonthlyLoss: 42296,
  overallCancellationRate: 12.5,
  overallNoShowRate: 2.8,
  recoveryRate: 35.2, // Percentage of cancelled slots that were rebooked
  highestRiskSegment: 'New Patient',
  highestRiskTimeSlot: '17:00',
  avgCancellationLeadTime: 48.5, // hours
};

// Top cancellation reasons
export const topCancellationReasons = [
  { reason: 'Personal emergency', count: 145, percentage: 22 },
  { reason: 'Work conflict', count: 98, percentage: 15 },
  { reason: 'Illness', count: 85, percentage: 13 },
  { reason: 'Transportation issues', count: 72, percentage: 11 },
  { reason: 'Financial reasons', count: 65, percentage: 10 },
  { reason: 'Forgot appointment', count: 52, percentage: 8 },
  { reason: 'Other', count: 137, percentage: 21 },
]; 