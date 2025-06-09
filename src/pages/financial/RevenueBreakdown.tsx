import React from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from 'recharts';
import {
  revenueByModality,
  revenueByClinicianData,
  revenueByLocation,
  revenueByPayerType,
  generateMonthlyRevenueTrend,
  revenueByDayOfWeek,
  revenueKPIs,
} from '@/mockData/revenueBreakdown';
import { DollarSign, PoundSterling, TrendingUp, Activity, MapPin } from 'lucide-react';

const COLORS = ['#005EB8', '#38B6FF', '#F97316', '#14B8A6', '#8B5CF6', '#EC4899'];

export const RevenueBreakdown: React.FC = () => {
  const monthlyTrend = generateMonthlyRevenueTrend();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
          title="Total Revenue"
          value={formatCurrency(revenueKPIs.totalRevenue)}
          change={revenueKPIs.monthlyGrowth}
          changeLabel="vs last month"
          icon={<PoundSterling className="h-4 w-4" />}
        />
        <KPICard
          title="Avg Revenue/Scan"
          value={formatCurrency(revenueKPIs.avgRevenuePerScan)}
          change={5.2}
          changeLabel="vs last month"
          icon={<Activity className="h-4 w-4" />}
        />
        <KPICard
          title="Top Modality"
          value={`${revenueKPIs.topModality} (42%)`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="Top Location"
          value="Harley St Main (61%)"
          icon={<MapPin className="h-4 w-4" />}
        />
      </div>

      {/* Revenue by Modality and Payer Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Modality */}
        <ChartContainer
          title="Revenue by Modality"
          description="Revenue distribution across imaging types"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByModality}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByModality.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {revenueByModality.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground">{item.name}:</span>
                <span className="font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Revenue by Payer Type */}
        <ChartContainer
          title="Revenue by Payer Type"
          description="Payment source distribution"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByPayerType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByPayerType.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {revenueByPayerType.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }}
                />
                <span className="text-muted-foreground">{item.name}:</span>
                <span className="font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Monthly Revenue Trend */}
      <ChartContainer
        title="Monthly Revenue Trend"
        description="12-month revenue performance"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={COLORS[0]}
              strokeWidth={3}
              name="Total Revenue"
              dot={{ fill: COLORS[0] }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Revenue by Location and Day of Week */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Location */}
        <ChartContainer
          title="Revenue by Location"
          description="Performance across clinic locations"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByLocation} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="revenue" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Revenue by Day of Week */}
        <ChartContainer
          title="Revenue by Day of Week"
          description="Weekly pattern analysis"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByDayOfWeek}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? formatCurrency(value as number) : value,
                name === 'revenue' ? 'Revenue' : 'Avg Scans'
              ]} />
              <Bar dataKey="revenue" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Revenue by Clinician Table */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Clinician</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Clinician</th>
                  <th className="text-left p-3">Total Revenue</th>
                  <th className="text-left p-3">Scans</th>
                  <th className="text-left p-3">Avg Revenue/Scan</th>
                  <th className="text-left p-3">Trend</th>
                  <th className="text-left p-3">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {revenueByClinicianData.map((clinician) => {
                  const percentOfTotal = ((clinician.revenue / revenueKPIs.totalRevenue) * 100).toFixed(1);
                  return (
                    <tr key={clinician.name} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-medium">{clinician.name}</td>
                      <td className="p-3">{formatCurrency(clinician.revenue)}</td>
                      <td className="p-3">{clinician.scans}</td>
                      <td className="p-3">{formatCurrency(clinician.avgRevenue)}</td>
                      <td className="p-3">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            clinician.trend > 0
                              ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                              : 'text-red-600 bg-red-50 dark:bg-red-900/20'
                          }`}
                        >
                          {clinician.trend > 0 ? '+' : ''}{clinician.trend.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span>{percentOfTotal}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentOfTotal}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 