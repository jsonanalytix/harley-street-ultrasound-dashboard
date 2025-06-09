import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  addDays,
  format, 
  getDay, 
  getHours,
  setHours,
  setMinutes,
  isWeekend,
  addWeeks,
  differenceInMinutes,
  startOfWeek,
  endOfWeek
} from 'date-fns';

export interface Room {
  id: string;
  name: string;
  type: 'Ultrasound' | 'Consultation' | 'Multi-purpose';
  capacity: number; // appointments per day
}

export interface Sonographer {
  id: string;
  name: string;
  specialties: string[];
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  maxAppointmentsPerDay: number;
}

export interface Appointment {
  id: string;
  roomId: string;
  sonographerId: string;
  patientId: string;
  serviceType: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';
}

export interface DailyUtilization {
  date: Date;
  roomUtilization: {
    [roomId: string]: {
      totalSlots: number;
      usedSlots: number;
      utilizationRate: number;
      peakHours: number[];
    };
  };
  sonographerUtilization: {
    [sonographerId: string]: {
      scheduledAppointments: number;
      completedAppointments: number;
      workload: number; // percentage
      overtimeMinutes: number;
    };
  };
  overallMetrics: {
    totalCapacity: number;
    totalUtilized: number;
    utilizationRate: number;
    bottleneckRoom?: string;
    bottleneckSonographer?: string;
  };
}

export interface HourlyPattern {
  hour: number;
  dayOfWeek: number;
  avgUtilization: number;
  avgAppointments: number;
  peakDemand: boolean;
}

export interface ForecastData {
  date: Date;
  predictedDemand: number;
  confidence: number;
  factors: {
    baselineDemand: number;
    seasonalFactor: number;
    dayOfWeekFactor: number;
    growthTrend: number;
    holidayImpact: number;
  };
  recommendedCapacity: number;
  capacityGap: number;
}

export const rooms: Room[] = [
  { id: 'room-1', name: 'Suite 1 - Advanced Imaging', type: 'Ultrasound', capacity: 16 },
  { id: 'room-2', name: 'Suite 2 - General Ultrasound', type: 'Ultrasound', capacity: 20 },
  { id: 'room-3', name: 'Suite 3 - Specialist Scans', type: 'Ultrasound', capacity: 12 },
  { id: 'room-4', name: 'Consultation Room A', type: 'Consultation', capacity: 24 },
  { id: 'room-5', name: 'Multi-Purpose Suite', type: 'Multi-purpose', capacity: 18 }
];

export const sonographers: Sonographer[] = [
  { 
    id: 'son-1', 
    name: 'Dr. Sarah Mitchell', 
    specialties: ['Early Pregnancy', 'Anomaly Scans'], 
    workingDays: [1, 2, 3, 4, 5], 
    maxAppointmentsPerDay: 12 
  },
  { 
    id: 'son-2', 
    name: 'Dr. James Chen', 
    specialties: ['3D/4D Scans', 'Growth Scans'], 
    workingDays: [1, 2, 3, 4, 5, 6], 
    maxAppointmentsPerDay: 14 
  },
  { 
    id: 'son-3', 
    name: 'Dr. Emma Thompson', 
    specialties: ['Gender Scans', 'General Ultrasound'], 
    workingDays: [2, 3, 4, 5, 6], 
    maxAppointmentsPerDay: 16 
  },
  { 
    id: 'son-4', 
    name: 'Dr. Michael Roberts', 
    specialties: ['Specialist Diagnostics', 'Anomaly Scans'], 
    workingDays: [1, 2, 4, 5], 
    maxAppointmentsPerDay: 10 
  },
  { 
    id: 'son-5', 
    name: 'Dr. Lisa Anderson', 
    specialties: ['Early Pregnancy', 'Reassurance Scans'], 
    workingDays: [1, 3, 4, 5, 6], 
    maxAppointmentsPerDay: 15 
  }
];

const serviceTypes = [
  { name: 'Early Pregnancy Scan', duration: 30, roomType: 'Ultrasound' },
  { name: 'Gender Scan', duration: 20, roomType: 'Ultrasound' },
  { name: 'Anomaly Scan', duration: 45, roomType: 'Ultrasound' },
  { name: '3D/4D Scan', duration: 40, roomType: 'Ultrasound' },
  { name: 'Growth Scan', duration: 30, roomType: 'Ultrasound' },
  { name: 'Consultation', duration: 20, roomType: 'Consultation' },
  { name: 'Specialist Review', duration: 60, roomType: 'Multi-purpose' }
];

