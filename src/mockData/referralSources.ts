export interface ReferralSource {
  id: string;
  name: string;
  type: 'GP' | 'Consultant' | 'Self-Referral' | 'Insurer' | 'Embassy' | 'Referral Website' | 'Organic' | 'Google Ads';
  bookings: number;
  revenue: number;
  averageOrderValue: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export const generateReferralSources = (): ReferralSource[] => {
  const sources: ReferralSource[] = [
    {
      id: '1',
      name: 'Google Ads - Pregnancy Scans',
      type: 'Google Ads',
      bookings: 234,
      revenue: 42120,
      averageOrderValue: 180,
      trend: 'up',
      trendPercentage: 18.5,
      location: 'Online - Paid Search',
      contactPerson: 'Marketing Team',
      email: 'marketing@harleystreetultrasound.com',
      phone: '+44 20 3904 4441'
    },
    {
      id: '2',
      name: 'Dr Ayman Mahfouz (Consultant)',
      type: 'Consultant',
      bookings: 186,
      revenue: 37200,
      averageOrderValue: 200,
      trend: 'up',
      trendPercentage: 12.3,
      location: 'UCLH, WC1E',
      contactPerson: 'Dr Ayman Mahfouz',
      email: 'referrals@uclh.nhs.uk',
      phone: '+44 20 3456 7890'
    },
    {
      id: '3',
      name: 'Harley Street Medical Centre',
      type: 'GP',
      bookings: 156,
      revenue: 28080,
      averageOrderValue: 180,
      trend: 'stable',
      trendPercentage: 2.1,
      location: 'Harley Street, W1G',
      contactPerson: 'Dr James Thompson',
      email: 'j.thompson@hsmc.co.uk',
      phone: '+44 20 7123 4567'
    },
    {
      id: '4',
      name: 'BUPA Insurance',
      type: 'Insurer',
      bookings: 142,
      revenue: 31240,
      averageOrderValue: 220,
      trend: 'up',
      trendPercentage: 8.7,
      location: 'London',
      contactPerson: 'BUPA Relations Team',
      email: 'providers@bupa.com',
      phone: '+44 20 7656 2000'
    },
    {
      id: '5',
      name: 'Organic Search - Website',
      type: 'Organic',
      bookings: 128,
      revenue: 21760,
      averageOrderValue: 170,
      trend: 'up',
      trendPercentage: 15.3,
      location: 'Online - Organic',
      contactPerson: 'SEO Team',
      email: 'digital@harleystreetultrasound.com',
      phone: '+44 20 3904 4441'
    },
    {
      id: '6',
      name: 'Self-Referral (Walk-in)',
      type: 'Self-Referral',
      bookings: 112,
      revenue: 17920,
      averageOrderValue: 160,
      trend: 'up',
      trendPercentage: 6.8,
      location: '99 Harley Street',
      contactPerson: 'Reception Team',
      email: 'contact@harleystreetultrasound.com',
      phone: '+44 20 3904 4441'
    },
    {
      id: '7',
      name: 'US Embassy London',
      type: 'Embassy',
      bookings: 98,
      revenue: 24500,
      averageOrderValue: 250,
      trend: 'up',
      trendPercentage: 22.5,
      location: 'Grosvenor Square, W1A',
      contactPerson: 'Medical Unit',
      email: 'medicalunit@usembassy.gov',
      phone: '+44 20 7499 9000'
    },
    {
      id: '8',
      name: 'Dr Sophie Pattison (Consultant)',
      type: 'Consultant',
      bookings: 94,
      revenue: 19740,
      averageOrderValue: 210,
      trend: 'up',
      trendPercentage: 9.2,
      location: 'UCL, WC1E',
      contactPerson: 'Dr Sophie Pattison',
      email: 's.pattison@ucl.ac.uk',
      phone: '+44 20 3108 2000'
    },
    {
      id: '9',
      name: 'Doctify Referrals',
      type: 'Referral Website',
      bookings: 87,
      revenue: 14790,
      averageOrderValue: 170,
      trend: 'up',
      trendPercentage: 28.4,
      location: 'Online Platform',
      contactPerson: 'Partner Success',
      email: 'partners@doctify.com',
      phone: '+44 20 3058 1777'
    },
    {
      id: '10',
      name: 'Portland Place Surgery',
      type: 'GP',
      bookings: 82,
      revenue: 13940,
      averageOrderValue: 170,
      trend: 'stable',
      trendPercentage: -1.2,
      location: 'Portland Place, W1B',
      contactPerson: 'Dr Lisa Chen',
      email: 'l.chen@portlandplace.co.uk',
      phone: '+44 20 7567 8901'
    },
    {
      id: '11',
      name: 'AXA PPP Healthcare',
      type: 'Insurer',
      bookings: 76,
      revenue: 17480,
      averageOrderValue: 230,
      trend: 'up',
      trendPercentage: 11.3,
      location: 'London',
      contactPerson: 'Provider Relations',
      email: 'provider@axappp.co.uk',
      phone: '+44 1892 503 856'
    },
    {
      id: '12',
      name: 'Google Ads - Breast Screening',
      type: 'Google Ads',
      bookings: 74,
      revenue: 14800,
      averageOrderValue: 200,
      trend: 'down',
      trendPercentage: -5.2,
      location: 'Online - Paid Search',
      contactPerson: 'Marketing Team',
      email: 'marketing@harleystreetultrasound.com',
      phone: '+44 20 3904 4441'
    },
    {
      id: '13',
      name: 'Canadian High Commission',
      type: 'Embassy',
      bookings: 68,
      revenue: 15640,
      averageOrderValue: 230,
      trend: 'up',
      trendPercentage: 18.7,
      location: 'Trafalgar Square, SW1Y',
      contactPerson: 'Health Services',
      email: 'medical@canada.ca',
      phone: '+44 20 7004 6000'
    },
    {
      id: '14',
      name: 'TopDoctors.co.uk',
      type: 'Referral Website',
      bookings: 65,
      revenue: 10400,
      averageOrderValue: 160,
      trend: 'up',
      trendPercentage: 32.1,
      location: 'Online Platform',
      contactPerson: 'Account Manager',
      email: 'partners@topdoctors.co.uk',
      phone: '+44 20 3970 1301'
    },
    {
      id: '15',
      name: 'Marylebone Medical Practice',
      type: 'GP',
      bookings: 58,
      revenue: 9860,
      averageOrderValue: 170,
      trend: 'stable',
      trendPercentage: 0.8,
      location: 'Marylebone, W1U',
      contactPerson: 'Dr Michael Roberts',
      email: 'm.roberts@marylebone.co.uk',
      phone: '+44 20 7935 6554'
    },
    {
      id: '16',
      name: 'Dr Nikhil Patel (MSK Consultant)',
      type: 'Consultant',
      bookings: 54,
      revenue: 11880,
      averageOrderValue: 220,
      trend: 'up',
      trendPercentage: 14.2,
      location: "King's College Hospital",
      contactPerson: 'Dr Nikhil Patel',
      email: 'n.patel@nhs.net',
      phone: '+44 20 3299 9000'
    },
    {
      id: '17',
      name: 'Vitality Health Insurance',
      type: 'Insurer',
      bookings: 48,
      revenue: 10560,
      averageOrderValue: 220,
      trend: 'down',
      trendPercentage: -8.3,
      location: 'London',
      contactPerson: 'Provider Support',
      email: 'providers@vitality.co.uk',
      phone: '+44 345 600 1022'
    },
    {
      id: '18',
      name: 'French Embassy',
      type: 'Embassy',
      bookings: 45,
      revenue: 9450,
      averageOrderValue: 210,
      trend: 'stable',
      trendPercentage: 3.2,
      location: 'Knightsbridge, SW1X',
      contactPerson: 'Service Médical',
      email: 'medical@ambafrance-uk.org',
      phone: '+44 20 7073 1000'
    },
    {
      id: '19',
      name: 'Self-Referral (Phone)',
      type: 'Self-Referral',
      bookings: 42,
      revenue: 6720,
      averageOrderValue: 160,
      trend: 'down',
      trendPercentage: -12.5,
      location: 'Phone Bookings',
      contactPerson: 'Call Centre',
      email: 'contact@harleystreetultrasound.com',
      phone: '+44 20 3904 4441'
    },
    {
      id: '20',
      name: 'Google Ads - MSK Ultrasound',
      type: 'Google Ads',
      bookings: 38,
      revenue: 7980,
      averageOrderValue: 210,
      trend: 'up',
      trendPercentage: 25.8,
      location: 'Online - Paid Search',
      contactPerson: 'Marketing Team',
      email: 'marketing@harleystreetultrasound.com',
      phone: '+44 20 3904 4441'
    },
    {
      id: '21',
      name: 'Harley Street Doctors',
      type: 'GP',
      bookings: 36,
      revenue: 6120,
      averageOrderValue: 170,
      trend: 'up',
      trendPercentage: 7.9,
      location: 'Harley Street, W1G',
      contactPerson: 'Practice Manager',
      email: 'referrals@harleystreetdoctors.com',
      phone: '+44 20 7467 8350'
    },
    {
      id: '22',
      name: 'WhatClinic.com',
      type: 'Referral Website',
      bookings: 32,
      revenue: 5120,
      averageOrderValue: 160,
      trend: 'stable',
      trendPercentage: 1.5,
      location: 'Online Platform',
      contactPerson: 'Partner Team',
      email: 'partners@whatclinic.com',
      phone: '+44 1 661 0836'
    },
    {
      id: '23',
      name: 'Organic - Direct Traffic',
      type: 'Organic',
      bookings: 28,
      revenue: 4760,
      averageOrderValue: 170,
      trend: 'up',
      trendPercentage: 9.4,
      location: 'Direct Website Visit',
      contactPerson: 'Web Team',
      email: 'digital@harleystreetultrasound.com',
      phone: '+44 20 3904 4441'
    },
    {
      id: '24',
      name: 'Australian High Commission',
      type: 'Embassy',
      bookings: 24,
      revenue: 5280,
      averageOrderValue: 220,
      trend: 'up',
      trendPercentage: 16.2,
      location: 'Strand, WC2B',
      contactPerson: 'Medical Officer',
      email: 'medical@australia.gov.au',
      phone: '+44 20 7379 4334'
    },
    {
      id: '25',
      name: 'Cigna Healthcare',
      type: 'Insurer',
      bookings: 22,
      revenue: 5060,
      averageOrderValue: 230,
      trend: 'stable',
      trendPercentage: 2.8,
      location: 'London',
      contactPerson: 'Provider Network',
      email: 'providernetwork@cigna.com',
      phone: '+44 1475 788 816'
    }
  ];

  return sources;
};

export const referralKPIs = {
  topReferrer: 'Google Ads - Pregnancy Scans',
  totalRevenue: 456890,
  revenueChange: 14.7,
  averageOrderValue: 195,
  aovChange: 5.2,
};

export const referralRevenueBySource = [
  { name: 'Google Ads', value: 64900, percentage: 14.2 },
  { name: 'Consultants', value: 68820, percentage: 15.1 },
  { name: 'GP Practices', value: 58000, percentage: 12.7 },
  { name: 'Insurers', value: 64340, percentage: 14.1 },
  { name: 'Organic', value: 26520, percentage: 5.8 },
  { name: 'Self-Referrals', value: 24640, percentage: 5.4 },
  { name: 'Embassies', value: 44870, percentage: 9.8 },
  { name: 'Referral Websites', value: 30310, percentage: 6.6 },
  { name: 'Other', value: 74490, percentage: 16.3 },
];