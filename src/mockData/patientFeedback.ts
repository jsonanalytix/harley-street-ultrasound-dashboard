import { subDays, format, startOfWeek, subWeeks } from 'date-fns';

export interface FeedbackRecord {
  id: string;
  patientId: string;
  patientName: string;
  appointmentDate: Date;
  feedbackDate: Date;
  service: string;
  clinician: string;
  overallRating: number; // 1-5
  npsScore: number; // 0-10
  dimensions: {
    careQuality: number; // 1-5
    facility: number; // 1-5
    bookingProcess: number; // 1-5
    valueForMoney: number; // 1-5
    waitTime: number; // 1-5
    communication: number; // 1-5
  };
  feedbackText?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  wouldRecommend: boolean;
  tags: string[];
  responseTime: number; // hours from appointment to feedback
}

export interface ClinicianRating {
  clinician: string;
  totalFeedbacks: number;
  averageRating: number;
  averageNPS: number;
  dimensions: {
    careQuality: number;
    communication: number;
  };
  positivePercentage: number;
  topTags: { tag: string; count: number }[];
}

export interface NPSTrend {
  period: string;
  promoters: number;
  passives: number;
  detractors: number;
  npsScore: number;
  totalResponses: number;
  responseRate: number;
}

export interface DimensionAnalysis {
  dimension: string;
  averageScore: number;
  trend: number; // percentage change
  distribution: {
    score: number;
    count: number;
  }[];
  correlation: number; // correlation with NPS
}

// Service list
const services = [
  'Early Pregnancy Scan',
  'Dating Scan (12 weeks)',
  'Anomaly Scan (20 weeks)',
  'Growth Scan',
  '4D Baby Scan',
  'Breast Screening',
  'Breast Lump Assessment',
  'Pelvic Ultrasound',
  'Transvaginal Scan',
  'Fertility Assessment',
  'Shoulder Ultrasound',
  'Knee Ultrasound',
  'Hip Screening (Baby)',
  'Testicular Ultrasound',
  'Prostate Assessment',
];

const clinicians = [
  'Dr. Kate Hawtin',
  'Dr. Ayman Mahfouz',
  'Ms. Heba Alkutbi',
  'Dr. Hela Sbano',
  'Dr. Sophie Pattison',
  'Dr. Nikhil Patel',
  'Dr. Shayan Ahmed',
  'Dr. Trevor Gaunt'
];

// Feedback text templates by sentiment
const positiveFeedback = [
  "Excellent service! The staff were incredibly professional and caring.",
  "Dr. {clinician} was amazing - took time to explain everything clearly.",
  "Very impressed with the facilities and the quick appointment availability.",
  "The whole experience was seamless from booking to results.",
  "Outstanding care and attention to detail. Highly recommend!",
  "Felt very comfortable and well-informed throughout the procedure.",
  "Best ultrasound experience I've had. The 4D images were incredible!",
  "Quick, efficient, and professional. Couldn't ask for better service.",
  "The sonographer was gentle and reassuring - made all the difference.",
  "Impressed by the modern equipment and expertise of the staff."
];

const neutralFeedback = [
  "Service was okay, nothing particularly special.",
  "The appointment went as expected.",
  "Standard ultrasound experience, no complaints.",
  "Everything was fine, though waiting time was a bit longer than expected.",
  "Adequate service, results were delivered on time.",
  "The scan was done professionally, though felt a bit rushed."
];

const negativeFeedback = [
  "Had to wait 45 minutes past my appointment time.",
  "The receptionist was quite dismissive and unhelpful.",
  "Pricing seems high compared to other clinics.",
  "Communication about results was poor - had to chase multiple times.",
  "The facility felt dated and could use renovation.",
  "Felt rushed during the appointment, didn't get all my questions answered.",
  "Booking system is confusing and not user-friendly.",
  "Parking was a nightmare - very limited spaces available."
];

