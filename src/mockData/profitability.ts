export interface ProcedureProfitability {
  procedureName: string;
  category: string;
  volume: number;
  revenue: number;
  costs: {
    staffCost: number;
    consumables: number;
    equipmentDepreciation: number;
    overheadAllocation: number;
    totalCost: number;
  };
  grossMargin: number;
  grossMarginPercentage: number;
  averageTimeMinutes: number;
  profitabilityRating: 'high' | 'medium' | 'low';
}

export interface CategoryProfitability {
  category: string;
  totalRevenue: number;
  totalCosts: number;
  grossMargin: number;
  grossMarginPercentage: number;
  volume: number;
}

export interface ProfitabilityKPIs {
  overallGrossMargin: number;
  overallGrossMarginPercentage: number;
  highMarginProcedures: number;
  lowMarginProcedures: number;
  topProfitableCategory: string;
  lowestProfitableCategory: string;
  averageMarginChange: number;
}

// Define procedure cost structures
const procedureCostStructure = [
  // Pregnancy Scans - Generally high margin due to quick scans and high demand
  { 
    name: 'Early Pregnancy Scan', 
    category: 'Pregnancy',
    baseRevenue: 150,
    timeMinutes: 20,
    staffCostPerMinute: 1.5, // Sonographer rate
    consumables: 5,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Dating Scan (12 weeks)', 
    category: 'Pregnancy',
    baseRevenue: 180,
    timeMinutes: 25,
    staffCostPerMinute: 1.5,
    consumables: 6,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Anomaly Scan (20 weeks)', 
    category: 'Pregnancy',
    baseRevenue: 200,
    timeMinutes: 35,
    staffCostPerMinute: 2.0, // Consultant rate
    consumables: 8,
    equipmentDepreciation: 12,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Growth Scan', 
    category: 'Pregnancy',
    baseRevenue: 160,
    timeMinutes: 20,
    staffCostPerMinute: 1.5,
    consumables: 5,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Gender Scan', 
    category: 'Pregnancy',
    baseRevenue: 120,
    timeMinutes: 15,
    staffCostPerMinute: 1.5,
    consumables: 4,
    equipmentDepreciation: 6,
    overheadPerMinute: 0.8
  },
  { 
    name: '4D Baby Scan', 
    category: 'Pregnancy',
    baseRevenue: 250,
    timeMinutes: 40,
    staffCostPerMinute: 1.8,
    consumables: 10,
    equipmentDepreciation: 15,
    overheadPerMinute: 0.8
  },
  
  // Breast Scans - Medium to high margin
  { 
    name: 'Breast Screening', 
    category: 'Breast',
    baseRevenue: 180,
    timeMinutes: 30,
    staffCostPerMinute: 2.0,
    consumables: 7,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Breast Lump Assessment', 
    category: 'Breast',
    baseRevenue: 220,
    timeMinutes: 40,
    staffCostPerMinute: 2.5, // Specialist consultant
    consumables: 10,
    equipmentDepreciation: 12,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Breast Follow-up', 
    category: 'Breast',
    baseRevenue: 150,
    timeMinutes: 20,
    staffCostPerMinute: 2.0,
    consumables: 5,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  
  // Gynae Scans - Variable margins
  { 
    name: 'Pelvic Ultrasound', 
    category: 'Gynae',
    baseRevenue: 180,
    timeMinutes: 30,
    staffCostPerMinute: 1.8,
    consumables: 8,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Transvaginal Scan', 
    category: 'Gynae',
    baseRevenue: 200,
    timeMinutes: 35,
    staffCostPerMinute: 2.0,
    consumables: 12,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Ovarian Screening', 
    category: 'Gynae',
    baseRevenue: 160,
    timeMinutes: 25,
    staffCostPerMinute: 1.8,
    consumables: 7,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Fertility Assessment', 
    category: 'Gynae',
    baseRevenue: 250,
    timeMinutes: 45,
    staffCostPerMinute: 2.5,
    consumables: 15,
    equipmentDepreciation: 12,
    overheadPerMinute: 0.8
  },
  
  // Male Health - Generally good margins
  { 
    name: 'Testicular Ultrasound', 
    category: 'Male',
    baseRevenue: 160,
    timeMinutes: 20,
    staffCostPerMinute: 1.8,
    consumables: 5,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Prostate Assessment', 
    category: 'Male',
    baseRevenue: 200,
    timeMinutes: 30,
    staffCostPerMinute: 2.2,
    consumables: 8,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Male Fertility Scan', 
    category: 'Male',
    baseRevenue: 180,
    timeMinutes: 25,
    staffCostPerMinute: 2.0,
    consumables: 6,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  
  // MSK - Lower margins due to time required
  { 
    name: 'Shoulder Ultrasound', 
    category: 'MSK',
    baseRevenue: 180,
    timeMinutes: 35,
    staffCostPerMinute: 2.0,
    consumables: 6,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Knee Ultrasound', 
    category: 'MSK',
    baseRevenue: 180,
    timeMinutes: 35,
    staffCostPerMinute: 2.0,
    consumables: 6,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Hip Ultrasound', 
    category: 'MSK',
    baseRevenue: 180,
    timeMinutes: 40,
    staffCostPerMinute: 2.0,
    consumables: 6,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Elbow Ultrasound', 
    category: 'MSK',
    baseRevenue: 160,
    timeMinutes: 30,
    staffCostPerMinute: 2.0,
    consumables: 5,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Ankle/Foot Ultrasound', 
    category: 'MSK',
    baseRevenue: 160,
    timeMinutes: 30,
    staffCostPerMinute: 2.0,
    consumables: 5,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  
  // Paediatric - Lower volume but good margins
  { 
    name: 'Hip Screening (Baby)', 
    category: 'Paediatric',
    baseRevenue: 150,
    timeMinutes: 25,
    staffCostPerMinute: 2.2,
    consumables: 5,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Paediatric Abdominal', 
    category: 'Paediatric',
    baseRevenue: 180,
    timeMinutes: 30,
    staffCostPerMinute: 2.2,
    consumables: 6,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Paediatric Renal', 
    category: 'Paediatric',
    baseRevenue: 160,
    timeMinutes: 25,
    staffCostPerMinute: 2.2,
    consumables: 5,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  
  // Abdominal - Mixed margins
  { 
    name: 'Abdominal Ultrasound', 
    category: 'Abdominal',
    baseRevenue: 160,
    timeMinutes: 30,
    staffCostPerMinute: 1.8,
    consumables: 6,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Liver/Gallbladder Scan', 
    category: 'Abdominal',
    baseRevenue: 180,
    timeMinutes: 35,
    staffCostPerMinute: 2.0,
    consumables: 7,
    equipmentDepreciation: 10,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Renal (Kidney) Scan', 
    category: 'Abdominal',
    baseRevenue: 160,
    timeMinutes: 25,
    staffCostPerMinute: 1.8,
    consumables: 5,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
  { 
    name: 'Thyroid Ultrasound', 
    category: 'Abdominal',
    baseRevenue: 150,
    timeMinutes: 20,
    staffCostPerMinute: 1.8,
    consumables: 4,
    equipmentDepreciation: 8,
    overheadPerMinute: 0.8
  },
];

export const calculateProcedureProfitability = (): ProcedureProfitability[] => {
  return procedureCostStructure.map(procedure => {
    // Calculate costs
    const staffCost = procedure.timeMinutes * procedure.staffCostPerMinute;
    const overheadAllocation = procedure.timeMinutes * procedure.overheadPerMinute;
    const totalCost = staffCost + procedure.consumables + procedure.equipmentDepreciation + overheadAllocation;
    
    // Calculate margin
    const grossMargin = procedure.baseRevenue - totalCost;
    const grossMarginPercentage = (grossMargin / procedure.baseRevenue) * 100;
    
    // Determine profitability rating
    let profitabilityRating: 'high' | 'medium' | 'low';
    if (grossMarginPercentage >= 60) {
      profitabilityRating = 'high';
    } else if (grossMarginPercentage >= 40) {
      profitabilityRating = 'medium';
    } else {
      profitabilityRating = 'low';
    }
    
    // Add some volume variation
    const volume = Math.floor(100 + Math.random() * 500);
    
    return {
      procedureName: procedure.name,
      category: procedure.category,
      volume,
      revenue: procedure.baseRevenue * volume,
      costs: {
        staffCost: staffCost * volume,
        consumables: procedure.consumables * volume,
        equipmentDepreciation: procedure.equipmentDepreciation * volume,
        overheadAllocation: overheadAllocation * volume,
        totalCost: totalCost * volume,
      },
      grossMargin: grossMargin * volume,
      grossMarginPercentage,
      averageTimeMinutes: procedure.timeMinutes,
      profitabilityRating,
    };
  });
};

export const calculateCategoryProfitability = (): CategoryProfitability[] => {
  const procedures = calculateProcedureProfitability();
  const categories = ['Pregnancy', 'Breast', 'Gynae', 'Male', 'MSK', 'Paediatric', 'Abdominal'];
  
  return categories.map(category => {
    const categoryProcedures = procedures.filter(p => p.category === category);
    
    const totalRevenue = categoryProcedures.reduce((sum, p) => sum + p.revenue, 0);
    const totalCosts = categoryProcedures.reduce((sum, p) => sum + p.costs.totalCost, 0);
    const grossMargin = totalRevenue - totalCosts;
    const grossMarginPercentage = totalRevenue > 0 ? (grossMargin / totalRevenue) * 100 : 0;
    const volume = categoryProcedures.reduce((sum, p) => sum + p.volume, 0);
    
    return {
      category,
      totalRevenue,
      totalCosts,
      grossMargin,
      grossMarginPercentage,
      volume,
    };
  });
};

export const profitabilityKPIs = (): ProfitabilityKPIs => {
  const procedures = calculateProcedureProfitability();
  const categories = calculateCategoryProfitability();
  
  const totalRevenue = procedures.reduce((sum, p) => sum + p.revenue, 0);
  const totalCosts = procedures.reduce((sum, p) => sum + p.costs.totalCost, 0);
  const overallGrossMargin = totalRevenue - totalCosts;
  const overallGrossMarginPercentage = (overallGrossMargin / totalRevenue) * 100;
  
  const highMarginProcedures = procedures.filter(p => p.profitabilityRating === 'high').length;
  const lowMarginProcedures = procedures.filter(p => p.profitabilityRating === 'low').length;
  
  const topProfitableCategory = categories.sort((a, b) => b.grossMarginPercentage - a.grossMarginPercentage)[0].category;
  const lowestProfitableCategory = categories.sort((a, b) => a.grossMarginPercentage - b.grossMarginPercentage)[0].category;
  
  return {
    overallGrossMargin,
    overallGrossMarginPercentage,
    highMarginProcedures,
    lowMarginProcedures,
    topProfitableCategory,
    lowestProfitableCategory,
    averageMarginChange: 3.2, // Mock positive trend
  };
};

// Cost breakdown for visualization
export const costBreakdownByCategory = () => {
  const procedures = calculateProcedureProfitability();
  const categories = ['Pregnancy', 'Breast', 'Gynae', 'Male', 'MSK', 'Paediatric', 'Abdominal'];
  
  return categories.map(category => {
    const categoryProcedures = procedures.filter(p => p.category === category);
    
    const totalStaffCost = categoryProcedures.reduce((sum, p) => sum + p.costs.staffCost, 0);
    const totalConsumables = categoryProcedures.reduce((sum, p) => sum + p.costs.consumables, 0);
    const totalEquipment = categoryProcedures.reduce((sum, p) => sum + p.costs.equipmentDepreciation, 0);
    const totalOverhead = categoryProcedures.reduce((sum, p) => sum + p.costs.overheadAllocation, 0);
    const totalRevenue = categoryProcedures.reduce((sum, p) => sum + p.revenue, 0);
    
    return {
      category,
      staffCost: (totalStaffCost / totalRevenue) * 100,
      consumables: (totalConsumables / totalRevenue) * 100,
      equipment: (totalEquipment / totalRevenue) * 100,
      overhead: (totalOverhead / totalRevenue) * 100,
    };
  });
}; 