// UK public holidays for capacity planning
const holidays = [
  '2024-01-01', '2024-03-29', '2024-04-01', '2024-05-06', 
  '2024-05-27', '2024-08-26', '2024-12-25', '2024-12-26'
];

const isHoliday = (date: Date): boolean => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return holidays.includes(dateStr);
};

// Generate appointments for historical data
export const generateAppointments = (days: number = 180): Appointment[] => {
  const appointments: Appointment[] = [];
  const startDate = subDays(new Date(), days);
  
  // Track sonographer appointments per day to ensure realistic distribution
  const sonographerDailyAppointments = new Map<string, Map<string, number>>();
  
  for (let d = 0; d < days; d++) {
    const currentDate = addDays(startDate, d);
    const dayOfWeek = getDay(currentDate);
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    
    // Skip Sundays and holidays
    if (dayOfWeek === 0 || isHoliday(currentDate)) continue;
    
    // Working sonographers for this day
    const availableSonographers = sonographers.filter(s => 
      s.workingDays.includes(dayOfWeek)
    );
    
    // Initialize daily appointment counts for sonographers
    const dailyCounts = new Map<string, number>();
    availableSonographers.forEach(s => dailyCounts.set(s.id, 0));
    sonographerDailyAppointments.set(dateKey, dailyCounts);
    
    // Calculate total appointments for the day based on sonographer capacity
    const totalSonographerCapacity = availableSonographers.reduce(
      (sum, s) => sum + s.maxAppointmentsPerDay, 0
    );
    
    // Generate appointments for each room
    rooms.forEach(room => {
      // Base demand varies by day and room type
      let dailyDemand = room.capacity * 0.7; // Base 70% utilization
      
      // Day of week factors
      if (dayOfWeek === 1) dailyDemand *= 1.2; // Monday busy
      if (dayOfWeek === 5) dailyDemand *= 1.1; // Friday busy
      if (dayOfWeek === 6) dailyDemand *= 0.8; // Saturday quieter
      
      // Seasonal factors
      const month = currentDate.getMonth();
      if (month === 0 || month === 1) dailyDemand *= 1.15; // Jan-Feb busy
      if (month === 7) dailyDemand *= 0.85; // August quieter
      if (month === 11) dailyDemand *= 0.9; // December slightly quieter
      
      // Random variation
      dailyDemand *= (0.9 + Math.random() * 0.2);
      
      const appointmentCount = Math.min(
        Math.floor(dailyDemand),
        room.capacity
      );
      
      // Distribute appointments throughout the day
      const startHour = 9;
      const endHour = 18;
      const suitableServices = serviceTypes.filter(s => 
        room.type === 'Multi-purpose' || s.roomType === room.type
      );
      
      for (let a = 0; a < appointmentCount; a++) {
        const service = suitableServices[Math.floor(Math.random() * suitableServices.length)];
        
        // Select sonographer based on capacity and current load
        let selectedSonographer = null;
        const sonographerLoads = availableSonographers.map(s => ({
          sonographer: s,
          currentLoad: dailyCounts.get(s.id) || 0,
          capacity: s.maxAppointmentsPerDay,
          loadPercentage: ((dailyCounts.get(s.id) || 0) / s.maxAppointmentsPerDay) * 100
        })).sort((a, b) => a.loadPercentage - b.loadPercentage);
        
        // Prefer sonographers with lower load, but add some randomness
        const candidatePool = sonographerLoads.filter(s => s.currentLoad < s.capacity);
        if (candidatePool.length > 0) {
          // Weight selection towards less loaded sonographers
          const weights = candidatePool.map((s, i) => Math.pow(2, candidatePool.length - i));
          const totalWeight = weights.reduce((sum, w) => sum + w, 0);
          let random = Math.random() * totalWeight;
          
          for (let i = 0; i < candidatePool.length; i++) {
            random -= weights[i];
            if (random <= 0) {
              selectedSonographer = candidatePool[i].sonographer;
              break;
            }
          }
        }
        
        if (!selectedSonographer) {
          selectedSonographer = availableSonographers[Math.floor(Math.random() * availableSonographers.length)];
        }
        
        // Update daily count
        dailyCounts.set(selectedSonographer.id, (dailyCounts.get(selectedSonographer.id) || 0) + 1);
        
        // Calculate appointment time with realistic distribution
        const hourWeight = Math.random();
        let hour: number;
        if (hourWeight < 0.3) hour = startHour + Math.floor(Math.random() * 2); // Morning rush
        else if (hourWeight < 0.7) hour = 11 + Math.floor(Math.random() * 3); // Midday
        else hour = 15 + Math.floor(Math.random() * 3); // Afternoon
        
        const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
        const startTime = setMinutes(setHours(currentDate, hour), minutes);
        const endTime = addDays(startTime, service.duration / (24 * 60));
        
        // Random status (mostly completed)
        const statusRand = Math.random();
        let status: Appointment['status'] = 'Completed';
        if (statusRand < 0.05) status = 'Cancelled';
        else if (statusRand < 0.08) status = 'No-show';
        else if (currentDate > new Date()) status = 'Scheduled';
        
        appointments.push({
          id: `apt-${d}-${room.id}-${a}`,
          roomId: room.id,
          sonographerId: selectedSonographer.id,
          patientId: `patient-${Math.floor(Math.random() * 10000)}`,
          serviceType: service.name,
          date: currentDate,
          startTime,
          endTime,
          duration: service.duration,
          status
        });
      }
    });
  }
  
  return appointments;
};

