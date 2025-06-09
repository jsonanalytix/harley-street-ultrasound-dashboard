import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  subMonths, 
  differenceInDays,
  addDays,
  format,
  isWeekend
} from 'date-fns';

export interface ComplaintIncident {
  id: string;
  date: string;
  reportedDate: string;
  category: 'Clinical' | 'Administrative' | 'Facility' | 'Staff Behavior' | 'Technical/Equipment';
  subCategory: string;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  description: string;
  patient: {
    id: string;
    name: string;
    age: number;
    contact: string;
  };
  department: string;
  practitioner?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  resolutionDate?: string;
  resolutionTime?: number; // in days
  rootCause?: string;
  correctiveAction?: string;
  followUpRequired: boolean;
  compensationOffered: boolean;
  compensationAmount?: number;
}

const categories = {
  'Clinical': [
    'Misdiagnosis concerns',
    'Procedure complications',
    'Scan quality issues',
    'Report accuracy',
    'Follow-up care',
    'Consent process'
  ],
  'Administrative': [
    'Booking errors',
    'Long wait times',
    'Billing disputes',
    'Insurance claims',
    'Report delays',
    'Communication failures'
  ],
  'Facility': [
    'Cleanliness',
    'Accessibility',
    'Parking issues',
    'Comfort/amenities',
    'Privacy concerns',
    'Safety hazards'
  ],
  'Staff Behavior': [
    'Unprofessional conduct',
    'Communication style',
    'Lack of empathy',
    'Privacy breach',
    'Discrimination concerns',
    'Rudeness'
  ],
  'Technical/Equipment': [
    'Equipment malfunction',
    'System downtime',
    'Data loss',
    'Software errors',
    'Report generation',
    'Image storage issues'
  ]
};

const departments = [
  'Obstetrics',
  'Gynecology',
  'General Imaging',
  'MSK',
  'Cardiology',
  'Reception',
  'Billing'
];

const practitioners = [
  'Dr. Sarah Mitchell',
  'Dr. James Chen',
  'Dr. Emma Thompson',
  'Dr. Robert Kumar',
  'Dr. Lisa Anderson',
  'Mr. David Wilson',
  'Reception Staff',
  'Billing Team'
];

const generateComplaintDescription = (category: string, subCategory: string, severity: ComplaintIncident['severity']): string => {
  const descriptions: Record<string, string[]> = {
    'Misdiagnosis concerns': [
      'Patient concerned about accuracy of initial assessment',
      'Discrepancy between our findings and follow-up specialist opinion',
      'Request for second opinion due to unexpected diagnosis'
    ],
    'Procedure complications': [
      'Patient experienced discomfort during transvaginal scan',
      'Allergic reaction to ultrasound gel',
      'Fainting episode during procedure'
    ],
    'Booking errors': [
      'Double-booked appointment slot',
      'Wrong procedure type scheduled',
      'Appointment cancelled without notification'
    ],
    'Long wait times': [
      'Waited over 45 minutes past appointment time',
      'No communication about delays',
      'Multiple patients scheduled for same time slot'
    ],
    'Unprofessional conduct': [
      'Sonographer made inappropriate comments',
      'Staff member was dismissive of concerns',
      'Lack of professional boundaries during examination'
    ],
    'Equipment malfunction': [
      'Ultrasound machine failure mid-procedure',
      'Image quality degradation affecting diagnosis',
      'System crash resulting in lost images'
    ]
  };

  const severityModifiers = {
    'Critical': 'Severe ',
    'Severe': 'Significant ',
    'Moderate': '',
    'Minor': 'Minor '
  };

  const baseDescriptions = descriptions[subCategory] || ['Generic complaint'];
  const description = baseDescriptions[Math.floor(Math.random() * baseDescriptions.length)];
  
  return `${severityModifiers[severity]}${description}. ${
    severity === 'Critical' ? 'Immediate escalation required.' : ''
  }`;
};

const generateRootCause = (category: string): string => {
  const rootCauses: Record<string, string[]> = {
    'Clinical': [
      'Insufficient training on new protocols',
      'Equipment calibration issues',
      'Communication breakdown between staff',
      'Inadequate pre-procedure briefing'
    ],
    'Administrative': [
      'System synchronization failure',
      'Staff scheduling conflicts',
      'Inadequate staffing levels',
      'Process documentation outdated'
    ],
    'Facility': [
      'Maintenance schedule delays',
      'Budget constraints',
      'Vendor service issues',
      'Aging infrastructure'
    ],
    'Staff Behavior': [
      'Stress and workload pressures',
      'Inadequate customer service training',
      'Personal circumstances affecting performance',
      'Cultural sensitivity gaps'
    ],
    'Technical/Equipment': [
      'Outdated software version',
      'Hardware reaching end of life',
      'Insufficient IT support coverage',
      'Integration issues with third-party systems'
    ]
  };

  const causes = rootCauses[category] || ['Process improvement needed'];
  return causes[Math.floor(Math.random() * causes.length)];
};

