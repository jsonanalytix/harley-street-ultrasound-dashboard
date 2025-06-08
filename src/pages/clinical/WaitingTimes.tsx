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
  appointmentAvailabilityKPIs,
  nextAvailableByModality,
  availabilityByDayOfWeek,
  generateMissedAppointmentsTrend,
  missedAppointmentsByReason,
  cancellationLeadTime,
  generateRealTimeAvailability,
  clinicianAvailabilityMetrics,
} from '@/mockData/waitingTimes';
import { Calendar, Clock, XCircle, AlertTriangle } from 'lucide-react';

const COLORS = ['#005EB8', '#38B6FF', '#F97316', '#14B8A6', '#8B5CF6', '#EC4899'];

export const WaitingTimes: React.FC = () => {
  const missedAppointmentsTrend = generateMissedAppointmentsTrend();
  const realTimeAvailability = generateRealTimeAvailability();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Avg Lead Time to Next"
          value={`${appointmentAvailabilityKPIs.avgLeadTimeToNext} days`}
          change={-8.3}
          changeLabel="vs last month"
          icon={<Clock className="h-4 w-4" />}
        />
        <KPICard
          title="Same-Day Availability"
          value={`${appointmentAvailabilityKPIs.sameDayAvailability}%`}
          change={-5.2}
          changeLabel="vs last month"
          icon={<Calendar className="h-4 w-4" />}
        />
        <KPICard
          title="Missed Appointment Rate"
          value={`${appointmentAvailabilityKPIs.missedAppointmentRate}%`}
          change={2.1}
          changeLabel="vs last month"
          icon={<XCircle className="h-4 w-4" />}
        />
        <KPICard
          title="Late Cancellation Rate"
          value={`${appointmentAvailabilityKPIs.lateCancellationRate}%`}
          change={3.4}
          changeLabel="vs last month"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Next Available by Modality */}
      <Card>
        <CardHeader>
          <CardTitle>Next Available Appointment by Modality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {nextAvailableByModality.map((item) => (
              <div key={item.modality} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-lg mb-2">{item.modality}</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Next Available:</span>
                    <Badge 
                      variant={item.nextAvailable === 0 ? "default" : item.nextAvailable <= 3 ? "secondary" : "destructive"}
                      className="ml-2"
                    >
                      {item.nextAvailable === 0 ? 'Today' : `${item.nextAvailable} days`}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Same Day:</span>
                    <span className="font-medium">{item.sameDaySlots} slots</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Day:</span>
                    <span className="font-medium">{item.nextDaySlots} slots</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Availability Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability by Day of Week */}
        <ChartContainer
          title="Availability by Day of Week"
          description="Average lead time and slot availability"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={availabilityByDayOfWeek}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="availableSlots" fill={COLORS[0]} radius={[4, 4, 0, 0]} name="Available Slots" />
              <Bar dataKey="bookedSlots" fill={COLORS[1]} radius={[4, 4, 0, 0]} name="Booked Slots" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Missed Appointments by Reason */}
        <ChartContainer
          title="Missed Appointments by Reason"
          description="Primary reasons for no-shows"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={missedAppointmentsByReason}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {missedAppointmentsByReason.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {missedAppointmentsByReason.map((item, index) => (
              <div key={item.reason} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground truncate">{item.reason}:</span>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Missed Appointments and Cancellations Trend */}
      <ChartContainer
        title="Missed Appointments & Late Cancellations Trend"
        description="30-day trend of missed slots"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={missedAppointmentsTrend}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={2} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="missed"
              stroke={COLORS[2]}
              strokeWidth={2}
              name="Missed Appointments"
              dot={{ fill: COLORS[2], r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="lateCancellation"
              stroke={COLORS[3]}
              strokeWidth={2}
              name="Late Cancellations"
              dot={{ fill: COLORS[3], r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Cancellation Lead Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Cancellation Lead Time"
          description="How far in advance appointments are cancelled"
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cancellationLeadTime}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS[4]} radius={[4, 4, 0, 0]} name="Cancellations" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Availability Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Next-Day Availability</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{appointmentAvailabilityKPIs.nextDayAvailability}%</span>
                  <Badge variant="secondary" className="text-xs">
                    +3.2% vs last week
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Within 3 Days</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{appointmentAvailabilityKPIs.within3DaysAvailability}%</span>
                  <Badge variant="secondary" className="text-xs">
                    -1.5% vs last week
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Utilization Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{appointmentAvailabilityKPIs.utilizationRate}%</span>
                  <Badge variant="secondary" className="text-xs text-green-600 bg-green-50">
                    +2.8% vs last week
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Available Slots</span>
                <span className="text-2xl font-bold">{appointmentAvailabilityKPIs.totalSlotsAvailable}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinician Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clinician Availability & Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Clinician</th>
                  <th className="text-left p-3">Avg Lead Time</th>
                  <th className="text-left p-3">Missed Appt Rate</th>
                  <th className="text-left p-3">Same-Day Fill Rate</th>
                  <th className="text-left p-3">Utilization</th>
                  <th className="text-left p-3">Total Slots</th>
                </tr>
              </thead>
              <tbody>
                {clinicianAvailabilityMetrics.map((clinician) => (
                  <tr key={clinician.name} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{clinician.name}</td>
                    <td className="p-3">{clinician.avgLeadTime} days</td>
                    <td className="p-3">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          clinician.missedAppointmentRate < 6
                            ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                            : clinician.missedAppointmentRate < 10
                            ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'text-red-600 bg-red-50 dark:bg-red-900/20'
                        }`}
                      >
                        {clinician.missedAppointmentRate}%
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          clinician.sameDayFillRate >= 90
                            ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                            : clinician.sameDayFillRate >= 75
                            ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'text-red-600 bg-red-50 dark:bg-red-900/20'
                        }`}
                      >
                        {clinician.sameDayFillRate}%
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{clinician.utilizationRate}%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${clinician.utilizationRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{clinician.totalSlots}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Availability Table */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Appointment Availability (Next 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Modality</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Available</th>
                  <th className="text-left p-3">Booked</th>
                  <th className="text-left p-3">Utilization</th>
                  <th className="text-left p-3">Next Available</th>
                </tr>
              </thead>
              <tbody>
                {realTimeAvailability.slice(0, 30).map((slot, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3">{slot.displayDate}</td>
                    <td className="p-3">{slot.modality}</td>
                    <td className="p-3 text-xs">{slot.location}</td>
                    <td className="p-3">
                      <Badge
                        variant={slot.availableSlots === 0 ? "destructive" : slot.availableSlots < 5 ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {slot.availableSlots}
                      </Badge>
                    </td>
                    <td className="p-3">{slot.bookedSlots}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{slot.utilizationRate}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              slot.utilizationRate >= 90 ? 'bg-red-600' :
                              slot.utilizationRate >= 70 ? 'bg-yellow-600' :
                              'bg-green-600'
                            }`}
                            style={{ width: `${slot.utilizationRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-xs">
                      {slot.nextAvailableTime || 'Fully Booked'}
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