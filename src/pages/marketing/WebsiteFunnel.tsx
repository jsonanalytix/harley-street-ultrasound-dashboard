import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';
import {
  generateFunnelData,
  generatePagePerformance,
  generateDeviceBreakdown,
  generateBrowserBreakdown,
  generateUserFlow,
  generateHourlyPattern,
  generateDailyFunnelTrends,
  websiteFunnelKPIs,
  highIntentPages,
  exitPages,
  sessionDurationDistribution,
} from '@/mockData/websiteFunnel';
import { 
  TrendingDown, 
  MousePointer, 
  Monitor, 
  Smartphone, 
  Clock, 
  AlertTriangle,
  Globe,
  BarChart3
} from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

export const WebsiteFunnel: React.FC = () => {
  const funnelData = useMemo(() => generateFunnelData(), []);
  const pagePerformance = useMemo(() => generatePagePerformance(), []);
  const deviceBreakdown = useMemo(() => generateDeviceBreakdown(), []);
  const browserBreakdown = useMemo(() => generateBrowserBreakdown(), []);
  const userFlow = useMemo(() => generateUserFlow(), []);
  const hourlyPattern = useMemo(() => generateHourlyPattern(), []);
  const dailyTrends = useMemo(() => generateDailyFunnelTrends(), []);

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const getStatusBadge = (rate: number, type: 'bounce' | 'exit' | 'conversion') => {
    let status: 'good' | 'warning' | 'bad';
    
    if (type === 'bounce' || type === 'exit') {
      status = rate < 30 ? 'good' : rate < 50 ? 'warning' : 'bad';
    } else {
      status = rate > 10 ? 'good' : rate > 5 ? 'warning' : 'bad';
    }
    
    const classes = {
      good: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      bad: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    };
    
    return (
      <Badge variant="secondary" className={`text-xs ${classes[status]}`}>
        {rate.toFixed(1)}%
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Overall Conversion Rate"
          value={`${websiteFunnelKPIs.overallConversionRate}%`}
          change={1.2}
          changeLabel="vs last month"
          icon={<MousePointer className="h-4 w-4" />}
        />
        <KPICard
          title="Avg Drop-off Rate"
          value={`${websiteFunnelKPIs.avgDropOffRate}%`}
          change={-3.5}
          changeLabel="improvement"
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <KPICard
          title="Bounce Rate"
          value={`${websiteFunnelKPIs.bounceRate}%`}
          change={-2.1}
          changeLabel="vs last month"
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <KPICard
          title="Form Abandonment"
          value={`${websiteFunnelKPIs.formAbandonmentRate}%`}
          change={5.3}
          changeLabel="needs attention"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mobile vs Desktop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{websiteFunnelKPIs.mobileConversionRate}%</span>
              <span className="text-muted-foreground">vs</span>
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{websiteFunnelKPIs.desktopConversionRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mobile users convert {((websiteFunnelKPIs.desktopConversionRate - websiteFunnelKPIs.mobileConversionRate) / websiteFunnelKPIs.desktopConversionRate * 100).toFixed(0)}% less
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{formatDuration(websiteFunnelKPIs.avgSessionDuration)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {websiteFunnelKPIs.avgPagesPerSession} pages per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Exit Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{exitPages[0].page}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {exitPages[0].exitRate}% exit rate • {exitPages[0].reason}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="pages">Page Performance</TabsTrigger>
          <TabsTrigger value="devices">Device & Browser</TabsTrigger>
          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
        </TabsList>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-6">
          {/* Funnel Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {funnelData.map((step, index) => {
                  const isLast = index === funnelData.length - 1;
                  const nextStep = funnelData[index + 1];
                  
                  return (
                    <div key={step.step}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">{step.step}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {step.sessions.toLocaleString()} sessions
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            Avg time: {formatDuration(step.avgTimeOnStep)}
                          </span>
                          {step.dropOffRate > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {step.dropOffRate}% drop-off
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Progress 
                        value={step.conversionRate} 
                        className="h-8"
                      />
                      {!isLast && nextStep && (
                        <div className="flex items-center mt-3 mb-2">
                          <TrendingDown className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm text-muted-foreground">
                            {(step.sessions - nextStep.sessions).toLocaleString()} users dropped off
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Daily Trends */}
          <ChartContainer
            title="Daily Funnel Performance"
            description="30-day trend of key funnel metrics"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any) => value.toLocaleString()}
                  labelFormatter={(date: any) => new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="sessions" 
                  stackId="1"
                  stroke="#E5E7EB" 
                  fill="#E5E7EB"
                  name="Sessions"
                />
                <Area 
                  type="monotone" 
                  dataKey="servicePageViews" 
                  stackId="2"
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  name="Service Views"
                />
                <Area 
                  type="monotone" 
                  dataKey="bookingFormStarts" 
                  stackId="3"
                  stroke="#F59E0B" 
                  fill="#F59E0B"
                  name="Form Starts"
                />
                <Area 
                  type="monotone" 
                  dataKey="bookingCompletions" 
                  stackId="4"
                  stroke="#10B981" 
                  fill="#10B981"
                  name="Completions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        {/* Page Performance Tab */}
        <TabsContent value="pages" className="space-y-6">
          {/* High Intent Pages */}
          <Card>
            <CardHeader>
              <CardTitle>High Intent Pages</CardTitle>
              <p className="text-sm text-muted-foreground">Pages most likely to lead to conversions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {highIntentPages.map((page) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{page.page}</span>
                        <span className="text-sm text-muted-foreground">
                          Avg conversion time: {page.avgTimeToConversion}m
                        </span>
                      </div>
                      <Progress value={page.score} className="h-2" />
                    </div>
                    <div className="ml-4">
                      <Badge variant="secondary" className="text-xs">
                        Score: {page.score}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Page Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Page Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Page</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-right p-3">Views</th>
                      <th className="text-right p-3">Unique Views</th>
                      <th className="text-right p-3">Avg Time</th>
                      <th className="text-right p-3">Bounce Rate</th>
                      <th className="text-right p-3">Exit Rate</th>
                      <th className="text-right p-3">Conversions</th>
                      <th className="text-right p-3">Conv Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagePerformance.map((page) => (
                      <tr key={page.page} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{page.page}</td>
                        <td className="p-3">
                          <Badge variant="secondary" className="text-xs">
                            {page.pageType}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">{page.views.toLocaleString()}</td>
                        <td className="p-3 text-right">{page.uniqueViews.toLocaleString()}</td>
                        <td className="p-3 text-right">{formatDuration(Math.round(page.avgTimeOnPage))}</td>
                        <td className="p-3 text-right">
                          {getStatusBadge(page.bounceRate, 'bounce')}
                        </td>
                        <td className="p-3 text-right">
                          {getStatusBadge(page.exitRate, 'exit')}
                        </td>
                        <td className="p-3 text-right">{page.conversions}</td>
                        <td className="p-3 text-right">
                          {getStatusBadge(page.conversionRate, 'conversion')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Exit Pages Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Top Exit Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exitPages.map((page, index) => (
                  <div key={page.page} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{page.page}</span>
                        <span className="text-sm text-muted-foreground">
                          {page.exits.toLocaleString()} exits ({page.exitRate}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${page.exitRate}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{page.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Device & Browser Tab */}
        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Breakdown */}
            <ChartContainer
              title="Device Performance"
              description="Conversion rates by device type"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deviceBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="device" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: any) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="bounceRate" fill="#EF4444" name="Bounce Rate" />
                  <Bar dataKey="conversionRate" fill="#10B981" name="Conversion Rate" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Browser Breakdown */}
            <ChartContainer
              title="Browser Distribution"
              description="Sessions and conversion by browser"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={browserBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.browser} (${entry.percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sessions"
                  >
                    {browserBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Device Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Device Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Device</th>
                      <th className="text-right p-3">Sessions</th>
                      <th className="text-right p-3">% of Total</th>
                      <th className="text-right p-3">Bounce Rate</th>
                      <th className="text-right p-3">Conv Rate</th>
                      <th className="text-right p-3">Avg Duration</th>
                      <th className="text-right p-3">Pages/Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceBreakdown.map((device) => (
                      <tr key={device.device} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium flex items-center gap-2">
                          {device.device === 'Desktop' ? <Monitor className="h-4 w-4" /> :
                           device.device === 'Mobile' ? <Smartphone className="h-4 w-4" /> :
                           <Globe className="h-4 w-4" />}
                          {device.device}
                        </td>
                        <td className="p-3 text-right">{device.sessions.toLocaleString()}</td>
                        <td className="p-3 text-right">{device.percentage}%</td>
                        <td className="p-3 text-right">
                          {getStatusBadge(device.bounceRate, 'bounce')}
                        </td>
                        <td className="p-3 text-right">
                          {getStatusBadge(device.conversionRate, 'conversion')}
                        </td>
                        <td className="p-3 text-right">{formatDuration(device.avgSessionDuration)}</td>
                        <td className="p-3 text-right">{device.pagesPerSession.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          {/* Hourly Pattern */}
          <ChartContainer
            title="Hourly Session & Conversion Pattern"
            description="Website activity throughout the day"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyPattern}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any, name: any) => {
                    if (name === 'Conversion Rate') return `${value}%`;
                    return value.toLocaleString();
                  }}
                  labelFormatter={(hour) => `${hour}:00`}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="sessions" fill="#E5E7EB" name="Sessions" />
                <Bar yAxisId="left" dataKey="conversions" fill="#10B981" name="Conversions" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="conversionRate" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Conversion Rate"
                  dot={{ fill: '#3B82F6', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Session Duration Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Duration Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessionDurationDistribution.map((duration) => (
                    <div key={duration.duration} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{duration.duration}</span>
                          <span className="text-sm text-muted-foreground">
                            {duration.sessions.toLocaleString()} sessions ({duration.percentage}%)
                          </span>
                        </div>
                        <Progress value={duration.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">High Form Abandonment</p>
                      <p className="text-sm text-muted-foreground">
                        68% of users abandon the booking form. Consider simplifying the process or adding progress indicators.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Mobile Conversion Gap</p>
                      <p className="text-sm text-muted-foreground">
                        Mobile users convert 41% less than desktop users. Optimize mobile booking experience.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Peak Conversion Hours</p>
                      <p className="text-sm text-muted-foreground">
                        9:00-11:00 AM shows highest conversion rates. Consider chat support during these hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Quick Decision Makers</p>
                      <p className="text-sm text-muted-foreground">
                        30% of conversions happen within 3 minutes of landing, indicating strong intent visitors.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 