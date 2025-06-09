# Harley Street Ultrasound BI Portal - Remaining Reports Brief

## Important Context

### Original Vision vs Current Implementation
This project was originally scoped as a full data integration platform (see `proejct_scope.md`) with connections to:
- Zoho CRM for patient and appointment data
- Google Ads API for marketing performance
- GA4 for website analytics
- Payment systems for financial data

**Current Status**: This is a **demo/proof-of-concept implementation** using mock data generators. All data is simulated to demonstrate the UI/UX and report functionality without actual API integrations.

### Why Mock Data?
- Faster development and iteration
- No dependencies on external systems
- Demonstrates full functionality for stakeholder review
- Can be easily converted to real data sources later

## Project Overview

### Current State
- **Project**: Harley Street Ultrasound BI Portal (harley-street-us)
- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts, Framer Motion
- **Deployment**: Cloudflare Pages
- **Authentication**: Environment variables (VITE_APP_USERNAME, VITE_APP_PASSWORD)
- **Demo Credentials**: admin@harleystreetultrasound.com / HSU2024!Portal

### Completed Reports
1. ✅ Patient Volume & Demographics
2. ✅ Referral Source Performance
3. ✅ Waiting Times & Patient Journey
4. ✅ Procedure Trends & Clinician Stats
5. ✅ Revenue Breakdown & KPIs
6. ✅ Service & Insurance Profitability
7. ✅ Outstanding & Aging Report
8. ✅ Cancellation & No-show Impact Report

### Project Structure
```
src/
├── components/
│   ├── layout/
│   └── ui/
├── contexts/
├── hooks/
├── lib/
├── mockData/     # Mock data generators
└── pages/
    ├── clinical/
    ├── financial/
    └── marketing/ (to be created)
```

## Established Patterns

### Mock Data Pattern
```typescript
// Example from cancellationImpact.ts
export interface RecordType {
  // Define interfaces
}

export const generateRecords = (): RecordType[] => {
  // Use date-fns for date manipulation
  // Generate realistic data for 90-180 days
  // Include realistic distributions
};

export const calculateMetrics = (records: RecordType[]): MetricType[] => {
  // Process raw records into meaningful metrics
};

export const kpis = {
  // Pre-calculated KPIs for dashboard cards
};
```

### Component Pattern
```typescript
// Standard imports
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '@/components/ui/kpi-card';
import { ChartContainer } from '@/components/ui/chart-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Recharts imports
// Icon imports from lucide-react

export const ComponentName: React.FC = () => {
  // useMemo for data generation
  // Multiple tabs for different views
  // Responsive grid layouts
  // Motion animations on mount
};
```

### UI/UX Standards
- KPI cards at top (4 columns on desktop, responsive)
- Tab-based navigation for different views
- Tables with hover states and status badges
- Color coding: Green (good), Yellow (warning), Red (alert)
- Charts use consistent color palette
- All monetary values formatted with £ and toLocaleString()
- Date ranges typically 90-180 days of historical data

## Remaining Reports Implementation Guide

### Marketing & Conversion Reports (9-12)

#### 9. Google Ads Performance Report
**File**: `src/pages/marketing/GoogleAdsPerformance.tsx`
**Mock Data**: `src/mockData/googleAds.ts`

**Key Metrics**:
- CTR by campaign/ad group/keyword
- Conversion rates (impressions → clicks → bookings)
- ROAS (Return on Ad Spend)
- Cost per acquisition
- Landing page performance metrics
- Quality Score distribution

**Data Structure Suggestions**:
```typescript
interface AdCampaign {
  id: string;
  name: string;
  type: 'Search' | 'Display' | 'Shopping';
  status: 'Active' | 'Paused';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

interface Keyword {
  id: string;
  campaignId: string;
  adGroupId: string;
  keyword: string;
  matchType: 'Exact' | 'Phrase' | 'Broad';
  qualityScore: number;
  avgCpc: number;
  // ... metrics
}
```

**Tabs**:
1. Campaign Overview (KPIs, trend charts)
2. Keyword Performance (sortable table with quality scores)
3. Landing Pages (conversion funnel by page)
4. Geographic Performance (performance by location)

#### 10. Website Funnel & Drop-off Analysis
**File**: `src/pages/marketing/WebsiteFunnel.tsx`
**Mock Data**: `src/mockData/websiteFunnel.ts`

**Key Features**:
- Funnel visualization (Sessions → Service Page → Booking Form → Confirmation)
- Drop-off rates at each stage
- Heatmap of high-intent pages
- Device/browser breakdown
- Session duration analysis

**Visualization Ideas**:
- Sankey diagram for user flow
- Funnel chart with percentages
- Time-on-page distribution
- Exit page analysis

#### 11. SEO & Organic Lead Report
**File**: `src/pages/marketing/SEOOrganic.tsx`
**Mock Data**: `src/mockData/seoOrganic.ts`

**Key Metrics**:
- Organic traffic trends
- Top performing keywords
- Page rankings
- Blog post performance
- Local SEO metrics (Google My Business)
- Backlink profile strength

**Data Points**:
- Search queries with impressions/clicks
- Landing page organic performance
- Mobile vs desktop traffic
- Location-based searches
- Featured snippets captured

#### 12. Social & Email Campaign Engagement
**File**: `src/pages/marketing/SocialEmail.tsx`
**Mock Data**: `src/mockData/socialEmail.ts`

**Channels to Include**:
- Email campaigns (newsletters, promotions)
- Facebook/Instagram ads
- LinkedIn presence
- WhatsApp business messages

