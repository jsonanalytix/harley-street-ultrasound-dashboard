import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  generateOutstandingInvoices,
  calculateAgingBrackets,
  calculateClientTypeAging,
  generateCollectionActivities,
  outstandingAgingKPIs,
  highRiskAccounts,
} from '@/mockData/outstandingAging';
import { DollarSign, PoundSterling, Clock, AlertTriangle, Phone, Search } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#DC2626', '#991B1B'];

export const OutstandingAging: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const invoices = useMemo(() => generateOutstandingInvoices(), []);
  const agingBrackets = useMemo(() => calculateAgingBrackets(invoices), [invoices]);
  const clientTypeAging = useMemo(() => calculateClientTypeAging(invoices), [invoices]);
  const collectionActivities = useMemo(() => generateCollectionActivities(), []);
  
  // Filter invoices based on search
  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices;
    
    return invoices.filter(invoice => 
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);
  
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Current': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'Overdue': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'Partially Paid': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'In Dispute': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    };
    
    return (
      <Badge variant="secondary" className={`text-xs ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </Badge>
    );
  };
  
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Outstanding"
          value={`£${outstandingAgingKPIs.totalOutstanding.toLocaleString()}`}
          change={-5.2}
          changeLabel="vs last month"
          icon={<PoundSterling className="h-4 w-4" />}
        />
        <KPICard
          title="Overdue Amount"
          value={`£${outstandingAgingKPIs.overdueAmount.toLocaleString()}`}
          icon={<Clock className="h-4 w-4" />}
        />
        <KPICard
          title="Over 90 Days"
          value={`£${outstandingAgingKPIs.over90DaysAmount.toLocaleString()}`}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <KPICard
          title="Collection Rate"
          value={`${outstandingAgingKPIs.collectionRate}%`}
          change={3.2}
          changeLabel="vs last month"
          icon={<Phone className="h-4 w-4" />}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Days Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outstandingAgingKPIs.avgDaysOutstanding} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: 30 days
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: `${Math.min((outstandingAgingKPIs.avgDaysOutstanding / 60) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disputed Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{outstandingAgingKPIs.disputedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((outstandingAgingKPIs.disputedAmount / outstandingAgingKPIs.totalOutstanding) * 100)}% of outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Write-off</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{outstandingAgingKPIs.monthlyWriteOff.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((outstandingAgingKPIs.monthlyWriteOff / outstandingAgingKPIs.totalOutstanding) * 100 * 12)}% annual rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Outstanding Invoices</TabsTrigger>
          <TabsTrigger value="collections">Collection Activity</TabsTrigger>
          <TabsTrigger value="risk">High Risk Accounts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Aging Brackets Chart */}
          <ChartContainer
            title="Aging Analysis"
            description="Outstanding amounts by aging bracket"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agingBrackets}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="bracket" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    `£${value.toLocaleString()}`,
                    name === 'amount' ? 'Amount' : name
                  ]}
                  labelFormatter={(label) => `Aging: ${label}`}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {agingBrackets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Client Type Aging Table */}
          <Card>
            <CardHeader>
              <CardTitle>Aging by Client Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Client Type</th>
                      <th className="text-right p-3">Current</th>
                      <th className="text-right p-3">1-30 Days</th>
                      <th className="text-right p-3">31-60 Days</th>
                      <th className="text-right p-3">61-90 Days</th>
                      <th className="text-right p-3">Over 90 Days</th>
                      <th className="text-right p-3 font-semibold">Total</th>
                      <th className="text-right p-3">Avg Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientTypeAging.map((aging) => (
                      <tr key={aging.clientType} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{aging.clientType}</td>
                        <td className="p-3 text-right">
                          {aging.current > 0 && `£${aging.current.toLocaleString()}`}
                        </td>
                        <td className="p-3 text-right">
                          {aging.days1_30 > 0 && `£${aging.days1_30.toLocaleString()}`}
                        </td>
                        <td className="p-3 text-right">
                          {aging.days31_60 > 0 && `£${aging.days31_60.toLocaleString()}`}
                        </td>
                        <td className="p-3 text-right">
                          {aging.days61_90 > 0 && `£${aging.days61_90.toLocaleString()}`}
                        </td>
                        <td className="p-3 text-right text-red-600 font-medium">
                          {aging.over90 > 0 && `£${aging.over90.toLocaleString()}`}
                        </td>
                        <td className="p-3 text-right font-semibold">
                          £{aging.total.toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              aging.avgDaysOutstanding <= 30
                                ? 'text-green-600 bg-green-50'
                                : aging.avgDaysOutstanding <= 60
                                ? 'text-yellow-600 bg-yellow-50'
                                : 'text-red-600 bg-red-50'
                            }`}
                          >
                            {aging.avgDaysOutstanding} days
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outstanding Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Outstanding Invoices</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Invoice #</th>
                      <th className="text-left p-3">Client</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">Invoice Date</th>
                      <th className="text-left p-3">Due Date</th>
                      <th className="text-right p-3">Amount</th>
                      <th className="text-right p-3">Outstanding</th>
                      <th className="text-center p-3">Days Overdue</th>
                      <th className="text-center p-3">Status</th>
                      <th className="text-left p-3">Next Follow-up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.slice(0, 50).map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono text-xs">{invoice.invoiceNumber}</td>
                        <td className="p-3">
                          <div className="font-medium">{invoice.clientName}</div>
                          {invoice.notes && (
                            <div className="text-xs text-muted-foreground">{invoice.notes}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary" className="text-xs">
                            {invoice.clientType}
                          </Badge>
                        </td>
                        <td className="p-3 text-xs">{format(invoice.invoiceDate, 'dd/MM/yyyy')}</td>
                        <td className="p-3 text-xs">{format(invoice.dueDate, 'dd/MM/yyyy')}</td>
                        <td className="p-3 text-right">£{invoice.amount.toLocaleString()}</td>
                        <td className="p-3 text-right font-medium">£{invoice.outstandingAmount.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span className={`font-medium ${
                            invoice.daysOverdue === 0 ? 'text-green-600' :
                            invoice.daysOverdue <= 30 ? 'text-yellow-600' :
                            invoice.daysOverdue <= 60 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {invoice.daysOverdue}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="p-3 text-xs">
                          {invoice.nextFollowUpDate && format(invoice.nextFollowUpDate, 'dd/MM/yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collection Activity Tab */}
        <TabsContent value="collections" className="space-y-6">
          {/* Collection Trend Chart */}
          <ChartContainer
            title="Weekly Collection Activity"
            description="12-week collection performance trend"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={collectionActivities}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="contacted"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Contacted"
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="promisedPayment"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Promised Payment"
                  dot={{ fill: '#F59E0B', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="collected"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Collected"
                  dot={{ fill: '#10B981', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="disputed"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Disputed"
                  dot={{ fill: '#EF4444', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Collection Activity Table */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Activity Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Week</th>
                      <th className="text-right p-3">Contacted</th>
                      <th className="text-right p-3">Promised Payment</th>
                      <th className="text-right p-3">Collected</th>
                      <th className="text-right p-3">Disputed</th>
                      <th className="text-right p-3">Write-off</th>
                      <th className="text-right p-3">Collection Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectionActivities.map((activity, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{activity.week}</td>
                        <td className="p-3 text-right">{activity.contacted}</td>
                        <td className="p-3 text-right">{activity.promisedPayment}</td>
                        <td className="p-3 text-right text-green-600 font-medium">{activity.collected}</td>
                        <td className="p-3 text-right text-red-600">{activity.disputed}</td>
                        <td className="p-3 text-right">{activity.writeOff}</td>
                        <td className="p-3 text-right">
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              activity.collectionRate >= 70
                                ? 'text-green-600 bg-green-50'
                                : activity.collectionRate >= 50
                                ? 'text-yellow-600 bg-yellow-50'
                                : 'text-red-600 bg-red-50'
                            }`}
                          >
                            {activity.collectionRate.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* High Risk Accounts Tab */}
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>High Risk Accounts (Over 90 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highRiskAccounts.map((account, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{account.clientName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Last payment: {format(account.lastPaymentDate, 'dd MMM yyyy')}
                        </p>
                      </div>
                      {getRiskBadge(account.riskScore)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                        <p className="text-xl font-bold text-red-600">
                          £{account.outstandingAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Days Overdue</p>
                        <p className="text-xl font-bold">{account.daysOverdue} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Collection Action</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Legal Notice Sent
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Escalated
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Items */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Recommended Actions
                </h4>
                <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                  <li>• Embassy accounts: Schedule meetings with embassy finance departments</li>
                  <li>• Insurance claims: Request immediate documentation review</li>
                  <li>• Consider payment plans for accounts over £20,000</li>
                  <li>• Engage legal counsel for accounts over 120 days</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 