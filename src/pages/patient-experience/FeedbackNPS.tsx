import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  RadialBarChart,
  RadialBar,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  generateFeedbackRecords,
  calculateClinicianRatings,
  calculateNPSTrends,
  analyzeDimensions,
  generateWordCloudData,
  feedbackKPIs,
} from '@/mockData/patientFeedback';
import { 
  TrendingUp, 
  MessageSquare, 
  Star, 
  Users, 
  ThumbsUp,
  AlertCircle,
  Activity,
  Award
} from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

// Custom NPS Gauge Component
const NPSGauge: React.FC<{ score: number }> = ({ score }) => {
  const data = [
    { name: 'NPS', value: score + 100, fill: score >= 50 ? '#10B981' : score >= 0 ? '#F59E0B' : '#EF4444' }
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="60%" 
        outerRadius="90%" 
        startAngle={180} 
        endAngle={0}
        data={data}
      >
        <RadialBar dataKey="value" cornerRadius={10} fill="#82ca9d" max={200} />
        <text x="50%" y="45%" textAnchor="middle" fontSize="36" fontWeight="bold">
          {score}
        </text>
        <text x="50%" y="60%" textAnchor="middle" fontSize="14" fill="#666">
          NPS Score
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export const FeedbackNPS: React.FC = () => {
  const records = useMemo(() => generateFeedbackRecords(), []);
  const clinicianRatings = useMemo(() => calculateClinicianRatings(records), [records]);
  const npsTrends = useMemo(() => calculateNPSTrends(records), [records]);
  const dimensionAnalysis = useMemo(() => analyzeDimensions(records), [records]);
  const wordCloudData = useMemo(() => generateWordCloudData(records), [records]);
  
  // Calculate recent feedback samples
  const recentFeedback = useMemo(() => 
    records.filter(r => r.feedbackText).slice(0, 10),
    [records]
  );
  
  // Prepare radar chart data for dimensions
  const radarData = dimensionAnalysis.map(d => ({
    dimension: d.dimension,
    score: d.averageScore,
    fullMark: 5,
  }));
  
  // Get sentiment badge
  const getSentimentBadge = (sentiment: string) => {
    const sentimentClasses = {
      'positive': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'neutral': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'negative': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    };
    
    return (
      <Badge variant="secondary" className={`text-xs ${sentimentClasses[sentiment as keyof typeof sentimentClasses]}`}>
        {sentiment}
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
          title="Current NPS Score"
          value={feedbackKPIs.currentNPS.toString()}
          change={feedbackKPIs.npsChange}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="Average Rating"
          value={`${feedbackKPIs.averageRating}/5`}
          change={2.4}
          changeLabel="vs last month"
          icon={<Star className="h-4 w-4" />}
        />
        <KPICard
          title="Response Rate"
          value={`${feedbackKPIs.responseRate}%`}
          change={3.2}
          changeLabel="vs last month"
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <KPICard
          title="Satisfaction Score"
          value={`${feedbackKPIs.satisfactionScore}%`}
          change={1.8}
          changeLabel="4-5 star ratings"
          icon={<ThumbsUp className="h-4 w-4" />}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackKPIs.totalResponses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 180 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Performing Dimension</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackKPIs.topPerformingDimension}</div>
            <p className="text-xs text-muted-foreground mt-1">Highest satisfaction area</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Area for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackKPIs.lowestPerformingDimension}</div>
            <p className="text-xs text-muted-foreground mt-1">Lowest satisfaction area</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="nps-overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nps-overview">NPS Overview</TabsTrigger>
          <TabsTrigger value="satisfaction-dimensions">Satisfaction Analysis</TabsTrigger>
          <TabsTrigger value="clinician-ratings">Clinician Ratings</TabsTrigger>
          <TabsTrigger value="feedback-insights">Feedback Insights</TabsTrigger>
        </TabsList>

        {/* NPS Overview Tab */}
        <TabsContent value="nps-overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NPS Gauge */}
            <Card>
              <CardHeader>
                <CardTitle>Net Promoter Score</CardTitle>
              </CardHeader>
              <CardContent>
                <NPSGauge score={feedbackKPIs.currentNPS} />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Promoters</div>
                    <div className="text-lg font-semibold text-green-600">40%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Passives</div>
                    <div className="text-lg font-semibold text-yellow-600">40%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Detractors</div>
                    <div className="text-lg font-semibold text-red-600">20%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NPS Trend */}
            <ChartContainer
              title="NPS Score Trend"
              description="Weekly NPS score over the last 12 weeks"
            >
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={npsTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[-100, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="npsScore" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Response Distribution */}
          <ChartContainer
            title="Response Distribution Over Time"
            description="Breakdown of promoters, passives, and detractors"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={npsTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="promoters" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981"
                  name="Promoters (9-10)"
                />
                <Area 
                  type="monotone" 
                  dataKey="passives" 
                  stackId="1"
                  stroke="#F59E0B" 
                  fill="#F59E0B"
                  name="Passives (7-8)"
                />
                <Area 
                  type="monotone" 
                  dataKey="detractors" 
                  stackId="1"
                  stroke="#EF4444" 
                  fill="#EF4444"
                  name="Detractors (0-6)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>

        {/* Satisfaction Dimensions Tab */}
        <TabsContent value="satisfaction-dimensions" className="space-y-6">
          {/* Radar Chart */}
          <ChartContainer
            title="Satisfaction by Dimension"
            description="Average scores across all service dimensions"
          >
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 5]} tickCount={6} />
                <Radar 
                  name="Average Score" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6} 
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Dimension Details */}
          <Card>
            <CardHeader>
              <CardTitle>Dimension Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dimensionAnalysis.map((dimension) => (
                  <div key={dimension.dimension} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{dimension.dimension}</span>
                        <Badge variant="outline" className={`text-xs ${
                          dimension.trend > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {dimension.trend > 0 ? '+' : ''}{dimension.trend}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          Correlation with NPS: {dimension.correlation.toFixed(2)}
                        </span>
                        <span className="font-medium">{dimension.averageScore}/5</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {dimension.distribution.map((dist) => (
                        <div
                          key={dist.score}
                          className="flex-1 bg-gray-200 rounded-sm overflow-hidden"
                          style={{ height: '8px' }}
                        >
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${(dist.count / records.length) * 100}%`,
                              backgroundColor: dist.score >= 4 ? '#10B981' : dist.score >= 3 ? '#F59E0B' : '#EF4444',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinician Ratings Tab */}
        <TabsContent value="clinician-ratings">
          <Card>
            <CardHeader>
              <CardTitle>Clinician Performance Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Clinician</th>
                      <th className="text-right p-3">Total Reviews</th>
                      <th className="text-right p-3">Avg Rating</th>
                      <th className="text-right p-3">Avg NPS</th>
                      <th className="text-right p-3">Care Quality</th>
                      <th className="text-right p-3">Communication</th>
                      <th className="text-right p-3">Positive %</th>
                      <th className="text-left p-3">Top Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicianRatings.map((clinician) => (
                      <tr key={clinician.clinician} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{clinician.clinician}</td>
                        <td className="p-3 text-right">{clinician.totalFeedbacks}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{clinician.averageRating}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-medium ${
                            clinician.averageNPS >= 7 ? 'text-green-600' :
                            clinician.averageNPS >= 5 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {clinician.averageNPS}
                          </span>
                        </td>
                        <td className="p-3 text-right">{clinician.dimensions.careQuality}/5</td>
                        <td className="p-3 text-right">{clinician.dimensions.communication}/5</td>
                        <td className="p-3 text-right">
                          <span className={`font-medium ${
                            clinician.positivePercentage >= 80 ? 'text-green-600' :
                            clinician.positivePercentage >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {clinician.positivePercentage}%
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {clinician.topTags.slice(0, 3).map((tag) => (
                              <Badge key={tag.tag} variant="secondary" className="text-xs">
                                {tag.tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Insights Tab */}
        <TabsContent value="feedback-insights" className="space-y-6">
          {/* Word Cloud Simulation */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {wordCloudData.map((word, index) => (
                  <Badge
                    key={word.text}
                    variant="secondary"
                    className="cursor-default"
                    style={{
                      fontSize: `${Math.max(12, Math.min(24, word.value / 10))}px`,
                      opacity: Math.max(0.6, Math.min(1, word.value / 100)),
                    }}
                  >
                    {word.text} ({word.value})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Feedback Samples */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Patient Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.overallRating
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        {getSentimentBadge(feedback.sentiment)}
                        <Badge variant="outline" className="text-xs">
                          NPS: {feedback.npsScore}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {feedback.service} - {feedback.clinician}
                      </span>
                    </div>
                    <p className="text-sm">{feedback.feedbackText}</p>
                    <div className="flex gap-1 mt-2">
                      {feedback.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Response Rate Analysis */}
          <ChartContainer
            title="Response Rate by Week"
            description="Percentage of patients providing feedback"
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={npsTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => `${value}%`} />
                <Line 
                  type="monotone" 
                  dataKey="responseRate" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  name="Response Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 