import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'recharts';
import {
  generateCancellationRecords,
  calculateServiceCancellationRates,
  analyzeTimeSlots,
  analyzePatientSegments,
  generateWeeklyTrends,
  cancellationKPIs,
  topCancellationReasons,
} from '@/mockData/cancellationImpact';
import { DollarSign, TrendingDown, Clock, Users, AlertTriangle } from 'lucide-react';

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

export const CancellationImpact: React.FC = () => {
  const records = useMemo(() => generateCancellationRecords(), []);
  const serviceCancellationRates = useMemo(() => calculateServiceCancellationRates(records), [records]);
  const timeSlotAnalysis = useMemo(() => analyzeTimeSlots(records), [records]);
  const patientSegmentAnalysis = useMemo(() => analyzePatientSegments(records), [records]);
  const weeklyTrends = useMemo(() => generateWeeklyTrends(records), [records]);
  
  const getRiskBadge = (riskScore: string) => {
    const riskClasses = {
      'High': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'Low': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    };
    
    return (
      <Badge variant="secondary" className={`text-xs ${riskClasses[riskScore as keyof typeof riskClasses]}`}>
        {riskScore} Risk
      </Badge>
    );
  };
  
  // Prepare time slot data for heat map
  const timeSlotHeatMapData = timeSlotAnalysis.map(slot => ({
    timeSlot: slot.timeSlot,
    cancellationRate: slot.cancellationRate,
    noShowRate: slot.noShowRate,
    totalRate: slot.cancellationRate + slot.noShowRate,
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
          title="Total Lost Revenue (90d)"
          value={`£${cancellationKPIs.totalLostRevenue.toLocaleString()}`}
          change={-12.5}
          changeLabel="vs previous period"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="Cancellation Rate"
          value={`${cancellationKPIs.overallCancellationRate}%`}
          change={2.3}
          changeLabel="vs last month"
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <KPICard
          title="No-show Rate"
          value={`${cancellationKPIs.overallNoShowRate}%`}
          change={0.5}
          changeLabel="vs last month"
          icon={<Users className="h-4 w-4" />}
        />
        <KPICard
          title="Recovery Rate"
          value={`${cancellationKPIs.recoveryRate}%`}
          change={5.2}
          changeLabel="slots rebooked"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{cancellationKPIs.avgMonthlyLoss.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on 90-day average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Risk Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancellationKPIs.highestRiskSegment}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Most likely to cancel/no-show
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Cancellation Notice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancellationKPIs.avgCancellationLeadTime} hours</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lead time before appointment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="revenue-impact" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue-impact">Revenue Impact</TabsTrigger>
          <TabsTrigger value="service-analysis">Service Analysis</TabsTrigger>
          <TabsTrigger value="time-patterns">Time Patterns</TabsTrigger>
          <TabsTrigger value="patient-segments">Patient Segments</TabsTrigger>
        </TabsList>

        {/* Revenue Impact Tab */}
        <TabsContent value="revenue-impact" className="space-y-6">
          {/* Weekly Trends Chart */}
          <ChartContainer
            title="Weekly Cancellation & Revenue Impact"
            description="12-week trend of cancellations and lost revenue"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: any, name: any) => {
                    if (name.includes('Revenue')) {
                      return [`£${value.toLocaleString()}`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="cancellations" 
                  stackId="1"
                  stroke="#F59E0B" 
                  fill="#F59E0B"
                  name="Cancellations"
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="noShows" 
                  stackId="1"
                  stroke="#EF4444" 
                  fill="#EF4444"
                  name="No-shows"
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="lateCancellations" 
                  stackId="1"
                  stroke="#DC2626" 
                  fill="#DC2626"
                  name="Late Cancellations"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="netLoss" 
                  stroke="#991B1B" 
                  strokeWidth={3}
                  name="Net Revenue Loss"
                  dot={{ fill: '#991B1B', r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Cancellation Reasons */}
          <Card>
            <CardHeader>
              <CardTitle>Top Cancellation Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCancellationReasons.map((reason, index) => (
                  <div key={reason.reason} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{reason.reason}</span>
                        <span className="text-sm text-muted-foreground">{reason.count} ({reason.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${reason.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Analysis Tab */}
        <TabsContent value="service-analysis">
          <Card>
            <CardHeader>
              <CardTitle>Cancellation & No-show Rates by Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Service</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-right p-3">Total Appts</th>
                      <th className="text-right p-3">Cancellations</th>
                      <th className="text-right p-3">No-shows</th>
                      <th className="text-right p-3">Cancel Rate</th>
                      <th className="text-right p-3">No-show Rate</th>
                      <th className="text-right p-3">Lost Revenue</th>
                      <th className="text-right p-3">Avg Notice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceCancellationRates.map((service) => (
                      <tr key={service.service} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{service.service}</td>
                        <td className="p-3">
                          <Badge variant="secondary" className="text-xs">
                            {service.category}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">{service.totalAppointments}</td>
                        <td className="p-3 text-right">{service.cancellations + service.lateCancellations}</td>
                        <td className="p-3 text-right">{service.noShows}</td>
                        <td className="p-3 text-right">
                          <span className={`font-medium ${
                            service.cancellationRate > 15 ? 'text-red-600' :
                            service.cancellationRate > 10 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {service.cancellationRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-medium ${
                            service.noShowRate > 5 ? 'text-red-600' :
                            service.noShowRate > 3 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {service.noShowRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3 text-right font-medium">
                          £{service.totalLostRevenue.toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          {service.averageLeadTime > 0 ? `${service.averageLeadTime.toFixed(0)}h` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Patterns Tab */}
        <TabsContent value="time-patterns" className="space-y-6">
          {/* Time Slot Heat Map */}
          <ChartContainer
            title="Cancellation & No-show Rates by Time Slot"
            description="Combined cancellation and no-show rates throughout the day"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSlotHeatMapData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timeSlot" 
                  tick={{ fontSize: 10 }} 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Bar dataKey="cancellationRate" stackId="a" fill="#F59E0B" name="Cancellation Rate" />
                <Bar dataKey="noShowRate" stackId="a" fill="#EF4444" name="No-show Rate" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Time Slot Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Time Slot Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Time Slot</th>
                      <th className="text-right p-3">Total Appointments</th>
                      <th className="text-right p-3">Cancellations</th>
                      <th className="text-right p-3">No-shows</th>
                      <th className="text-right p-3">Combined Rate</th>
                      <th className="text-right p-3">Lost Revenue</th>
                      <th className="text-center p-3">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlotAnalysis.map((slot) => {
                      const combinedRate = slot.cancellationRate + slot.noShowRate;
                      const riskLevel = combinedRate > 20 ? 'High' : combinedRate > 15 ? 'Medium' : 'Low';
                      
                      return (
                        <tr key={slot.timeSlot} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{slot.timeSlot}</td>
                          <td className="p-3 text-right">{slot.totalAppointments}</td>
                          <td className="p-3 text-right">{slot.cancellations}</td>
                          <td className="p-3 text-right">{slot.noShows}</td>
                          <td className="p-3 text-right">
                            <span className={`font-medium ${
                              combinedRate > 20 ? 'text-red-600' :
                              combinedRate > 15 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {combinedRate.toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-3 text-right">£{slot.lostRevenue.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            {getRiskBadge(riskLevel)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Time Pattern Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Late Afternoon Risk</p>
                    <p className="text-sm text-muted-foreground">
                      Appointments after 4:00 PM show significantly higher cancellation rates, particularly at {cancellationKPIs.highestRiskTimeSlot}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Lunch Hour Pattern</p>
                    <p className="text-sm text-muted-foreground">
                      12:00-13:00 slots experience higher no-show rates, likely due to work schedule conflicts
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Morning Reliability</p>
                    <p className="text-sm text-muted-foreground">
                      9:00-11:00 AM slots show the lowest cancellation rates and should be prioritized for high-value procedures
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patient Segments Tab */}
        <TabsContent value="patient-segments" className="space-y-6">
          {/* Segment Risk Chart */}
          <ChartContainer
            title="Cancellation Risk by Patient Segment"
            description="Combined cancellation and no-show rates by patient type"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patientSegmentAnalysis} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="segment" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip formatter={(value: any) => `${value.toFixed(1)}%`} />
                <Legend />
                <Bar dataKey="cancellationRate" fill="#F59E0B" name="Cancellation Rate" />
                <Bar dataKey="noShowRate" fill="#EF4444" name="No-show Rate" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Segment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Segment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Segment</th>
                      <th className="text-right p-3">Total Appts</th>
                      <th className="text-right p-3">Cancellations</th>
                      <th className="text-right p-3">No-shows</th>
                      <th className="text-right p-3">Combined Rate</th>
                      <th className="text-right p-3">Avg Notice</th>
                      <th className="text-right p-3">Lost Revenue</th>
                      <th className="text-center p-3">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientSegmentAnalysis.map((segment) => (
                      <tr key={segment.segment} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{segment.segment}</td>
                        <td className="p-3 text-right">{segment.totalAppointments}</td>
                        <td className="p-3 text-right">{segment.cancellations}</td>
                        <td className="p-3 text-right">{segment.noShows}</td>
                        <td className="p-3 text-right">
                          <span className={`font-medium ${
                            (segment.cancellationRate + segment.noShowRate) > 20 ? 'text-red-600' :
                            (segment.cancellationRate + segment.noShowRate) > 15 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {(segment.cancellationRate + segment.noShowRate).toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {segment.avgLeadTime > 0 ? `${segment.avgLeadTime.toFixed(0)}h` : '-'}
                        </td>
                        <td className="p-3 text-right font-medium">
                          £{segment.lostRevenue.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          {getRiskBadge(segment.riskScore)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>High-Risk Segment Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">New Patients</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Send appointment reminders 48h and 24h before</li>
                      <li>• Require deposit for first appointment</li>
                      <li>• Call to confirm 2 days before appointment</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Insurance Patients</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Pre-authorize procedures before booking</li>
                      <li>• Clarify coverage details upfront</li>
                      <li>• Maintain waitlist for quick replacements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Recovery Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                      Implement 48-hour cancellation policy
                    </p>
                    <p className="text-xs text-green-800 dark:text-green-200 mt-1">
                      Could recover up to £{Math.round(cancellationKPIs.avgMonthlyLoss * 0.3).toLocaleString()} monthly
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      Maintain active waitlist system
                    </p>
                    <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                      Current recovery rate: {cancellationKPIs.recoveryRate}% → Target: 50%
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                      Overbooking strategy for high-risk slots
                    </p>
                    <p className="text-xs text-purple-800 dark:text-purple-200 mt-1">
                      Consider 5-10% overbooking for {cancellationKPIs.highestRiskTimeSlot} slots
                    </p>
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