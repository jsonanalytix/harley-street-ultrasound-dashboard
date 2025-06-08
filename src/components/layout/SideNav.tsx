import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Activity,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  PieChart,
  FileText,
  Calendar,
  Target,
  Globe,
  Search,
  Mail,
  Heart,
  AlertTriangle,
  BarChart3,
  MapPin,
  ChevronLeft,
  Menu,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Clinical & Ops',
    href: '/clinical',
    icon: Activity,
    children: [
      { title: 'Patient Volume', href: '/clinical/patient-volume', icon: Users },
      { title: 'Referral Sources', href: '/clinical/referral-sources', icon: Users },
      { title: 'Waiting Times', href: '/clinical/waiting-times', icon: Clock },
      { title: 'Procedure Trends', href: '/clinical/procedure-trends', icon: TrendingUp },
    ],
  },
  {
    title: 'Financial & Business',
    href: '/financial',
    icon: DollarSign,
    children: [
      { title: 'Revenue Breakdown', href: '/financial/revenue-breakdown', icon: PieChart },
      { title: 'Profitability', href: '/financial/profitability', icon: TrendingUp },
      { title: 'Outstanding & Aging', href: '/financial/outstanding-aging', icon: FileText },
      { title: 'Cancellation Impact', href: '/financial/cancellation-impact', icon: Calendar },
    ],
  },
  {
    title: 'Marketing & Conversion',
    href: '/marketing',
    icon: Target,
    children: [
      { title: 'Google Ads', href: '/marketing/google-ads', icon: Globe },
      { title: 'Website Funnel', href: '/marketing/website-funnel', icon: Target },
      { title: 'SEO & Organic', href: '/marketing/seo-organic', icon: Search },
      { title: 'Social & Email', href: '/marketing/social-email', icon: Mail },
    ],
  },
  {
    title: 'Patient Experience',
    href: '/patient-experience',
    icon: Heart,
    children: [
      { title: 'Feedback & NPS', href: '/patient-experience/feedback-nps', icon: Heart },
      { title: 'Complaints & Incidents', href: '/patient-experience/complaints-incidents', icon: AlertTriangle },
    ],
  },
  {
    title: 'Strategic & Capacity',
    href: '/strategic',
    icon: BarChart3,
    children: [
      { title: 'Utilization Forecast', href: '/strategic/utilization-forecast', icon: BarChart3 },
      { title: 'Competitor Benchmark', href: '/strategic/competitor-benchmark', icon: TrendingUp },
      { title: 'Patient Heatmap', href: '/strategic/patient-heatmap', icon: MapPin },
    ],
  },
];

export const SideNav: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('clinical');

  const toggleSection = (href: string) => {
    setExpandedSection(expandedSection === href ? null : href);
  };

  return (
    <div
      className={cn(
        'relative flex flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-[#005EB8]">Navigation</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => (
          <div key={item.href}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start font-normal',
                isCollapsed ? 'px-2' : 'px-3',
                'text-left hover:bg-[#005EB8]/10 hover:text-[#005EB8]'
              )}
              onClick={() => toggleSection(item.href.replace('/', ''))}
            >
              <item.icon className={cn('h-4 w-4', isCollapsed ? 'mr-0' : 'mr-3')} />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.children && (
                    <ChevronLeft
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedSection === item.href.replace('/', '') && 'rotate-[-90deg]'
                      )}
                    />
                  )}
                </>
              )}
            </Button>
            
            {!isCollapsed && item.children && expandedSection === item.href.replace('/', '') && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.href}
                    to={child.href}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        'hover:bg-[#005EB8]/10 hover:text-[#005EB8]',
                        isActive
                          ? 'bg-[#005EB8]/10 text-[#005EB8]'
                          : 'text-muted-foreground'
                      )
                    }
                  >
                    <child.icon className="mr-3 h-4 w-4" />
                    {child.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};