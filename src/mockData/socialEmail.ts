import { addDays, subDays, format, startOfWeek, endOfWeek } from 'date-fns';

export interface EmailCampaign {
  id: string;
  name: string;
  type: 'Newsletter' | 'Promotional' | 'Service Update' | 'Follow-up' | 'Re-engagement';
  subject: string;
  sentDate: Date;
  recipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  bounced: number;
  conversions: number;
  revenue: number;
  segmentType: 'All Patients' | 'New Patients' | 'Pregnancy' | 'Women\'s Health' | 'MSK' | 'Inactive';
}

export interface SocialPost {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'LinkedIn';
  type: 'Organic' | 'Paid';
  postType: 'Image' | 'Video' | 'Carousel' | 'Story' | 'Reel';
  content: string;
  date: Date;
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
  saves?: number;
  conversions: number;
  spend?: number;
  revenue?: number;
}

export interface WhatsAppCampaign {
  id: string;
  name: string;
  type: 'Appointment Reminder' | 'Follow-up' | 'Promotional' | 'Service Alert';
  date: Date;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  optOut: number;
  conversions: number;
}

export interface ChannelGrowth {
  date: Date;
  channel: 'Email' | 'Facebook' | 'Instagram' | 'LinkedIn' | 'WhatsApp';
  subscribers: number;
  growth: number;
}

// Email subject lines with realistic performance
const emailSubjects = [
  { subject: "Your pregnancy scan is due - Book now with 20% off", openRate: 0.42, ctr: 0.15 },
  { subject: "New: 4D baby scanning now available", openRate: 0.35, ctr: 0.12 },
  { subject: "Important: Updated COVID-19 safety measures", openRate: 0.68, ctr: 0.08 },
  { subject: "Last chance: January health check special", openRate: 0.38, ctr: 0.18 },
  { subject: "Thank you for choosing Harley Street Ultrasound", openRate: 0.55, ctr: 0.05 },
  { subject: "Reminder: Your appointment tomorrow at 2:30 PM", openRate: 0.72, ctr: 0.03 },
  { subject: "Meet our new consultant sonographer", openRate: 0.28, ctr: 0.07 },
  { subject: "5 signs you might need a pelvic scan", openRate: 0.45, ctr: 0.14 },
  { subject: "Exclusive: VIP patient loyalty rewards", openRate: 0.48, ctr: 0.22 },
  { subject: "Weekend availability for urgent scans", openRate: 0.33, ctr: 0.11 }
];

const socialContent = [
  { content: "Meet baby Oliver! Our patient Sarah sharing her 4D scan experience", type: "Image", engagementRate: 0.08 },
  { content: "Early pregnancy symptoms you shouldn't ignore", type: "Carousel", engagementRate: 0.12 },
  { content: "Behind the scenes: A day in our ultrasound clinic", type: "Video", engagementRate: 0.15 },
  { content: "New year, new health goals. Book your check-up today", type: "Image", engagementRate: 0.06 },
  { content: "Patient testimonial: 'The care was exceptional'", type: "Reel", engagementRate: 0.18 },
  { content: "Understanding your scan results - expert tips", type: "Carousel", engagementRate: 0.10 },
  { content: "We're hiring! Join our team of healthcare professionals", type: "Image", engagementRate: 0.04 },
  { content: "Myth-busting: Common ultrasound misconceptions", type: "Video", engagementRate: 0.11 },
  { content: "Celebrating 10 years of excellence in ultrasound care", type: "Story", engagementRate: 0.09 },
  { content: "Q&A with Dr. Smith - Your pregnancy questions answered", type: "Video", engagementRate: 0.14 }
];

