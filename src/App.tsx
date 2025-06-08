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
                    <Route path="outstanding-aging" element={<div>Outstanding & Aging - Coming Soon</div>} />
                    <Route path="cancellation-impact" element={<div>Cancellation Impact - Coming Soon</div>} />
                  </Route>
                  <Route path="marketing">
                    <Route path="google-ads" element={<div>Google Ads - Coming Soon</div>} />
                    <Route path="website-funnel" element={<div>Website Funnel - Coming Soon</div>} />
                    <Route path="seo-organic" element={<div>SEO & Organic - Coming Soon</div>} />
                    <Route path="social-email" element={<div>Social & Email - Coming Soon</div>} />
                  </Route>
                  <Route path="patient-experience">
                    <Route path="feedback-nps" element={<div>Feedback & NPS - Coming Soon</div>} />
                    <Route path="complaints-incidents" element={<div>Complaints & Incidents - Coming Soon</div>} />
                  </Route>
                  <Route path="strategic">
                    <Route path="utilization-forecast" element={<div>Utilization Forecast - Coming Soon</div>} />
                    <Route path="competitor-benchmark" element={<div>Competitor Benchmark - Coming Soon</div>} />
                    <Route path="patient-heatmap" element={<div>Patient Heatmap - Coming Soon</div>} />
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