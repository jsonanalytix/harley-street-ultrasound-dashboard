import { subDays, addDays, startOfMonth, endOfMonth } from 'date-fns';

export interface Competitor {
  id: string;
  name: string;
  type: 'Premium' | 'Standard' | 'Budget';
  location: string;
  distance: number; // miles from Harley Street
  established: number; // year
}

export interface ServicePricing {
  competitorId: string;
  service: string;
  ourPrice: number;
  theirPrice: number;
  priceDifference: number;
  percentageDifference: number;
}

export interface ReviewMetrics {
  competitorId: string;
  googleRating: number;
  googleReviewCount: number;
  trustpilotRating: number;
  trustpilotReviewCount: number;
  avgWaitTime: number; // days
  responseTime: number; // hours to respond to enquiries
  npsScore: number;
  lastUpdated: Date;
}

export interface ServiceOffering {
  service: string;
  category: 'Pregnancy' | 'Gynaecology' | 'General' | 'Specialist';
  weOffer: boolean;
  competitors: {
    competitorId: string;
    offers: boolean;
    specialisation: boolean;
  }[];
}

export interface MarketingMetrics {
  competitorId: string;
  month: Date;
  estimatedAdSpend: number;
  searchVisibility: number; // percentage
  socialMediaFollowers: {
    facebook: number;
    instagram: number;
    twitter: number;
    linkedin: number;
  };
  websiteTrafficRank: number;
  domainAuthority: number;
}

export interface WaitTimeComparison {
  service: string;
  ourWaitTime: number; // days
  competitors: {
    competitorId: string;
    waitTime: number;
  }[];
}

export interface MarketShareEstimate {
  month: Date;
  marketShares: {
    competitorId: string;
    share: number; // percentage
    trend: 'increasing' | 'stable' | 'decreasing';
  }[];
  ourShare: number;
  ourTrend: 'increasing' | 'stable' | 'decreasing';
}

// Define competitors
export const competitors: Competitor[] = [
  {
    id: 'comp1',
    name: 'London Pregnancy Clinic',
    type: 'Premium',
    location: 'Harley Street',
    distance: 0.2,
    established: 2010
  },
  {
    id: 'comp2',
    name: 'The Birth Company',
    type: 'Premium',
    location: 'Portland Place',
    distance: 0.8,
    established: 2015
  },
  {
    id: 'comp3',
    name: 'City Ultrasound',
    type: 'Standard',
    location: 'Liverpool Street',
    distance: 3.5,
    established: 2012
  },
  {
    id: 'comp4',
    name: 'BabyBond Ultrasound',
    type: 'Standard',
    location: 'Multiple Locations',
    distance: 2.0,
    established: 2008
  },
  {
    id: 'comp5',
    name: 'NHS Private Unit',
    type: 'Budget',
    location: 'UCH',
    distance: 1.5,
    established: 2005
  }
];

// Common services for comparison
const commonServices = [
  'Early Pregnancy Scan',
  'Dating Scan',
  'Anomaly Scan',
  'Growth Scan',
  '4D Baby Scan',
  'Gender Scan',
  'NIPT Test',
  'Harmony Test',
  'Pelvic Scan',
  'Follicle Tracking',
  'Well Woman Check',
  'Thyroid Scan'
];

export const generateServicePricing = (): ServicePricing[] => {
  const pricing: ServicePricing[] = [];
  
  const basePrices: Record<string, number> = {
    'Early Pregnancy Scan': 150,
    'Dating Scan': 120,
    'Anomaly Scan': 280,
    'Growth Scan': 180,
    '4D Baby Scan': 200,
    'Gender Scan': 85,
    'NIPT Test': 400,
    'Harmony Test': 450,
    'Pelvic Scan': 250,
    'Follicle Tracking': 120,
    'Well Woman Check': 350,
    'Thyroid Scan': 200
  };

  commonServices.forEach(service => {
    const ourPrice = basePrices[service] || 150;
    
    competitors.forEach(competitor => {
      let theirPrice = ourPrice;
      
      // Premium competitors charge 10-20% more
      if (competitor.type === 'Premium') {
        theirPrice = ourPrice * (1 + (Math.random() * 0.1 + 0.1));
      }
      // Standard competitors are within 5% either way
      else if (competitor.type === 'Standard') {
        theirPrice = ourPrice * (1 + (Math.random() * 0.1 - 0.05));
      }
      // Budget competitors charge 15-30% less
      else {
        theirPrice = ourPrice * (1 - (Math.random() * 0.15 + 0.15));
      }
      
      theirPrice = Math.round(theirPrice);
      const priceDifference = ourPrice - theirPrice;
      const percentageDifference = (priceDifference / ourPrice) * 100;
      
      pricing.push({
        competitorId: competitor.id,
        service,
        ourPrice,
        theirPrice,
        priceDifference,
        percentageDifference
      });
    });
  });
  
  return pricing;
};

