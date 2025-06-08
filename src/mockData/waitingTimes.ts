import { subDays, format, startOfDay, addHours, addDays } from 'date-fns';

export interface WaitingTimeData {
  date: string;
  averageLeadTime: number; // in hours
  sameDayAvailability: number; // percentage
  dayOfWeek: string;
}

export interface SameDayAvailabilityData {
  date: string;
  availability: number;
}

export const generateWaitingTimesData = (): WaitingTimeData[] => {
  const data: WaitingTimeData[] = [];
  
  for (let i = 59; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dayOfWeek = format(subDays(new Date(), i), 'EEEE');
    
    // Simulate higher wait times on Mondays and lower on weekends
    let baseLeadTime = 48; // 2 days average
    const day = subDays(new Date(), i).getDay();
    
    if (day === 1) baseLeadTime = 72; // Monday - higher
    if (day === 0 || day === 6) baseLeadTime = 24; // Weekend - lower
    
    const averageLeadTime = baseLeadTime + (Math.random() - 0.5) * 24;
    const sameDayAvailability = Math.max(0, Math.min(100, 30 + (Math.random() - 0.5) * 40));
    
    data.push({
      date,
      averageLeadTime: Math.round(averageLeadTime),
      sameDayAvailability: Math.round(sameDayAvailability),
      dayOfWeek,
    });
  }
  
  return data;
};

export const generateSameDayAvailability = (): SameDayAvailabilityData[] => {
  const data: SameDayAvailabilityData[] = [];
  
  for (let i = 59; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'MMM dd');
    const availability = Math.max(0, Math.min(100, 35 + (Math.random() - 0.5) * 30));
    
    data.push({
      date,
      availability: Math.round(availability),
    });
  }
  
  return data;
};

// Heat map data for calendar view
export const generateHeatMapData = () => {
  const data: { date: string; value: number }[] = [];
  
  for (let i = 89; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const day = subDays(new Date(), i).getDay();
    
    let baseValue = 48;
    if (day === 1) baseValue = 72; // Monday
    if (day === 0 || day === 6) baseValue = 24; // Weekend
    
    const value = Math.max(12, Math.min(96, baseValue + (Math.random() - 0.5) * 24));
    
    data.push({
      date,
      value: Math.round(value),
    });
  }
  
  return data;
};

// Waiting Time KPIs
export const waitingTimeKPIs = {
  averageWaitTime: 3.2, // days
  medianWaitTime: 2.5, // days
  longestWait: 14, // days
  shortestWait: 0, // same day
  withinTargetPercentage: 78, // % within 3 days
  urgentWithin24h: 95, // % of urgent seen within 24h
  totalAppointments: 1247,
  averageChangeVsLastMonth: -12.5, // improvement
};

// Waiting Time by Modality
export const waitingTimeByModality = [
  { modality: 'Pregnancy Scans', avgWaitDays: 1.8, medianWaitDays: 1.5, volume: 420 },
  { modality: 'Breast Ultrasound', avgWaitDays: 1.2, medianWaitDays: 1.0, volume: 385 },
  { modality: 'Female Health', avgWaitDays: 2.3, medianWaitDays: 2.0, volume: 312 },
  { modality: 'Male Health', avgWaitDays: 1.5, medianWaitDays: 1.2, volume: 265 },
  { modality: 'Musculoskeletal', avgWaitDays: 2.8, medianWaitDays: 2.5, volume: 198 },
  { modality: 'Paediatric', avgWaitDays: 3.2, medianWaitDays: 3.0, volume: 142 },
];

// Waiting Time Distribution
export const waitingTimeDistribution = [
  { category: 'Same Day', count: 187, percentage: 15 },
  { category: '1 Day', count: 312, percentage: 25 },
  { category: '2-3 Days', count: 374, percentage: 30 },
  { category: '4-7 Days', count: 249, percentage: 20 },
  { category: '8-14 Days', count: 100, percentage: 8 },
  { category: '>14 Days', count: 25, percentage: 2 },
];

