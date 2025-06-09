import React from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bar,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from 'recharts';
import {
  topProcedures,
  generateSeasonalData,
  procedureTrendsKPIs,
} from '@/mockData/procedureTrends';
import { TrendingUp, DollarSign, PoundSterling, Activity, Zap } from 'lucide-react';

const COLORS = ['#005EB8', '#38B6FF', '#F97316', '#14B8A6', '#8B5CF6', '#EC4899', '#10B981'];

export const ProcedureTrends: React.FC = () => {
  const seasonalData = generateSeasonalData();

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
    return <div className="h-3 w-3" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (trend === 'down') return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'Pregnancy': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'Breast': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      'Gynae': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Male': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
      'MSK': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      'Paediatric': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'Abdominal': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    };
    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };

  // Prepare data for volume/revenue comparison chart
  const volumeRevenueData = topProcedures.map(proc => ({
    name: proc.name.length > 20 ? proc.name.substring(0, 20) + '...' : proc.name,
    volume: proc.volume,
    revenue: proc.revenue / 1000, // Convert to thousands for better scale
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Procedures"
          value={procedureTrendsKPIs.totalProcedures.toLocaleString()}
          change={procedureTrendsKPIs.procedureChange}
          changeLabel="vs last month"
          icon={<Activity className="h-4 w-4" />}
        />
        <KPICard
          title="Total Revenue"
          value={`£${(procedureTrendsKPIs.totalRevenue / 1000).toFixed(0)}k`}
          change={procedureTrendsKPIs.revenueChange}
          changeLabel="vs last month"
          icon={<PoundSterling className="h-4 w-4" />}
        />
        <KPICard
          title="Top Category"
          value={procedureTrendsKPIs.topCategory}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="Fastest Growing"
          value={procedureTrendsKPIs.fastestGrowing}
          icon={<Zap className="h-4 w-4" />}
        />
      </div>

      {/* Top 10 Procedures Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Procedures by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Rank</th>
                  <th className="text-left p-3">Procedure</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Volume</th>
                  <th className="text-left p-3">Revenue</th>
                  <th className="text-left p-3">Avg Price</th>
                  <th className="text-left p-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topProcedures.map((procedure, index) => (
                  <tr key={procedure.name} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{index + 1}</td>
                    <td className="p-3">
                      <div className="font-medium">{procedure.name}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(procedure.category)}`}>
                        {procedure.category}
                      </Badge>
                    </td>
                    <td className="p-3">{procedure.volume.toLocaleString()}</td>
                    <td className="p-3 font-medium">£{procedure.revenue.toLocaleString()}</td>
                    <td className="p-3">£{procedure.averagePrice}</td>
                    <td className="p-3">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getTrendColor(procedure.trend)}`}
                      >
                        {getTrendIcon(procedure.trend)}
                        <span className="ml-1">
                          {procedure.trendPercentage > 0 ? '+' : ''}{procedure.trendPercentage}%
                        </span>
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume vs Revenue Chart */}
        <ChartContainer
          title="Volume vs Revenue Comparison"
          description="Top procedures by volume and revenue contribution"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={volumeRevenueData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }} 
                angle={-45} 
                textAnchor="end" 
                height={80}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="volume" 
                fill={COLORS[0]} 
                name="Volume (count)" 
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="revenue" 
                stroke={COLORS[2]} 
                strokeWidth={3}
                name="Revenue (£k)" 
                dot={{ fill: COLORS[2], r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Category Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Pregnancy', 'Breast', 'Gynae', 'Male', 'MSK', 'Paediatric', 'Abdominal'].map((category, index) => {
                const categoryProcs = topProcedures.filter(p => p.category === category);
                const totalRevenue = categoryProcs.reduce((sum, p) => sum + p.revenue, 0);
                const totalVolume = categoryProcs.reduce((sum, p) => sum + p.volume, 0);
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{category}</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">Vol: {totalVolume.toLocaleString()}</span>
                      <span className="font-medium">£{(totalRevenue / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Demand Chart */}
      <ChartContainer
        title="Seasonal Demand Patterns"
        description="Monthly scan volume by category showing seasonal trends"
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={seasonalData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="pregnancy" 
              stroke={COLORS[0]} 
              strokeWidth={2} 
              name="Pregnancy"
              dot={{ fill: COLORS[0], r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="breast" 
              stroke={COLORS[1]} 
              strokeWidth={2} 
              name="Breast"
              dot={{ fill: COLORS[1], r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="gynae" 
              stroke={COLORS[2]} 
              strokeWidth={2} 
              name="Gynae"
              dot={{ fill: COLORS[2], r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="male" 
              stroke={COLORS[3]} 
              strokeWidth={2} 
              name="Male Health"
              dot={{ fill: COLORS[3], r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="msk" 
              stroke={COLORS[4]} 
              strokeWidth={2} 
              name="MSK"
              dot={{ fill: COLORS[4], r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="paediatric" 
              stroke={COLORS[5]} 
              strokeWidth={2} 
              name="Paediatric"
              dot={{ fill: COLORS[5], r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="abdominal" 
              stroke={COLORS[6]} 
              strokeWidth={2} 
              name="Abdominal"
              dot={{ fill: COLORS[6], r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Seasonal Insights Card */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🌸 Spring Peak (Mar-May)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Pregnancy scans increase by 20% - ensure adequate staffing for anomaly and growth scans.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">☀️ Summer Sports (Jun-Aug)</h4>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                MSK ultrasounds peak with 20% increase - consider extended hours for sports injury assessments.
              </p>
            </div>
            
            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <h4 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">🎀 October Awareness</h4>
              <p className="text-sm text-pink-800 dark:text-pink-200">
                Breast screening demand increases by 15% - run awareness campaigns and offer package deals.
              </p>
            </div>
            
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
              <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">🧔 Movember Impact</h4>
              <p className="text-sm text-cyan-800 dark:text-cyan-200">
                Male health scans increase by 10% in November - partner with Movember campaigns for promotions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 