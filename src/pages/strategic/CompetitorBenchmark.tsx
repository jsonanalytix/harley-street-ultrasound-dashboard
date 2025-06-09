import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ScatterChart, Scatter
} from 'recharts';
import {
  TrendingUp, TrendingDown, Minus, Star, Clock, DollarSign, PoundSterling, Users,
  Activity, Globe, Target, AlertCircle, ChevronUp, ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import {
  competitors,
  generateServicePricing,
  generateReviewMetrics,
  generateServiceOfferings,
  generateMarketingMetrics,
  generateWaitTimeComparison,
  generateMarketShareEstimates,
  calculateCompetitorKPIs,
  type ServicePricing,
  type ReviewMetrics,
  type MarketShareEstimate
} from '@/mockData/competitorAnalysis';

const COLORS = {
  primary: '#0EA5E9',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#94A3B8'
};

export const CompetitorBenchmark: React.FC = () => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');

  // Generate all data
  const { pricing, reviews, offerings, marketing, waitTimes, marketShare, kpis } = useMemo(() => {
    const pricingData = generateServicePricing();
    const reviewData = generateReviewMetrics();
    const offeringData = generateServiceOfferings();
    const marketingData = generateMarketingMetrics();
    const waitTimeData = generateWaitTimeComparison();
    const marketShareData = generateMarketShareEstimates();
    const kpiData = calculateCompetitorKPIs();

    return {
      pricing: pricingData,
      reviews: reviewData,
      offerings: offeringData,
      marketing: marketingData,
      waitTimes: waitTimeData,
      marketShare: marketShareData,
      kpis: kpiData
    };
  }, []);

  // Market Share Chart Data
  const marketShareChartData = useMemo(() => {
    return marketShare.map(ms => ({
      month: format(ms.month, 'MMM yyyy'),
      'Harley Street US': ms.ourShare,
      ...competitors.reduce((acc, comp) => {
        const share = ms.marketShares.find(s => s.competitorId === comp.id);
        return { ...acc, [comp.name]: share?.share || 0 };
      }, {})
    }));
  }, [marketShare]);

  // Price Comparison Data
  const priceComparisonData = useMemo(() => {
    const serviceGroups = pricing.reduce((acc, p) => {
      if (!acc[p.service]) {
        acc[p.service] = { service: p.service, ourPrice: p.ourPrice, competitors: [] };
      }
      const competitor = competitors.find(c => c.id === p.competitorId);
      if (competitor) {
        acc[p.service].competitors.push({
          name: competitor.name,
          price: p.theirPrice,
          difference: p.percentageDifference
        });
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(serviceGroups);
  }, [pricing]);

  // Review Comparison Radar Data
  const reviewRadarData = useMemo(() => {
    const metrics = ['Google Rating', 'Review Count', 'Response Speed', 'NPS Score', 'Wait Time'];
    const maxValues = {
      'Google Rating': 5,
      'Review Count': 500,
      'Response Speed': 24,
      'NPS Score': 100,
      'Wait Time': 20
    };

    return metrics.map(metric => {
      const dataPoint: any = { metric };
      
      // Add our values
      dataPoint['Harley Street US'] = metric === 'Google Rating' ? 92 : // 4.6/5 * 100
                                      metric === 'Review Count' ? 90 : // 450/500 * 100
                                      metric === 'Response Speed' ? 92 : // (24-2)/24 * 100
                                      metric === 'NPS Score' ? 65 : // 65/100 * 100
                                      85; // (20-3)/20 * 100 - default for Wait Time

      // Add competitor values
      reviews.forEach(review => {
        const competitor = competitors.find(c => c.id === review.competitorId);
        if (competitor) {
          let value = 0;
          switch (metric) {
            case 'Google Rating':
              value = (review.googleRating / maxValues[metric]) * 100;
              break;
            case 'Review Count':
              value = (review.googleReviewCount / maxValues[metric]) * 100;
              break;
            case 'Response Speed':
              value = ((maxValues[metric] - review.responseTime) / maxValues[metric]) * 100;
              break;
            case 'NPS Score':
              value = (review.npsScore / maxValues[metric]) * 100;
              break;
            case 'Wait Time':
              value = ((maxValues[metric] - review.avgWaitTime) / maxValues[metric]) * 100;
              break;
          }
          dataPoint[competitor.name] = Math.round(value);
        }
      });

      return dataPoint;
    });
  }, [reviews]);

  // Service Coverage Matrix
  const serviceCoverageData = useMemo(() => {
    return offerings.map(offering => {
      const coverage: any = {
        service: offering.service,
        category: offering.category,
        'Harley Street US': offering.weOffer ? 100 : 0
      };

      offering.competitors.forEach(comp => {
        const competitor = competitors.find(c => c.id === comp.competitorId);
        if (competitor) {
          coverage[competitor.name] = comp.offers ? (comp.specialisation ? 100 : 50) : 0;
        }
      });

      return coverage;
    });
  }, [offerings]);

  // Marketing Spend Trend
  const marketingTrendData = useMemo(() => {
    const monthlyData = marketing.reduce((acc, m) => {
      const monthKey = format(m.month, 'MMM yyyy');
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey };
      }
      const competitor = competitors.find(c => c.id === m.competitorId);
      if (competitor) {
        acc[monthKey][competitor.name] = m.estimatedAdSpend;
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData).reverse();
  }, [marketing]);

  const getTrendIcon = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCompetitorColor = (name: string) => {
    const colorMap: Record<string, string> = {
      'Harley Street US': COLORS.primary,
      'London Pregnancy Clinic': COLORS.secondary,
      'The Birth Company': COLORS.success,
      'City Ultrasound': COLORS.warning,
      'BabyBond Ultrasound': COLORS.danger,
      'NHS Private Unit': COLORS.muted
    };
    return colorMap[name] || COLORS.muted;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Competitor Benchmark Report</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          Market Position: #{kpis.marketShare.rank}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Market Share"
          value={`${kpis.marketShare.current.toFixed(1)}%`}
          change={kpis.marketShare.growth}
          changeLabel={`${kpis.marketShare.growth > 0 ? '+' : ''}${kpis.marketShare.growth.toFixed(1)}% YoY`}
          icon={<Target className="h-6 w-6" />}
        />
        <KPICard
          title="Review Rating"
          value={kpis.reviews.ourRating.toFixed(1)}
          change={kpis.reviews.ratingAdvantage}
          changeLabel={`${kpis.reviews.totalReviews} reviews`}
          icon={<Star className="h-6 w-6" />}
        />
        <KPICard
          title="Price Position"
          value={kpis.pricing.position}
          change={kpis.pricing.avgDifference}
          changeLabel={`${Math.abs(kpis.pricing.avgDifference).toFixed(1)}% ${kpis.pricing.avgDifference > 0 ? 'above' : 'below'} avg`}
          icon={<PoundSterling className="h-6 w-6" />}
        />
        <KPICard
          title="Wait Time Advantage"
          value={`${kpis.waitTime.advantage.toFixed(1)} days`}
          change={kpis.waitTime.advantage}
          changeLabel={`${kpis.waitTime.ourAverage} vs ${kpis.waitTime.competitorAverage} days`}
          icon={<Clock className="h-6 w-6" />}
        />
      </div>

      <Tabs defaultValue="market-share" className="space-y-4">
        <TabsList>
          <TabsTrigger value="market-share">Market Share</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Analysis</TabsTrigger>
          <TabsTrigger value="reviews">Reviews & Reputation</TabsTrigger>
          <TabsTrigger value="services">Service Coverage</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="market-share" className="space-y-4">
          <ChartContainer title="Market Share Trend - Last 12 Months">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={marketShareChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Market Share (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Harley Street US"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary }}
                />
                {competitors.map(comp => (
                  <Line
                    key={comp.id}
                    type="monotone"
                    dataKey={comp.name}
                    stroke={getCompetitorColor(comp.name)}
                    strokeWidth={2}
                    strokeDasharray={comp.type === 'Budget' ? '5 5' : undefined}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <Card>
            <CardHeader>
              <CardTitle>Competitor Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Competitor</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-right p-2">Market Share</th>
                      <th className="text-center p-2">Trend</th>
                      <th className="text-right p-2">Est. Since</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">Harley Street US</td>
                      <td className="p-2">
                        <Badge variant="default">Premium</Badge>
                      </td>
                      <td className="p-2">Harley Street</td>
                      <td className="p-2 text-right font-medium">{kpis.marketShare.current.toFixed(1)}%</td>
                      <td className="p-2 text-center">{getTrendIcon(kpis.marketShare.trend)}</td>
                      <td className="p-2 text-right">2018</td>
                    </tr>
                    {competitors.map(comp => {
                      const share = marketShare[0].marketShares.find(s => s.competitorId === comp.id);
                      return (
                        <tr key={comp.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{comp.name}</td>
                          <td className="p-2">
                            <Badge 
                              variant={comp.type === 'Premium' ? 'default' : 
                                      comp.type === 'Standard' ? 'secondary' : 'outline'}
                            >
                              {comp.type}
                            </Badge>
                          </td>
                          <td className="p-2">{comp.location}</td>
                          <td className="p-2 text-right">{share?.share.toFixed(1)}%</td>
                          <td className="p-2 text-center">{share && getTrendIcon(share.trend)}</td>
                          <td className="p-2 text-right">{comp.established}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Pricing Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      {priceComparisonData.map(service => (
                        <SelectItem key={service.service} value={service.service}>
                          {service.service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {priceComparisonData
                    .filter(service => selectedService === 'all' || service.service === selectedService)
                    .map(service => (
                      <div key={service.service} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{service.service}</span>
                          <span className="text-lg font-bold">£{service.ourPrice}</span>
                        </div>
                        <div className="space-y-1">
                          {service.competitors.map((comp: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">{comp.name}</span>
                              <div className="flex items-center gap-2">
                                <span>£{comp.price}</span>
                                <Badge 
                                  variant={comp.difference > 5 ? 'default' : 
                                          comp.difference < -5 ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {comp.difference > 0 ? '+' : ''}{comp.difference.toFixed(1)}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <ChartContainer title="Price Positioning by Competitor Type">
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="avgPrice" 
                    name="Average Price (£)"
                    label={{ value: 'Average Price (£)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    dataKey="rating" 
                    name="Google Rating"
                    label={{ value: 'Google Rating', angle: -90, position: 'insideLeft' }}
                    domain={[3, 5]}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter
                    name="Competitors"
                    data={reviews.map(review => {
                      const comp = competitors.find(c => c.id === review.competitorId);
                      const avgPrice = pricing
                        .filter(p => p.competitorId === review.competitorId)
                        .reduce((sum, p) => sum + p.theirPrice, 0) / 12;
                      return {
                        name: comp?.name,
                        avgPrice: Math.round(avgPrice),
                        rating: review.googleRating,
                        type: comp?.type
                      };
                    })}
                    fill={COLORS.secondary}
                  >
                    {reviews.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? COLORS.primary : COLORS.secondary} 
                      />
                    ))}
                  </Scatter>
                  <Scatter
                    name="Harley Street US"
                    data={[{
                      name: 'Harley Street US',
                      avgPrice: pricing.filter(p => p.competitorId === competitors[0].id)[0]?.ourPrice || 200,
                      rating: kpis.reviews.ourRating,
                      type: 'Premium'
                    }]}
                    fill={COLORS.primary}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartContainer title="Multi-Metric Performance Comparison">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={reviewRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Harley Street US"
                    dataKey="Harley Street US"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  {selectedCompetitor === 'all' ? (
                    competitors.slice(0, 2).map(comp => (
                      <Radar
                        key={comp.id}
                        name={comp.name}
                        dataKey={comp.name}
                        stroke={getCompetitorColor(comp.name)}
                        fill={getCompetitorColor(comp.name)}
                        fillOpacity={0.1}
                        strokeWidth={1}
                      />
                    ))
                  ) : (
                    <Radar
                      name={competitors.find(c => c.id === selectedCompetitor)?.name || ''}
                      dataKey={competitors.find(c => c.id === selectedCompetitor)?.name || ''}
                      stroke={COLORS.secondary}
                      fill={COLORS.secondary}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  )}
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <Card>
              <CardHeader>
                <CardTitle>Review Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Harley Street US</span>
                      <div className="flex gap-2">
                        <Badge variant="default">
                          <Star className="h-3 w-3 mr-1" />
                          {kpis.reviews.ourRating}
                        </Badge>
                        <Badge variant="outline">{kpis.reviews.totalReviews} reviews</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Google: 4.6 ★ (450)</div>
                      <div>Trustpilot: 4.4 ★ (270)</div>
                      <div>Response Time: 2 hours</div>
                      <div>NPS Score: 65</div>
                    </div>
                  </div>
                  {reviews.map(review => {
                    const comp = competitors.find(c => c.id === review.competitorId);
                    return (
                      <div key={review.competitorId} className="border-b pb-3 last:border-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{comp?.name}</span>
                          <div className="flex gap-2">
                            <Badge variant={review.googleRating >= 4.5 ? 'default' : 
                                          review.googleRating >= 4.0 ? 'secondary' : 'outline'}>
                              <Star className="h-3 w-3 mr-1" />
                              {review.googleRating}
                            </Badge>
                            <Badge variant="outline">{review.googleReviewCount} reviews</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>Google: {review.googleRating} ★ ({review.googleReviewCount})</div>
                          <div>Trustpilot: {review.trustpilotRating} ★ ({review.trustpilotReviewCount})</div>
                          <div>Response Time: {review.responseTime} hours</div>
                          <div>NPS Score: {review.npsScore}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Coverage Matrix</CardTitle>
              <p className="text-sm text-gray-600">
                ✓ Offered | ★ Specialization | ✗ Not Offered
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Service</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-center p-2">We Offer</th>
                      {competitors.map(comp => (
                        <th key={comp.id} className="text-center p-2 text-xs">
                          {comp.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {offerings.map(offering => (
                      <tr key={offering.service} className="border-b hover:bg-gray-50">
                        <td className="p-2">{offering.service}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">
                            {offering.category}
                          </Badge>
                        </td>
                        <td className="p-2 text-center">
                          {offering.weOffer ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                        </td>
                        {offering.competitors.map(comp => (
                          <td key={comp.competitorId} className="p-2 text-center">
                            {comp.specialisation ? (
                              <span className="text-yellow-600">★</span>
                            ) : comp.offers ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-gray-300">✗</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartContainer title="Service Category Coverage">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { category: 'Pregnancy', us: 90, competitors: 75 },
                  { category: 'Gynaecology', us: 85, competitors: 70 },
                  { category: 'General', us: 70, competitors: 60 },
                  { category: 'Specialist', us: 50, competitors: 40 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="us" name="Harley Street US" fill={COLORS.primary} />
                  <Bar dataKey="competitors" name="Avg Competitor" fill={COLORS.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Wait Time by Service">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={waitTimes.map(w => ({
                  service: w.service.replace(' Scan', ''),
                  'Our Wait': w.ourWaitTime,
                  'Avg Competitor': Math.round(
                    w.competitors.reduce((sum, c) => sum + c.waitTime, 0) / w.competitors.length
                  )
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service" angle={-45} textAnchor="end" height={80} />
                  <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Our Wait" fill={COLORS.primary} />
                  <Bar dataKey="Avg Competitor" fill={COLORS.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartContainer title="Estimated Monthly Ad Spend Trend">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={marketingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Ad Spend (£)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: any) => `£${value.toLocaleString()}`} />
                  <Legend />
                  {competitors.map(comp => (
                    <Line
                      key={comp.id}
                      type="monotone"
                      dataKey={comp.name}
                      stroke={getCompetitorColor(comp.name)}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <Card>
              <CardHeader>
                <CardTitle>Digital Marketing Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketing
                    .filter(m => format(m.month, 'MMM yyyy') === format(marketingTrendData[0]?.month || new Date(), 'MMM yyyy'))
                    .map(metric => {
                      const comp = competitors.find(c => c.id === metric.competitorId);
                      return (
                        <div key={metric.competitorId} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{comp?.name}</span>
                            <Badge variant="outline">DA: {metric.domainAuthority}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ad Spend:</span>
                              <span className="font-medium">£{metric.estimatedAdSpend.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Search Visibility:</span>
                              <span className="font-medium">{metric.searchVisibility}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Traffic Rank:</span>
                              <span className="font-medium">#{metric.websiteTrafficRank.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Social Total:</span>
                              <span className="font-medium">
                                {Object.values(metric.socialMediaFollowers).reduce((sum, val) => sum + val, 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex gap-4 text-xs text-gray-500">
                            <span>FB: {metric.socialMediaFollowers.facebook.toLocaleString()}</span>
                            <span>IG: {metric.socialMediaFollowers.instagram.toLocaleString()}</span>
                            <span>TW: {metric.socialMediaFollowers.twitter.toLocaleString()}</span>
                            <span>LI: {metric.socialMediaFollowers.linkedin.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Competitive Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Market Leadership Opportunity</h4>
                    <p className="text-sm text-gray-600">
                      Currently ranked #2 with {kpis.marketShare.current.toFixed(1)}% market share. 
                      London Pregnancy Clinic leads but showing declining trend. 
                      Opportunity to capture additional 3-5% share through targeted campaigns.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Competitive Advantages</h4>
                    <p className="text-sm text-gray-600">
                      Superior review ratings ({kpis.reviews.ourRating} vs {kpis.reviews.avgCompetitorRating} avg), 
                      faster response times (2 hours), and {kpis.waitTime.advantage.toFixed(1)} days shorter wait times. 
                      Premium positioning justified by service quality.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Strategic Recommendations</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                      <li>Expand specialist services where competitors have gaps</li>
                      <li>Increase digital marketing spend to match premium competitors</li>
                      <li>Leverage superior NPS score in marketing campaigns</li>
                      <li>Consider strategic pricing on high-volume services</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 