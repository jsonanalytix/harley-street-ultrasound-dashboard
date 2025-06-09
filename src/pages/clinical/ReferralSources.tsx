import React from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  generateReferralSources,
  referralKPIs,
  referralRevenueBySource,
} from '@/mockData/referralSources';
import { Building2, DollarSign, PoundSterling, TrendingUp, Users } from 'lucide-react';

const COLORS = ['#005EB8', '#38B6FF', '#F97316', '#14B8A6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

export const ReferralSources: React.FC = () => {
  const referralData = generateReferralSources();

  // Prepare bar chart data
  const chartData = referralData.slice(0, 10).map(source => ({
    name: source.name.length > 20 ? source.name.substring(0, 20) + '...' : source.name,
    revenue: source.revenue,
    bookings: source.bookings,
  }));

  // Prepare trend data for top 5 referrers
  const trendData = [
    { month: 'Jul', 'Google Ads': 28000, 'Consultants': 45000, 'GP Practices': 38000, 'Insurers': 42000, 'Embassies': 25000 },
    { month: 'Aug', 'Google Ads': 32000, 'Consultants': 48000, 'GP Practices': 40000, 'Insurers': 45000, 'Embassies': 28000 },
    { month: 'Sep', 'Google Ads': 35000, 'Consultants': 52000, 'GP Practices': 42000, 'Insurers': 48000, 'Embassies': 32000 },
    { month: 'Oct', 'Google Ads': 38000, 'Consultants': 55000, 'GP Practices': 45000, 'Insurers': 52000, 'Embassies': 35000 },
    { month: 'Nov', 'Google Ads': 42000, 'Consultants': 58000, 'GP Practices': 48000, 'Insurers': 55000, 'Embassies': 38000 },
    { month: 'Dec', 'Google Ads': 64900, 'Consultants': 68820, 'GP Practices': 58000, 'Insurers': 64340, 'Embassies': 44870 },
  ];

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Top Referrer"
          value={referralKPIs.topReferrer}
          icon={<Building2 className="h-4 w-4" />}
        />
        <KPICard
          title="Total Revenue"
          value={`£${(referralKPIs.totalRevenue / 1000).toFixed(0)}k`}
          change={referralKPIs.revenueChange}
          changeLabel="vs last month"
          icon={<PoundSterling className="h-4 w-4" />}
        />
        <KPICard
          title="Average Order Value"
          value={`£${referralKPIs.averageOrderValue}`}
          change={referralKPIs.aovChange}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="Active Referrers"
          value={referralData.length.toString()}
          change={8.7}
          changeLabel="vs last month"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Referral Source Bar Chart */}
        <ChartContainer
          title="Revenue by Referral Source"
          description="Top 10 referrers by revenue contribution"
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  name === 'revenue' ? `£${value.toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Bookings'
                ]}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#005EB8"
                name="Revenue (£)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Revenue Breakdown Pie Chart */}
        <ChartContainer
          title="Revenue Breakdown by Source Type"
          description="Percentage contribution by referral category"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={referralRevenueBySource}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {referralRevenueBySource.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `£${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {referralRevenueBySource.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground">{item.name}:</span>
                <span className="font-medium">£{(item.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Trends Chart */}
      <ChartContainer
        title="Top Referrer Trends"
        description="6-month revenue trends for top 5 referral categories"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => `£${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="Google Ads" stroke={COLORS[0]} strokeWidth={2} dot={{ fill: COLORS[0], r: 4 }} />
            <Line type="monotone" dataKey="Consultants" stroke={COLORS[1]} strokeWidth={2} dot={{ fill: COLORS[1], r: 4 }} />
            <Line type="monotone" dataKey="GP Practices" stroke={COLORS[2]} strokeWidth={2} dot={{ fill: COLORS[2], r: 4 }} />
            <Line type="monotone" dataKey="Insurers" stroke={COLORS[3]} strokeWidth={2} dot={{ fill: COLORS[3], r: 4 }} />
            <Line type="monotone" dataKey="Embassies" stroke={COLORS[4]} strokeWidth={2} dot={{ fill: COLORS[4], r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Referral Sources Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Referral Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Source</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Bookings</th>
                  <th className="text-left p-3">Revenue</th>
                  <th className="text-left p-3">AOV</th>
                  <th className="text-left p-3">Trend</th>
                  <th className="text-left p-3">Contact</th>
                </tr>
              </thead>
              <tbody>
                {referralData.map((source, index) => (
                  <tr key={source.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-xs text-muted-foreground">{source.location}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary" className="text-xs">
                        {source.type}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium">{source.bookings}</td>
                    <td className="p-3 font-medium">£{source.revenue.toLocaleString()}</td>
                    <td className="p-3">£{source.averageOrderValue}</td>
                    <td className="p-3">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getTrendColor(source.trend)}`}
                      >
                        {getTrendIcon(source.trend)}
                        <span className="ml-1">
                          {source.trendPercentage > 0 ? '+' : ''}{source.trendPercentage}%
                        </span>
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="text-xs">
                        <div>{source.contactPerson}</div>
                        <div className="text-muted-foreground">{source.email}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};