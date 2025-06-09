// Google Ads Performance Report Component
// Displays comprehensive Google Ads campaign metrics and analytics

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ScatterChart, Scatter, Treemap
} from 'recharts';
import {
  TrendingUp, TrendingDown, MousePointer, Target,
  DollarSign, Percent, MapPin, Search, Globe,
  Activity, BarChart2, PieChart as PieChartIcon,
  AlertCircle, CheckCircle, XCircle, PoundSterling
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import {
  generateCampaigns,
  generateAdGroups,
  generateKeywords,
  generateLandingPagePerformance,
  generateGeographicPerformance,
  generateDailyPerformance,
  calculateKPIs,
  type AdCampaign,
  type Keyword,
  type LandingPagePerformance,
  type GeographicPerformance
} from '@/mockData/googleAds';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93bbfc', '#c7d2fe'];
const STATUS_COLORS = {
  Active: '#22c55e',
  Paused: '#f59e0b'
};

// Custom content for Treemap
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, value } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={value > 3 ? '#22c55e' : value > 2 ? '#f59e0b' : '#ef4444'}
        stroke="#fff"
        strokeWidth={2}
      />
      {width > 50 && height > 30 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={10}
          >
            ROI: {value?.toFixed(1)}x
          </text>
        </>
      )}
    </g>
  );
};