// Common tags
const positiveTags = [
  'Professional', 'Caring', 'Thorough', 'Clean facility', 'Easy booking',
  'Quick results', 'Excellent communication', 'Modern equipment', 'Comfortable',
  'Knowledgeable', 'Reassuring', 'Efficient', 'Friendly staff'
];

const neutralTags = [
  'Average experience', 'As expected', 'Standard service', 'Acceptable'
];

const negativeTags = [
  'Long wait', 'Poor communication', 'Expensive', 'Rushed appointment',
  'Parking issues', 'Outdated facility', 'Unfriendly staff', 'Booking problems'
];

// Generate feedback records
export const generateFeedbackRecords = (): FeedbackRecord[] => {
  const records: FeedbackRecord[] = [];
  let recordId = 1000;
  
  // Generate records for the last 180 days
  for (let daysAgo = 0; daysAgo < 180; daysAgo++) {
    const appointmentDate = subDays(new Date(), daysAgo);
    const dayOfWeek = appointmentDate.getDay();
    
    // Skip Sundays
    if (dayOfWeek === 0) continue;
    
    // Generate 5-15 feedbacks per day with response rate of 60-80%
    const dailyAppointments = 20 + Math.floor(Math.random() * 15);
    const responseRate = 0.6 + Math.random() * 0.2;
    const dailyFeedbacks = Math.floor(dailyAppointments * responseRate);
    
    for (let i = 0; i < dailyFeedbacks; i++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const clinician = clinicians[Math.floor(Math.random() * clinicians.length)];
      
      // Response time: 1-72 hours after appointment
      const responseTime = 1 + Math.random() * 71;
      const feedbackDate = new Date(appointmentDate.getTime() + responseTime * 60 * 60 * 1000);
      
      // Generate NPS score with realistic distribution
      // 40% promoters (9-10), 40% passives (7-8), 20% detractors (0-6)
      let npsScore: number;
      const npsRandom = Math.random();
      if (npsRandom < 0.2) {
        npsScore = Math.floor(Math.random() * 7); // 0-6 detractors
      } else if (npsRandom < 0.6) {
        npsScore = 7 + Math.floor(Math.random() * 2); // 7-8 passives
      } else {
        npsScore = 9 + Math.floor(Math.random() * 2); // 9-10 promoters
      }
      
      // Overall rating correlates with NPS
      let overallRating: number;
      if (npsScore >= 9) {
        overallRating = 4 + Math.floor(Math.random() * 2); // 4-5
      } else if (npsScore >= 7) {
        overallRating = 3 + Math.floor(Math.random() * 2); // 3-4
      } else {
        overallRating = 1 + Math.floor(Math.random() * 3); // 1-3
      }
      
      // Generate dimension scores based on overall sentiment
      const baseScore = overallRating;
      const dimensions = {
        careQuality: Math.max(1, Math.min(5, baseScore + (Math.random() - 0.5))),
        facility: Math.max(1, Math.min(5, baseScore + (Math.random() - 0.5))),
        bookingProcess: Math.max(1, Math.min(5, baseScore + (Math.random() - 0.5))),
        valueForMoney: Math.max(1, Math.min(5, baseScore - 0.5 + (Math.random() - 0.5))), // Slightly lower
        waitTime: Math.max(1, Math.min(5, baseScore + (Math.random() - 0.5))),
        communication: Math.max(1, Math.min(5, baseScore + (Math.random() - 0.5))),
      };
      
      // Determine sentiment
      let sentiment: 'positive' | 'neutral' | 'negative';
      let feedbackText: string | undefined;
      let tags: string[] = [];
      
      if (npsScore >= 9) {
        sentiment = 'positive';
        feedbackText = positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)]
          .replace('{clinician}', clinician.replace('Dr. ', '').replace('Ms. ', ''));
        tags = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => 
          positiveTags[Math.floor(Math.random() * positiveTags.length)]
        ).filter((tag, index, self) => self.indexOf(tag) === index);
      } else if (npsScore >= 7) {
        sentiment = 'neutral';
        if (Math.random() < 0.6) { // 60% leave feedback
          feedbackText = neutralFeedback[Math.floor(Math.random() * neutralFeedback.length)];
          tags = Array.from({ length: 1 + Math.floor(Math.random() * 2) }, () => 
            neutralTags[Math.floor(Math.random() * neutralTags.length)]
          ).filter((tag, index, self) => self.indexOf(tag) === index);
        }
      } else {
        sentiment = 'negative';
        feedbackText = negativeFeedback[Math.floor(Math.random() * negativeFeedback.length)];
        tags = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => 
          negativeTags[Math.floor(Math.random() * negativeTags.length)]
        ).filter((tag, index, self) => self.indexOf(tag) === index);
      }
      
      records.push({
        id: `FB-${recordId++}`,
        patientId: `PAT-${Math.floor(Math.random() * 10000)}`,
        patientName: `Patient ${recordId}`,
        appointmentDate,
        feedbackDate,
        service,
        clinician,
        overallRating,
        npsScore,
        dimensions,
        feedbackText,
        sentiment,
        wouldRecommend: npsScore >= 7,
        tags,
        responseTime,
      });
    }
  }
  
  return records.sort((a, b) => b.feedbackDate.getTime() - a.feedbackDate.getTime());
};

