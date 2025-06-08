import React from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bar,
  BarChart,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Treemap,
  Cell,
} from 'recharts';
import {
  calculateProcedureProfitability,
  calculateCategoryProfitability,
  profitabilityKPIs,
  costBreakdownByCategory,
} from '@/mockData/profitability';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = ['#005EB8', '#38B6FF', '#F97316', '#14B8A6', '#8B5CF6', '#EC4899', '#10B981'];

// Custom content for Treemap
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, grossMarginPercentage, profitabilityRating } = props;
  
  const getColor = () => {
    if (profitabilityRating === 'high') return '#10B981';
    if (profitabilityRating === 'medium') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: getColor(),
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight="bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
          >
            {grossMarginPercentage?.toFixed(1)}%
          </text>
        </>
      )}
    </g>
  );
};

export const Profitability: React.FC = () => {
  const procedures = calculateProcedureProfitability();
  const categories = calculateCategoryProfitability();
  const kpis = profitabilityKPIs();
  const costBreakdown = costBreakdownByCategory();

  // Sort procedures by gross margin percentage
  const sortedProcedures = [...procedures].sort((a, b) => b.grossMarginPercentage - a.grossMarginPercentage);
  const topProcedures = sortedProcedures.slice(0, 10);
  const bottomProcedures = sortedProcedures.slice(-10).reverse();

  // Prepare data for treemap
  const treemapData = procedures.map(p => ({
    name: p.procedureName,
    size: p.revenue,
    grossMarginPercentage: p.grossMarginPercentage,
    profitabilityRating: p.profitabilityRating,
  }));

  // Prepare data for cost breakdown chart
  const costBreakdownChartData = costBreakdown.map(item => ({
    category: item.category,
    'Staff Cost': item.staffCost,
    'Consumables': item.consumables,
    'Equipment': item.equipment,
    'Overhead': item.overhead,
    'Gross Margin': 100 - (item.staffCost + item.consumables + item.equipment + item.overhead),
  }));

  const getProfitabilityBadge = (rating: string) => {
    const colorClass = 
      rating === 'high' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
      rating === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    
    return (
      <Badge variant="secondary" className={`text-xs ${colorClass}`}>
        {rating.charAt(0).toUpperCase() + rating.slice(1)}
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
          title="Overall Gross Margin"
          value={`${kpis.overallGrossMarginPercentage.toFixed(1)}%`}
          change={kpis.averageMarginChange}
          changeLabel="vs last month"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="Total Gross Profit"
          value={`£${(kpis.overallGrossMargin / 1000).toFixed(0)}k`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="High Margin Services"
          value={kpis.highMarginProcedures.toString()}
          icon={<TrendingUp className="h-4 w-4 text-green-600" />}
        />
        <KPICard
          title="Low Margin Services"
          value={kpis.lowMarginProcedures.toString()}
          icon={<TrendingDown className="h-4 w-4 text-red-600" />}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="procedures">Procedure Analysis</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="cost-breakdown">Cost Breakdown</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Profitability Treemap */}
          <ChartContainer
            title="Service Profitability Map"
            description="Size represents revenue, color represents margin level"
          >
            <div className="mb-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>High Margin (≥60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span>Medium Margin (40-60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span>Low Margin (&lt;40%)</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomTreemapContent />}
              />
            </ResponsiveContainer>
          </ChartContainer>

          {/* Top and Bottom Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Top 10 High-Margin Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProcedures.map((proc, index) => (
                    <div key={proc.procedureName} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                        <div>
                          <div className="font-medium text-sm">{proc.procedureName}</div>
                          <div className="text-xs text-muted-foreground">{proc.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{proc.grossMarginPercentage.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">£{(proc.grossMargin / 1000).toFixed(0)}k</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Bottom 10 Low-Margin Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bottomProcedures.map((proc, index) => (
                    <div key={proc.procedureName} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                        <div>
                          <div className="font-medium text-sm">{proc.procedureName}</div>
                          <div className="text-xs text-muted-foreground">{proc.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">{proc.grossMarginPercentage.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">£{(proc.grossMargin / 1000).toFixed(0)}k</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Procedure Analysis Tab */}
        <TabsContent value="procedures">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Procedure Profitability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Procedure</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-right p-3">Volume</th>
                      <th className="text-right p-3">Revenue</th>
                      <th className="text-right p-3">Total Cost</th>
                      <th className="text-right p-3">Gross Margin</th>
                      <th className="text-right p-3">Margin %</th>
                      <th className="text-center p-3">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProcedures.map((proc) => (
                      <tr key={proc.procedureName} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{proc.procedureName}</td>
                        <td className="p-3">
                          <Badge variant="secondary" className="text-xs">
                            {proc.category}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">{proc.volume.toLocaleString()}</td>
                        <td className="p-3 text-right">£{proc.revenue.toLocaleString()}</td>
                        <td className="p-3 text-right">£{proc.costs.totalCost.toLocaleString()}</td>
                        <td className="p-3 text-right font-medium">£{proc.grossMargin.toLocaleString()}</td>
                        <td className="p-3 text-right font-semibold">
                          <span className={proc.grossMarginPercentage >= 60 ? 'text-green-600' : proc.grossMarginPercentage >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                            {proc.grossMarginPercentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {getProfitabilityBadge(proc.profitabilityRating)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Analysis Tab */}
        <TabsContent value="categories" className="space-y-6">
          {/* Category Profitability Chart */}
          <ChartContainer
            title="Profitability by Service Category"
            description="Gross margin percentage and revenue by category"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={categories} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toFixed(1) : value} />
                <Legend />
                <Bar yAxisId="left" dataKey="grossMarginPercentage" fill={COLORS[0]} name="Margin %" radius={[4, 4, 0, 0]}>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.grossMarginPercentage >= 60 ? '#10B981' : entry.grossMarginPercentage >= 40 ? '#F59E0B' : '#EF4444'} />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="totalRevenue" stroke={COLORS[2]} strokeWidth={3} name="Revenue (£)" dot={{ fill: COLORS[2], r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Category Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Category</th>
                      <th className="text-right p-3">Volume</th>
                      <th className="text-right p-3">Revenue</th>
                      <th className="text-right p-3">Total Costs</th>
                      <th className="text-right p-3">Gross Margin</th>
                      <th className="text-right p-3">Margin %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.sort((a, b) => b.grossMarginPercentage - a.grossMarginPercentage).map((cat) => (
                      <tr key={cat.category} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{cat.category}</td>
                        <td className="p-3 text-right">{cat.volume.toLocaleString()}</td>
                        <td className="p-3 text-right">£{cat.totalRevenue.toLocaleString()}</td>
                        <td className="p-3 text-right">£{cat.totalCosts.toLocaleString()}</td>
                        <td className="p-3 text-right font-medium">£{cat.grossMargin.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <span className={`font-semibold ${cat.grossMarginPercentage >= 60 ? 'text-green-600' : cat.grossMarginPercentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {cat.grossMarginPercentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Breakdown Tab */}
        <TabsContent value="cost-breakdown">
          <ChartContainer
            title="Cost Structure by Category"
            description="Percentage breakdown of costs and margin by service category"
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={costBreakdownChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value: any) => `${value.toFixed(1)}%`} />
                <Legend />
                <Bar dataKey="Staff Cost" stackId="a" fill="#EF4444" />
                <Bar dataKey="Consumables" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Equipment" stackId="a" fill="#3B82F6" />
                <Bar dataKey="Overhead" stackId="a" fill="#8B5CF6" />
                <Bar dataKey="Gross Margin" stackId="a" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Cost Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Management Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Staff Cost Optimization</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    MSK procedures have the highest staff cost ratio due to longer scan times. Consider training sonographers for these specialized scans to reduce consultant dependency.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">High-Margin Opportunities</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Pregnancy scans show the best margins (60%+) due to shorter scan times and high demand. Consider promotional packages to increase volume.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Equipment Utilization</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Equipment depreciation is highest for specialized scans (4D, fertility). Ensure maximum utilization of high-end equipment during peak hours.
                  </p>
                </div>
                
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Low-Margin Services</h4>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Complex MSK scans show lower margins due to time requirements. Consider bundling with follow-up consultations to improve overall profitability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 