import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Search, 
  MousePointer,
  Link,
  FileText,
  MapPin,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  Monitor,
  Tablet,
  Users,
  Eye,
  ChevronUp,
  ChevronDown,
  Minus
} from 'lucide-react';
import {
  generateOrganicTrafficData,
  generateKeywordPerformance,
  generateLandingPagePerformance,
  generateBlogPostPerformance,
  generateLocalSEOMetrics,
  generateBacklinkProfile,
  calculateKPIs
} from '@/mockData/seoOrganic';

export const SEOOrganic: React.FC = () => {
  const { trafficData, keywordData, landingPageData, blogData, localSEOData, backlinkData, kpis } = useMemo(() => {
    const traffic = generateOrganicTrafficData();
    const keywords = generateKeywordPerformance();
    const landingPages = generateLandingPagePerformance();
    const blogs = generateBlogPostPerformance();
    const localSEO = generateLocalSEOMetrics();
    const backlinks = generateBacklinkProfile();
    const kpiData = calculateKPIs(traffic, keywords, landingPages, backlinks);
    
    return {
      trafficData: traffic,
      keywordData: keywords,
      landingPageData: landingPages,
      blogData: blogs,
      localSEOData: localSEO,
      backlinkData: backlinks,
      kpis: kpiData
    };
  }, []);

  // Prepare data for charts
  const last30DaysTraffic = trafficData.slice(-30);
  const deviceBreakdown = [
    { name: 'Mobile', value: last30DaysTraffic.reduce((sum, d) => sum + d.mobileTraffic, 0), icon: Smartphone },
    { name: 'Desktop', value: last30DaysTraffic.reduce((sum, d) => sum + d.desktopTraffic, 0), icon: Monitor },
    { name: 'Tablet', value: last30DaysTraffic.reduce((sum, d) => sum + d.tabletTraffic, 0), icon: Tablet }
  ];

  const keywordPositionDistribution = [
    { range: 'Position 1-3', count: keywordData.filter(k => k.position <= 3).length },
    { range: 'Position 4-10', count: keywordData.filter(k => k.position > 3 && k.position <= 10).length },
    { range: 'Position 11-20', count: keywordData.filter(k => k.position > 10 && k.position <= 20).length },
    { range: 'Position 20+', count: keywordData.filter(k => k.position > 20).length }
  ];

  const topBlogCategories = blogData.reduce((acc, blog) => {
    acc[blog.category] = (acc[blog.category] || 0) + blog.views;
    return acc;
  }, {} as Record<string, number>);

  const blogCategoryData = Object.entries(topBlogCategories)
    .map(([category, views]) => ({ category, views }))
    .sort((a, b) => b.views - a.views);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const getPositionIcon = (current: number, previous: number) => {
    if (current < previous) return <ChevronUp className="w-4 h-4 text-green-500" />;
    if (current > previous) return <ChevronDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SEO & Organic Lead Report</h1>
        <Badge variant="outline" className="text-sm">
          Last 30 Days
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={kpis.totalOrganicSessions.label}
          value={kpis.totalOrganicSessions.value.toLocaleString()}
          change={kpis.totalOrganicSessions.change}
          icon={<Globe className="w-5 h-5" />}
        />
        <KPICard
          title={kpis.avgOrganicConversionRate.label}
          value={`${kpis.avgOrganicConversionRate.value.toFixed(2)}%`}
          change={kpis.avgOrganicConversionRate.change}
          icon={<MousePointer className="w-5 h-5" />}
        />
        <KPICard
          title={kpis.topRankingKeywords.label}
          value={kpis.topRankingKeywords.value.toString()}
          change={kpis.topRankingKeywords.change}
          icon={<Search className="w-5 h-5" />}
        />
        <KPICard
          title={kpis.domainAuthority.label}
          value={kpis.domainAuthority.value.toString()}
          change={kpis.domainAuthority.change}
          icon={<Link className="w-5 h-5" />}
        />
      </div>

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full">
          <TabsTrigger value="traffic">Traffic Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="pages">Landing Pages</TabsTrigger>
          <TabsTrigger value="blog">Blog Performance</TabsTrigger>
          <TabsTrigger value="local">Local SEO</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Organic Traffic Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer title="Organic Traffic Trend" className="h-80">
                  <ResponsiveContainer>
                    <AreaChart data={last30DaysTraffic}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="sessions" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer title="Device Breakdown" className="h-80">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {deviceBreakdown.map((device, index) => (
                    <div key={device.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <device.icon className="w-4 h-4" />
                        <span className="text-sm">{device.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index] }} />
                        <span className="text-sm font-medium">
                          {((device.value / deviceBreakdown.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer title="User Engagement Metrics" className="h-80">
                <ResponsiveContainer>
                  <ComposedChart data={last30DaysTraffic}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="pageviews" fill="#8b5cf6" />
                    <Line yAxisId="right" type="monotone" dataKey="bounceRate" stroke="#ef4444" />
                    <Line yAxisId="right" type="monotone" dataKey="avgSessionDuration" stroke="#f59e0b" />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Ranking Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Keyword</th>
                        <th className="text-center py-2">Position</th>
                        <th className="text-right py-2">Search Volume</th>
                        <th className="text-right py-2">Clicks</th>
                        <th className="text-right py-2">CTR</th>
                        <th className="text-right py-2">URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordData.slice(0, 10).map((keyword, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{keyword.keyword}</span>
                              {keyword.featured && (
                                <Badge variant="default" className="text-xs">Featured</Badge>
                              )}
                            </div>
                          </td>
                          <td className="text-center py-3">
                            <div className="flex items-center justify-center gap-1">
                              <span>{keyword.position}</span>
                              {getPositionIcon(keyword.position, keyword.previousPosition)}
                            </div>
                          </td>
                          <td className="text-right py-3">{formatNumber(keyword.searchVolume)}</td>
                          <td className="text-right py-3">{keyword.clicks}</td>
                          <td className="text-right py-3">{keyword.ctr.toFixed(2)}%</td>
                          <td className="text-right py-3">
                            <span className="text-sm text-gray-500 truncate max-w-[200px] inline-block">
                              {keyword.url}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Position Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer title="Position Distribution" className="h-80">
                  <ResponsiveContainer>
                    <BarChart data={keywordPositionDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="range" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Keyword Difficulty vs Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer title="Keyword Difficulty vs Performance" className="h-80">
                <ResponsiveContainer>
                  <AreaChart
                    data={keywordData.sort((a, b) => a.difficulty - b.difficulty)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="difficulty" label={{ value: 'Keyword Difficulty', position: 'insideBottom', offset: -5 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="impressions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="clicks" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Performance</CardTitle>
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
                    </tr>
                  </thead>
                  <tbody>
                    {landingPageData.map((page, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div>
                            <div className="font-medium">{page.title}</div>
                            <div className="text-sm text-gray-500">{page.url}</div>
                          </div>
                        </td>
                        <td className="text-right py-3">{page.sessions.toLocaleString()}</td>
                        <td className="text-right py-3">
                          <span className={page.bounceRate > 50 ? 'text-red-600' : 'text-green-600'}>
                            {page.bounceRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-right py-3">
                          {Math.floor(page.avgTimeOnPage / 60)}:{(page.avgTimeOnPage % 60).toString().padStart(2, '0')}
                        </td>
                        <td className="text-right py-3">{page.conversions}</td>
                        <td className="text-right py-3">
                          <Badge variant={page.conversionRate > 3 ? 'default' : 'secondary'}>
                            {page.conversionRate.toFixed(2)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer title="Conversion Funnel" className="h-80">
                  <ResponsiveContainer>
                    <BarChart data={landingPageData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="conversionRate" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Page Performance Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer title="Page Performance Matrix" className="h-80">
                  <ResponsiveContainer>
                    <ComposedChart data={landingPageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="sessions" fill="#3b82f6" />
                      <Line yAxisId="right" type="monotone" dataKey="exitRate" stroke="#ef4444" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Blog Post Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogData.slice(0, 5).map((post, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium">{post.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{post.author}</span>
                            <span>•</span>
                            <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <Badge variant="outline">{post.category}</Badge>
                          </div>
                          <div className="flex gap-6 mt-3">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{formatNumber(post.views)} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{formatNumber(post.organicTraffic)} organic</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Link className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{post.backlinks} backlinks</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={post.conversionRate > 2 ? 'default' : 'secondary'}>
                          {post.conversionRate.toFixed(1)}% CR
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer title="Content Categories" className="h-80">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={blogCategoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="views"
                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      >
                        {blogCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer title="Content Performance Over Time" className="h-80">
                <ResponsiveContainer>
                  <AreaChart data={blogData.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="publishDate" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="organicTraffic" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {localSEOData.map((metric, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{metric.metric}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold">{metric.value.toLocaleString()}</span>
                        <div className={`flex items-center gap-1 text-sm ${
                          metric.trend === 'up' ? 'text-green-600' : 
                          metric.trend === 'down' ? 'text-red-600' : 
                          'text-gray-500'
                        }`}>
                          {metric.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                          {metric.trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
                          <span>{Math.abs(metric.change).toFixed(1)}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Previous: {metric.previousValue.toLocaleString()}
                      </p>
                    </div>
                    <MapPin className="w-8 h-8 text-gray-300" />
                  </div>
                  <Progress 
                    value={metric.trend === 'up' ? 75 : metric.trend === 'down' ? 25 : 50} 
                    className="mt-3 h-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Local Search Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="font-medium">Google Reviews</p>
                      <p className="text-sm text-gray-600">487 reviews • 4.8 average rating</p>
                    </div>
                  </div>
                  <Badge variant="default">Top Rated</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-green-600">94%</p>
                    <p className="text-sm text-gray-500 mt-1">Citation Consistency</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">#2.3</p>
                    <p className="text-sm text-gray-500 mt-1">Avg. Local Pack Position</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">168</p>
                    <p className="text-sm text-gray-500 mt-1">GMB Phone Calls</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Backlinks</p>
                    <p className="text-2xl font-bold">{backlinkData.totalBacklinks.toLocaleString()}</p>
                  </div>
                  <Link className="w-8 h-8 text-gray-300" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Referring Domains</p>
                    <p className="text-2xl font-bold">{backlinkData.referringDomains}</p>
                  </div>
                  <Globe className="w-8 h-8 text-gray-300" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Domain Authority</p>
                    <p className="text-2xl font-bold">{backlinkData.domainAuthority}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">New Backlinks (30d)</p>
                    <p className="text-2xl font-bold text-green-600">+{backlinkData.newBacklinks}</p>
                  </div>
                  <ArrowUpRight className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Referring Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {backlinkData.topReferrers.map((referrer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium">{referrer.domain}</div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>DA: {referrer.authority}</span>
                          <span>•</span>
                          <span>{referrer.links} links</span>
                          <span>•</span>
                          <span>{formatNumber(referrer.traffic)} traffic</span>
                        </div>
                      </div>
                      <Badge variant={referrer.authority > 70 ? 'default' : 'secondary'}>
                        High Authority
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Link Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer title="Link Type Distribution" className="h-80">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Follow Links', value: backlinkData.followLinks },
                          { name: 'Nofollow Links', value: backlinkData.nofollowLinks }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded" />
                      <span className="text-sm">Follow Links</span>
                    </div>
                    <span className="text-sm font-medium">
                      {backlinkData.followLinks} ({((backlinkData.followLinks / backlinkData.totalBacklinks) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded" />
                      <span className="text-sm">Nofollow Links</span>
                    </div>
                    <span className="text-sm font-medium">
                      {backlinkData.nofollowLinks} ({((backlinkData.nofollowLinks / backlinkData.totalBacklinks) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backlink Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">Backlink growth visualization would go here</p>
                <p className="text-sm text-gray-400 mt-2">Showing new vs lost backlinks over time</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 