export const generateEmailCampaigns = (): EmailCampaign[] => {
  const campaigns: EmailCampaign[] = [];
  const endDate = new Date();
  const startDate = subDays(endDate, 180);
  
  // Generate 2-3 campaigns per week
  for (let date = startDate; date <= endDate; date = addDays(date, Math.floor(Math.random() * 4) + 2)) {
    const subjectData = emailSubjects[Math.floor(Math.random() * emailSubjects.length)];
    const campaignType = ['Newsletter', 'Promotional', 'Service Update', 'Follow-up', 'Re-engagement'][Math.floor(Math.random() * 5)] as EmailCampaign['type'];
    const segmentType = ['All Patients', 'New Patients', 'Pregnancy', 'Women\'s Health', 'MSK', 'Inactive'][Math.floor(Math.random() * 6)] as EmailCampaign['segmentType'];
    
    const recipients = segmentType === 'All Patients' ? 8500 + Math.floor(Math.random() * 1500) :
                      segmentType === 'Pregnancy' ? 2500 + Math.floor(Math.random() * 500) :
                      segmentType === 'New Patients' ? 800 + Math.floor(Math.random() * 200) :
                      1500 + Math.floor(Math.random() * 500);
    
    const deliveryRate = 0.95 + Math.random() * 0.03;
    const delivered = Math.floor(recipients * deliveryRate);
    const opened = Math.floor(delivered * (subjectData.openRate + (Math.random() - 0.5) * 0.1));
    const clicked = Math.floor(opened * (subjectData.ctr + (Math.random() - 0.5) * 0.05));
    const unsubscribed = Math.floor(recipients * (0.002 + Math.random() * 0.003));
    const bounced = recipients - delivered;
    
    // Higher conversion for targeted campaigns
    const conversionRate = campaignType === 'Promotional' ? 0.08 + Math.random() * 0.04 :
                          campaignType === 'Follow-up' ? 0.12 + Math.random() * 0.06 :
                          0.04 + Math.random() * 0.03;
    const conversions = Math.floor(clicked * conversionRate);
    const revenue = conversions * (150 + Math.random() * 100);
    
    campaigns.push({
      id: `email-${campaigns.length + 1}`,
      name: `${campaignType} - ${format(date, 'MMM dd')}`,
      type: campaignType,
      subject: subjectData.subject,
      sentDate: date,
      recipients,
      delivered,
      opened,
      clicked,
      unsubscribed,
      bounced,
      conversions,
      revenue,
      segmentType
    });
  }
  
  return campaigns.sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime());
};

