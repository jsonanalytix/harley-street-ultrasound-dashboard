import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { Activity, LogOut, Settings, User } from 'lucide-react';

const getPageTitle = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) return 'Dashboard';
  
  const titleMap: Record<string, string> = {
    'clinical': 'Clinical & Operations',
    'patient-volume': 'Patient Volume',
    'referral-sources': 'Referral Sources',
    'waiting-times': 'Waiting Times',
    'procedure-trends': 'Procedure Trends',
    'financial': 'Financial & Business',
    'revenue-breakdown': 'Revenue Breakdown',
    'profitability': 'Profitability',
    'outstanding-aging': 'Outstanding & Aging',
    'cancellation-impact': 'Cancellation Impact',
    'marketing': 'Marketing & Conversion',
    'google-ads': 'Google Ads',
    'website-funnel': 'Website Funnel',
    'seo-organic': 'SEO & Organic',
    'social-email': 'Social & Email Engagement',
    'patient-experience': 'Patient Experience & Quality',
    'feedback-nps': 'Feedback & NPS',
    'complaints-incidents': 'Complaints & Incidents',
    'strategic': 'Strategic & Capacity',
    'utilization-forecast': 'Utilization Forecast',
    'competitor-benchmark': 'Competitor Benchmark',
    'patient-heatmap': 'Patient Heatmap',
  };

  const lastSegment = segments[segments.length - 1];
  return titleMap[lastSegment] || 'Dashboard';
};

export const TopNav: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-[#005EB8]" />
            <div>
              <h1 className="text-xl font-semibold text-[#1A1A1A] dark:text-white">
                Harley Street Ultrasound
              </h1>
              <p className="text-sm text-muted-foreground">Business Intelligence Portal</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <h2 className="text-lg font-medium text-[#1A1A1A] dark:text-white">
            {pageTitle}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <DateRangePicker />
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};