// Calculate daily utilization metrics
export const calculateDailyUtilization = (appointments: Appointment[]): DailyUtilization[] => {
  const utilizationByDate = new Map<string, DailyUtilization>();
  
  // First, create entries for all days with working sonographers
  const dates = new Set<string>();
  appointments.forEach(apt => dates.add(format(apt.date, 'yyyy-MM-dd')));
  
  dates.forEach(dateKey => {
    const date = new Date(dateKey);
    const dayOfWeek = getDay(date);
    
    const dayUtil: DailyUtilization = {
      date,
      roomUtilization: {},
      sonographerUtilization: {},
      overallMetrics: {
        totalCapacity: 0,
        totalUtilized: 0,
        utilizationRate: 0
      }
    };
    
    // Initialize room utilization
    rooms.forEach(room => {
      dayUtil.roomUtilization[room.id] = {
        totalSlots: room.capacity,
        usedSlots: 0,
        utilizationRate: 0,
        peakHours: []
      };
    });
    
    // Initialize sonographer utilization for working sonographers
    sonographers.forEach(sonographer => {
      if (sonographer.workingDays.includes(dayOfWeek)) {
        dayUtil.sonographerUtilization[sonographer.id] = {
          scheduledAppointments: 0,
          completedAppointments: 0,
          workload: 0,
          overtimeMinutes: 0
        };
      }
    });
    
    utilizationByDate.set(dateKey, dayUtil);
  });
  
  // Now process appointments
  appointments.forEach(apt => {
    const dateKey = format(apt.date, 'yyyy-MM-dd');
    const dayUtil = utilizationByDate.get(dateKey)!;
    
    // Update room utilization
    if (apt.status !== 'Cancelled') {
      dayUtil.roomUtilization[apt.roomId].usedSlots++;
    }
    
    // Update sonographer utilization
    if (dayUtil.sonographerUtilization[apt.sonographerId]) {
      dayUtil.sonographerUtilization[apt.sonographerId].scheduledAppointments++;
      if (apt.status === 'Completed') {
        dayUtil.sonographerUtilization[apt.sonographerId].completedAppointments++;
      }
    }
  });
  
  // Calculate rates and identify bottlenecks
  utilizationByDate.forEach(dayUtil => {
    let totalCapacity = 0;
    let totalUsed = 0;
    let maxRoomUtil = 0;
    let maxRoomId = '';
    
    // Room metrics
    Object.entries(dayUtil.roomUtilization).forEach(([roomId, util]) => {
      util.utilizationRate = (util.usedSlots / util.totalSlots) * 100;
      totalCapacity += util.totalSlots;
      totalUsed += util.usedSlots;
      
      if (util.utilizationRate > maxRoomUtil) {
        maxRoomUtil = util.utilizationRate;
        maxRoomId = roomId;
      }
      
      // Identify peak hours (simplified)
      if (util.utilizationRate > 80) {
        util.peakHours = [10, 11, 14, 15]; // Common peak hours
      }
    });
    
    // Sonographer metrics
    let maxSonographerWorkload = 0;
    let maxSonographerId = '';
    
    Object.entries(dayUtil.sonographerUtilization).forEach(([sonId, util]) => {
      const sonographer = sonographers.find(s => s.id === sonId)!;
      util.workload = (util.scheduledAppointments / sonographer.maxAppointmentsPerDay) * 100;
      
      if (util.workload > maxSonographerWorkload) {
        maxSonographerWorkload = util.workload;
        maxSonographerId = sonId;
      }
      
      // Calculate overtime (if workload > 100%)
      if (util.workload > 100) {
        const extraAppointments = util.scheduledAppointments - sonographer.maxAppointmentsPerDay;
        util.overtimeMinutes = extraAppointments * 30; // Assume 30 min average
      }
    });
    
    // Overall metrics
    dayUtil.overallMetrics = {
      totalCapacity,
      totalUtilized: totalUsed,
      utilizationRate: (totalUsed / totalCapacity) * 100,
      bottleneckRoom: maxRoomUtil > 90 ? maxRoomId : undefined,
      bottleneckSonographer: maxSonographerWorkload > 90 ? maxSonographerId : undefined
    };
  });
  
  return Array.from(utilizationByDate.values()).sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );
};

