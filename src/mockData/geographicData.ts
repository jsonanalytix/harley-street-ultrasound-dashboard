import { subDays, format } from 'date-fns';

// London postcode areas with coordinates and characteristics
export interface PostcodeArea {
  code: string;
  name: string;
  lat: number;
  lng: number;
  zone: 'Central' | 'Inner' | 'Outer';
  avgIncome: number;
  population: number;
}

export interface PatientLocation {
  id: string;
  postcode: string;
  area: string;
  lat: number;
  lng: number;
  patientCount: number;
  revenue: number;
  avgSpend: number;
  avgTravelTime: number; // minutes
  primaryService: string;
  lastVisit: Date;
}

export interface CompetitorLocation {
  id: string;
  name: string;
  type: 'Premium' | 'Standard' | 'Budget';
  lat: number;
  lng: number;
  postcode: string;
  estimatedPatients: number;
}

export interface TravelTimeZone {
  zone: string;
  minMinutes: number;
  maxMinutes: number;
  patientCount: number;
  revenue: number;
  conversionRate: number;
}

export interface ExpansionOpportunity {
  area: string;
  postcode: string;
  lat: number;
  lng: number;
  score: number; // 0-100
  potentialPatients: number;
  potentialRevenue: number;
  nearestCompetitor: number; // miles
  demographics: {
    avgAge: number;
    femalePercentage: number;
    avgIncome: number;
  };
}

export interface ServiceDemand {
  service: string;
  areas: {
    postcode: string;
    demand: number;
    revenue: number;
  }[];
}

// Major London postcode areas
export const postcodeAreas: PostcodeArea[] = [
  // Central London
  { code: 'W1', name: 'West End', lat: 51.5142, lng: -0.1425, zone: 'Central', avgIncome: 85000, population: 25000 },
  { code: 'WC1', name: 'Bloomsbury', lat: 51.5246, lng: -0.1240, zone: 'Central', avgIncome: 75000, population: 30000 },
  { code: 'WC2', name: 'Covent Garden', lat: 51.5138, lng: -0.1240, zone: 'Central', avgIncome: 80000, population: 20000 },
  { code: 'EC1', name: 'Clerkenwell', lat: 51.5277, lng: -0.1055, zone: 'Central', avgIncome: 72000, population: 35000 },
  { code: 'EC2', name: 'Liverpool Street', lat: 51.5194, lng: -0.0817, zone: 'Central', avgIncome: 90000, population: 15000 },
  { code: 'SW1', name: 'Westminster', lat: 51.4975, lng: -0.1357, zone: 'Central', avgIncome: 95000, population: 40000 },
  
  // Inner London
  { code: 'N1', name: 'Islington', lat: 51.5465, lng: -0.1058, zone: 'Inner', avgIncome: 68000, population: 55000 },
  { code: 'NW1', name: 'Camden', lat: 51.5390, lng: -0.1426, zone: 'Inner', avgIncome: 65000, population: 60000 },
  { code: 'NW3', name: 'Hampstead', lat: 51.5566, lng: -0.1781, zone: 'Inner', avgIncome: 88000, population: 45000 },
  { code: 'SW3', name: 'Chelsea', lat: 51.4867, lng: -0.1673, zone: 'Inner', avgIncome: 92000, population: 38000 },
  { code: 'SW7', name: 'South Kensington', lat: 51.4943, lng: -0.1777, zone: 'Inner', avgIncome: 87000, population: 42000 },
  { code: 'W2', name: 'Paddington', lat: 51.5142, lng: -0.1761, zone: 'Inner', avgIncome: 70000, population: 48000 },
  { code: 'W8', name: 'Kensington', lat: 51.4989, lng: -0.1925, zone: 'Inner', avgIncome: 89000, population: 35000 },
  { code: 'SE1', name: 'Southwark', lat: 51.5034, lng: -0.0862, zone: 'Inner', avgIncome: 62000, population: 58000 },
  
  // Outer London
  { code: 'NW4', name: 'Hendon', lat: 51.5836, lng: -0.2259, zone: 'Outer', avgIncome: 55000, population: 70000 },
  { code: 'N2', name: 'East Finchley', lat: 51.5874, lng: -0.1653, zone: 'Outer', avgIncome: 58000, population: 65000 },
  { code: 'SW15', name: 'Putney', lat: 51.4610, lng: -0.2157, zone: 'Outer', avgIncome: 61000, population: 75000 },
  { code: 'SW19', name: 'Wimbledon', lat: 51.4214, lng: -0.2064, zone: 'Outer', avgIncome: 64000, population: 80000 },
  { code: 'E14', name: 'Canary Wharf', lat: 51.5074, lng: -0.0198, zone: 'Outer', avgIncome: 78000, population: 90000 },
  { code: 'W4', name: 'Chiswick', lat: 51.4928, lng: -0.2677, zone: 'Outer', avgIncome: 67000, population: 68000 },
];