export const generateReviewMetrics = (): ReviewMetrics[] => {
  return competitors.map(competitor => {
    let baseRating = 4.0;
    let baseReviews = 100;
    let baseWaitTime = 7;
    let baseNPS = 30;
    
    if (competitor.type === 'Premium') {
      baseRating = 4.3 + Math.random() * 0.4;
      baseReviews = 200 + Math.floor(Math.random() * 300);
      baseWaitTime = 3 + Math.floor(Math.random() * 3);
      baseNPS = 40 + Math.floor(Math.random() * 20);
    } else if (competitor.type === 'Standard') {
      baseRating = 3.8 + Math.random() * 0.6;
      baseReviews = 100 + Math.floor(Math.random() * 200);
      baseWaitTime = 5 + Math.floor(Math.random() * 5);
      baseNPS = 20 + Math.floor(Math.random() * 30);
    } else {
      baseRating = 3.5 + Math.random() * 0.5;
      baseReviews = 50 + Math.floor(Math.random() * 100);
      baseWaitTime = 10 + Math.floor(Math.random() * 10);
      baseNPS = 10 + Math.floor(Math.random() * 20);
    }
    
    return {
      competitorId: competitor.id,
      googleRating: Math.round(baseRating * 10) / 10,
      googleReviewCount: baseReviews,
      trustpilotRating: Math.round((baseRating - 0.2 + Math.random() * 0.4) * 10) / 10,
      trustpilotReviewCount: Math.floor(baseReviews * 0.6),
      avgWaitTime: baseWaitTime,
      responseTime: 2 + Math.floor(Math.random() * 22), // 2-24 hours
      npsScore: baseNPS,
      lastUpdated: subDays(new Date(), Math.floor(Math.random() * 30))
    };
  });
};

export const generateServiceOfferings = (): ServiceOffering[] => {
  const allServices = [
    // Pregnancy services
    { service: 'Early Pregnancy Scan', category: 'Pregnancy' as const, commonality: 1.0 },
    { service: 'Dating Scan', category: 'Pregnancy' as const, commonality: 1.0 },
    { service: 'Anomaly Scan', category: 'Pregnancy' as const, commonality: 0.9 },
    { service: 'Growth Scan', category: 'Pregnancy' as const, commonality: 0.95 },
    { service: '4D Baby Scan', category: 'Pregnancy' as const, commonality: 0.8 },
    { service: 'Gender Scan', category: 'Pregnancy' as const, commonality: 0.85 },
    { service: 'NIPT Test', category: 'Pregnancy' as const, commonality: 0.7 },
    { service: 'Harmony Test', category: 'Pregnancy' as const, commonality: 0.6 },
    { service: 'Fetal Echocardiography', category: 'Pregnancy' as const, commonality: 0.3 },
    { service: 'Multiple Pregnancy Scan', category: 'Pregnancy' as const, commonality: 0.5 },
    
    // Gynaecology services
    { service: 'Pelvic Scan', category: 'Gynaecology' as const, commonality: 0.9 },
    { service: 'Follicle Tracking', category: 'Gynaecology' as const, commonality: 0.7 },
    { service: 'Well Woman Check', category: 'Gynaecology' as const, commonality: 0.6 },
    { service: 'HyCoSy', category: 'Gynaecology' as const, commonality: 0.4 },
    { service: 'Ovarian Reserve Testing', category: 'Gynaecology' as const, commonality: 0.5 },
    { service: 'Fibroid Mapping', category: 'Gynaecology' as const, commonality: 0.6 },
    
    // General services
    { service: 'Thyroid Scan', category: 'General' as const, commonality: 0.5 },
    { service: 'Abdominal Scan', category: 'General' as const, commonality: 0.7 },
    { service: 'Renal Scan', category: 'General' as const, commonality: 0.6 },
    { service: 'Liver Scan', category: 'General' as const, commonality: 0.5 },
    
    // Specialist services
    { service: 'Musculoskeletal Ultrasound', category: 'Specialist' as const, commonality: 0.2 },
    { service: 'Breast Ultrasound', category: 'Specialist' as const, commonality: 0.3 },
    { service: 'Vascular Doppler', category: 'Specialist' as const, commonality: 0.4 },
    { service: 'Paediatric Ultrasound', category: 'Specialist' as const, commonality: 0.2 }
  ];
  
  return allServices.map(({ service, category, commonality }) => {
    const offering: ServiceOffering = {
      service,
      category,
      weOffer: Math.random() < 0.85, // We offer 85% of services
      competitors: competitors.map(comp => {
        let offerChance = commonality;
        
        // Adjust based on competitor type
        if (comp.type === 'Premium') {
          offerChance *= 0.95;
        } else if (comp.type === 'Budget') {
          offerChance *= 0.7;
        }
        
        const offers = Math.random() < offerChance;
        const specialisation = offers && Math.random() < 0.3;
        
        return {
          competitorId: comp.id,
          offers,
          specialisation
        };
      })
    };
    
    return offering;
  });
};

