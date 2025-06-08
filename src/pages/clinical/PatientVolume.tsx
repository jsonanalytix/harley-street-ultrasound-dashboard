import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import {
  generatePatientVolumeData,
  generateDailyVolumeTable,
  generateUtilizationData,
  generateWeeklyMonthlyData,
  patientVolumeKPIs,
  clinicResources,
} from '@/mockData/patientVolume';
import { Users, TrendingUp, UserCheck, UserPlus, Activity, Building, Stethoscope } from 'lucide-react';

const COLORS = ['#005EB8', '#38B6FF', '#F97316', '#14B8A6', '#8B5CF6', '#EC4899', '#10B981'];

export const PatientVolume: React.FC = () => {
  const [timeView, setTimeView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const volumeData = generatePatientVolumeData();
  const tableData = generateDailyVolumeTable();
  const utilizationData = generateUtilizationData();
  const weeklyMonthlyData = generateWeeklyMonthlyData();

  // Prepare pie chart data
  const totalScans = volumeData[volumeData.length - 1];
  const pieData = [
    { name: 'New Patients', value: totalScans.newPatients, color: '#005EB8' },
    { name: 'Returning Patients', value: totalScans.returningPatients, color: '#38B6FF' },
  ];

  // Prepare modality breakdown for pie chart
  const modalityBreakdown = [
    { name: 'Pregnancy', value: volumeData.reduce((sum, d) => sum + d.pregnancy, 0), color: COLORS[0] },
    { name: 'Breast', value: volumeData.reduce((sum, d) => sum + d.breast, 0), color: COLORS[1] },
    { name: 'Gynae', value: volumeData.reduce((sum, d) => sum + d.gynae, 0), color: COLORS[2] },
    { name: 'Male Health', value: volumeData.reduce((sum, d) => sum + d.male, 0), color: COLORS[3] },
    { name: 'MSK', value: volumeData.reduce((sum, d) => sum + d.msk, 0), color: COLORS[4] },
    { name: 'Paediatric', value: volumeData.reduce((sum, d) => sum + d.paediatric, 0), color: COLORS[5] },
    { name: 'Abdominal', value: volumeData.reduce((sum, d) => sum + d.abdominal, 0), color: COLORS[6] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Scans (30d)"
          value={patientVolumeKPIs.totalScans.toLocaleString()}
          change={patientVolumeKPIs.changeVsPrevious}
          changeLabel="vs last month"
          icon={<Users className="h-4 w-4" />}
        />
        <KPICard
          title="Scans per Day"
          value={patientVolumeKPIs.scansPerDay.toFixed(1)}
          change={5.2}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="New Patients"
          value={`${patientVolumeKPIs.newPatientPercentage}%`}
          change={2.3}
          changeLabel="vs last month"
          icon={<UserPlus className="h-4 w-4" />}
        />
        <KPICard
          title="Room Utilization"
          value={`${patientVolumeKPIs.roomUtilization}%`}
          change={3.2}
          changeLabel="vs last month"
          icon={<Building className="h-4 w-4" />}
        />
      </div>

      {/* Utilization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Equipment Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientVolumeKPIs.equipmentUtilization}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {clinicResources.totalEquipment} ultrasound machines
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${patientVolumeKPIs.equipmentUtilization}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Staff Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientVolumeKPIs.staffUtilization}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Object.values(clinicResources.totalStaff).reduce((a, b) => a + b, 0)} total staff
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${patientVolumeKPIs.staffUtilization}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clinic Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exam Rooms:</span>
                <span className="font-medium">{clinicResources.totalRooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Consultants:</span>
                <span className="font-medium">{clinicResources.totalStaff.consultants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sonographers:</span>
                <span className="font-medium">{clinicResources.totalStaff.sonographers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volume Analysis Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Volume Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Modality Breakdown</TabsTrigger>
          <TabsTrigger value="utilization">Utilization Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area Chart */}
            <ChartContainer
              title="Scan Volume Trends by Modality"
              description="90-day scan volume breakdown"
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value, name) => [value, name]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="pregnancy" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} name="Pregnancy" />
                  <Area type="monotone" dataKey="breast" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} name="Breast" />
                  <Area type="monotone" dataKey="gynae" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} name="Gynae" />
                  <Area type="monotone" dataKey="male" stackId="1" stroke={COLORS[3]} fill={COLORS[3]} name="Male Health" />
                  <Area type="monotone" dataKey="msk" stackId="1" stroke={COLORS[4]} fill={COLORS[4]} name="MSK" />
                  <Area type="monotone" dataKey="paediatric" stackId="1" stroke={COLORS[5]} fill={COLORS[5]} name="Paediatric" />
                  <Area type="monotone" dataKey="abdominal" stackId="1" stroke={COLORS[6]} fill={COLORS[6]} name="Abdominal" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Pie Chart */}
            <ChartContainer
              title="Patient Mix"
              description="New vs Returning Patients"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Modality Pie Chart */}
            <ChartContainer
              title="Scan Volume by Modality"
              description="Total distribution across all modalities"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={modalityBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {modalityBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Bar Chart for Weekly/Monthly View */}
            <ChartContainer
              title="Volume Summary"
              description="Weekly and monthly scan totals"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyMonthlyData.filter(d => d.type === 'week').slice(-8)}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total" fill={COLORS[0]} name="Total Scans" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-4">
          <ChartContainer
            title="30-Day Utilization Trends"
            description="Room, equipment, and staff utilization rates"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => `${value}%`}
                />
                <Legend />
                <Line type="monotone" dataKey="roomUtilization" stroke={COLORS[0]} strokeWidth={2} name="Room Utilization" dot={false} />
                <Line type="monotone" dataKey="equipmentUtilization" stroke={COLORS[1]} strokeWidth={2} name="Equipment Utilization" dot={false} />
                <Line type="monotone" dataKey="staffUtilization" stroke={COLORS[2]} strokeWidth={2} name="Staff Utilization" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
      </Tabs>

      {/* Detailed Tables */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Volume</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Volume by Modality (Last 14 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Pregnancy</th>
                      <th className="text-left p-2">Breast</th>
                      <th className="text-left p-2">Gynae</th>
                      <th className="text-left p-2">Male</th>
                      <th className="text-left p-2">MSK</th>
                      <th className="text-left p-2">Paediatric</th>
                      <th className="text-left p-2">Abdominal</th>
                      <th className="text-left p-2 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(new Set(tableData.map(item => item.date))).map(date => {
                      const dayData = tableData.filter(item => item.date === date);
                      const pregnancy = dayData.find(item => item.modality === 'Pregnancy')?.count || 0;
                      const breast = dayData.find(item => item.modality === 'Breast')?.count || 0;
                      const gynae = dayData.find(item => item.modality === 'Gynae')?.count || 0;
                      const male = dayData.find(item => item.modality === 'Male Health')?.count || 0;
                      const msk = dayData.find(item => item.modality === 'MSK')?.count || 0;
                      const paediatric = dayData.find(item => item.modality === 'Paediatric')?.count || 0;
                      const abdominal = dayData.find(item => item.modality === 'Abdominal')?.count || 0;
                      const total = pregnancy + breast + gynae + male + msk + paediatric + abdominal;

                      return (
                        <tr key={date} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{date}</td>
                          <td className="p-2">{pregnancy}</td>
                          <td className="p-2">{breast}</td>
                          <td className="p-2">{gynae}</td>
                          <td className="p-2">{male}</td>
                          <td className="p-2">{msk}</td>
                          <td className="p-2">{paediatric}</td>
                          <td className="p-2">{abdominal}</td>
                          <td className="p-2 font-semibold">{total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Volume Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Week</th>
                      <th className="text-left p-2">Total Scans</th>
                      <th className="text-left p-2">New Patients</th>
                      <th className="text-left p-2">Returning</th>
                      <th className="text-left p-2">Top Modality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyMonthlyData.filter(d => d.type === 'week').map((week, index) => {
                      const topModality = ['pregnancy', 'breast', 'gynae', 'male', 'msk', 'paediatric', 'abdominal']
                        .map(m => ({ name: m, value: week[m as keyof typeof week] as number }))
                        .sort((a, b) => b.value - a.value)[0];

                      return (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{week.period}</td>
                          <td className="p-2">{week.total.toLocaleString()}</td>
                          <td className="p-2">{week.newPatients.toLocaleString()}</td>
                          <td className="p-2">{week.returningPatients.toLocaleString()}</td>
                          <td className="p-2">
                            <Badge variant="secondary" className="text-xs">
                              {topModality.name.charAt(0).toUpperCase() + topModality.name.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Volume Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Month</th>
                      <th className="text-left p-2">Total Scans</th>
                      <th className="text-left p-2">Daily Average</th>
                      <th className="text-left p-2">New Patient %</th>
                      <th className="text-left p-2">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyMonthlyData.filter(d => d.type === 'month').map((month, index) => {
                      const newPatientPercentage = (month.newPatients / month.total * 100).toFixed(1);
                      const dailyAverage = (month.total / 30).toFixed(1);

                      return (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{month.period}</td>
                          <td className="p-2">{month.total.toLocaleString()}</td>
                          <td className="p-2">{dailyAverage}</td>
                          <td className="p-2">{newPatientPercentage}%</td>
                          <td className="p-2">
                            <Badge variant="secondary" className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20">
                              +{(Math.random() * 10 + 5).toFixed(1)}%
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
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