import { subDays, format, getMonth } from 'date-fns';

export interface ProcedureData {
  date: string;
  procedureName: string;
  category: string;
  volume: number;
  revenue: number;
}

export interface TopProcedure {
  name: string;
  category: string;
  volume: number;
  revenue: number;
  averagePrice: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface SeasonalData {
  month: string;
  pregnancy: number;
  breast: number;
  gynae: number;
  male: number;
  msk: number;
  paediatric: number;
  abdominal: number;
}

// Define procedure types with their categories and base prices
const procedureTypes = [
  // Pregnancy Scans
  { name: 'Early Pregnancy Scan', category: 'Pregnancy', basePrice: 150, baseVolume: 45 },
  { name: 'Dating Scan (12 weeks)', category: 'Pregnancy', basePrice: 180, baseVolume: 38 },
  { name: 'Anomaly Scan (20 weeks)', category: 'Pregnancy', basePrice: 200, baseVolume: 35 },
  { name: 'Growth Scan', category: 'Pregnancy', basePrice: 160, baseVolume: 32 },
  { name: 'Gender Scan', category: 'Pregnancy', basePrice: 120, baseVolume: 28 },
  { name: '4D Baby Scan', category: 'Pregnancy', basePrice: 250, baseVolume: 22 },
  
  // Breast Scans
  { name: 'Breast Screening', category: 'Breast', basePrice: 180, baseVolume: 42 },
  { name: 'Breast Lump Assessment', category: 'Breast', basePrice: 220, baseVolume: 28 },
  { name: 'Breast Follow-up', category: 'Breast', basePrice: 150, baseVolume: 18 },
  
  // Gynae Scans
  { name: 'Pelvic Ultrasound', category: 'Gynae', basePrice: 180, baseVolume: 35 },
  { name: 'Transvaginal Scan', category: 'Gynae', basePrice: 200, baseVolume: 28 },
  { name: 'Ovarian Screening', category: 'Gynae', basePrice: 160, baseVolume: 22 },
  { name: 'Fertility Assessment', category: 'Gynae', basePrice: 250, baseVolume: 18 },
  
  // Male Health
  { name: 'Testicular Ultrasound', category: 'Male', basePrice: 160, baseVolume: 25 },
  { name: 'Prostate Assessment', category: 'Male', basePrice: 200, baseVolume: 20 },
  { name: 'Male Fertility Scan', category: 'Male', basePrice: 180, baseVolume: 15 },
  
  // MSK
  { name: 'Shoulder Ultrasound', category: 'MSK', basePrice: 180, baseVolume: 22 },
  { name: 'Knee Ultrasound', category: 'MSK', basePrice: 180, baseVolume: 20 },
  { name: 'Hip Ultrasound', category: 'MSK', basePrice: 180, baseVolume: 18 },
  { name: 'Elbow Ultrasound', category: 'MSK', basePrice: 160, baseVolume: 15 },
  { name: 'Ankle/Foot Ultrasound', category: 'MSK', basePrice: 160, baseVolume: 12 },
  
  // Paediatric
  { name: 'Hip Screening (Baby)', category: 'Paediatric', basePrice: 150, baseVolume: 15 },
  { name: 'Paediatric Abdominal', category: 'Paediatric', basePrice: 180, baseVolume: 12 },
  { name: 'Paediatric Renal', category: 'Paediatric', basePrice: 160, baseVolume: 8 },
  
  // Abdominal
  { name: 'Abdominal Ultrasound', category: 'Abdominal', basePrice: 160, baseVolume: 28 },
  { name: 'Liver/Gallbladder Scan', category: 'Abdominal', basePrice: 180, baseVolume: 22 },
  { name: 'Renal (Kidney) Scan', category: 'Abdominal', basePrice: 160, baseVolume: 18 },
  { name: 'Thyroid Ultrasound', category: 'Abdominal', basePrice: 150, baseVolume: 15 },
];

// Generate seasonal multipliers
const getSeasonalMultiplier = (month: number, category: string): number => {
  // January = 0, December = 11
  const seasonalPatterns: { [key: string]: number[] } = {
    'Pregnancy': [0.9, 0.95, 1.1, 1.15, 1.2, 1.15, 1.1, 1.05, 1.1, 1.15, 1.0, 0.85], // Higher in spring/summer
    'Breast': [1.2, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.9, 1.0, 1.1, 1.15, 1.1], // Higher in winter (awareness months)
    'Gynae': [1.1, 1.05, 1.0, 1.0, 1.05, 1.1, 1.0, 0.95, 1.0, 1.05, 1.1, 1.0],
    'Male': [1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.9, 1.0, 1.05, 1.1, 1.05], // November peak (Movember)
    'MSK': [0.85, 0.9, 1.0, 1.1, 1.15, 1.2, 1.15, 1.1, 1.05, 1.0, 0.95, 0.85], // Summer sports injuries
    'Paediatric': [1.0, 1.0, 1.05, 1.0, 1.0, 0.9, 0.8, 0.85, 1.1, 1.1, 1.05, 1.0], // School term patterns
    'Abdominal': [1.1, 1.05, 1.0, 0.95, 0.95, 0.9, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15], // Winter higher
  };
  
  return seasonalPatterns[category]?.[month] || 1.0;
};

// Generate 90 days of procedure data
export const generateProcedureTrendsData = (): ProcedureData[] => {
  const data: ProcedureData[] = [];
  
  for (let i = 89; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = date.getDay();
    const month = getMonth(date);
    
    // Closed on Sundays, reduced on Saturdays
    const weekdayMultiplier = dayOfWeek === 0 ? 0 : (dayOfWeek === 6 ? 0.4 : 1);
    
    procedureTypes.forEach(procedure => {
      const seasonalMultiplier = getSeasonalMultiplier(month, procedure.category);
      const randomVariance = 0.8 + Math.random() * 0.4; // 80% to 120%
      
      const volume = Math.floor(
        procedure.baseVolume * weekdayMultiplier * seasonalMultiplier * randomVariance
      );
      
      const priceVariance = 0.9 + Math.random() * 0.2; // Price varies 90% to 110%
      const revenue = volume * procedure.basePrice * priceVariance;
      
      if (volume > 0) {
        data.push({
          date: dateStr,
          procedureName: procedure.name,
          category: procedure.category,
          volume,
          revenue: Math.round(revenue),
        });
      }
    });
  }
  
  return data;
};

// Calculate top procedures from the generated data
export const calculateTopProcedures = (): TopProcedure[] => {
  const data = generateProcedureTrendsData();
  const procedureStats: { [key: string]: { volume: number; revenue: number; category: string } } = {};
  
  // Aggregate by procedure name
  data.forEach(item => {
    if (!procedureStats[item.procedureName]) {
      procedureStats[item.procedureName] = { volume: 0, revenue: 0, category: item.category };
    }
    procedureStats[item.procedureName].volume += item.volume;
    procedureStats[item.procedureName].revenue += item.revenue;
  });
  
  // Convert to array and calculate averages
  const procedures = Object.entries(procedureStats).map(([name, stats]) => ({
    name,
    category: stats.category,
    volume: stats.volume,
    revenue: stats.revenue,
    averagePrice: Math.round(stats.revenue / stats.volume),
    trend: Math.random() > 0.3 ? (Math.random() > 0.5 ? 'up' : 'stable') : 'down' as 'up' | 'down' | 'stable',
    trendPercentage: Math.round((Math.random() * 30 - 10) * 10) / 10, // -10% to +20%
  }));
  
  // Sort by revenue and return top 10
  return procedures
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map(proc => ({
      ...proc,
      trend: proc.trendPercentage > 5 ? 'up' : proc.trendPercentage < -5 ? 'down' : 'stable',
    }));
};

// Generate seasonal demand data
export const generateSeasonalData = (): SeasonalData[] => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return months.map((month, index) => ({
    month,
    pregnancy: Math.round(300 * getSeasonalMultiplier(index, 'Pregnancy')),
    breast: Math.round(250 * getSeasonalMultiplier(index, 'Breast')),
    gynae: Math.round(200 * getSeasonalMultiplier(index, 'Gynae')),
    male: Math.round(150 * getSeasonalMultiplier(index, 'Male')),
    msk: Math.round(180 * getSeasonalMultiplier(index, 'MSK')),
    paediatric: Math.round(80 * getSeasonalMultiplier(index, 'Paediatric')),
    abdominal: Math.round(160 * getSeasonalMultiplier(index, 'Abdominal')),
  }));
};

export const topProcedures = calculateTopProcedures();

export const procedureTrendsKPIs = {
  totalProcedures: 8456,
  totalRevenue: 1523400,
  averageRevenue: 180.2,
  procedureChange: 12.5,
  revenueChange: 15.8,
  topCategory: 'Pregnancy',
  fastestGrowing: 'Male Health',
};