// Calculate clinician ratings
export const calculateClinicianRatings = (records: FeedbackRecord[]): ClinicianRating[] => {
  const clinicianStats = new Map<string, {
    feedbacks: FeedbackRecord[];
    tagCounts: Map<string, number>;
  }>();
  
  // Initialize clinician stats
  clinicians.forEach(clinician => {
    clinicianStats.set(clinician, {
      feedbacks: [],
      tagCounts: new Map(),
    });
  });
  
  // Process records
  records.forEach(record => {
    const stats = clinicianStats.get(record.clinician);
    if (stats) {
      stats.feedbacks.push(record);
      record.tags.forEach(tag => {
        stats.tagCounts.set(tag, (stats.tagCounts.get(tag) || 0) + 1);
      });
    }
  });
  
  // Calculate ratings
  return Array.from(clinicianStats.entries()).map(([clinician, stats]) => {
    const feedbacks = stats.feedbacks;
    const totalFeedbacks = feedbacks.length;
    
    if (totalFeedbacks === 0) {
      return {
        clinician,
        totalFeedbacks: 0,
        averageRating: 0,
        averageNPS: 0,
        dimensions: { careQuality: 0, communication: 0 },
        positivePercentage: 0,
        topTags: [],
      };
    }
    
    const averageRating = feedbacks.reduce((sum, f) => sum + f.overallRating, 0) / totalFeedbacks;
    const averageNPS = feedbacks.reduce((sum, f) => sum + f.npsScore, 0) / totalFeedbacks;
    const positiveCount = feedbacks.filter(f => f.sentiment === 'positive').length;
    
    const dimensions = {
      careQuality: feedbacks.reduce((sum, f) => sum + f.dimensions.careQuality, 0) / totalFeedbacks,
      communication: feedbacks.reduce((sum, f) => sum + f.dimensions.communication, 0) / totalFeedbacks,
    };
    
    const topTags = Array.from(stats.tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
    
    return {
      clinician,
      totalFeedbacks,
      averageRating: Math.round(averageRating * 10) / 10,
      averageNPS: Math.round(averageNPS * 10) / 10,
      dimensions: {
        careQuality: Math.round(dimensions.careQuality * 10) / 10,
        communication: Math.round(dimensions.communication * 10) / 10,
      },
      positivePercentage: Math.round((positiveCount / totalFeedbacks) * 100),
      topTags,
    };
  }).sort((a, b) => b.averageRating - a.averageRating);
};

// Calculate NPS trends
export const calculateNPSTrends = (records: FeedbackRecord[]): NPSTrend[] => {
  const trends: NPSTrend[] = [];
  
  // Calculate for last 12 weeks
  for (let i = 11; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekRecords = records.filter(r => 
      r.feedbackDate >= weekStart && r.feedbackDate <= weekEnd
    );
    
    const promoters = weekRecords.filter(r => r.npsScore >= 9).length;
    const passives = weekRecords.filter(r => r.npsScore >= 7 && r.npsScore <= 8).length;
    const detractors = weekRecords.filter(r => r.npsScore <= 6).length;
    const totalResponses = weekRecords.length;
    
    const npsScore = totalResponses > 0 ? 
      ((promoters - detractors) / totalResponses) * 100 : 0;
    
    // Estimate response rate (assuming 30 appointments per day average)
    const responseRate = totalResponses / (30 * 6) * 100; // 6 working days
    
    trends.push({
      period: format(weekStart, 'MMM dd'),
      promoters,
      passives,
      detractors,
      npsScore: Math.round(npsScore),
      totalResponses,
      responseRate: Math.round(responseRate),
    });
  }
  
  return trends;
};

// Analyze dimensions
export const analyzeDimensions = (records: FeedbackRecord[]): DimensionAnalysis[] => {
  const dimensions = [
    { key: 'careQuality', label: 'Care Quality' },
    { key: 'facility', label: 'Facility & Equipment' },
    { key: 'bookingProcess', label: 'Booking Process' },
    { key: 'valueForMoney', label: 'Value for Money' },
    { key: 'waitTime', label: 'Wait Time' },
    { key: 'communication', label: 'Communication' },
  ];
  
  return dimensions.map(({ key, label }) => {
    const scores = records.map(r => r.dimensions[key as keyof typeof r.dimensions]);
    const npsScores = records.map(r => r.npsScore);
    
    // Calculate average
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // Calculate distribution
    const distribution = [1, 2, 3, 4, 5].map(score => ({
      score,
      count: scores.filter(s => Math.round(s) === score).length,
    }));
    
    // Calculate correlation with NPS (simplified)
    const correlation = calculateCorrelation(scores, npsScores);
    
    // Calculate trend (compare last 30 days with previous 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const sixtyDaysAgo = subDays(new Date(), 60);
    
    const recentScores = records
      .filter(r => r.feedbackDate >= thirtyDaysAgo)
      .map(r => r.dimensions[key as keyof typeof r.dimensions]);
    
    const previousScores = records
      .filter(r => r.feedbackDate >= sixtyDaysAgo && r.feedbackDate < thirtyDaysAgo)
      .map(r => r.dimensions[key as keyof typeof r.dimensions]);
    
    const recentAvg = recentScores.length > 0 ? 
      recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length : 0;
    
    const previousAvg = previousScores.length > 0 ?
      previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length : 0;
    
    const trend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
    
    return {
      dimension: label,
      averageScore: Math.round(averageScore * 10) / 10,
      trend: Math.round(trend * 10) / 10,
      distribution,
      correlation: Math.round(correlation * 100) / 100,
    };
  }).sort((a, b) => b.correlation - a.correlation);
};

// Helper function to calculate correlation
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
  const sumX2 = x.map(xi => xi * xi).reduce((a, b) => a + b, 0);
  const sumY2 = y.map(yi => yi * yi).reduce((a, b) => a + b, 0);
  
  const correlation = (n * sumXY - sumX * sumY) / 
    Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return isNaN(correlation) ? 0 : correlation;
}

// Generate word cloud data
export const generateWordCloudData = (records: FeedbackRecord[]): { text: string; value: number }[] => {
  const wordCounts = new Map<string, number>();
  
  // Count tags
  records.forEach(record => {
    record.tags.forEach(tag => {
      wordCounts.set(tag, (wordCounts.get(tag) || 0) + 1);
    });
  });
  
  // Convert to array and sort by count
  return Array.from(wordCounts.entries())
    .map(([text, count]) => ({ text, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 30); // Top 30 words
};

// KPIs
export const feedbackKPIs = {
  currentNPS: 42,
  npsChange: 5.2,
  averageRating: 4.2,
  responseRate: 68.5,
  totalResponses: 3847,
  satisfactionScore: 84, // % of 4-5 star ratings
  topPerformingDimension: 'Care Quality',
  lowestPerformingDimension: 'Value for Money',
}; 