// Waiting Time by Hour of Day (when appointment was booked)
export const waitingTimeByHourOfDay = [
  { hour: '6 AM', avgWaitDays: 3.8, bookings: 12 },
  { hour: '7 AM', avgWaitDays: 3.5, bookings: 45 },
  { hour: '8 AM', avgWaitDays: 3.2, bookings: 98 },
  { hour: '9 AM', avgWaitDays: 2.9, bookings: 156 },
  { hour: '10 AM', avgWaitDays: 2.7, bookings: 178 },
  { hour: '11 AM', avgWaitDays: 2.8, bookings: 165 },
  { hour: '12 PM', avgWaitDays: 3.0, bookings: 142 },
  { hour: '1 PM', avgWaitDays: 3.1, bookings: 125 },
  { hour: '2 PM', avgWaitDays: 3.3, bookings: 134 },
  { hour: '3 PM', avgWaitDays: 3.4, bookings: 121 },
  { hour: '4 PM', avgWaitDays: 3.6, bookings: 89 },
  { hour: '5 PM', avgWaitDays: 3.9, bookings: 67 },
  { hour: '6 PM', avgWaitDays: 4.2, bookings: 45 },
  { hour: '7 PM', avgWaitDays: 4.5, bookings: 23 },
];

// Weekly Waiting Time Trend (last 12 weeks)
export const generateWeeklyWaitingTrend = () => {
  const weeks = 12;
  const data = [];
  
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = subDays(new Date(), i * 7);
    const baseWait = 3.5 - (i * 0.08); // Showing improvement trend
    
    data.push({
      week: format(weekStart, 'MMM dd'),
      avgWaitTime: Math.max(baseWait + (Math.random() * 0.6 - 0.3), 0.5),
      urgent: Math.max(0.3 + (Math.random() * 0.2 - 0.1), 0.1),
      routine: Math.max(baseWait + 1.2 + (Math.random() * 0.8 - 0.4), 1.0),
      volume: Math.floor(100 + Math.random() * 20),
    });
  }
  
  return data;
};

// Waiting Time by Referral Type
export const waitingTimeByReferralType = [
  { type: 'GP - Urgent', avgWaitDays: 0.5, count: 89, targetDays: 1 },
  { type: 'GP - Routine', avgWaitDays: 3.8, count: 456, targetDays: 5 },
  { type: 'Consultant - Urgent', avgWaitDays: 0.8, count: 67, targetDays: 1 },
  { type: 'Consultant - Routine', avgWaitDays: 4.2, count: 234, targetDays: 7 },
  { type: 'Self-Referral', avgWaitDays: 2.5, count: 178, targetDays: 3 },
  { type: 'A&E', avgWaitDays: 0.2, count: 45, targetDays: 0.5 },
  { type: 'Corporate', avgWaitDays: 1.8, count: 123, targetDays: 2 },
  { type: 'Insurance', avgWaitDays: 3.1, count: 55, targetDays: 5 },
];

