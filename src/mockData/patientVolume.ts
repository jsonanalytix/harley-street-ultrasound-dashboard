import { subDays, format, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from 'date-fns';

export interface PatientVolumeData {
  date: string;
  pregnancy: number;
  breast: number;
  gynae: number;
  male: number;
  msk: number;
  paediatric: number;
  abdominal: number;
  total: number;
  newPatients: number;
  returningPatients: number;
}

export interface DailyVolumeData {
  date: string;
  modality: string;
  count: number;
}

export interface UtilizationData {
  date: string;
  roomUtilization: number;
  equipmentUtilization: number;
  staffUtilization: number;
}

export interface WeeklyMonthlyData {
  period: string;
  type: 'week' | 'month';
  pregnancy: number;
  breast: number;
  gynae: number;
  male: number;
  msk: number;
  paediatric: number;
  abdominal: number;
  total: number;
  newPatients: number;
  returningPatients: number;
}

// Generate 90 days of patient volume data
export const generatePatientVolumeData = (): PatientVolumeData[] => {
  const data: PatientVolumeData[] = [];
  
  for (let i = 89; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    
    // Simulate weekly patterns (higher on weekdays, closed on Sundays)
    const dayOfWeek = subDays(new Date(), i).getDay();
    const weekdayMultiplier = dayOfWeek === 0 ? 0 : (dayOfWeek === 6 ? 0.4 : 1);
    
    const pregnancy = Math.floor((Math.random() * 30 + 25) * weekdayMultiplier);
    const breast = Math.floor((Math.random() * 25 + 20) * weekdayMultiplier);
    const gynae = Math.floor((Math.random() * 20 + 15) * weekdayMultiplier);
    const male = Math.floor((Math.random() * 15 + 10) * weekdayMultiplier);
    const msk = Math.floor((Math.random() * 18 + 12) * weekdayMultiplier);
    const paediatric = Math.floor((Math.random() * 10 + 5) * weekdayMultiplier);
    const abdominal = Math.floor((Math.random() * 12 + 8) * weekdayMultiplier);
    
    const total = pregnancy + breast + gynae + male + msk + paediatric + abdominal;
    
    const newPatients = Math.floor(total * (0.28 + Math.random() * 0.12));
    const returningPatients = total - newPatients;
    
    data.push({
      date,
      pregnancy,
      breast,
      gynae,
      male,
      msk,
      paediatric,
      abdominal,
      total,
      newPatients,
      returningPatients,
    });
  }
  
  return data;
};

export const generateDailyVolumeTable = (): DailyVolumeData[] => {
  const data: DailyVolumeData[] = [];
  const modalities = [
    { name: 'Pregnancy', baseCount: 28 },
    { name: 'Breast', baseCount: 23 },
    { name: 'Gynae', baseCount: 18 },
    { name: 'Male Health', baseCount: 13 },
    { name: 'MSK', baseCount: 15 },
    { name: 'Paediatric', baseCount: 8 },
    { name: 'Abdominal', baseCount: 10 }
  ];
  
  for (let i = 13; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'MMM dd');
    const dayOfWeek = subDays(new Date(), i).getDay();
    const weekdayMultiplier = dayOfWeek === 0 ? 0 : (dayOfWeek === 6 ? 0.4 : 1);
    
    modalities.forEach(({ name, baseCount }) => {
      const count = Math.floor((Math.random() * baseCount * 0.4 + baseCount * 0.8) * weekdayMultiplier);
      
      data.push({
        date,
        modality: name,
        count,
      });
    });
  }
  
  return data;
};

