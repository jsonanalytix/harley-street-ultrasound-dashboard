import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, Treemap
} from 'recharts';
import {
  MapPin, Users, Clock, PoundSterling, Target, TrendingUp,
  AlertCircle, Building2, Navigation, Activity, Home, Expand
} from 'lucide-react';
import {
  generatePatientLocations,
  generateCompetitorLocations,
  generateTravelTimeZones,
  generateExpansionOpportunities,
  generateServiceDemand,
  calculateGeographicKPIs,
  postcodeAreas,
  type PatientLocation,
  type CompetitorLocation,
  type ExpansionOpportunity
} from '@/mockData/geographicData';

const COLORS = {
  primary: '#0EA5E9',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#94A3B8',
  zones: {
    central: '#0EA5E9',
    inner: '#8B5CF6',
    outer: '#F59E0B'
  }
};

const HEATMAP_COLORS = [
  '#FFF5F5', '#FED7D7', '#FEB2B2', '#FC8181', 
  '#F56565', '#E53E3E', '#C53030', '#9B2C2C'
];

export const PatientHeatmap: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [hoveredLocation, setHoveredLocation] = useState<PatientLocation | null>(null);
  const [showCompetitors, setShowCompetitors] = useState(true);

  // Generate all data
  const { locations, competitors, travelZones, opportunities, serviceDemand, kpis } = useMemo(() => {
    const patientLocations = generatePatientLocations();
    const competitorLocations = generateCompetitorLocations();
    const zones = generateTravelTimeZones();
    const expansionOpportunities = generateExpansionOpportunities();
    const demand = generateServiceDemand();
    const geographicKPIs = calculateGeographicKPIs();

    return {
      locations: patientLocations,
      competitors: competitorLocations,
      travelZones: zones,
      opportunities: expansionOpportunities,
      serviceDemand: demand,
      kpis: geographicKPIs
    };
  }, []);

  // Filter locations based on selected zone
  const filteredLocations = useMemo(() => {
    if (selectedZone === 'all') return locations;
    const zone = postcodeAreas.find(area => area.code === selectedZone);
    if (!zone) return locations;
    return locations.filter(loc => {
      const area = postcodeAreas.find(a => a.code === loc.postcode);
      return area?.zone === zone.zone;
    });
  }, [locations, selectedZone]);

  // Calculate bounds for the map
  const mapBounds = useMemo(() => {
    const allLats = [...locations, ...competitors].map(loc => loc.lat);
    const allLngs = [...locations, ...competitors].map(loc => loc.lng);
    
    return {
      minLat: Math.min(...allLats),
      maxLat: Math.max(...allLats),
      minLng: Math.min(...allLngs),
      maxLng: Math.max(...allLngs)
    };
  }, [locations, competitors]);

  // Convert lat/lng to SVG coordinates
  const latLngToSvg = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 800;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 600;
    return { x, y };
  };

  // Get color based on patient density
  const getHeatmapColor = (count: number) => {
    const maxCount = Math.max(...locations.map(l => l.patientCount));
    const ratio = count / maxCount;
    const index = Math.floor(ratio * (HEATMAP_COLORS.length - 1));
    return HEATMAP_COLORS[Math.min(index, HEATMAP_COLORS.length - 1)];
  };

  // Revenue by zone data
  const revenueByZone = useMemo(() => {
    const zones = ['Central', 'Inner', 'Outer'];
    return zones.map(zone => {
      const zoneLocations = locations.filter(loc => {
        const area = postcodeAreas.find(a => a.code === loc.postcode);
        return area?.zone === zone;
      });
      
      const revenue = zoneLocations.reduce((sum, loc) => sum + loc.revenue, 0);
      const patients = zoneLocations.reduce((sum, loc) => sum + loc.patientCount, 0);
      
      return {
        zone,
        revenue,
        patients,
        avgSpend: patients > 0 ? Math.floor(revenue / patients) : 0
      };
    });
  }, [locations]);

  // Top postcodes data
  const topPostcodes = useMemo(() => {
    return [...locations]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [locations]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{payload[0].payload.zone || payload[0].payload.area}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              {entry.name}: {entry.name.includes('£') || entry.name.includes('Revenue') 
                ? `£${entry.value.toLocaleString()}`
                : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Geographic Heatmap of Patients</h1>
        <div className="flex gap-2">
          <Button
            variant={showCompetitors ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCompetitors(!showCompetitors)}
          >
            <Building2 className="h-4 w-4 mr-1" />
            Competitors
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Coverage"
          value={kpis.coverage.totalPatients.toLocaleString()}
          change={12}
          changeLabel="patients across London"
          icon={<Users className="h-6 w-6" />}
        />
        <KPICard
          title="Geographic Revenue"
          value={`£${(kpis.coverage.totalRevenue / 1000).toFixed(0)}k`}
          change={kpis.coverage.avgRevenuePerPatient}
          changeLabel={`£${kpis.coverage.avgRevenuePerPatient} per patient`}
          icon={<PoundSterling className="h-6 w-6" />}
        />
        <KPICard
          title="Accessibility"
          value={`${kpis.accessibility.within30minsPercentage}%`}
          change={kpis.accessibility.avgTravelTime}
          changeLabel={`${kpis.accessibility.avgTravelTime} min avg travel`}
          icon={<Clock className="h-6 w-6" />}
        />
        <KPICard
          title="Best Expansion"
          value={kpis.expansion.bestOpportunity}
          change={kpis.expansion.score}
          changeLabel={`Score: ${kpis.expansion.score}/100`}
          icon={<Target className="h-6 w-6" />}
        />
      </div>

      <Tabs defaultValue="heatmap" className="space-y-4">
        <TabsList>
          <TabsTrigger value="heatmap">Patient Density Map</TabsTrigger>
          <TabsTrigger value="travel-time">Travel Time Analysis</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Distribution</TabsTrigger>
          <TabsTrigger value="expansion">Expansion Opportunities</TabsTrigger>
          <TabsTrigger value="service-demand">Service Demand</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Distribution Across London</CardTitle>
              <div className="flex gap-2 mt-2">
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    <SelectItem value="Central">Central London</SelectItem>
                    <SelectItem value="Inner">Inner London</SelectItem>
                    <SelectItem value="Outer">Outer London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-50 rounded-lg p-4">
                <svg width="800" height="600" viewBox="0 0 800 600" className="w-full h-auto">
                  {/* Draw postcode areas as circles with heatmap colors */}
                  {filteredLocations.map(location => {
                    const { x, y } = latLngToSvg(location.lat, location.lng);
                    const area = postcodeAreas.find(a => a.code === location.postcode);
                    
                    return (
                      <g key={location.id}>
                        {/* Heatmap circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r={Math.sqrt(location.patientCount) * 2}
                          fill={getHeatmapColor(location.patientCount)}
                          opacity={0.7}
                          className="cursor-pointer transition-all hover:opacity-100"
                          onMouseEnter={() => setHoveredLocation(location)}
                          onMouseLeave={() => setHoveredLocation(null)}
                        />
                        
                        {/* Postcode label */}
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-medium pointer-events-none"
                          fill="#374151"
                        >
                          {location.postcode}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Draw competitor locations */}
                  {showCompetitors && competitors.map(competitor => {
                    const { x, y } = latLngToSvg(competitor.lat, competitor.lng);
                    
                    return (
                      <g key={competitor.id}>
                        <rect
                          x={x - 10}
                          y={y - 10}
                          width={20}
                          height={20}
                          fill={competitor.type === 'Premium' ? COLORS.danger : 
                                competitor.type === 'Standard' ? COLORS.warning : COLORS.muted}
                          stroke="white"
                          strokeWidth={2}
                          className="cursor-pointer"
                        />
                        <text
                          x={x}
                          y={y + 25}
                          textAnchor="middle"
                          className="text-xs"
                          fill="#374151"
                        >
                          {competitor.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Harley Street US location */}
                  <g>
                    <polygon
                      points={`${latLngToSvg(51.5142, -0.1425).x},${latLngToSvg(51.5142, -0.1425).y - 15} ${latLngToSvg(51.5142, -0.1425).x + 5},${latLngToSvg(51.5142, -0.1425).y - 5} ${latLngToSvg(51.5142, -0.1425).x + 15},${latLngToSvg(51.5142, -0.1425).y - 5} ${latLngToSvg(51.5142, -0.1425).x + 7},${latLngToSvg(51.5142, -0.1425).y + 3} ${latLngToSvg(51.5142, -0.1425).x + 10},${latLngToSvg(51.5142, -0.1425).y + 15} ${latLngToSvg(51.5142, -0.1425).x},${latLngToSvg(51.5142, -0.1425).y + 8} ${latLngToSvg(51.5142, -0.1425).x - 10},${latLngToSvg(51.5142, -0.1425).y + 15} ${latLngToSvg(51.5142, -0.1425).x - 7},${latLngToSvg(51.5142, -0.1425).y + 3} ${latLngToSvg(51.5142, -0.1425).x - 15},${latLngToSvg(51.5142, -0.1425).y - 5} ${latLngToSvg(51.5142, -0.1425).x - 5},${latLngToSvg(51.5142, -0.1425).y - 5}`}
                      fill={COLORS.primary}
                      stroke="white"
                      strokeWidth={3}
                    />
                    <text
                      x={latLngToSvg(51.5142, -0.1425).x}
                      y={latLngToSvg(51.5142, -0.1425).y + 30}
                      textAnchor="middle"
                      className="text-sm font-bold"
                      fill={COLORS.primary}
                    >
                      Harley Street US
                    </text>
                  </g>
                </svg>
                
                {/* Hover tooltip */}
                {hoveredLocation && (
                  <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                    <h4 className="font-semibold">{hoveredLocation.area} ({hoveredLocation.postcode})</h4>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>Patients: {hoveredLocation.patientCount.toLocaleString()}</p>
                      <p>Revenue: £{hoveredLocation.revenue.toLocaleString()}</p>
                      <p>Avg Spend: £{hoveredLocation.avgSpend}</p>
                      <p>Travel Time: {hoveredLocation.avgTravelTime} mins</p>
                      <p>Top Service: {hoveredLocation.primaryService}</p>
                    </div>
                  </div>
                )}
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow">
                  <p className="text-xs font-medium mb-2">Patient Density</p>
                  <div className="flex gap-1">
                    {HEATMAP_COLORS.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartContainer title="Revenue by Zone">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByZone}
                    dataKey="revenue"
                    nameKey="zone"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ zone, percent }) => `${zone} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueByZone.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.zone === 'Central' ? COLORS.zones.central :
                              entry.zone === 'Inner' ? COLORS.zones.inner : COLORS.zones.outer}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <Card>
              <CardHeader>
                <CardTitle>Top Revenue Postcodes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topPostcodes.map((location, index) => (
                    <div key={location.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-12 justify-center">
                          {location.postcode}
                        </Badge>
                        <span className="text-sm">{location.area}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">£{location.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{location.patientCount} patients</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="travel-time" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartContainer title="Patient Distribution by Travel Time">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={travelZones}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zone" />
                  <YAxis yAxisId="left" orientation="left" stroke={COLORS.primary} />
                  <YAxis yAxisId="right" orientation="right" stroke={COLORS.secondary} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="patientCount" name="Patients" fill={COLORS.primary} />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue (£)" fill={COLORS.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer title="Conversion Rate by Travel Distance">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={travelZones}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zone" />
                  <YAxis 
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    domain={[0, 0.5]}
                  />
                  <Tooltip 
                    formatter={(value: any) => `${(value * 100).toFixed(1)}%`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversionRate" 
                    stroke={COLORS.success} 
                    strokeWidth={3}
                    dot={{ fill: COLORS.success }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Travel Time Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {travelZones.map(zone => (
                  <div key={zone.zone} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {zone.zone}
                    </h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Patients:</span>
                        <span className="font-medium">{zone.patientCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-medium">£{zone.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Conversion:</span>
                        <span className="font-medium">{(zone.conversionRate * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  <strong>{kpis.accessibility.within30minsPercentage}%</strong> of patients are within 
                  30 minutes travel time. Focus marketing efforts on the <strong>0-30 minute zones</strong> where 
                  conversion rates are highest ({(0.45 * 100).toFixed(0)}% for 0-15 mins).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Concentration by Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={locations.map(loc => ({
                      name: `${loc.postcode} - ${loc.area}`,
                      value: loc.revenue,
                      patients: loc.patientCount,
                      avgSpend: loc.avgSpend
                    }))}
                    dataKey="value"
                    aspectRatio={4/3}
                    stroke="#fff"
                    fill={COLORS.primary}
                  >
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm">Revenue: £{data.value.toLocaleString()}</p>
                              <p className="text-sm">Patients: {data.patients.toLocaleString()}</p>
                              <p className="text-sm">Avg Spend: £{data.avgSpend}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </Treemap>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Highest Revenue Area</span>
                      <Badge variant="default">{kpis.topAreas.revenue.postcode}</Badge>
                    </div>
                    <p className="text-2xl font-bold">£{kpis.topAreas.revenue.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{kpis.topAreas.revenue.area}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Most Patients Area</span>
                      <Badge variant="secondary">{kpis.topAreas.patients.postcode}</Badge>
                    </div>
                    <p className="text-2xl font-bold">{kpis.topAreas.patients.count.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{kpis.topAreas.patients.area}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Revenue Distribution</span>
                    </div>
                    <div className="space-y-2">
                      {revenueByZone.map(zone => (
                        <div key={zone.zone} className="flex justify-between text-sm">
                          <span>{zone.zone}:</span>
                          <span className="font-medium">£{zone.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Spend by Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" data={revenueByZone}>
                      <RadialBar 
                        dataKey="avgSpend" 
                        cornerRadius={10}
                        fill={COLORS.primary}
                        label={{ position: 'insideStart', fill: '#fff' }}
                      />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expansion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expansion Opportunity Analysis</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Potential new locations scored based on demographics, competition, and market potential
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Area</th>
                      <th className="text-left p-2">Postcode</th>
                      <th className="text-right p-2">Score</th>
                      <th className="text-right p-2">Potential Patients</th>
                      <th className="text-right p-2">Potential Revenue</th>
                      <th className="text-right p-2">Nearest Competitor</th>
                      <th className="text-center p-2">Demographics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opportunities
                      .sort((a, b) => b.score - a.score)
                      .map(opp => (
                        <tr key={opp.area} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{opp.area}</td>
                          <td className="p-2">
                            <Badge variant="outline">{opp.postcode}</Badge>
                          </td>
                          <td className="p-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${opp.score}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-10">{opp.score}</span>
                            </div>
                          </td>
                          <td className="p-2 text-right">{opp.potentialPatients.toLocaleString()}</td>
                          <td className="p-2 text-right">£{opp.potentialRevenue.toLocaleString()}</td>
                          <td className="p-2 text-right">{opp.nearestCompetitor} mi</td>
                          <td className="p-2 text-center">
                            <div className="text-xs">
                              <p>Age: {opp.demographics.avgAge}</p>
                              <p>Female: {opp.demographics.femalePercentage}%</p>
                              <p>Income: £{(opp.demographics.avgIncome / 1000).toFixed(0)}k</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartContainer title="Expansion Opportunities Map">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={opportunities.sort((a, b) => b.score - a.score)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill={COLORS.success} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <Card>
              <CardHeader>
                <CardTitle>Expansion Strategy Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Primary Target: {kpis.expansion.bestOpportunity}</h4>
                      <p className="text-sm text-gray-600">
                        Highest scoring opportunity with potential for £{(kpis.expansion.potentialRevenue / 1000).toFixed(0)}k 
                        annual revenue. Limited competition and favorable demographics.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Market Gaps</h4>
                      <p className="text-sm text-gray-600">
                        East and South London show lower clinic density. Consider satellite 
                        locations or mobile services for areas beyond 45-minute travel time.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Expand className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Expansion Model Options</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside mt-1">
                        <li>Full satellite clinic in high-score areas</li>
                        <li>Partnership with local GP practices</li>
                        <li>Mobile scanning service for outer zones</li>
                        <li>Collection points with shuttle service</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="service-demand" className="space-y-4">
          {serviceDemand.map(service => (
            <Card key={service.service}>
              <CardHeader>
                <CardTitle>{service.service} - Geographic Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Top 5 Areas by Demand</h4>
                    <div className="space-y-2">
                      {service.areas.slice(0, 5).map(area => (
                        <div key={area.postcode} className="flex justify-between items-center">
                          <Badge variant="outline">{area.postcode}</Badge>
                          <div className="text-right">
                            <p className="font-medium">{area.demand} scans</p>
                            <p className="text-xs text-gray-600">£{area.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={service.areas.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="postcode" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="demand" fill={COLORS.primary} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 