// Recent Appointments with Wait Times
export const generateRecentAppointments = () => {
  const appointments = [];
  const serviceCategories = ['Pregnancy Scans', 'Breast Ultrasound', 'Female Health', 'Male Health', 'Musculoskeletal', 'Paediatric'];
  const referralTypes = ['GP', 'Consultant', 'Self-Referral', 'A&E', 'Corporate'];
  const clinicians = [
    'Dr Shayan Ahmed', 'Dr Hussain Amin', 'Dr Trevor Gaunt',
    'Dr Kate Hawtin', 'Dr Ayman Mahfouz', 'Dr Nikhil Patel',
    'Dr Sophie Pattison', 'Dr Hela Sbano', 'Dr Ahmed Shah',
    'Ms Heba Alkutbi', 'Dr Niels van Vucht', 'Dr Tahir Hussain',
    'Dr Sanjay Karamsadkar', 'Dr Xin Kowa', 'Dr Husam Wassati',
    'Mr Massimiliano Cariati', 'Miss Chloe Constantinou'
  ];
  
  for (let i = 0; i < 50; i++) {
    const createdDate = subDays(new Date(), Math.floor(Math.random() * 30));
    const waitDays = Math.random() * 10;
    const appointmentDate = new Date(createdDate);
    appointmentDate.setDate(appointmentDate.getDate() + waitDays);
    
    appointments.push({
      id: `APT-${1000 + i}`,
      patientId: `PAT-${Math.floor(Math.random() * 500)}`,
      modality: serviceCategories[Math.floor(Math.random() * serviceCategories.length)],
      referralType: referralTypes[Math.floor(Math.random() * referralTypes.length)],
      clinician: clinicians[Math.floor(Math.random() * clinicians.length)],
      createdDate: format(createdDate, 'MMM dd, yyyy HH:mm'),
      appointmentDate: format(appointmentDate, 'MMM dd, yyyy HH:mm'),
      waitTimeDays: Math.round(waitDays * 10) / 10,
      isUrgent: Math.random() > 0.8,
      status: Math.random() > 0.1 ? 'Completed' : 'Scheduled',
    });
  }
  
  return appointments.sort((a, b) => b.waitTimeDays - a.waitTimeDays);
};

// Performance Metrics by Clinician
export const waitingTimeByClinicianData = [
  { name: 'Dr. Sarah Collins', avgWaitDays: 2.8, patientsSeenOnTime: 92, totalPatients: 120 },
  { name: 'Dr. Michael Roberts', avgWaitDays: 3.2, patientsSeenOnTime: 85, totalPatients: 98 },
  { name: 'Dr. Emma Wilson', avgWaitDays: 2.5, patientsSeenOnTime: 95, totalPatients: 110 },
  { name: 'Dr. James Thompson', avgWaitDays: 3.5, patientsSeenOnTime: 78, totalPatients: 95 },
  { name: 'Dr. Lisa Chen', avgWaitDays: 2.9, patientsSeenOnTime: 88, totalPatients: 105 },
  { name: 'Dr. David Kumar', avgWaitDays: 3.1, patientsSeenOnTime: 82, totalPatients: 87 },
];

// Appointment Availability KPIs
export const appointmentAvailabilityKPIs = {
  avgLeadTimeToNext: 4.5, // days
  sameDayAvailability: 15, // percentage
  nextDayAvailability: 35, // percentage
  within3DaysAvailability: 78, // percentage
  missedAppointmentRate: 8.2, // percentage
  lateCancellationRate: 12.5, // percentage
  totalSlotsAvailable: 245,
  utilizationRate: 82, // percentage
};

// Next Available Appointment by Service Category (Harley Street Ultrasound specializes in ultrasound only)
export const nextAvailableByModality = [
  { modality: 'Pregnancy Scans', nextAvailable: 1, sameDaySlots: 2, nextDaySlots: 5 },
  { modality: 'Breast Ultrasound', nextAvailable: 0, sameDaySlots: 4, nextDaySlots: 8 },
  { modality: 'Female Health', nextAvailable: 2, sameDaySlots: 1, nextDaySlots: 4 },
  { modality: 'Male Health', nextAvailable: 0, sameDaySlots: 3, nextDaySlots: 6 },
  { modality: 'Musculoskeletal', nextAvailable: 1, sameDaySlots: 2, nextDaySlots: 4 },
  { modality: 'Paediatric', nextAvailable: 3, sameDaySlots: 0, nextDaySlots: 2 },
];