export const generateSocialPosts = (): SocialPost[] => {
  const posts: SocialPost[] = [];
  const endDate = new Date();
  const startDate = subDays(endDate, 90);
  
  // Generate posts for each platform
  const platforms = ['Facebook', 'Instagram', 'LinkedIn'] as const;
  
  for (const platform of platforms) {
    const postsPerWeek = platform === 'Instagram' ? 5 : platform === 'Facebook' ? 3 : 2;
    
    for (let date = startDate; date <= endDate; date = addDays(date, Math.floor(7 / postsPerWeek))) {
      const contentData = socialContent[Math.floor(Math.random() * socialContent.length)];
      const isOrganic = Math.random() > 0.3;
      
      const baseReach = platform === 'Facebook' ? 3000 : platform === 'Instagram' ? 2500 : 1500;
      const reach = isOrganic ? 
        Math.floor(baseReach * (0.5 + Math.random() * 0.5)) :
        Math.floor(baseReach * (2 + Math.random() * 3));
      
      const impressions = Math.floor(reach * (1.2 + Math.random() * 0.8));
      const engagementRate = contentData.engagementRate + (Math.random() - 0.5) * 0.04;
      const engagement = Math.floor(reach * engagementRate);
      
      const likes = Math.floor(engagement * 0.7);
      const comments = Math.floor(engagement * 0.2);
      const shares = Math.floor(engagement * 0.1);
      const clicks = Math.floor(reach * (0.02 + Math.random() * 0.03));
      const conversions = isOrganic ? 0 : Math.floor(clicks * (0.05 + Math.random() * 0.05));
      
      posts.push({
        id: `${platform.toLowerCase()}-${posts.length + 1}`,
        platform,
        type: isOrganic ? 'Organic' : 'Paid',
        postType: contentData.type as SocialPost['postType'],
        content: contentData.content,
        date,
        reach,
        impressions,
        engagement,
        clicks,
        shares,
        comments,
        likes,
        saves: platform === 'Instagram' ? Math.floor(engagement * 0.15) : undefined,
        conversions,
        spend: isOrganic ? undefined : 50 + Math.random() * 150,
        revenue: conversions * (180 + Math.random() * 120)
      });
    }
  }
  
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const generateWhatsAppCampaigns = (): WhatsAppCampaign[] => {
  const campaigns: WhatsAppCampaign[] = [];
  const endDate = new Date();
  const startDate = subDays(endDate, 90);
  
  // Daily appointment reminders
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const appointmentCount = 20 + Math.floor(Math.random() * 15);
    campaigns.push({
      id: `wa-reminder-${format(date, 'yyyy-MM-dd')}`,
      name: `Appointment Reminders - ${format(date, 'MMM dd')}`,
      type: 'Appointment Reminder',
      date,
      sent: appointmentCount,
      delivered: Math.floor(appointmentCount * 0.98),
      read: Math.floor(appointmentCount * 0.92),
      replied: Math.floor(appointmentCount * 0.15),
      optOut: Math.random() > 0.9 ? 1 : 0,
      conversions: 0 // Reminders don't directly convert
    });
  }
  
  // Weekly promotional campaigns
  for (let date = startDate; date <= endDate; date = addDays(date, 7)) {
    const sent = 500 + Math.floor(Math.random() * 300);
    const delivered = Math.floor(sent * 0.96);
    const read = Math.floor(delivered * 0.78);
    const replied = Math.floor(read * 0.08);
    
    campaigns.push({
      id: `wa-promo-${campaigns.length + 1}`,
      name: `Weekly Offers - ${format(date, 'MMM dd')}`,
      type: 'Promotional',
      date,
      sent,
      delivered,
      read,
      replied,
      optOut: Math.floor(sent * 0.005),
      conversions: Math.floor(replied * 0.25)
    });
  }
  
  return campaigns.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const generateChannelGrowth = (): ChannelGrowth[] => {
  const growth: ChannelGrowth[] = [];
  const endDate = new Date();
  const startDate = subDays(endDate, 180);
  
  const channels = [
    { name: 'Email', baseSubscribers: 8000, monthlyGrowthRate: 0.025 },
    { name: 'Facebook', baseSubscribers: 4500, monthlyGrowthRate: 0.015 },
    { name: 'Instagram', baseSubscribers: 3200, monthlyGrowthRate: 0.035 },
    { name: 'LinkedIn', baseSubscribers: 1800, monthlyGrowthRate: 0.02 },
    { name: 'WhatsApp', baseSubscribers: 2500, monthlyGrowthRate: 0.04 }
  ];
  
  // Weekly snapshots
  for (let date = startDate; date <= endDate; date = addDays(date, 7)) {
    const weeksSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    channels.forEach(channel => {
      const weeklyGrowthRate = channel.monthlyGrowthRate / 4;
      const randomVariation = 1 + (Math.random() - 0.5) * 0.1;
      const subscribers = Math.floor(
        channel.baseSubscribers * Math.pow(1 + weeklyGrowthRate * randomVariation, weeksSinceStart)
      );
      
      const previousWeekSubs = weeksSinceStart > 0 ? 
        growth.find(g => g.channel === channel.name && 
          g.date.getTime() === subDays(date, 7).getTime())?.subscribers || 
          channel.baseSubscribers : 
        channel.baseSubscribers;
      
      growth.push({
        date,
        channel: channel.name as ChannelGrowth['channel'],
        subscribers,
        growth: subscribers - previousWeekSubs
      });
    });
  }
  
  return growth;
};

// Calculate summary KPIs
const emailCampaigns = generateEmailCampaigns();
const socialPosts = generateSocialPosts();
const whatsAppCampaigns = generateWhatsAppCampaigns();
const channelGrowth = generateChannelGrowth();

const recentEmails = emailCampaigns.filter(e => e.sentDate >= subDays(new Date(), 30));
const recentSocial = socialPosts.filter(p => p.date >= subDays(new Date(), 30));
const recentWhatsApp = whatsAppCampaigns.filter(w => w.date >= subDays(new Date(), 30));

const totalEmailSent = recentEmails.reduce((sum, e) => sum + e.recipients, 0);
const totalEmailOpened = recentEmails.reduce((sum, e) => sum + e.opened, 0);
const totalEmailClicked = recentEmails.reduce((sum, e) => sum + e.clicked, 0);
const totalEmailRevenue = recentEmails.reduce((sum, e) => sum + e.revenue, 0);

const totalSocialReach = recentSocial.reduce((sum, p) => sum + p.reach, 0);
const totalSocialEngagement = recentSocial.reduce((sum, p) => sum + p.engagement, 0);
const paidSocialSpend = recentSocial.filter(p => p.type === 'Paid').reduce((sum, p) => sum + (p.spend || 0), 0);
const paidSocialRevenue = recentSocial.filter(p => p.type === 'Paid').reduce((sum, p) => sum + (p.revenue || 0), 0);

const latestGrowth = channelGrowth.filter(g => g.date.getTime() === Math.max(...channelGrowth.map(g => g.date.getTime())));
const totalSubscribers = latestGrowth.reduce((sum, g) => sum + g.subscribers, 0);

export const kpis = {
  emailOpenRate: totalEmailSent > 0 ? ((totalEmailOpened / totalEmailSent) * 100).toFixed(1) + '%' : '0%',
  emailCTR: totalEmailOpened > 0 ? ((totalEmailClicked / totalEmailOpened) * 100).toFixed(1) + '%' : '0%',
  emailRevenue: totalEmailRevenue,
  socialEngagementRate: totalSocialReach > 0 ? ((totalSocialEngagement / totalSocialReach) * 100).toFixed(1) + '%' : '0%',
  socialROAS: paidSocialSpend > 0 ? (paidSocialRevenue / paidSocialSpend).toFixed(2) : '0',
  totalAudience: totalSubscribers,
  whatsAppReadRate: '78.5%',
  monthlyGrowth: '+4.2%'
}; 