// Generate utilization data
export const generateUtilizationData = (): UtilizationData[] => {
  const data: UtilizationData[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dayOfWeek = subDays(new Date(), i).getDay();
    
    // Base utilization rates
    let roomBase = dayOfWeek === 0 ? 0 : (dayOfWeek === 6 ? 45 : 75);
    let equipmentBase = dayOfWeek === 0 ? 0 : (dayOfWeek === 6 ? 40 : 70);
    let staffBase = dayOfWeek === 0 ? 0 : (dayOfWeek === 6 ? 50 : 80);
    
    // Add some variance
    const roomUtilization = Math.min(100, Math.max(0, roomBase + (Math.random() - 0.5) * 20));
    const equipmentUtilization = Math.min(100, Math.max(0, equipmentBase + (Math.random() - 0.5) * 20));
    const staffUtilization = Math.min(100, Math.max(0, staffBase + (Math.random() - 0.5) * 15));
    
    data.push({
      date,
      roomUtilization: Math.round(roomUtilization),
      equipmentUtilization: Math.round(equipmentUtilization),
      staffUtilization: Math.round(staffUtilization),
    });
  }
  
  return data;
};

// Generate weekly and monthly summaries
export const generateWeeklyMonthlyData = (): WeeklyMonthlyData[] => {
  const volumeData = generatePatientVolumeData();
  const data: WeeklyMonthlyData[] = [];
  
  // Group by weeks (last 12 weeks)
  for (let i = 11; i >= 0; i--) {
    const weekStart = startOfWeek(subDays(new Date(), i * 7), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(subDays(new Date(), i * 7), { weekStartsOn: 1 });
    
    const weekData = volumeData.filter(d => {
      const date = new Date(d.date);
      return date >= weekStart && date <= weekEnd;
    });
    
    if (weekData.length > 0) {
      const summary = weekData.reduce((acc, curr) => ({
        pregnancy: acc.pregnancy + curr.pregnancy,
        breast: acc.breast + curr.breast,
        gynae: acc.gynae + curr.gynae,
        male: acc.male + curr.male,
        msk: acc.msk + curr.msk,
        paediatric: acc.paediatric + curr.paediatric,
        abdominal: acc.abdominal + curr.abdominal,
        total: acc.total + curr.total,
        newPatients: acc.newPatients + curr.newPatients,
        returningPatients: acc.returningPatients + curr.returningPatients,
      }), {
        pregnancy: 0, breast: 0, gynae: 0, male: 0, msk: 0, 
        paediatric: 0, abdominal: 0, total: 0, newPatients: 0, returningPatients: 0
      });
      
      data.push({
        period: `Week ${format(weekStart, 'MMM dd')}`,
        type: 'week',
        ...summary
      });
    }
  }
  
  // Group by months (last 3 months)
  for (let i = 2; i >= 0; i--) {
    const monthStart = startOfMonth(subDays(new Date(), i * 30));
    const monthEnd = endOfMonth(subDays(new Date(), i * 30));
    
    const monthData = volumeData.filter(d => {
      const date = new Date(d.date);
      return date >= monthStart && date <= monthEnd;
    });
    
    if (monthData.length > 0) {
      const summary = monthData.reduce((acc, curr) => ({
        pregnancy: acc.pregnancy + curr.pregnancy,
        breast: acc.breast + curr.breast,
        gynae: acc.gynae + curr.gynae,
        male: acc.male + curr.male,
        msk: acc.msk + curr.msk,
        paediatric: acc.paediatric + curr.paediatric,
        abdominal: acc.abdominal + curr.abdominal,
        total: acc.total + curr.total,
        newPatients: acc.newPatients + curr.newPatients,
        returningPatients: acc.returningPatients + curr.returningPatients,
      }), {
        pregnancy: 0, breast: 0, gynae: 0, male: 0, msk: 0, 
        paediatric: 0, abdominal: 0, total: 0, newPatients: 0, returningPatients: 0
      });
      
      data.push({
        period: format(monthStart, 'MMMM yyyy'),
        type: 'month',
        ...summary
      });
    }
  }
  
  return data;
};

export const patientVolumeKPIs = {
  totalScans: 3842,
  scansPerDay: 137.2,
  scansPerWeek: 823.5,
  scansPerMonth: 3842,
  newPatientPercentage: 32.5,
  changeVsPrevious: 12.3,
  roomUtilization: 78.5,
  equipmentUtilization: 72.3,
  staffUtilization: 85.2,
};

// Clinic resources
export const clinicResources = {
  totalRooms: 8,
  totalEquipment: 12, // ultrasound machines
  totalStaff: {
    consultants: 15,
    sonographers: 8,
    nurses: 6,
    reception: 4
  }
};