// Generate patient locations based on realistic distribution
export const generatePatientLocations = (): PatientLocation[] => {
  const locations: PatientLocation[] = [];
  const currentDate = new Date();
  
  // Services with different geographic patterns
  const services = [
    'Early Pregnancy Scan',
    'Anomaly Scan',
    'Growth Scan',
    '4D Baby Scan',
    'NIPT Test',
    'Pelvic Scan',
    'Well Woman Check'
  ];
  
  postcodeAreas.forEach(area => {
    // Central areas have more patients
    let basePatients = 100;
    let baseRevenue = 25000;
    
    if (area.zone === 'Central') {
      basePatients *= 2.5;
      baseRevenue *= 3;
    } else if (area.zone === 'Inner') {
      basePatients *= 1.8;
      baseRevenue *= 2.2;
    }
    
    // Wealthier areas have higher patient counts and spend
    const incomeMultiplier = area.avgIncome / 70000;
    basePatients = Math.floor(basePatients * incomeMultiplier);
    baseRevenue = baseRevenue * incomeMultiplier * 1.2;
    
    // Add some randomness
    const patientCount = Math.floor(basePatients * (0.7 + Math.random() * 0.6));
    const revenue = Math.floor(baseRevenue * (0.8 + Math.random() * 0.4));
    
    // Calculate travel time based on distance from Harley Street (W1)
    const distance = Math.sqrt(
      Math.pow((area.lat - 51.5142) * 69, 2) + 
      Math.pow((area.lng - (-0.1425)) * 54.6, 2)
    );
    const avgTravelTime = Math.floor(15 + distance * 8 + Math.random() * 10);
    
    locations.push({
      id: `loc-${area.code}`,
      postcode: area.code,
      area: area.name,
      lat: area.lat,
      lng: area.lng,
      patientCount,
      revenue,
      avgSpend: Math.floor(revenue / patientCount),
      avgTravelTime,
      primaryService: services[Math.floor(Math.random() * services.length)],
      lastVisit: subDays(currentDate, Math.floor(Math.random() * 30))
    });
  });
  
  return locations;
};

// Generate competitor locations
export const generateCompetitorLocations = (): CompetitorLocation[] => {
  return [
    {
      id: 'comp1',
      name: 'London Pregnancy Clinic',
      type: 'Premium',
      lat: 51.5167,
      lng: -0.1430,
      postcode: 'W1',
      estimatedPatients: 450
    },
    {
      id: 'comp2',
      name: 'The Birth Company',
      type: 'Premium',
      lat: 51.5225,
      lng: -0.1571,
      postcode: 'W1',
      estimatedPatients: 380
    },
    {
      id: 'comp3',
      name: 'City Ultrasound',
      type: 'Standard',
      lat: 51.5174,
      lng: -0.0836,
      postcode: 'EC2',
      estimatedPatients: 320
    },
    {
      id: 'comp4',
      name: 'BabyBond Chelsea',
      type: 'Standard',
      lat: 51.4873,
      lng: -0.1687,
      postcode: 'SW3',
      estimatedPatients: 280
    },
    {
      id: 'comp5',
      name: 'BabyBond Wimbledon',
      type: 'Standard',
      lat: 51.4219,
      lng: -0.2067,
      postcode: 'SW19',
      estimatedPatients: 250
    },
    {
      id: 'comp6',
      name: 'NHS Private Unit UCH',
      type: 'Budget',
      lat: 51.5246,
      lng: -0.1340,
      postcode: 'WC1',
      estimatedPatients: 200
    },
    {
      id: 'comp7',
      name: 'Hampstead Women\'s Clinic',
      type: 'Premium',
      lat: 51.5566,
      lng: -0.1781,
      postcode: 'NW3',
      estimatedPatients: 220
    },
    {
      id: 'comp8',
      name: 'South London Ultrasound',
      type: 'Budget',
      lat: 51.4610,
      lng: -0.2157,
      postcode: 'SW15',
      estimatedPatients: 180
    }
  ];
};