export const GoogleAdsPerformance: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<number>(30);
  
  // Generate mock data
  const { campaigns, adGroups, keywords, landingPages, geographic, dailyData, kpis } = useMemo(() => {
    const campaigns = generateCampaigns();
    const adGroups = generateAdGroups(campaigns);
    const keywords = generateKeywords(adGroups);
    const landingPages = generateLandingPagePerformance();
    const geographic = generateGeographicPerformance();
    const dailyData = generateDailyPerformance(90);
    const kpis = calculateKPIs(campaigns, dailyData);
    
    return { campaigns, adGroups, keywords, landingPages, geographic, dailyData, kpis };
  }, []);

  // Filter daily data based on selected range
  const filteredDailyData = useMemo(() => {
    return dailyData.slice(-selectedDateRange);
  }, [dailyData, selectedDateRange]);

  // Prepare chart data
  const performanceTrend = useMemo(() => {
    return filteredDailyData.map(d => ({
      date: format(d.date, 'MMM dd'),
      spend: d.spend,
      revenue: d.revenue,
      conversions: d.conversions,
      roas: d.roas
    }));
  }, [filteredDailyData]);

  const campaignPerformance = useMemo(() => {
    return campaigns.map(campaign => ({
      name: campaign.name.replace(' - Search', '').replace(' - Display', ''),
      spend: Math.round(campaign.spend),
      revenue: Math.round(campaign.revenue),
      conversions: campaign.conversions,
      roas: campaign.roas,
      status: campaign.status
    }));
  }, [campaigns]);

  const keywordQualityDistribution = useMemo(() => {
    const distribution: Record<number, number> = {};
    keywords.forEach(kw => {
      distribution[kw.qualityScore] = (distribution[kw.qualityScore] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([score, count]) => ({
      score: `Score ${score}`,
      count: count,
      percentage: (count / keywords.length) * 100
    }));
  }, [keywords]);

  const funnelData = useMemo(() => {
    const totalSessions = landingPages.reduce((sum, lp) => sum + lp.sessions, 0);
    const totalNonBounced = landingPages.reduce((sum, lp) => sum + (lp.sessions * (1 - lp.bounceRate)), 0);
    const totalConversions = landingPages.reduce((sum, lp) => sum + lp.conversions, 0);
    
    return [
      { stage: 'Sessions', value: totalSessions, percentage: 100 },
      { stage: 'Engaged', value: Math.floor(totalNonBounced), percentage: (totalNonBounced / totalSessions) * 100 },
      { stage: 'Conversions', value: totalConversions, percentage: (totalConversions / totalSessions) * 100 }
    ];
  }, [landingPages]);

  const getQualityScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCTRColor = (ctr: number) => {
    if (ctr >= 0.05) return 'text-green-600';
    if (ctr >= 0.03) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Google Ads Performance</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your Google Ads campaigns, keywords, and conversion metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Spend (30d)"
          value={`£${kpis.totalSpend.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={kpis.spendChange}
          icon={<PoundSterling className="h-4 w-4" />}
        />
        <KPICard
          title="ROAS"
          value={kpis.roas.toFixed(2)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="Conversions (30d)"
          value={kpis.totalConversions.toLocaleString()}
          change={kpis.conversionsChange}
          icon={<Target className="h-4 w-4" />}
        />
        <KPICard
          title="Avg. CTR"
          value={`${kpis.avgCtr.toFixed(2)}%`}
          icon={<MousePointer className="h-4 w-4" />}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Campaign Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Performance</TabsTrigger>
          <TabsTrigger value="landing">Landing Pages</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Performance</TabsTrigger>
        </TabsList>

        {/* Campaign Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Performance Trend Chart */}
          <ChartContainer title="Performance Trend" className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'spend' || name === 'revenue') {
                      return `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
                    }
                    if (name === 'roas') {
                      return value.toFixed(2);
                    }
                    return value.toLocaleString();
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="spend" stroke="#ef4444" name="Spend" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#22c55e" name="Revenue" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#3b82f6" name="ROAS" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Campaign Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartContainer title="Campaign Performance" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'Spend' || name === 'Revenue') {
                        return `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
                      }
                      return value.toLocaleString();
                    }}
                  />
                  <Legend />
                  <Bar dataKey="spend" fill="#ef4444" name="Spend" />
                  <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Quality Score Distribution" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={keywordQualityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage.toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {keywordQualityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Campaign Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Campaign</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-right py-2">Budget</th>
                      <th className="text-right py-2">Spend</th>
                      <th className="text-right py-2">Impressions</th>
                      <th className="text-right py-2">Clicks</th>
                      <th className="text-right py-2">CTR</th>
                      <th className="text-right py-2">CPC</th>
                      <th className="text-right py-2">Conversions</th>
                      <th className="text-right py-2">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{campaign.name}</td>
                        <td className="py-2">
                          <Badge 
                            variant="outline" 
                            style={{ color: STATUS_COLORS[campaign.status] }}
                          >
                            {campaign.status}
                          </Badge>
                        </td>
                        <td className="text-right py-2">£{campaign.budget.toFixed(2)}</td>
                        <td className="text-right py-2">£{campaign.spend.toFixed(2)}</td>
                        <td className="text-right py-2">{campaign.impressions.toLocaleString()}</td>
                        <td className="text-right py-2">{campaign.clicks.toLocaleString()}</td>
                        <td className={`text-right py-2 ${getCTRColor(campaign.ctr)}`}>
                          {(campaign.ctr * 100).toFixed(2)}%
                        </td>
                        <td className="text-right py-2">£{campaign.cpc.toFixed(2)}</td>
                        <td className="text-right py-2">{campaign.conversions}</td>
                        <td className={`text-right py-2 font-medium ${campaign.roas >= 3 ? 'text-green-600' : 'text-red-600'}`}>
                          {campaign.roas.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keyword Performance Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Top Keywords by Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Keyword</th>
                      <th className="text-left py-2">Match Type</th>
                      <th className="text-right py-2">Quality Score</th>
                      <th className="text-right py-2">Impressions</th>
                      <th className="text-right py-2">Clicks</th>
                      <th className="text-right py-2">CTR</th>
                      <th className="text-right py-2">Avg. CPC</th>
                      <th className="text-right py-2">Conversions</th>
                      <th className="text-right py-2">Conv. Rate</th>
                      <th className="text-right py-2">Spend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords
                      .sort((a, b) => b.conversions - a.conversions)
                      .slice(0, 20)
                      .map((keyword) => (
                        <tr key={keyword.id} className="border-b hover:bg-gray-50">
                          <td className="py-2">{keyword.keyword}</td>
                          <td className="py-2">
                            <Badge variant="outline">{keyword.matchType}</Badge>
                          </td>
                          <td className="text-right py-2">
                            <span className={`font-medium ${getQualityScoreColor(keyword.qualityScore)}`}>
                              {keyword.qualityScore}/10
                            </span>
                          </td>
                          <td className="text-right py-2">{keyword.impressions.toLocaleString()}</td>
                          <td className="text-right py-2">{keyword.clicks.toLocaleString()}</td>
                          <td className={`text-right py-2 ${getCTRColor(keyword.ctr)}`}>
                            {(keyword.ctr * 100).toFixed(2)}%
                          </td>
                          <td className="text-right py-2">£{keyword.avgCpc.toFixed(2)}</td>
                          <td className="text-right py-2">{keyword.conversions}</td>
                          <td className="text-right py-2">{(keyword.conversionRate * 100).toFixed(2)}%</td>
                          <td className="text-right py-2">£{keyword.spend.toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  High Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Keywords with Quality Score ≥ 8
                </p>
                <div className="text-3xl font-bold text-green-600">
                  {keywords.filter(k => k.qualityScore >= 8).length}
                </div>
                <Progress 
                  value={(keywords.filter(k => k.qualityScore >= 8).length / keywords.length) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Need Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Keywords with Quality Score 5-7
                </p>
                <div className="text-3xl font-bold text-yellow-600">
                  {keywords.filter(k => k.qualityScore >= 5 && k.qualityScore < 8).length}
                </div>
                <Progress 
                  value={(keywords.filter(k => k.qualityScore >= 5 && k.qualityScore < 8).length / keywords.length) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Poor Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Keywords with Quality Score &lt; 5
                </p>
                <div className="text-3xl font-bold text-red-600">
                  {keywords.filter(k => k.qualityScore < 5).length}
                </div>
                <Progress 
                  value={(keywords.filter(k => k.qualityScore < 5).length / keywords.length) * 100} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Landing Pages Tab */}
        <TabsContent value="landing" className="space-y-4">
          {/* Conversion Funnel */}
          <ChartContainer title="Conversion Funnel" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Count">
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Landing Page Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Landing Page Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Page</th>
                      <th className="text-right py-2">Sessions</th>
                      <th className="text-right py-2">Bounce Rate</th>
                      <th className="text-right py-2">Avg. Time</th>
                      <th className="text-right py-2">Conversions</th>
                      <th className="text-right py-2">Conv. Rate</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">Load Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landingPages
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((page) => (
                        <tr key={page.url} className="border-b hover:bg-gray-50">
                          <td className="py-2">
                            <div>
                              <div className="font-medium">{page.pageName}</div>
                              <div className="text-sm text-muted-foreground">{page.url}</div>
                            </div>
                          </td>
                          <td className="text-right py-2">{page.sessions.toLocaleString()}</td>
                          <td className={`text-right py-2 ${page.bounceRate > 0.5 ? 'text-red-600' : ''}`}>
                            {(page.bounceRate * 100).toFixed(1)}%
                          </td>
                          <td className="text-right py-2">{Math.floor(page.avgTimeOnPage)}s</td>
                          <td className="text-right py-2">{page.conversions}</td>
                          <td className={`text-right py-2 font-medium ${page.conversionRate > 0.05 ? 'text-green-600' : ''}`}>
                            {(page.conversionRate * 100).toFixed(2)}%
                          </td>
                          <td className="text-right py-2">£{page.revenue.toFixed(2)}</td>
                          <td className={`text-right py-2 ${page.pageLoadTime > 3 ? 'text-red-600' : ''}`}>
                            {page.pageLoadTime.toFixed(1)}s
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Performance Tab */}
        <TabsContent value="geographic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Geographic Performance Chart */}
            <ChartContainer title="Performance by Location" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geographic} margin={{ left: 20, right: 20, top: 20, bottom: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'spend' || name === 'revenue') {
                        return `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
                      }
                      return value.toLocaleString();
                    }}
                  />
                  <Legend />
                  <Bar dataKey="clicks" fill="#3b82f6" name="Clicks" />
                  <Bar dataKey="conversions" fill="#22c55e" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Geographic ROI Chart */}
            <ChartContainer title="ROI by Location" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={geographic.map(g => ({
                    name: g.location,
                    size: g.revenue,
                    value: g.revenue / g.spend
                  }))}
                  dataKey="size"
                  stroke="#fff"
                  fill="#3b82f6"
                  content={<CustomTreemapContent />}
                />
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Geographic Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Location</th>
                      <th className="text-right py-2">Impressions</th>
                      <th className="text-right py-2">Clicks</th>
                      <th className="text-right py-2">CTR</th>
                      <th className="text-right py-2">Conversions</th>
                      <th className="text-right py-2">Spend</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">CPA</th>
                      <th className="text-right py-2">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geographic
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((location) => (
                        <tr key={location.location} className="border-b hover:bg-gray-50">
                          <td className="py-2">{location.location}</td>
                          <td className="text-right py-2">{location.impressions.toLocaleString()}</td>
                          <td className="text-right py-2">{location.clicks.toLocaleString()}</td>
                          <td className="text-right py-2">{(location.ctr * 100).toFixed(2)}%</td>
                          <td className="text-right py-2">{location.conversions}</td>
                          <td className="text-right py-2">£{location.spend.toFixed(2)}</td>
                          <td className="text-right py-2">£{location.revenue.toFixed(2)}</td>
                          <td className="text-right py-2">£{location.cpa.toFixed(2)}</td>
                          <td className={`text-right py-2 font-medium ${location.revenue / location.spend > 3 ? 'text-green-600' : 'text-red-600'}`}>
                            {(location.revenue / location.spend).toFixed(1)}x
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 