const generateCorrectiveAction = (category: string, rootCause: string): string => {
  const actions: Record<string, string[]> = {
    'Clinical': [
      'Additional training scheduled for all clinical staff',
      'Protocol review and update completed',
      'Equipment servicing and recalibration arranged',
      'New consent forms implemented'
    ],
    'Administrative': [
      'Booking system upgrade implemented',
      'Staff rota optimization completed',
      'Process workflow redesigned',
      'Additional administrative support hired'
    ],
    'Facility': [
      'Immediate maintenance work completed',
      'Deep cleaning schedule enhanced',
      'Accessibility audit conducted',
      'Facility upgrade plan approved'
    ],
    'Staff Behavior': [
      'One-on-one coaching provided',
      'Customer service workshop attendance mandatory',
      'Performance improvement plan initiated',
      'Team building exercises scheduled'
    ],
    'Technical/Equipment': [
      'Emergency IT support protocols established',
      'Equipment replacement fast-tracked',
      'Software patches applied',
      'Redundancy systems implemented'
    ]
  };

  const categoryActions = actions[category] || ['Standard remediation process initiated'];
  return categoryActions[Math.floor(Math.random() * categoryActions.length)];
};

export const generateComplaints = (): ComplaintIncident[] => {
  const complaints: ComplaintIncident[] = [];
  const endDate = new Date();
  const startDate = subMonths(endDate, 6);
  
  // Generate 80-120 complaints over 6 months
  const totalComplaints = 80 + Math.floor(Math.random() * 40);
  
  for (let i = 0; i < totalComplaints; i++) {
    const incidentDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    );
    
    // Report usually filed within 1-3 days
    const reportedDate = addDays(incidentDate, Math.floor(Math.random() * 3) + 1);
    
    const category = Object.keys(categories)[
      Math.floor(Math.random() * Object.keys(categories).length)
    ] as keyof typeof categories;
    
    const subCategories = categories[category];
    const subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
    
    // Severity distribution: 50% Minor, 30% Moderate, 15% Severe, 5% Critical
    const severityRand = Math.random();
    const severity = severityRand < 0.5 ? 'Minor' : 
                    severityRand < 0.8 ? 'Moderate' : 
                    severityRand < 0.95 ? 'Severe' : 'Critical';
    
    // Status based on age and severity
    const daysSinceReport = differenceInDays(endDate, reportedDate);
    let status: ComplaintIncident['status'];
    let resolutionDate: string | undefined;
    let resolutionTime: number | undefined;
    
    if (daysSinceReport < 7 && severity !== 'Critical') {
      status = 'Open';
    } else if (daysSinceReport < 14 && severity !== 'Critical') {
      status = 'In Progress';
    } else if (severity === 'Critical' || severity === 'Severe') {
      status = daysSinceReport > 21 ? 'Resolved' : 'Escalated';
      if (status === 'Resolved') {
        resolutionTime = severity === 'Critical' ? 
          7 + Math.floor(Math.random() * 7) : // 7-14 days for critical
          14 + Math.floor(Math.random() * 14); // 14-28 days for severe
        resolutionDate = format(addDays(reportedDate, resolutionTime), 'yyyy-MM-dd');
      }
    } else {
      status = 'Resolved';
      resolutionTime = severity === 'Moderate' ? 
        7 + Math.floor(Math.random() * 14) : // 7-21 days for moderate
        3 + Math.floor(Math.random() * 7); // 3-10 days for minor
      resolutionDate = format(addDays(reportedDate, resolutionTime), 'yyyy-MM-dd');
    }
    
    const department = departments[Math.floor(Math.random() * departments.length)];
    const needsPractitioner = category === 'Clinical' || category === 'Staff Behavior';
    
    const complaint: ComplaintIncident = {
      id: `INC-${String(i + 1).padStart(4, '0')}`,
      date: format(incidentDate, 'yyyy-MM-dd'),
      reportedDate: format(reportedDate, 'yyyy-MM-dd'),
      category,
      subCategory,
      severity,
      description: generateComplaintDescription(category, subCategory, severity),
      patient: {
        id: `PAT-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
        name: `Patient ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        age: 25 + Math.floor(Math.random() * 50),
        contact: `07${Math.floor(Math.random() * 900000000 + 100000000)}`
      },
      department,
      practitioner: needsPractitioner ? 
        practitioners[Math.floor(Math.random() * practitioners.length)] : 
        undefined,
      status,
      resolutionDate,
      resolutionTime,
      rootCause: status === 'Resolved' ? generateRootCause(category) : undefined,
      correctiveAction: status === 'Resolved' ? 
        generateCorrectiveAction(category, generateRootCause(category)) : 
        undefined,
      followUpRequired: severity === 'Critical' || severity === 'Severe' || Math.random() < 0.3,
      compensationOffered: severity === 'Critical' || (severity === 'Severe' && Math.random() < 0.5),
      compensationAmount: severity === 'Critical' ? 500 + Math.floor(Math.random() * 1500) :
                         severity === 'Severe' && Math.random() < 0.5 ? 100 + Math.floor(Math.random() * 400) :
                         undefined
    };
    
    complaints.push(complaint);
  }
  
  return complaints.sort((a, b) => b.reportedDate.localeCompare(a.reportedDate));
};