// Generate travel time zones
export const generateTravelTimeZones = (): TravelTimeZone[] => {
  const patientLocations = generatePatientLocations();
  
  const zones = [
    { zone: '0-15 mins', minMinutes: 0, maxMinutes: 15 },
    { zone: '15-30 mins', minMinutes: 15, maxMinutes: 30 },
    { zone: '30-45 mins', minMinutes: 30, maxMinutes: 45 },
    { zone: '45-60 mins', minMinutes: 45, maxMinutes: 60 },
    { zone: '60+ mins', minMinutes: 60, maxMinutes: 999 }
  ];
  
  return zones.map(zone => {
    const zonePatients = patientLocations.filter(
      loc => loc.avgTravelTime >= zone.minMinutes && loc.avgTravelTime < zone.maxMinutes
    );
    
    const patientCount = zonePatients.reduce((sum, loc) => sum + loc.patientCount, 0);
    const revenue = zonePatients.reduce((sum, loc) => sum + loc.revenue, 0);
    
    // Closer zones have higher conversion rates
    let conversionRate = 0.25;
    if (zone.minMinutes === 0) conversionRate = 0.45;
    else if (zone.minMinutes === 15) conversionRate = 0.35;
    else if (zone.minMinutes === 30) conversionRate = 0.25;
    else if (zone.minMinutes === 45) conversionRate = 0.15;
    else conversionRate = 0.08;
    
    return {
      ...zone,
      patientCount,
      revenue,
      conversionRate
    };
  });
};

// Generate expansion opportunities
export const generateExpansionOpportunities = (): ExpansionOpportunity[] => {
  const competitors = generateCompetitorLocations();
  const patientLocations = generatePatientLocations();
  
  // Areas with high potential
  const potentialAreas = [
    { area: 'Stratford', postcode: 'E15', lat: 51.5423, lng: 0.0014 },
    { area: 'Greenwich', postcode: 'SE10', lat: 51.4828, lng: -0.0057 },
    { area: 'Richmond', postcode: 'TW9', lat: 51.4613, lng: -0.3037 },
    { area: 'Ealing', postcode: 'W5', lat: 51.5130, lng: -0.3055 },
    { area: 'Clapham', postcode: 'SW4', lat: 51.4619, lng: -0.1382 },
    { area: 'Highgate', postcode: 'N6', lat: 51.5712, lng: -0.1458 }
  ];
  
  return potentialAreas.map(area => {
    // Calculate distance to nearest competitor
    let nearestCompetitor = 999;
    competitors.forEach(comp => {
      const distance = Math.sqrt(
        Math.pow((area.lat - comp.lat) * 69, 2) + 
        Math.pow((area.lng - comp.lng) * 54.6, 2)
      );
      nearestCompetitor = Math.min(nearestCompetitor, distance);
    });
    
    // Calculate score based on various factors
    let score = 50;
    
    // Distance from competitors (farther is better)
    score += Math.min(nearestCompetitor * 10, 20);
    
    // Population density and income (estimate)
    const nearbyPopulation = Math.floor(50000 + Math.random() * 50000);
    const avgIncome = 45000 + Math.random() * 35000;
    score += (nearbyPopulation / 100000) * 10;
    score += (avgIncome / 100000) * 15;
    
    // Random factors
    score += Math.random() * 5;
    score = Math.min(Math.max(score, 0), 100);
    
    return {
      area: area.area,
      postcode: area.postcode,
      lat: area.lat,
      lng: area.lng,
      score: Math.round(score),
      potentialPatients: Math.floor(nearbyPopulation * 0.002 * (score / 100)),
      potentialRevenue: Math.floor(nearbyPopulation * 0.002 * (score / 100) * 250),
      nearestCompetitor: Math.round(nearestCompetitor * 10) / 10,
      demographics: {
        avgAge: 28 + Math.floor(Math.random() * 10),
        femalePercentage: 52 + Math.floor(Math.random() * 5),
        avgIncome: Math.floor(avgIncome)
      }
    };
  });
};

