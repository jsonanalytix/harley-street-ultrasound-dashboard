import { 
  addDays, 
  subDays, 
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  getDay
} from 'date-fns';

export interface OrganicTrafficData {
  date: string;
  sessions: number;
  users: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number; // in seconds
  newUsers: number;
  returningUsers: number;
  mobileTraffic: number;
  desktopTraffic: number;
  tabletTraffic: number;
}

export interface KeywordPerformance {
  keyword: string;
  position: number;
  previousPosition: number;
  impressions: number;
  clicks: number;
  ctr: number;
  searchVolume: number;
  difficulty: number;
  url: string;
  featured: boolean;
}

export interface LandingPagePerformance {
  url: string;
  title: string;
  sessions: number;
  bounceRate: number;
  avgTimeOnPage: number;
  conversions: number;
  conversionRate: number;
  entrances: number;
  exitRate: number;
}

export interface BlogPostPerformance {
  title: string;
  url: string;
  publishDate: string;
  author: string;
  category: string;
  views: number;
  avgTimeOnPage: number;
  shares: number;
  backlinks: number;
  organicTraffic: number;
  conversionRate: number;
}

export interface LocalSEOMetric {
  metric: string;
  value: number;
  previousValue: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface BacklinkProfile {
  totalBacklinks: number;
  referringDomains: number;
  domainAuthority: number;
  newBacklinks: number;
  lostBacklinks: number;
  followLinks: number;
  nofollowLinks: number;
  topReferrers: Array<{
    domain: string;
    authority: number;
    links: number;
    traffic: number;
  }>;
}

// Generate organic traffic data for the last 180 days
export const generateOrganicTrafficData = (): OrganicTrafficData[] => {
  const endDate = new Date();
  const startDate = subDays(endDate, 180);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return days.map(date => {
    const dayOfWeek = getDay(date);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Base traffic with seasonality and weekly patterns
    const baseTraffic = 450 + Math.sin(days.indexOf(date) / 30) * 100;
    const weekendModifier = isWeekend ? 0.7 : 1.1;
    const randomVariation = 0.8 + Math.random() * 0.4;
    
    const sessions = Math.floor(baseTraffic * weekendModifier * randomVariation);
    const users = Math.floor(sessions * 0.85);
    const pageviews = Math.floor(sessions * 2.3);
    
    const mobileRatio = 0.55 + Math.random() * 0.1;
    const desktopRatio = 0.35 + Math.random() * 0.1;
    const tabletRatio = 1 - mobileRatio - desktopRatio;
    
    return {
      date: format(date, 'yyyy-MM-dd'),
      sessions,
      users,
      pageviews,
      bounceRate: 35 + Math.random() * 15,
      avgSessionDuration: 120 + Math.random() * 60,
      newUsers: Math.floor(users * (0.4 + Math.random() * 0.2)),
      returningUsers: users - Math.floor(users * (0.4 + Math.random() * 0.2)),
      mobileTraffic: Math.floor(sessions * mobileRatio),
      desktopTraffic: Math.floor(sessions * desktopRatio),
      tabletTraffic: Math.floor(sessions * tabletRatio)
    };
  });
};

// Generate keyword performance data
export const generateKeywordPerformance = (): KeywordPerformance[] => {
  const keywords = [
    { keyword: "early pregnancy scan london", volume: 2400, difficulty: 65 },
    { keyword: "private ultrasound harley street", volume: 880, difficulty: 45 },
    { keyword: "4d baby scan london", volume: 1900, difficulty: 58 },
    { keyword: "gender scan near me", volume: 3200, difficulty: 42 },
    { keyword: "anomaly scan private london", volume: 720, difficulty: 52 },
    { keyword: "dating scan cost uk", volume: 1600, difficulty: 38 },
    { keyword: "viability scan harley street", volume: 390, difficulty: 35 },
    { keyword: "nuchal translucency scan london", volume: 480, difficulty: 48 },
    { keyword: "growth scan private", volume: 1100, difficulty: 40 },
    { keyword: "reassurance scan london", volume: 590, difficulty: 36 },
    { keyword: "3d ultrasound london", volume: 1300, difficulty: 55 },
    { keyword: "pregnancy scan packages", volume: 440, difficulty: 32 },
    { keyword: "fetal wellbeing scan", volume: 320, difficulty: 44 },
    { keyword: "cervical length scan", volume: 210, difficulty: 38 },
    { keyword: "doppler scan pregnancy", volume: 280, difficulty: 41 }
  ];

  const urls = [
    "/services/early-pregnancy-scan",
    "/services/4d-baby-scan",
    "/services/anomaly-scan",
    "/services/gender-scan",
    "/services/growth-scan",
    "/about/harley-street-clinic",
    "/",
    "/services",
    "/pricing",
    "/book-appointment"
  ];

  return keywords.map((kw, index) => {
    const currentPosition = Math.floor(Math.random() * 20) + 1;
    const previousPosition = currentPosition + Math.floor(Math.random() * 10) - 5;
    const impressions = Math.floor(kw.volume * (0.1 + Math.random() * 0.3));
    const ctrByPosition = currentPosition <= 3 ? 0.15 : currentPosition <= 10 ? 0.05 : 0.02;
    const clicks = Math.floor(impressions * ctrByPosition * (0.8 + Math.random() * 0.4));
    
    return {
      keyword: kw.keyword,
      position: currentPosition,
      previousPosition,
      impressions,
      clicks,
      ctr: clicks / impressions * 100,
      searchVolume: kw.volume,
      difficulty: kw.difficulty,
      url: urls[index % urls.length],
      featured: currentPosition <= 3 && Math.random() > 0.7
    };
  });
};

// Generate landing page performance data
export const generateLandingPagePerformance = (): LandingPagePerformance[] => {
  const pages = [
    { url: "/", title: "Home - Harley Street Ultrasound", baseTraffic: 2800 },
    { url: "/services/early-pregnancy-scan", title: "Early Pregnancy Scan", baseTraffic: 1200 },
    { url: "/services/4d-baby-scan", title: "4D Baby Scan", baseTraffic: 980 },
    { url: "/services/gender-scan", title: "Gender Reveal Scan", baseTraffic: 850 },
    { url: "/services/anomaly-scan", title: "Anomaly Scan", baseTraffic: 620 },
    { url: "/services/growth-scan", title: "Growth Scan", baseTraffic: 540 },
    { url: "/pricing", title: "Pricing & Packages", baseTraffic: 720 },
    { url: "/about", title: "About Us", baseTraffic: 380 },
    { url: "/blog", title: "Pregnancy Blog", baseTraffic: 460 },
    { url: "/contact", title: "Contact Us", baseTraffic: 320 }
  ];

  return pages.map(page => {
    const sessions = Math.floor(page.baseTraffic * (0.8 + Math.random() * 0.4));
    const bounceRate = page.url === "/" ? 25 + Math.random() * 10 : 35 + Math.random() * 20;
    const conversionRate = page.url.includes("services") ? 3 + Math.random() * 2 : 1 + Math.random();
    
    return {
      url: page.url,
      title: page.title,
      sessions,
      bounceRate,
      avgTimeOnPage: 60 + Math.random() * 120,
      conversions: Math.floor(sessions * conversionRate / 100),
      conversionRate,
      entrances: Math.floor(sessions * 0.7),
      exitRate: 20 + Math.random() * 30
    };
  });
};

// Generate blog post performance data
export const generateBlogPostPerformance = (): BlogPostPerformance[] => {
  const posts = [
    { title: "What to Expect During Your First Pregnancy Scan", category: "Pregnancy Guide", daysAgo: 15 },
    { title: "Understanding Nuchal Translucency Results", category: "Medical Info", daysAgo: 22 },
    { title: "Best Time for a 4D Baby Scan", category: "4D Scanning", daysAgo: 8 },
    { title: "Early Pregnancy Symptoms: When to Book a Scan", category: "Early Pregnancy", daysAgo: 30 },
    { title: "Gender Scan Accuracy: Everything You Need to Know", category: "Gender Reveal", daysAgo: 45 },
    { title: "Preparing for Your Anomaly Scan", category: "Medical Info", daysAgo: 12 },
    { title: "Twin Pregnancy: Special Scan Considerations", category: "Multiple Pregnancy", daysAgo: 38 },
    { title: "Understanding Growth Charts and Percentiles", category: "Growth Monitoring", daysAgo: 25 },
    { title: "Private vs NHS Scans: Making the Right Choice", category: "Pregnancy Guide", daysAgo: 18 },
    { title: "What is a Doppler Scan and When is it Needed?", category: "Medical Info", daysAgo: 52 }
  ];

  const authors = ["Dr. Sarah Mitchell", "Dr. Emma Thompson", "Midwife Jane Parker", "Dr. Michael Chen"];

  return posts.map(post => {
    const ageModifier = Math.max(0.3, 1 - (post.daysAgo / 100));
    const baseViews = 800 + Math.random() * 3000;
    const views = Math.floor(baseViews * ageModifier);
    const organicTraffic = Math.floor(views * (0.6 + Math.random() * 0.3));
    
    return {
      title: post.title,
      url: `/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      publishDate: format(subDays(new Date(), post.daysAgo), 'yyyy-MM-dd'),
      author: authors[Math.floor(Math.random() * authors.length)],
      category: post.category,
      views,
      avgTimeOnPage: 180 + Math.random() * 120,
      shares: Math.floor(views * 0.02 * Math.random()),
      backlinks: Math.floor(Math.random() * 15),
      organicTraffic,
      conversionRate: 1.5 + Math.random() * 2
    };
  });
};

// Generate local SEO metrics
export const generateLocalSEOMetrics = (): LocalSEOMetric[] => {
  return [
    { 
      metric: "Google My Business Views", 
      value: 8420, 
      previousValue: 7650, 
      change: 10.1,
      trend: 'up' 
    },
    { 
      metric: "GMB Search Queries", 
      value: 3250, 
      previousValue: 2980, 
      change: 9.1,
      trend: 'up' 
    },
    { 
      metric: "Direction Requests", 
      value: 482, 
      previousValue: 445, 
      change: 8.3,
      trend: 'up' 
    },
    { 
      metric: "Phone Calls from GMB", 
      value: 168, 
      previousValue: 152, 
      change: 10.5,
      trend: 'up' 
    },
    { 
      metric: "Google Reviews", 
      value: 487, 
      previousValue: 465, 
      change: 4.7,
      trend: 'up' 
    },
    { 
      metric: "Average Review Rating", 
      value: 4.8, 
      previousValue: 4.8, 
      change: 0,
      trend: 'stable' 
    },
    { 
      metric: "Local Pack Rankings", 
      value: 2.3, 
      previousValue: 2.8, 
      change: -17.9,
      trend: 'up' // Lower is better for rankings
    },
    { 
      metric: "Citation Consistency", 
      value: 94, 
      previousValue: 92, 
      change: 2.2,
      trend: 'up' 
    }
  ];
};

// Generate backlink profile data
export const generateBacklinkProfile = (): BacklinkProfile => {
  return {
    totalBacklinks: 2847,
    referringDomains: 342,
    domainAuthority: 52,
    newBacklinks: 127,
    lostBacklinks: 38,
    followLinks: 2145,
    nofollowLinks: 702,
    topReferrers: [
      { domain: "mumsnet.com", authority: 78, links: 45, traffic: 1250 },
      { domain: "netmums.com", authority: 65, links: 38, traffic: 980 },
      { domain: "nhs.uk", authority: 92, links: 12, traffic: 2100 },
      { domain: "babycentre.co.uk", authority: 71, links: 28, traffic: 760 },
      { domain: "whattoexpect.com", authority: 68, links: 22, traffic: 540 },
      { domain: "londoncityguide.com", authority: 45, links: 18, traffic: 320 },
      { domain: "harleystreet.com", authority: 58, links: 15, traffic: 480 },
      { domain: "pregnancymagazine.co.uk", authority: 42, links: 12, traffic: 280 }
    ]
  };
};

// Calculate KPIs
export const calculateKPIs = (
  trafficData: OrganicTrafficData[],
  keywords: KeywordPerformance[],
  pages: LandingPagePerformance[],
  backlinks: BacklinkProfile
) => {
  const last30Days = trafficData.slice(-30);
  const previous30Days = trafficData.slice(-60, -30);
  
  const currentSessions = last30Days.reduce((sum, d) => sum + d.sessions, 0);
  const previousSessions = previous30Days.reduce((sum, d) => sum + d.sessions, 0);
  
  const currentConversions = pages.reduce((sum, p) => sum + p.conversions, 0);
  const avgConversionRate = currentConversions / currentSessions * 100;
  
  const topKeywords = keywords.filter(k => k.position <= 10).length;
  const featuredSnippets = keywords.filter(k => k.featured).length;
  
  return {
    totalOrganicSessions: {
      value: currentSessions,
      change: ((currentSessions - previousSessions) / previousSessions) * 100,
      label: "Organic Sessions (30d)"
    },
    avgOrganicConversionRate: {
      value: avgConversionRate,
      change: 8.5, // Mock change
      label: "Organic Conversion Rate"
    },
    topRankingKeywords: {
      value: topKeywords,
      change: 15.2,
      label: "Top 10 Keywords"
    },
    domainAuthority: {
      value: backlinks.domainAuthority,
      change: 2.1,
      label: "Domain Authority"
    }
  };
}; 