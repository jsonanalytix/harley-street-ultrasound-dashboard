import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Users,
  TrendingUp,
  Shield,
  FileText,
  Calendar
} from 'lucide-react';
import { generateComplaints, calculateMetrics, kpis, ComplaintIncident } from '@/mockData/complaintsIncidents';

const severityColors = {
  Critical: '#DC2626',
  Severe: '#F59E0B',
  Moderate: '#6366F1',
  Minor: '#10B981'
};

const statusColors = {
  Open: '#DC2626',
  'In Progress': '#F59E0B',
  Resolved: '#10B981',
  Escalated: '#7C3AED'
};

const categoryColors = {
  Clinical: '#DC2626',
  Administrative: '#F59E0B',
  Facility: '#3B82F6',
  'Staff Behavior': '#8B5CF6',
  'Technical/Equipment': '#10B981'
};

export const ComplaintsIncidents: React.FC = () => {
  const { complaints, metrics } = useMemo(() => {
    const data = generateComplaints();
    const calcs = calculateMetrics(data);
    return {
      complaints: data,
      metrics: calcs
    };
  }, []);

  const getSeverityBadge = (severity: ComplaintIncident['severity']) => {
    const colors = {
      Critical: 'bg-red-100 text-red-800',
      Severe: 'bg-amber-100 text-amber-800',
      Moderate: 'bg-blue-100 text-blue-800',
      Minor: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={`${colors[severity]} font-medium`}>
        {severity}
      </Badge>
    );
  };

  const getStatusBadge = (status: ComplaintIncident['status']) => {
    const colors = {
      Open: 'bg-red-100 text-red-800',
      'In Progress': 'bg-amber-100 text-amber-800',
      Resolved: 'bg-green-100 text-green-800',
      Escalated: 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={`${colors[status]} font-medium`}>
        {status}
      </Badge>
    );
  };

  const resolutionTimeData = [
    { name: 'Critical', target: 7, actual: metrics.resolutionTimes.critical, fill: severityColors.Critical },
    { name: 'Severe', target: 14, actual: metrics.resolutionTimes.severe, fill: severityColors.Severe },
    { name: 'Moderate', target: 21, actual: metrics.resolutionTimes.moderate, fill: severityColors.Moderate },
    { name: 'Minor', target: 10, actual: metrics.resolutionTimes.minor, fill: severityColors.Minor }
  ];

  const categoryData = Object.entries(metrics.byCategory).map(([category, count]) => ({
    name: category,
    value: count,
    percentage: ((count / metrics.summary.total) * 100).toFixed(1)
  }));

  const openIncidents = complaints.filter(c => 
    c.status === 'Open' || c.status === 'In Progress' || c.status === 'Escalated'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Complaints & Clinical Incidents</h1>
        <p className="mt-2 text-gray-600">Monitor and track patient complaints and clinical incidents</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Open Incidents"
          value={metrics.summary.open.toString()}
          change={-15.2}
          icon={<AlertCircle className="h-4 w-4" />}
          changeLabel="Requiring attention"
        />
        <KPICard
          title="Avg Resolution Time"
          value={`${metrics.resolutionTimes.overall.toFixed(1)} days`}
          change={-8.5}
          icon={<Clock className="h-4 w-4" />}
          changeLabel="All severities"
        />
        <KPICard
          title="Critical Incidents"
          value={complaints.filter(c => c.severity === 'Critical').length.toString()}
          change={0}
          icon={<AlertTriangle className="h-4 w-4" />}
          changeLabel="Last 6 months"
        />
        <KPICard
          title="Resolution Rate"
          value={`${metrics.summary.resolutionRate}%`}
          change={5.3}
          icon={<CheckCircle2 className="h-4 w-4" />}
          changeLabel="Successfully resolved"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="incidents">Active Incidents</TabsTrigger>
          <TabsTrigger value="resolution">Resolution Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
          <TabsTrigger value="actions">Corrective Actions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Category Distribution */}
            <ChartContainer
              title="Incidents by Category"
              description="Distribution of complaint types"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(categoryColors)[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Severity Distribution */}
            <ChartContainer
              title="Severity Distribution"
              description="Current incident severity levels"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { severity: 'Critical', count: complaints.filter(c => c.severity === 'Critical').length },
                  { severity: 'Severe', count: complaints.filter(c => c.severity === 'Severe').length },
                  { severity: 'Moderate', count: complaints.filter(c => c.severity === 'Moderate').length },
                  { severity: 'Minor', count: complaints.filter(c => c.severity === 'Minor').length }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="severity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {['Critical', 'Severe', 'Moderate', 'Minor'].map((severity, index) => (
                      <Cell key={`cell-${index}`} fill={severityColors[severity as keyof typeof severityColors]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Monthly Trend */}
          <ChartContainer
            title="Monthly Incident Trend"
            description="Incidents reported by month and severity"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={2} name="Total" />
                <Line type="monotone" dataKey="critical" stroke={severityColors.Critical} strokeWidth={2} name="Critical" />
                <Line type="monotone" dataKey="severe" stroke={severityColors.Severe} strokeWidth={2} name="Severe" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        {/* Active Incidents Tab */}
        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Active Incidents ({openIncidents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Severity</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-left p-2">Days Open</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openIncidents.slice(0, 10).map((incident) => {
                      const daysOpen = Math.floor(
                        (new Date().getTime() - new Date(incident.reportedDate).getTime()) / (1000 * 60 * 60 * 24)
                      );
                      
                      return (
                        <tr key={incident.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{incident.id}</td>
                          <td className="p-2">{new Date(incident.reportedDate).toLocaleDateString()}</td>
                          <td className="p-2">{incident.category}</td>
                          <td className="p-2">{getSeverityBadge(incident.severity)}</td>
                          <td className="p-2">{getStatusBadge(incident.status)}</td>
                          <td className="p-2">{incident.department}</td>
                          <td className="p-2">
                            <span className={daysOpen > 14 ? 'text-red-600 font-medium' : ''}>
                              {daysOpen} days
                            </span>
                          </td>
                          <td className="p-2">
                            <Button size="sm" variant="outline">View Details</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Critical Incidents Alert */}
          {complaints.filter(c => c.severity === 'Critical' && c.status !== 'Resolved').length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Incidents Requiring Immediate Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complaints
                    .filter(c => c.severity === 'Critical' && c.status !== 'Resolved')
                    .map((incident) => (
                      <div key={incident.id} className="p-3 bg-white rounded-lg border border-red-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{incident.id} - {incident.subCategory}</p>
                            <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Department: {incident.department} | 
                              {incident.practitioner && ` Practitioner: ${incident.practitioner} |`}
                              Status: {incident.status}
                            </p>
                          </div>
                          <Button size="sm" variant="destructive">Escalate</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Resolution Analysis Tab */}
        <TabsContent value="resolution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Resolution Time vs Target */}
            <ChartContainer
              title="Resolution Time vs Target"
              description="Average days to resolve by severity"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resolutionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="target" fill="#E5E7EB" name="Target (days)" />
                  <Bar dataKey="actual" name="Actual (days)">
                    {resolutionTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Resolution Rate by Category */}
            <ChartContainer
              title="Resolution Rate by Category"
              description="Percentage of resolved incidents"
            >
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" data={
                  Object.entries(metrics.byCategory).map(([category, total]) => {
                    const resolved = complaints.filter(c => 
                      c.category === category && c.status === 'Resolved'
                    ).length;
                    return {
                      name: category,
                      value: (resolved / total * 100),
                      fill: categoryColors[category as keyof typeof categoryColors]
                    };
                  })
                }>
                  <RadialBar dataKey="value" />
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Compensation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.compensation.total}
                  </p>
                  <p className="text-sm text-gray-600">Cases with Compensation</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    £{metrics.compensation.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Compensation</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    £{metrics.compensation.total > 0 ? 
                      Math.round(metrics.compensation.amount / metrics.compensation.total).toLocaleString() : 
                      '0'
                    }
                  </p>
                  <p className="text-sm text-gray-600">Average per Case</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends & Patterns Tab */}
        <TabsContent value="trends" className="space-y-4">
          {/* Department Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Incidents by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Obstetrics', 'Gynecology', 'General Imaging', 'MSK', 'Cardiology'].map(dept => {
                  const deptComplaints = complaints.filter(c => c.department === dept);
                  const percentage = (deptComplaints.length / complaints.length * 100);
                  
                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{dept}</span>
                        <span className="font-medium">{deptComplaints.length} incidents</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Root Cause Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Common Root Causes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(() => {
                  const rootCauseCounts = complaints
                    .filter(c => c.rootCause)
                    .reduce((acc, c) => {
                      const cause = c.rootCause!;
                      acc[cause] = (acc[cause] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                  
                  return Object.entries(rootCauseCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([cause, count]) => (
                      <div key={cause} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm">{cause}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ));
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Corrective Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Corrective Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complaints
                  .filter(c => c.correctiveAction && c.resolutionDate)
                  .sort((a, b) => b.resolutionDate!.localeCompare(a.resolutionDate!))
                  .slice(0, 10)
                  .map((incident) => (
                    <div key={incident.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{incident.id} - {incident.subCategory}</p>
                          <p className="text-sm text-gray-600">{incident.category}</p>
                        </div>
                        {getSeverityBadge(incident.severity)}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Root Cause:</p>
                          <p className="text-sm text-gray-600">{incident.rootCause}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Corrective Action:</p>
                          <p className="text-sm text-gray-600">{incident.correctiveAction}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">
                            Resolved: {new Date(incident.resolutionDate!).toLocaleDateString()}
                          </span>
                          {incident.followUpRequired && (
                            <Badge variant="outline" className="text-blue-600">
                              Follow-up Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Effectiveness */}
          <Card>
            <CardHeader>
              <CardTitle>Action Effectiveness Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <p className="font-medium text-green-900">Preventive Measures</p>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {complaints.filter(c => c.correctiveAction?.includes('prevent')).length}
                  </p>
                  <p className="text-sm text-green-700">Actions implemented</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <p className="font-medium text-blue-900">Training Initiatives</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {complaints.filter(c => c.correctiveAction?.includes('training')).length}
                  </p>
                  <p className="text-sm text-blue-700">Staff trained</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 