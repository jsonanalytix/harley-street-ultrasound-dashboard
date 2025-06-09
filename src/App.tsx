import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { DateRangeProvider } from '@/contexts/DateRangeContext';
import { PrivateRoute } from '@/components/PrivateRoute';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Login } from '@/pages/Login';
import { PatientVolume } from '@/pages/clinical/PatientVolume';
import { ReferralSources } from '@/pages/clinical/ReferralSources';
import { WaitingTimes } from '@/pages/clinical/WaitingTimes';
import { ProcedureTrends } from '@/pages/clinical/ProcedureTrends';
import { RevenueBreakdown } from '@/pages/financial/RevenueBreakdown';
import { Profitability } from '@/pages/financial/Profitability';
import { OutstandingAging } from '@/pages/financial/OutstandingAging';
import { CancellationImpact } from '@/pages/financial/CancellationImpact';
import { GoogleAdsPerformance } from '@/pages/marketing/GoogleAdsPerformance';
import { WebsiteFunnel } from '@/pages/marketing/WebsiteFunnel';
import { SEOOrganic } from '@/pages/marketing/SEOOrganic';
import { SocialEmail } from '@/pages/marketing/SocialEmail';
import { FeedbackNPS } from '@/pages/patient-experience/FeedbackNPS';
import { ComplaintsIncidents } from '@/pages/patient-experience/ComplaintsIncidents';
import { UtilizationForecast } from '@/pages/strategic/UtilizationForecast';
import { CompetitorBenchmark } from '@/pages/strategic/CompetitorBenchmark';
import { PatientHeatmap } from '@/pages/strategic/PatientHeatmap';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DateRangeProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <PrivateRoute>
                      <PageWrapper />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<Navigate to="/clinical/patient-volume\" replace />} />
                  <Route path="clinical">
                    <Route path="patient-volume" element={<PatientVolume />} />
                    <Route path="referral-sources" element={<ReferralSources />} />
                    <Route path="waiting-times" element={<WaitingTimes />} />
                    <Route path="procedure-trends" element={<ProcedureTrends />} />
                  </Route>
                  <Route path="financial">
                    <Route path="revenue-breakdown" element={<RevenueBreakdown />} />
                    <Route path="profitability" element={<Profitability />} />
                    <Route path="outstanding-aging" element={<OutstandingAging />} />
                    <Route path="cancellation-impact" element={<CancellationImpact />} />
                  </Route>
                  <Route path="marketing">
                    <Route path="google-ads" element={<GoogleAdsPerformance />} />
                    <Route path="website-funnel" element={<WebsiteFunnel />} />
                    <Route path="seo-organic" element={<SEOOrganic />} />
                    <Route path="social-email" element={<SocialEmail />} />
                  </Route>
                  <Route path="patient-experience">
                    <Route path="feedback-nps" element={<FeedbackNPS />} />
                    <Route path="complaints-incidents" element={<ComplaintsIncidents />} />
                  </Route>
                  <Route path="strategic">
                    <Route path="utilization-forecast" element={<UtilizationForecast />} />
                    <Route path="competitor-benchmark" element={<CompetitorBenchmark />} />
                    <Route path="patient-heatmap" element={<PatientHeatmap />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
            </Router>
          </DateRangeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;