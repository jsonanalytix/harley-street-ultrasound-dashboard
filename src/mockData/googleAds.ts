// Mock data generator for Google Ads Performance Report
// Simulates realistic Google Ads data for healthcare/ultrasound services

import { addDays, subDays, format, startOfMonth, endOfMonth } from 'date-fns';

export interface AdCampaign {
  id: string;
  name: string;
  type: 'Search' | 'Display' | 'Shopping';
  status: 'Active' | 'Paused';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
  qualityScore: number;
}

export interface AdGroup {
  id: string;
  campaignId: string;
  campaignName: string;
  name: string;
  status: 'Active' | 'Paused';
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
}

export interface Keyword {
  id: string;
  campaignId: string;
  adGroupId: string;
  keyword: string;
  matchType: 'Exact' | 'Phrase' | 'Broad';
  qualityScore: number;
  avgCpc: number;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  avgPosition: number;
}

export interface LandingPagePerformance {
  url: string;
  pageName: string;
  sessions: number;
  bounceRate: number;
  avgTimeOnPage: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  pageLoadTime: number;
}

export interface GeographicPerformance {
  location: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpa: number;
}

export interface DailyPerformance {
  date: Date;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

// Campaign templates for healthcare services
const campaignTemplates = [
  { name: 'Pregnancy Scans - Search', type: 'Search' as const, budgetMultiplier: 1.5 },
  { name: 'Early Pregnancy - Search', type: 'Search' as const, budgetMultiplier: 1.3 },
  { name: 'Gender Scan - Search', type: 'Search' as const, budgetMultiplier: 1.2 },
  { name: '4D Baby Scan - Search', type: 'Search' as const, budgetMultiplier: 1.4 },
  { name: 'General Ultrasound - Search', type: 'Search' as const, budgetMultiplier: 1.0 },
  { name: 'Women\'s Health - Display', type: 'Display' as const, budgetMultiplier: 0.8 },
  { name: 'Competitor Targeting', type: 'Search' as const, budgetMultiplier: 0.9 },
  { name: 'Brand Campaign', type: 'Search' as const, budgetMultiplier: 0.6 }
];

// Ad group templates
const adGroupTemplates = [
  'Exact Match - High Intent',
  'Phrase Match - Medium Intent',
  'Broad Match - Discovery',
  'Location Specific',
  'Competitor Terms',
  'Long Tail Keywords'
];

// Keyword templates for ultrasound services
const keywordTemplates = [
  { keyword: 'private ultrasound london', avgCpc: 4.50, qualityScore: 8 },
  { keyword: 'pregnancy scan harley street', avgCpc: 5.20, qualityScore: 9 },
  { keyword: 'early pregnancy scan', avgCpc: 3.80, qualityScore: 7 },
  { keyword: 'gender scan near me', avgCpc: 3.20, qualityScore: 8 },
  { keyword: '4d baby scan london', avgCpc: 6.50, qualityScore: 9 },
  { keyword: 'private pregnancy scan', avgCpc: 4.00, qualityScore: 8 },
  { keyword: 'ultrasound clinic london', avgCpc: 3.50, qualityScore: 7 },
  { keyword: 'emergency pregnancy scan', avgCpc: 7.20, qualityScore: 6 },
  { keyword: 'abdominal ultrasound private', avgCpc: 4.80, qualityScore: 7 },
  { keyword: 'pelvic scan london', avgCpc: 4.20, qualityScore: 8 },
  { keyword: 'harley street ultrasound', avgCpc: 5.50, qualityScore: 10 },
  { keyword: 'same day ultrasound london', avgCpc: 6.80, qualityScore: 7 },
  { keyword: '[competitor] alternative', avgCpc: 3.00, qualityScore: 6 },
  { keyword: 'best pregnancy scan london', avgCpc: 5.00, qualityScore: 8 },
  { keyword: 'nhs vs private scan', avgCpc: 2.50, qualityScore: 7 }
];

// Landing pages
const landingPages = [
  { url: '/pregnancy-scans', name: 'Pregnancy Scans', conversionMultiplier: 1.3 },
  { url: '/early-pregnancy', name: 'Early Pregnancy', conversionMultiplier: 1.2 },
  { url: '/gender-scan', name: 'Gender Scan', conversionMultiplier: 1.4 },
  { url: '/4d-scans', name: '4D Baby Scans', conversionMultiplier: 1.5 },
  { url: '/womens-health', name: 'Women\'s Health', conversionMultiplier: 1.0 },
  { url: '/book-now', name: 'Booking Page', conversionMultiplier: 2.0 },
  { url: '/', name: 'Homepage', conversionMultiplier: 0.8 },
  { url: '/about-us', name: 'About Us', conversionMultiplier: 0.6 },
  { url: '/prices', name: 'Pricing', conversionMultiplier: 1.1 }
];

// London locations for geographic performance
const locations = [
  { name: 'Central London', performanceMultiplier: 1.5 },
  { name: 'North London', performanceMultiplier: 1.2 },
  { name: 'South London', performanceMultiplier: 1.0 },
  { name: 'East London', performanceMultiplier: 0.9 },
  { name: 'West London', performanceMultiplier: 1.3 },
  { name: 'Greater London', performanceMultiplier: 0.8 },
  { name: 'Westminster', performanceMultiplier: 1.6 },
  { name: 'Camden', performanceMultiplier: 1.1 },
  { name: 'Kensington', performanceMultiplier: 1.4 },
  { name: 'City of London', performanceMultiplier: 1.7 }
];

// Generate campaigns
export const generateCampaigns = (): AdCampaign[] => {
  return campaignTemplates.map((template, index) => {
    const budget = 1000 * template.budgetMultiplier;
    const spend = budget * (0.75 + Math.random() * 0.23);
    const impressions = Math.floor(10000 * template.budgetMultiplier * (0.8 + Math.random() * 0.4));
    const ctr = template.type === 'Search' ? 0.03 + Math.random() * 0.04 : 0.001 + Math.random() * 0.002;
    const clicks = Math.floor(impressions * ctr);
    const conversionRate = template.type === 'Search' ? 0.03 + Math.random() * 0.04 : 0.01 + Math.random() * 0.02;
    const conversions = Math.floor(clicks * conversionRate);
    const avgOrderValue = 180 + Math.random() * 120;
    const revenue = conversions * avgOrderValue;
    
    return {
      id: `camp-${index + 1}`,
      name: template.name,
      type: template.type,
      status: Math.random() > 0.2 ? 'Active' : 'Paused',
      budget: budget,
      spend: spend,
      impressions: impressions,
      clicks: clicks,
      conversions: conversions,
      revenue: revenue,
      ctr: ctr,
      cpc: clicks > 0 ? spend / clicks : 0,
      cpa: conversions > 0 ? spend / conversions : 0,
      roas: spend > 0 ? revenue / spend : 0,
      qualityScore: Math.floor(6 + Math.random() * 4)
    };
  });
};

// Generate ad groups
export const generateAdGroups = (campaigns: AdCampaign[]): AdGroup[] => {
  const adGroups: AdGroup[] = [];
  
  campaigns.forEach((campaign) => {
    const numAdGroups = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numAdGroups; i++) {
      const template = adGroupTemplates[i % adGroupTemplates.length];
      const performanceRatio = 0.7 + Math.random() * 0.6;
      
      adGroups.push({
        id: `ag-${campaign.id}-${i + 1}`,
        campaignId: campaign.id,
        campaignName: campaign.name,
        name: `${campaign.name} - ${template}`,
        status: Math.random() > 0.1 ? 'Active' : 'Paused',
        impressions: Math.floor(campaign.impressions / numAdGroups * performanceRatio),
        clicks: Math.floor(campaign.clicks / numAdGroups * performanceRatio),
        conversions: Math.floor(campaign.conversions / numAdGroups * performanceRatio),
        spend: campaign.spend / numAdGroups * performanceRatio,
        revenue: campaign.revenue / numAdGroups * performanceRatio,
        ctr: campaign.ctr * (0.8 + Math.random() * 0.4),
        cpc: campaign.cpc * (0.9 + Math.random() * 0.2),
        cpa: campaign.cpa * (0.9 + Math.random() * 0.2)
      });
    }
  });
  