export const generateMarketingMetrics = (): MarketingMetrics[] => {
  const metrics: MarketingMetrics[] = [];
  const currentDate = new Date();
  
  // Generate for last 6 months
  for (let i = 0; i < 6; i++) {
    const month = startOfMonth(subDays(currentDate, i * 30));
    
    competitors.forEach(competitor => {
      let baseSpend = 2000;
      let baseVisibility = 20;
      let baseSocial = { facebook: 1000, instagram: 800, twitter: 300, linkedin: 200 };
      let baseDA = 30;
      
      if (competitor.type === 'Premium') {
        baseSpend = 5000 + Math.random() * 3000;
        baseVisibility = 35 + Math.random() * 15;
        baseSocial = {
          facebook: 3000 + Math.floor(Math.random() * 2000),
          instagram: 2500 + Math.floor(Math.random() * 1500),
          twitter: 800 + Math.floor(Math.random() * 400),
          linkedin: 500 + Math.floor(Math.random() * 300)
        };
        baseDA = 45 + Math.floor(Math.random() * 15);
      } else if (competitor.type === 'Standard') {
        baseSpend = 2000 + Math.random() * 2000;
        baseVisibility = 20 + Math.random() * 15;
        baseSocial = {
          facebook: 1500 + Math.floor(Math.random() * 1000),
          instagram: 1200 + Math.floor(Math.random() * 800),
          twitter: 400 + Math.floor(Math.random() * 300),
          linkedin: 250 + Math.floor(Math.random() * 150)
        };
        baseDA = 35 + Math.floor(Math.random() * 10);
      } else {
        baseSpend = 500 + Math.random() * 1000;
        baseVisibility = 10 + Math.random() * 10;
        baseSocial = {
          facebook: 500 + Math.floor(Math.random() * 500),
          instagram: 300 + Math.floor(Math.random() * 300),
          twitter: 100 + Math.floor(Math.random() * 100),
          linkedin: 50 + Math.floor(Math.random() * 50)
        };
        baseDA = 25 + Math.floor(Math.random() * 10);
      }
      
      // Add some monthly variation
      const monthlyVariation = 0.8 + Math.random() * 0.4;
      
      metrics.push({
        competitorId: competitor.id,
        month,
        estimatedAdSpend: Math.round(baseSpend * monthlyVariation),
        searchVisibility: Math.round(baseVisibility * monthlyVariation),
        socialMediaFollowers: {
          facebook: Math.floor(baseSocial.facebook * (1 + i * 0.02)), // slight growth
          instagram: Math.floor(baseSocial.instagram * (1 + i * 0.03)), // faster growth
          twitter: Math.floor(baseSocial.twitter * (1 + i * 0.01)),
          linkedin: Math.floor(baseSocial.linkedin * (1 + i * 0.015))
        },
        websiteTrafficRank: Math.floor(Math.random() * 50000) + 10000,
        domainAuthority: baseDA
      });
    });
  }
  
  return metrics;
};

export const generateWaitTimeComparison = (): WaitTimeComparison[] => {
  const services = [
    'Early Pregnancy Scan',
    'Dating Scan',
    'Anomaly Scan',
    'Growth Scan',
    '4D Baby Scan',
    'Gender Scan',
    'Pelvic Scan',
    'Well Woman Check'
  ];
  
  return services.map(service => {
    const isPopular = ['Early Pregnancy Scan', 'Anomaly Scan', 'Dating Scan'].includes(service);
    const ourWaitTime = isPopular ? 2 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 2);
    
    return {
      service,
      ourWaitTime,
      competitors: competitors.map(comp => {
        let waitTime = ourWaitTime;
        
        if (comp.type === 'Premium') {
          waitTime = ourWaitTime - 1 + Math.floor(Math.random() * 2);
        } else if (comp.type === 'Standard') {
          waitTime = ourWaitTime + Math.floor(Math.random() * 3);
        } else {
          waitTime = ourWaitTime + 3 + Math.floor(Math.random() * 7);
        }
        
        return {
          competitorId: comp.id,
          waitTime: Math.max(1, waitTime) // minimum 1 day
        };
      })
    };
  });
};

