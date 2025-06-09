import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  Mail, MessageCircle, TrendingUp, Users, DollarSign, Heart, PoundSterling,
  Share2, MessageSquare, Instagram, Linkedin, Send, MousePointer
} from 'lucide-react';
import { 
  generateEmailCampaigns, 
  generateSocialPosts, 
  generateWhatsAppCampaigns,
  generateChannelGrowth,
  kpis 
} from '@/mockData/socialEmail';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

export const SocialEmail: React.FC = () => {
  const { emailCampaigns, socialPosts, whatsAppCampaigns, channelGrowth } = useMemo(() => ({
    emailCampaigns: generateEmailCampaigns(),
    socialPosts: generateSocialPosts(),
    whatsAppCampaigns: generateWhatsAppCampaigns(),
    channelGrowth: generateChannelGrowth()
  }), []);

  // Email performance over time
  const emailPerformance = useMemo(() => {
    const last30Days = emailCampaigns.filter(e => e.sentDate >= subDays(new Date(), 30));
    const grouped = last30Days.reduce((acc, campaign) => {
      const week = format(startOfWeek(campaign.sentDate), 'MMM dd');
      if (!acc[week]) {
        acc[week] = { week, sent: 0, opened: 0, clicked: 0, revenue: 0 };
      }
      acc[week].sent += campaign.recipients;
      acc[week].opened += campaign.opened;
      acc[week].clicked += campaign.clicked;
      acc[week].revenue += campaign.revenue;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(grouped).map((week: any) => ({
      ...week,
      openRate: ((week.opened / week.sent) * 100).toFixed(1),
      ctr: ((week.clicked / week.opened) * 100).toFixed(1)
    }));
  }, [emailCampaigns]);

  // Social media engagement by platform
  const socialEngagement = useMemo(() => {
    const platforms = ['Facebook', 'Instagram', 'LinkedIn'];
    return platforms.map(platform => {
      const platformPosts = socialPosts.filter(p => p.platform === platform);
      const totalReach = platformPosts.reduce((sum, p) => sum + p.reach, 0);
      const totalEngagement = platformPosts.reduce((sum, p) => sum + p.engagement, 0);
      const paidSpend = platformPosts.filter(p => p.type === 'Paid').reduce((sum, p) => sum + (p.spend || 0), 0);
      const revenue = platformPosts.reduce((sum, p) => sum + (p.revenue || 0), 0);
      
      return {
        platform,
        posts: platformPosts.length,
        reach: totalReach,
        engagement: totalEngagement,
        engagementRate: ((totalEngagement / totalReach) * 100).toFixed(1),
        spend: paidSpend,
        revenue,
        roas: paidSpend > 0 ? (revenue / paidSpend).toFixed(2) : '0'
      };
    });
  }, [socialPosts]);

  // WhatsApp performance by type
  const whatsAppPerformance = useMemo(() => {
    const types = ['Appointment Reminder', 'Promotional', 'Follow-up', 'Service Alert'];
    return types.map(type => {
      const typeCampaigns = whatsAppCampaigns.filter(c => c.type === type);
      const totalSent = typeCampaigns.reduce((sum, c) => sum + c.sent, 0);
      const totalRead = typeCampaigns.reduce((sum, c) => sum + c.read, 0);
      const totalReplied = typeCampaigns.reduce((sum, c) => sum + c.replied, 0);
      const totalConversions = typeCampaigns.reduce((sum, c) => sum + c.conversions, 0);
      
      return {
        type,
        campaigns: typeCampaigns.length,
        sent: totalSent,
        readRate: totalSent > 0 ? ((totalRead / totalSent) * 100).toFixed(1) : '0',
        replyRate: totalRead > 0 ? ((totalReplied / totalRead) * 100).toFixed(1) : '0',
        conversions: totalConversions
      };
    }).filter(t => t.campaigns > 0);
  }, [whatsAppCampaigns]);

  // Channel growth trend
  const growthTrend = useMemo(() => {
    const last12Weeks = channelGrowth.filter(g => g.date >= subDays(new Date(), 84));
    const grouped = last12Weeks.reduce((acc, growth) => {
      const week = format(growth.date, 'MMM dd');
      if (!acc[week]) {
        acc[week] = { week };
      }
      acc[week][growth.channel] = growth.subscribers;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(grouped);
  }, [channelGrowth]);

  // Top performing email campaigns
  const topEmailCampaigns = useMemo(() => {
    return emailCampaigns
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map(campaign => ({
        ...campaign,
        openRate: ((campaign.opened / campaign.delivered) * 100).toFixed(1),
        ctr: campaign.opened > 0 ? ((campaign.clicked / campaign.opened) * 100).toFixed(1) : '0',
        conversionRate: campaign.clicked > 0 ? ((campaign.conversions / campaign.clicked) * 100).toFixed(1) : '0'
      }));
  }, [emailCampaigns]);

  // Content type performance
  const contentPerformance = useMemo(() => {
    const types = ['Image', 'Video', 'Carousel', 'Story', 'Reel'];
    return types.map(type => {
      const typePosts = socialPosts.filter(p => p.postType === type);
      const avgEngagementRate = typePosts.length > 0
        ? typePosts.reduce((sum, p) => sum + (p.engagement / p.reach), 0) / typePosts.length * 100
        : 0;
      
      return {
        type,
        posts: typePosts.length,
        avgEngagementRate: avgEngagementRate.toFixed(1)
      };
    }).filter(t => t.posts > 0);
  }, [socialPosts]);

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Email Open Rate"
          value={kpis.emailOpenRate}
          icon={<Mail className="h-4 w-4" />}
          change={2.3}
          changeLabel="vs last month"
        />
        <KPICard
          title="Social Engagement"
          value={kpis.socialEngagementRate}
          icon={<Heart className="h-4 w-4" />}
          change={0.8}
          changeLabel="vs last month"
        />
        <KPICard
          title="Total Audience"
          value={kpis.totalAudience.toLocaleString()}
          icon={<Users className="h-4 w-4" />}
          change={4.2}
          changeLabel="monthly growth"
        />
        <KPICard
          title="Campaign Revenue"
          value={`£${kpis.emailRevenue.toLocaleString()}`}
          icon={<PoundSterling className="h-4 w-4" />}
          change={15.2}
          changeLabel="vs last 30d"
        />
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email">Email Campaigns</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="growth">Channel Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          {/* Email Performance Chart */}
          <ChartContainer title="Email Campaign Performance">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={emailPerformance}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  fill="url(#colorRevenue)"
                  name="Revenue (£)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="openRate"
                  stroke="#3b82f6"
                  name="Open Rate (%)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ctr"
                  stroke="#8b5cf6"
                  name="CTR (%)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Top Email Campaigns Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Email Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Campaign</th>
                      <th className="text-left p-2">Subject</th>
                      <th className="text-center p-2">Sent</th>
                      <th className="text-center p-2">Open Rate</th>
                      <th className="text-center p-2">CTR</th>
                      <th className="text-center p-2">Conversions</th>
                      <th className="text-right p-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topEmailCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              campaign.type === 'Promotional' ? 'default' :
                              campaign.type === 'Newsletter' ? 'secondary' :
                              'outline'
                            }>
                              {campaign.type}
                            </Badge>
                            <span className="text-sm">{campaign.name}</span>
                          </div>
                        </td>
                        <td className="p-2 text-sm max-w-xs truncate">{campaign.subject}</td>
                        <td className="p-2 text-center">{campaign.recipients.toLocaleString()}</td>
                        <td className="p-2 text-center">
                          <Badge variant={parseFloat(campaign.openRate) > 40 ? 'default' : 'outline'}>
                            {campaign.openRate}%
                          </Badge>
                        </td>
                        <td className="p-2 text-center">{campaign.ctr}%</td>
                        <td className="p-2 text-center">{campaign.conversions}</td>
                        <td className="p-2 text-right font-semibold">£{campaign.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {/* Platform Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {socialEngagement.map((platform) => (
              <Card key={platform.platform}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium">{platform.platform}</CardTitle>
                  {platform.platform === 'Instagram' && <Instagram className="h-5 w-5 text-pink-500" />}
                  {platform.platform === 'Facebook' && <MessageCircle className="h-5 w-5 text-blue-600" />}
                  {platform.platform === 'LinkedIn' && <Linkedin className="h-5 w-5 text-blue-700" />}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Posts</span>
                      <span className="font-medium">{platform.posts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reach</span>
                      <span className="font-medium">{platform.reach.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Engagement Rate</span>
                      <Badge variant={parseFloat(platform.engagementRate) > 5 ? 'default' : 'outline'}>
                        {platform.engagementRate}%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ad Spend</span>
                      <span className="font-medium">£{platform.spend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ROAS</span>
                      <Badge variant={parseFloat(platform.roas) > 3 ? 'default' : 'outline'}>
                        {platform.roas}x
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Type Performance */}
          <ChartContainer title="Content Type Performance">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="type" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip formatter={(value: any) => `${value}%`} />
                <Bar dataKey="avgEngagementRate" fill="#8b5cf6" name="Avg Engagement Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          {/* WhatsApp Performance by Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer title="WhatsApp Campaign Types">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={whatsAppPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, sent }) => `${type}: ${sent.toLocaleString()}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sent"
                  >
                    {whatsAppPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {whatsAppPerformance.map((type) => (
                    <div key={type.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{type.type}</span>
                        <Badge>{type.campaigns} campaigns</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Read Rate</span>
                          <span className="font-medium">{type.readRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reply Rate</span>
                          <span className="font-medium">{type.replyRate}%</span>
                        </div>
                      </div>
                      {type.conversions > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Conversions</span>
                          <span className="font-medium text-green-600">{type.conversions}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          {/* Channel Growth Trend */}
          <ChartContainer title="Channel Growth Trend">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={growthTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Email" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Facebook" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="Instagram" stroke="#ec4899" strokeWidth={2} />
                <Line type="monotone" dataKey="LinkedIn" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="WhatsApp" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Current Channel Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {['Email', 'Facebook', 'Instagram', 'LinkedIn', 'WhatsApp'].map((channel, index) => {
              const latestData = channelGrowth
                .filter(g => g.channel === channel)
                .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
              
              return (
                <Card key={channel}>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <h3 className="font-medium">{channel}</h3>
                      <p className="text-2xl font-bold">{latestData?.subscribers.toLocaleString() || '0'}</p>
                      <Badge className="text-xs">
                        +{latestData?.growth || 0} this week
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 