// Calculate hourly patterns for heatmap
export const calculateHourlyPatterns = (appointments: Appointment[]): HourlyPattern[] => {
  const patterns: Map<string, HourlyPattern> = new Map();
  
  // Initialize patterns
  for (let hour = 9; hour < 18; hour++) {
    for (let day = 1; day <= 6; day++) { // Monday to Saturday
      const key = `${day}-${hour}`;
      patterns.set(key, {
        hour,
        dayOfWeek: day,
        avgUtilization: 0,
        avgAppointments: 0,
        peakDemand: false
      });
    }
  }
  
  // Count appointments by hour and day
  const counts: Map<string, number[]> = new Map();
  
  appointments.forEach(apt => {
    if (apt.status === 'Cancelled') return;
    
    const hour = getHours(apt.startTime);
    const day = getDay(apt.date);
    
    if (hour >= 9 && hour < 18 && day >= 1 && day <= 6) {
      const key = `${day}-${hour}`;
      if (!counts.has(key)) counts.set(key, []);
      counts.get(key)!.push(1);
    }
  });
  
  // Calculate averages
  counts.forEach((values, key) => {
    const pattern = patterns.get(key)!;
    pattern.avgAppointments = values.length / 30; // Average over period
    pattern.avgUtilization = (values.length / 30) / 5 * 100; // Assume 5 rooms average
  });
  
  // Identify peak demand periods
  const allUtilizations = Array.from(patterns.values()).map(p => p.avgUtilization);
  const threshold = Math.max(...allUtilizations) * 0.8;
  
  patterns.forEach(pattern => {
    pattern.peakDemand = pattern.avgUtilization >= threshold;
  });
  
  return Array.from(patterns.values());
};

// Generate forecast data
export const generateForecast = (historicalDays: number = 90, forecastDays: number = 90): ForecastData[] => {
  const forecasts: ForecastData[] = [];
  const startDate = new Date();
  
  // Calculate baseline from historical data
  const baselineDemand = 75; // Average appointments per day
  const growthRate = 0.002; // 0.2% daily growth
  
  for (let d = 0; d < forecastDays; d++) {
    const forecastDate = addDays(startDate, d);
    const dayOfWeek = getDay(forecastDate);
    const month = forecastDate.getMonth();
    
    // Skip Sundays
    if (dayOfWeek === 0) continue;
    
    // Calculate factors
    let dayOfWeekFactor = 1;
    if (dayOfWeek === 1) dayOfWeekFactor = 1.2; // Monday
    else if (dayOfWeek === 5) dayOfWeekFactor = 1.1; // Friday
    else if (dayOfWeek === 6) dayOfWeekFactor = 0.8; // Saturday
    
    let seasonalFactor = 1;
    if (month === 0 || month === 1) seasonalFactor = 1.15; // Jan-Feb
    else if (month === 7) seasonalFactor = 0.85; // August
    else if (month === 11) seasonalFactor = 0.9; // December
    
    const holidayImpact = isHoliday(forecastDate) ? 0 : 1;
    const growthTrend = 1 + (growthRate * d);
    
    // Calculate predicted demand
    const predictedDemand = Math.floor(
      baselineDemand * 
      dayOfWeekFactor * 
      seasonalFactor * 
      holidayImpact * 
      growthTrend
    );
    
    // Calculate confidence (decreases with forecast distance)
    const confidence = Math.max(50, 95 - (d * 0.5));
    
    // Calculate recommended capacity (add buffer)
    const recommendedCapacity = Math.ceil(predictedDemand * 1.15);
    const currentCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
    const capacityGap = recommendedCapacity - currentCapacity;
    
    forecasts.push({
      date: forecastDate,
      predictedDemand,
      confidence,
      factors: {
        baselineDemand,
        seasonalFactor,
        dayOfWeekFactor,
        growthTrend,
        holidayImpact
      },
      recommendedCapacity,
      capacityGap
    });
  }
  
  return forecasts;
};