export const generateMarketShareEstimates = (): MarketShareEstimate[] => {
  const estimates: MarketShareEstimate[] = [];
  const currentDate = new Date();
  
  // Our base market share
  let ourShare = 22;
  
  // Generate for last 12 months
  for (let i = 11; i >= 0; i--) {
    const month = startOfMonth(subDays(currentDate, i * 30));
    
    // Gradually increase our market share
    ourShare += (Math.random() * 0.5 - 0.1);
    ourShare = Math.max(15, Math.min(30, ourShare)); // Keep between 15-30%
    
    const competitorShares = competitors.map(comp => {
      let baseShare = 10;
      let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
      
      if (comp.name === 'London Pregnancy Clinic') {
        baseShare = 18 + Math.random() * 4;
        trend = i < 6 ? 'decreasing' : 'stable'; // Losing to us
      } else if (comp.name === 'The Birth Company') {
        baseShare = 15 + Math.random() * 3;
        trend = 'stable';
      } else if (comp.name === 'BabyBond Ultrasound') {
        baseShare = 12 + Math.random() * 3;
        trend = 'increasing'; // Growing chain
      } else if (comp.name === 'City Ultrasound') {
        baseShare = 8 + Math.random() * 2;
        trend = i < 3 ? 'decreasing' : 'stable';
      } else {
        baseShare = 5 + Math.random() * 2;
        trend = 'stable';
      }
      
      return {
        competitorId: comp.id,
        share: baseShare,
        trend
      };
    });
    
    // Normalize shares to add up to 100%
    const totalShare = ourShare + competitorShares.reduce((sum, cs) => sum + cs.share, 0);
    const scaleFactor = 100 / totalShare;
    
    estimates.push({
      month,
      marketShares: competitorShares.map(cs => ({
        ...cs,
        share: Math.round(cs.share * scaleFactor * 10) / 10
      })),
      ourShare: Math.round(ourShare * scaleFactor * 10) / 10,
      ourTrend: i < 6 ? 'increasing' : 'stable'
    });
  }
  
  return estimates;
};

// Calculate summary KPIs
export const calculateCompetitorKPIs = () => {
  const pricing = generateServicePricing();
  const reviews = generateReviewMetrics();
  const marketShare = generateMarketShareEstimates();
  const waitTimes = generateWaitTimeComparison();
  
  // Our average review score (weighted by review count)
  const ourGoogleRating = 4.6;
  const ourReviewCount = 450;
  
  // Calculate price competitiveness
  const avgPriceDiff = pricing.reduce((sum, p) => sum + p.percentageDifference, 0) / pricing.length;
  
  // Calculate review performance
  const avgCompetitorRating = reviews.reduce((sum, r) => sum + r.googleRating, 0) / reviews.length;
  const ratingAdvantage = ourGoogleRating - avgCompetitorRating;
  
  // Latest market share
  const latestMarketShare = marketShare[0];
  const marketShareGrowth = latestMarketShare.ourShare - marketShare[marketShare.length - 1].ourShare;
  
  // Wait time advantage
  const avgOurWaitTime = waitTimes.reduce((sum, w) => sum + w.ourWaitTime, 0) / waitTimes.length;
  const avgCompetitorWaitTime = waitTimes.reduce((sum, w) => {
    const compAvg = w.competitors.reduce((s, c) => s + c.waitTime, 0) / w.competitors.length;
    return sum + compAvg;
  }, 0) / waitTimes.length;
  
  return {
    marketShare: {
      current: latestMarketShare.ourShare,
      growth: marketShareGrowth,
      trend: latestMarketShare.ourTrend,
      rank: 2 // We're #2 in the market
    },
    pricing: {
      avgDifference: avgPriceDiff,
      position: avgPriceDiff > 0 ? 'Premium' : avgPriceDiff < -5 ? 'Budget' : 'Competitive',
      servicesAnalyzed: commonServices.length
    },
    reviews: {
      ourRating: ourGoogleRating,
      avgCompetitorRating: Math.round(avgCompetitorRating * 10) / 10,
      ratingAdvantage: Math.round(ratingAdvantage * 10) / 10,
      totalReviews: ourReviewCount
    },
    waitTime: {
      ourAverage: Math.round(avgOurWaitTime * 10) / 10,
      competitorAverage: Math.round(avgCompetitorWaitTime * 10) / 10,
      advantage: Math.round((avgCompetitorWaitTime - avgOurWaitTime) * 10) / 10
    }
  };
}; 