**Metrics**:
- Open rates, CTR by campaign type
- Best performing subject lines
- Conversion from email to booking
- Social engagement rates
- Follower growth trends

### Patient Experience & Quality Reports (13-14)

#### 13. Patient Feedback & NPS Report
**File**: `src/pages/patient-experience/FeedbackNPS.tsx`
**Mock Data**: `src/mockData/patientFeedback.ts`

**Key Components**:
- NPS score calculation and trend
- Satisfaction ratings by dimension (care, facility, booking, value)
- Word cloud of feedback themes
- Clinician-specific ratings
- Response rate tracking

**Visualizations**:
- NPS gauge chart
- Sentiment analysis over time
- Rating distribution histograms
- Correlation matrix (satisfaction vs likelihood to recommend)

#### 14. Complaints and Clinical Incidents Report
**File**: `src/pages/patient-experience/ComplaintsIncidents.tsx`
**Mock Data**: `src/mockData/complaintsIncidents.ts`

**Categories**:
- Clinical issues
- Administrative problems
- Facility concerns
- Staff behavior
- Technical/equipment issues

**Tracking**:
- Severity levels (Minor, Moderate, Severe, Critical)
- Resolution time metrics
- Root cause analysis
- Corrective actions taken
- Trends by department/practitioner

### Strategic & Capacity Planning Reports (15-17)

#### 15. Utilization & Capacity Forecasting
**File**: `src/pages/strategic/UtilizationForecast.tsx`
**Mock Data**: `src/mockData/capacityPlanning.ts`

**Features**:
- Room utilization heatmaps
- Sonographer workload balance
- Predictive demand modeling
- Seasonal pattern analysis
- Optimal scheduling recommendations

**Forecasting**:
- Use historical patterns
- Day of week/time of day trends
- Holiday impact analysis
- Growth projections

#### 16. Competitor Benchmark Report
**File**: `src/pages/strategic/CompetitorBenchmark.tsx`
**Mock Data**: `src/mockData/competitorAnalysis.ts`

**Comparison Points**:
- Pricing by service type
- Google reviews/ratings
- Service offerings gap analysis
- Wait time comparisons
- PPC ad visibility
- Website traffic estimates

**Data Sources to Simulate**:
- Mystery shopping results
- Review aggregation
- Ad intelligence data
- Market share estimates

#### 17. Geographic Heatmap of Patients
**File**: `src/pages/strategic/PatientHeatmap.tsx`
**Mock Data**: `src/mockData/geographicData.ts`

**Features**:
- Interactive map with patient density
- Postcode-level analysis
- Travel time radius analysis
- Competitor clinic locations
- Expansion opportunity scoring

**Visualizations**:
- Choropleth map of London
- Cluster analysis
- Drive-time polygons
- Revenue by geographic area

## Implementation Priorities

### Phase 1 (High Business Value)
1. Google Ads Performance Report
2. Patient Feedback & NPS Report
3. Website Funnel & Drop-off Analysis

### Phase 2 (Strategic Planning)
4. Utilization & Capacity Forecasting
5. Geographic Heatmap of Patients
6. SEO & Organic Lead Report

### Phase 3 (Operational Excellence)
7. Complaints and Clinical Incidents Report
8. Social & Email Campaign Engagement
9. Competitor Benchmark Report

## Technical Guidelines

### Data Generation Tips
- Use consistent date ranges (90-180 days history)
- Include realistic seasonality (quieter in August, busy in January)
- Add day-of-week patterns (Mondays busiest, Sundays closed)
- Include outliers and edge cases
- Use believable conversion rates (2-5% for ads, 10-15% for email)

### Performance Considerations
- Use React.memo for heavy components
- Implement virtual scrolling for large tables
- Lazy load chart libraries
- Use useMemo for expensive calculations
- Consider pagination for data tables

### Accessibility
- Ensure all charts have text alternatives
- Use semantic HTML
- Include ARIA labels
- Maintain keyboard navigation
- Test with screen readers

### Testing Mock Data
- Ensure data consistency across reports
- Validate calculations
- Test edge cases (empty data, single records)
- Verify date range filters work correctly

## Next Steps
1. Create the marketing folder structure
2. Implement mock data generators following established patterns
3. Build components using the standard layout
4. Ensure consistent styling with existing reports
5. Add proper TypeScript types throughout
6. Update App.tsx routes as you complete each report

## Remember
- Keep the same visual consistency as existing reports
- Use motion animations for smooth transitions
- Include helpful insights and recommendations in each report
- Make data actionable with clear CTAs
- Consider mobile responsiveness throughout

## Instructions for Next Chat Window

### Opening Message Template
```
I need to complete the remaining reports for the Harley Street Ultrasound BI Portal. 
Please refer to the REMAINING_REPORTS_BRIEF.md file for full context.

I'd like to start with [REPORT NAME] from the priority list.
```

### Quick Reference Checklist
- [ ] Read REMAINING_REPORTS_BRIEF.md first
- [ ] Check existing mock data patterns in src/mockData/
- [ ] Review component patterns in existing reports
- [ ] Create marketing/patient-experience/strategic folders as needed
- [ ] Update App.tsx routes after each report
- [ ] Test with `npm run dev` regularly
- [ ] Keep consistent styling with existing reports

### File References
- **Project Brief**: REMAINING_REPORTS_BRIEF.md
- **Original Scope**: proejct_scope.md  
- **Environment Setup**: CLOUDFLARE_ENV_SETUP.md
- **Example Mock Data**: src/mockData/cancellationImpact.ts
- **Example Component**: src/pages/financial/CancellationImpact.tsx

### Development Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

Good luck with the remaining reports! 🚀 