// Calculate optimization recommendations
export const getOptimizationRecommendations = (
  utilization: DailyUtilization[],
  patterns: HourlyPattern[],
  forecast: ForecastData[]
) => {
  const recommendations = [];
  
  // Analyze recent utilization
  const recentUtil = utilization.slice(-30);
  const avgUtil = recentUtil.reduce((sum, day) => 
    sum + day.overallMetrics.utilizationRate, 0
  ) / recentUtil.length;
  
  if (avgUtil > 85) {
    recommendations.push({
      type: 'capacity',
      priority: 'high',
      title: 'High Utilization Alert',
      description: 'Average utilization above 85% may lead to patient dissatisfaction',
      action: 'Consider adding capacity or extending hours'
    });
  }
  
  // Check for bottlenecks
  const bottleneckRooms = new Set<string>();
  const bottleneckSonographers = new Set<string>();
  
  recentUtil.forEach(day => {
    if (day.overallMetrics.bottleneckRoom) {
      bottleneckRooms.add(day.overallMetrics.bottleneckRoom);
    }
    if (day.overallMetrics.bottleneckSonographer) {
      bottleneckSonographers.add(day.overallMetrics.bottleneckSonographer);
    }
  });
  
  if (bottleneckRooms.size > 0) {
    recommendations.push({
      type: 'resource',
      priority: 'medium',
      title: 'Room Bottlenecks Identified',
      description: `Rooms frequently at capacity: ${Array.from(bottleneckRooms).join(', ')}`,
      action: 'Redistribute services or upgrade equipment'
    });
  }
  
  // Analyze patterns for scheduling optimization
  const peakHours = patterns.filter(p => p.peakDemand);
  if (peakHours.length > 0) {
    recommendations.push({
      type: 'scheduling',
      priority: 'medium',
      title: 'Peak Hour Management',
      description: 'Identified consistent peak demand periods',
      action: 'Implement dynamic pricing or encourage off-peak bookings'
    });
  }
  
  // Forecast-based recommendations
  const futureDemandSpike = forecast.filter(f => f.capacityGap > 10);
  if (futureDemandSpike.length > 0) {
    recommendations.push({
      type: 'planning',
      priority: 'high',
      title: 'Future Capacity Shortage',
      description: `Predicted capacity gaps in ${futureDemandSpike.length} days over next 90 days`,
      action: 'Plan for temporary staff or room expansion'
    });
  }
  
  return recommendations;
};

// Summary KPIs
export const calculateKPIs = (
  appointments: Appointment[],
  utilization: DailyUtilization[],
  forecast: ForecastData[]
) => {
  const recentUtil = utilization.slice(-30);
  const avgUtilization = recentUtil.reduce((sum, day) => 
    sum + day.overallMetrics.utilizationRate, 0
  ) / recentUtil.length;
  
  const completedAppointments = appointments.filter(a => 
    a.status === 'Completed' && 
    a.date >= subDays(new Date(), 30)
  ).length;
  
  const avgDailyAppointments = completedAppointments / 30;
  
  const nextMonthForecast = forecast.slice(0, 30);
  const avgForecastDemand = nextMonthForecast.reduce((sum, f) => 
    sum + f.predictedDemand, 0
  ) / nextMonthForecast.length;
  
  const capacityGaps = forecast.filter(f => f.capacityGap > 0).length;
  
  return {
    currentUtilization: avgUtilization,
    avgDailyAppointments,
    forecastGrowth: ((avgForecastDemand - avgDailyAppointments) / avgDailyAppointments) * 100,
    daysWithCapacityGap: capacityGaps
  };
}; 