  return adGroups;
};

// Generate keywords
export const generateKeywords = (adGroups: AdGroup[]): Keyword[] => {
  const keywords: Keyword[] = [];
  
  adGroups.forEach((adGroup) => {
    const numKeywords = 5 + Math.floor(Math.random() * 10);
    for (let i = 0; i < numKeywords; i++) {
      const template = keywordTemplates[Math.floor(Math.random() * keywordTemplates.length)];
      const matchType = ['Exact', 'Phrase', 'Broad'][Math.floor(Math.random() * 3)] as 'Exact' | 'Phrase' | 'Broad';
      const performanceMultiplier = matchType === 'Exact' ? 1.2 : matchType === 'Phrase' ? 1.0 : 0.8;
      
      const impressions = Math.floor(adGroup.impressions / numKeywords * (0.5 + Math.random() * 2));
      const ctr = (0.02 + Math.random() * 0.08) * performanceMultiplier;
      const clicks = Math.floor(impressions * ctr);
      const conversionRate = (0.02 + Math.random() * 0.06) * performanceMultiplier;
      const conversions = Math.floor(clicks * conversionRate);
      const avgCpc = template.avgCpc * (0.8 + Math.random() * 0.4);
      const spend = clicks * avgCpc;
      const revenue = conversions * (180 + Math.random() * 120);
      
      keywords.push({
        id: `kw-${adGroup.id}-${i + 1}`,
        campaignId: adGroup.campaignId,
        adGroupId: adGroup.id,
        keyword: template.keyword,
        matchType: matchType,
        qualityScore: Math.max(1, Math.min(10, template.qualityScore + Math.floor((Math.random() - 0.5) * 3))),
        avgCpc: avgCpc,
        impressions: impressions,
        clicks: clicks,
        conversions: conversions,
        spend: spend,
        revenue: revenue,
        ctr: ctr,
        conversionRate: conversionRate,
        avgPosition: 1.5 + Math.random() * 3
      });
    }
  });
  
  return keywords;
};