// Availability by Day of Week (next 4 weeks)
export const availabilityByDayOfWeek = [
  { day: 'Monday', avgLeadTime: 3.2, availableSlots: 45, bookedSlots: 178 },
  { day: 'Tuesday', avgLeadTime: 3.8, availableSlots: 38, bookedSlots: 185 },
  { day: 'Wednesday', avgLeadTime: 4.1, availableSlots: 32, bookedSlots: 191 },
  { day: 'Thursday', avgLeadTime: 4.5, availableSlots: 28, bookedSlots: 195 },
  { day: 'Friday', avgLeadTime: 5.2, availableSlots: 52, bookedSlots: 171 },
  { day: 'Saturday', avgLeadTime: 1.8, availableSlots: 35, bookedSlots: 45 },
  { day: 'Sunday', avgLeadTime: 0, availableSlots: 0, bookedSlots: 0 }, // Closed on Sundays
];

// Missed Appointments and Cancellations Trend (last 30 days)
export const generateMissedAppointmentsTrend = () => {
  const days = 30;
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dayOfWeek = date.getDay();
    
    // Lower rates on weekends, closed on Sunday
    const baseMissedRate = dayOfWeek === 0 ? 0 : (dayOfWeek === 6 ? 3 : 8);
    const baseCancellationRate = dayOfWeek === 0 ? 0 : (dayOfWeek === 6 ? 5 : 12);
    
    data.push({
      date: format(date, 'MMM dd'),
      missed: Math.max(0, Math.floor(baseMissedRate + (Math.random() * 4 - 2))),
      lateCancellation: Math.max(0, Math.floor(baseCancellationRate + (Math.random() * 6 - 3))),
      totalAppointments: dayOfWeek === 0 ? 0 : (dayOfWeek === 6 ? 45 : 180 + Math.floor(Math.random() * 40)),
    });
  }
  
  return data;
};

// Availability Heatmap (next 14 days)
export const generateAvailabilityHeatmap = () => {
  const data = [];
  
  for (let i = 0; i < 14; i++) {
    const date = addDays(new Date(), i);
    const dayOfWeek = date.getDay();
    
    for (let hour = 8; hour < 18; hour++) {
      // Different availability patterns
      let availabilityRate = 100;
      
      if (dayOfWeek === 0) availabilityRate = 0; // Sunday closed
      else if (dayOfWeek === 6) availabilityRate = hour < 13 ? 60 : 0; // Saturday morning only
      else {
        // Weekdays - busier during peak hours
        if (hour >= 9 && hour <= 11) availabilityRate = 20;
        else if (hour >= 14 && hour <= 16) availabilityRate = 35;
        else availabilityRate = 65;
      }
      
      // Add some randomness
      availabilityRate = Math.max(0, Math.min(100, availabilityRate + (Math.random() * 20 - 10)));
      
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        hour,
        dayName: format(date, 'EEE'),
        availabilityRate: Math.round(availabilityRate),
        slotsAvailable: Math.floor(availabilityRate / 100 * 6), // max 6 slots per hour
      });
    }
  }
  
  return data;
};

// Missed Appointments by Reason
export const missedAppointmentsByReason = [
  { reason: 'No Show - No Contact', count: 145, percentage: 35 },
  { reason: 'Forgot Appointment', count: 87, percentage: 21 },
  { reason: 'Transportation Issues', count: 62, percentage: 15 },
  { reason: 'Illness', count: 54, percentage: 13 },
  { reason: 'Work Conflict', count: 41, percentage: 10 },
  { reason: 'Other', count: 25, percentage: 6 },
];

// Cancellation Lead Time Distribution
export const cancellationLeadTime = [
  { category: '<2 hours', count: 78, percentage: 32 },
  { category: '2-6 hours', count: 56, percentage: 23 },
  { category: '6-24 hours', count: 49, percentage: 20 },
  { category: '1-3 days', count: 37, percentage: 15 },
  { category: '>3 days', count: 24, percentage: 10 },
];