export const calculateMetrics = (complaints: ComplaintIncident[]) => {
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved');
  const openComplaints = complaints.filter(c => c.status === 'Open' || c.status === 'In Progress');
  const escalatedComplaints = complaints.filter(c => c.status === 'Escalated');
  
  // Average resolution times by severity
  const resolutionTimesBySeverity = {
    Critical: resolvedComplaints
      .filter(c => c.severity === 'Critical' && c.resolutionTime)
      .map(c => c.resolutionTime!),
    Severe: resolvedComplaints
      .filter(c => c.severity === 'Severe' && c.resolutionTime)
      .map(c => c.resolutionTime!),
    Moderate: resolvedComplaints
      .filter(c => c.severity === 'Moderate' && c.resolutionTime)
      .map(c => c.resolutionTime!),
    Minor: resolvedComplaints
      .filter(c => c.severity === 'Minor' && c.resolutionTime)
      .map(c => c.resolutionTime!)
  };
  
  const avgResolutionTime = (times: number[]) => 
    times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  
  // Complaints by category
  const complaintsByCategory = Object.keys(categories).reduce((acc, cat) => {
    acc[cat] = complaints.filter(c => c.category === cat).length;
    return acc;
  }, {} as Record<string, number>);
  
  // Trend analysis - complaints per month
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i);
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthComplaints = complaints.filter(c => {
      const date = new Date(c.reportedDate);
      return date >= monthStart && date <= monthEnd;
    });
    
    return {
      month: format(month, 'MMM yyyy'),
      total: monthComplaints.length,
      critical: monthComplaints.filter(c => c.severity === 'Critical').length,
      severe: monthComplaints.filter(c => c.severity === 'Severe').length,
      moderate: monthComplaints.filter(c => c.severity === 'Moderate').length,
      minor: monthComplaints.filter(c => c.severity === 'Minor').length
    };
  });
  
  return {
    summary: {
      total: totalComplaints,
      open: openComplaints.length,
      resolved: resolvedComplaints.length,
      escalated: escalatedComplaints.length,
      resolutionRate: (resolvedComplaints.length / totalComplaints * 100).toFixed(1)
    },
    resolutionTimes: {
      critical: avgResolutionTime(resolutionTimesBySeverity.Critical),
      severe: avgResolutionTime(resolutionTimesBySeverity.Severe),
      moderate: avgResolutionTime(resolutionTimesBySeverity.Moderate),
      minor: avgResolutionTime(resolutionTimesBySeverity.Minor),
      overall: avgResolutionTime([
        ...resolutionTimesBySeverity.Critical,
        ...resolutionTimesBySeverity.Severe,
        ...resolutionTimesBySeverity.Moderate,
        ...resolutionTimesBySeverity.Minor
      ])
    },
    byCategory: complaintsByCategory,
    monthlyTrend,
    compensation: {
      total: complaints.filter(c => c.compensationOffered).length,
      amount: complaints
        .filter(c => c.compensationAmount)
        .reduce((sum, c) => sum + c.compensationAmount!, 0)
    }
  };
};

// Pre-calculated KPIs for the dashboard
export const kpis = {
  openIncidents: 12,
  avgResolutionTime: 8.5,
  criticalIncidents: 2,
  resolutionRate: 85.3
}; 