// Generate service demand by area
export const generateServiceDemand = (): ServiceDemand[] => {
  const patientLocations = generatePatientLocations();
  
  const services = [
    { service: 'Early Pregnancy Scan', basePrice: 150 },
    { service: 'Anomaly Scan', basePrice: 280 },
    { service: 'Growth Scan', basePrice: 180 },
    { service: '4D Baby Scan', basePrice: 200 },
    { service: 'NIPT Test', basePrice: 400 },
    { service: 'Pelvic Scan', basePrice: 250 },
    { service: 'Well Woman Check', basePrice: 350 }
  ];
  
  return services.map(service => {
    const areas = patientLocations.map(loc => {
      // Different services have different demand patterns
      let demandMultiplier = 1;
      
      // Premium services more popular in wealthy areas
      if (service.service === 'NIPT Test' || service.service === '4D Baby Scan') {
        const area = postcodeAreas.find(a => a.code === loc.postcode);
        if (area && area.avgIncome > 80000) {
          demandMultiplier = 1.5;
        }
      }
      
      // Basic scans have consistent demand
      if (service.service === 'Early Pregnancy Scan' || service.service === 'Anomaly Scan') {
        demandMultiplier = 1.2;
      }
      
      const demand = Math.floor(loc.patientCount * 0.15 * demandMultiplier * (0.7 + Math.random() * 0.6));
      const revenue = demand * service.basePrice;
      
      return {
        postcode: loc.postcode,
        demand,
        revenue
      };
    });
    
    return {
      service: service.service,
      areas: areas.sort((a, b) => b.demand - a.demand)
    };
  });
};

// Calculate geographic KPIs
export const calculateGeographicKPIs = () => {
  const locations = generatePatientLocations();
  const travelZones = generateTravelTimeZones();
  const opportunities = generateExpansionOpportunities();
  
  const totalPatients = locations.reduce((sum, loc) => sum + loc.patientCount, 0);
  const totalRevenue = locations.reduce((sum, loc) => sum + loc.revenue, 0);
  
  // Find top areas
  const topRevenueArea = locations.reduce((max, loc) => loc.revenue > max.revenue ? loc : max);
  const topPatientArea = locations.reduce((max, loc) => loc.patientCount > max.patientCount ? loc : max);
  
  // Travel time insights
  const within30mins = travelZones
    .filter(z => z.maxMinutes <= 30)
    .reduce((sum, z) => sum + z.patientCount, 0);
  
  // Best expansion opportunity
  const bestOpportunity = opportunities.reduce((max, opp) => opp.score > max.score ? opp : max);
  
  return {
    coverage: {
      totalPatients,
      totalRevenue,
      avgRevenuePerPatient: Math.floor(totalRevenue / totalPatients),
      postcodesCovered: locations.length
    },
    topAreas: {
      revenue: {
        postcode: topRevenueArea.postcode,
        area: topRevenueArea.area,
        amount: topRevenueArea.revenue
      },
      patients: {
        postcode: topPatientArea.postcode,
        area: topPatientArea.area,
        count: topPatientArea.patientCount
      }
    },
    accessibility: {
      within30mins,
      within30minsPercentage: Math.round((within30mins / totalPatients) * 100),
      avgTravelTime: Math.round(locations.reduce((sum, loc) => sum + loc.avgTravelTime, 0) / locations.length)
    },
    expansion: {
      bestOpportunity: bestOpportunity.area,
      score: bestOpportunity.score,
      potentialRevenue: bestOpportunity.potentialRevenue
    }
  };
}; 