// Generate landing page performance
export const generateLandingPagePerformance = (): LandingPagePerformance[] => {
  return landingPages.map((page) => {
    const sessions = Math.floor(500 + Math.random() * 2000);
    const bounceRate = 0.3 + Math.random() * 0.4;
    const conversionRate = (0.02 + Math.random() * 0.06) * page.conversionMultiplier;
    const conversions = Math.floor(sessions * (1 - bounceRate) * conversionRate);
    
    return {
      url: page.url,
      pageName: page.name,
      sessions: sessions,
      bounceRate: bounceRate,
      avgTimeOnPage: 60 + Math.random() * 180,
      conversions: conversions,
      conversionRate: conversionRate,
      revenue: conversions * (180 + Math.random() * 120),
      pageLoadTime: 1.5 + Math.random() * 2
    };
  });
};

// Generate geographic performance
export const generateGeographicPerformance = (): GeographicPerformance[] => {
  const baseMetrics = {
    impressions: 5000,
    clicks: 150,
    conversions: 5,
    spend: 500
  };
  
  return locations.map((location) => {
    const impressions = Math.floor(baseMetrics.impressions * location.performanceMultiplier * (0.7 + Math.random() * 0.6));
    const ctr = 0.02 + Math.random() * 0.04;
    const clicks = Math.floor(impressions * ctr);
    const conversionRate = 0.02 + Math.random() * 0.05;
    const conversions = Math.floor(clicks * conversionRate);
    const avgCpc = 3 + Math.random() * 2;
    const spend = clicks * avgCpc;
    const revenue = conversions * (180 + Math.random() * 120);
    
    return {
      location: location.name,
      impressions: impressions,
      clicks: clicks,
      conversions: conversions,
      spend: spend,
      revenue: revenue,
      ctr: ctr,
      cpa: conversions > 0 ? spend / conversions : 0
    };
  });
};

// Generate daily performance data
export const generateDailyPerformance = (days: number = 90): DailyPerformance[] => {
  const endDate = new Date();
  const startDate = subDays(endDate, days);
  const dailyData: DailyPerformance[] = [];
  
  for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekdayMultiplier = isWeekend ? 0.7 : 1.0;
    
    // Add some seasonality
    const monthMultiplier = [1.2, 1.1, 1.0, 0.9, 0.9, 0.8, 0.8, 0.7, 0.9, 1.0, 1.1, 1.3][d.getMonth()];
    
    const baseImpressions = 3000 * weekdayMultiplier * monthMultiplier;
    const impressions = Math.floor(baseImpressions * (0.8 + Math.random() * 0.4));
    const ctr = 0.03 + Math.random() * 0.02;
    const clicks = Math.floor(impressions * ctr);
    const conversionRate = 0.03 + Math.random() * 0.03;
    const conversions = Math.floor(clicks * conversionRate);
    const avgCpc = 3.5 + Math.random() * 1.5;
    const spend = clicks * avgCpc;
    const revenue = conversions * (180 + Math.random() * 120);
    
    dailyData.push({
      date: new Date(d),
      impressions: impressions,
      clicks: clicks,
      conversions: conversions,
      spend: spend,
      revenue: revenue,
      ctr: ctr,
      cpc: avgCpc,
      cpa: conversions > 0 ? spend / conversions : 0,
      roas: spend > 0 ? revenue / spend : 0
    });
  }
  
  return dailyData;
};

// Calculate KPIs
export const calculateKPIs = (
  campaigns: AdCampaign[],
  dailyData: DailyPerformance[]
) => {
  const activeCampaigns = campaigns.filter(c => c.status === 'Active');
  const last30Days = dailyData.slice(-30);
  const previous30Days = dailyData.slice(-60, -30);
  
  const totalSpend = last30Days.reduce((sum, d) => sum + d.spend, 0);
  const totalRevenue = last30Days.reduce((sum, d) => sum + d.revenue, 0);
  const totalConversions = last30Days.reduce((sum, d) => sum + d.conversions, 0);
  const totalClicks = last30Days.reduce((sum, d) => sum + d.clicks, 0);
  const totalImpressions = last30Days.reduce((sum, d) => sum + d.impressions, 0);
  
  const prevSpend = previous30Days.reduce((sum, d) => sum + d.spend, 0);
  const prevRevenue = previous30Days.reduce((sum, d) => sum + d.revenue, 0);
  const prevConversions = previous30Days.reduce((sum, d) => sum + d.conversions, 0);
  
  return {
    totalSpend: totalSpend,
    totalRevenue: totalRevenue,
    roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
    totalConversions: totalConversions,
    cpa: totalConversions > 0 ? totalSpend / totalConversions : 0,
    avgCtr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
    
    spendChange: prevSpend > 0 ? ((totalSpend - prevSpend) / prevSpend) * 100 : 0,
    revenueChange: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
    conversionsChange: prevConversions > 0 ? ((totalConversions - prevConversions) / prevConversions) * 100 : 0,
    
    activeCampaigns: activeCampaigns.length,
    totalCampaigns: campaigns.length
  };
}; 