// Real-time Availability Status
export const generateRealTimeAvailability = () => {
  const serviceCategories = ['Pregnancy Scans', 'Breast Ultrasound', 'Female Health', 'Male Health', 'Musculoskeletal', 'Paediatric'];
  const location = '99 Harley Street'; // Only one location
  const clinicians = [
    'Dr Shayan Ahmed', 'Dr Hussain Amin', 'Dr Trevor Gaunt',
    'Dr Kate Hawtin', 'Dr Ayman Mahfouz', 'Dr Nikhil Patel',
    'Dr Sophie Pattison', 'Dr Hela Sbano', 'Dr Ahmed Shah',
    'Ms Heba Alkutbi', 'Dr Niels van Vucht', 'Dr Tahir Hussain'
  ];
  
  const availability: Array<{
    date: string;
    displayDate: string;
    modality: string;
    location: string;
    totalSlots: number;
    availableSlots: number;
    bookedSlots: number;
    utilizationRate: number;
    nextAvailableTime: string | null;
  }> = [];
  
  serviceCategories.forEach(category => {
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      
      // Skip Sundays - clinic is closed
      if (dayOfWeek === 0) continue;
      
      // Different slot patterns
      let totalSlots = 0;
      let availableSlots = 0;
      
      if (dayOfWeek === 6) { // Saturday - reduced hours
        totalSlots = 20;
        availableSlots = Math.floor(Math.random() * 8);
      } else { // Weekdays
        totalSlots = category === 'Pregnancy Scans' || category === 'Breast Ultrasound' ? 45 : 35;
        availableSlots = Math.floor(Math.random() * (totalSlots * 0.3));
      }
      
      if (i === 0) { // Today
        availableSlots = Math.min(availableSlots, Math.floor(Math.random() * 3));
      }
      
      availability.push({
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'EEE, MMM dd'),
        modality: category,
        location,
        totalSlots,
        availableSlots,
        bookedSlots: totalSlots - availableSlots,
        utilizationRate: Math.round(((totalSlots - availableSlots) / totalSlots) * 100),
        nextAvailableTime: availableSlots > 0 ? 
          format(addHours(startOfDay(date), 8 + Math.floor(Math.random() * 9)), 'HH:mm') : 
          null,
      });
    }
  });
  
  return availability;
};

// Performance Metrics by Clinician (focusing on availability and missed appointments)
export const clinicianAvailabilityMetrics = [
  { 
    name: 'Dr Kate Hawtin', 
    avgLeadTime: 2.8, 
    missedAppointmentRate: 4.2,
    sameDayFillRate: 94,
    totalSlots: 240,
    utilizationRate: 92
  },
  { 
    name: 'Dr Ayman Mahfouz', 
    avgLeadTime: 3.5, 
    missedAppointmentRate: 6.8,
    sameDayFillRate: 82,
    totalSlots: 200,
    utilizationRate: 86
  },
  { 
    name: 'Ms Heba Alkutbi', 
    avgLeadTime: 2.5, 
    missedAppointmentRate: 3.9,
    sameDayFillRate: 96,
    totalSlots: 260,
    utilizationRate: 94
  },
  { 
    name: 'Dr Hela Sbano', 
    avgLeadTime: 4.2, 
    missedAppointmentRate: 8.5,
    sameDayFillRate: 72,
    totalSlots: 180,
    utilizationRate: 78
  },
  { 
    name: 'Dr Sophie Pattison', 
    avgLeadTime: 3.1, 
    missedAppointmentRate: 5.7,
    sameDayFillRate: 85,
    totalSlots: 210,
    utilizationRate: 83
  },
  { 
    name: 'Dr Nikhil Patel', 
    avgLeadTime: 3.8, 
    missedAppointmentRate: 7.2,
    sameDayFillRate: 78,
    totalSlots: 190,
    utilizationRate: 81
  },
  { 
    name: 'Dr Shayan Ahmed', 
    avgLeadTime: 2.9, 
    missedAppointmentRate: 4.8,
    sameDayFillRate: 88,
    totalSlots: 220,
    utilizationRate: 89
  },
  { 
    name: 'Dr Trevor Gaunt', 
    avgLeadTime: 4.5, 
    missedAppointmentRate: 9.2,
    sameDayFillRate: 68,
    totalSlots: 160,
    utilizationRate: 74
  },
];