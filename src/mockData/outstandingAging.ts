import { subDays, format } from 'date-fns';

export interface OutstandingInvoice {
  id: string;
  clientName: string;
  clientType: 'Embassy' | 'Insurance' | 'Corporate' | 'GP Practice' | 'Self-Pay' | 'NHS';
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  paidAmount: number;
  outstandingAmount: number;
  daysOverdue: number;
  status: 'Current' | 'Overdue' | 'Partially Paid' | 'In Dispute';
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
  notes?: string;
}

export interface AgingBracket {
  bracket: string;
  rangeStart: number;
  rangeEnd: number | null;
  count: number;
  amount: number;
  percentage: number;
}

export interface ClientTypeAging {
  clientType: string;
  current: number;
  days1_30: number;
  days31_60: number;
  days61_90: number;
  over90: number;
  total: number;
  avgDaysOutstanding: number;
}

export interface CollectionActivity {
  week: string;
  contacted: number;
  promisedPayment: number;
  collected: number;
  disputed: number;
  writeOff: number;
  collectionRate: number;
}

// Generate outstanding invoices
export const generateOutstandingInvoices = (): OutstandingInvoice[] => {
  const invoices: OutstandingInvoice[] = [];
  
  // Embassy clients (tend to have longer payment cycles)
  const embassies = [
    'Embassy of the United States',
    'Embassy of France',
    'Embassy of Japan',
    'Embassy of Saudi Arabia',
    'Embassy of UAE',
    'Embassy of Kuwait',
    'Embassy of Qatar',
    'Embassy of Nigeria',
  ];
  
  // Insurance companies
  const insurers = [
    'BUPA Global',
    'AXA PPP Healthcare',
    'Vitality Health',
    'WPA Healthcare',
    'Aviva Health',
    'Cigna Global',
    'Allianz Care',
  ];
  
  // Corporate clients
  const corporates = [
    'Goldman Sachs',
    'JP Morgan',
    'McKinsey & Company',
    'Deloitte LLP',
    'KPMG',
    'British Airways',
    'BP plc',
  ];
  
  // GP Practices
  const gpPractices = [
    'The Wellington Hospital',
    'Portland Hospital',
    'Harley Street Medical Centre',
    'Marylebone Health Centre',
    'Fitzrovia Medical Practice',
  ];
  
  let invoiceId = 1000;
  
  // Generate embassy invoices (typically slower payers)
  embassies.forEach(embassy => {
    const numInvoices = Math.floor(Math.random() * 8) + 5;
    for (let i = 0; i < numInvoices; i++) {
      const daysAgo = Math.floor(Math.random() * 180) + 30;
      const invoiceDate = subDays(new Date(), daysAgo);
      const dueDate = subDays(new Date(), daysAgo - 60); // 60 day payment terms
      const amount = Math.floor(Math.random() * 15000) + 5000;
      const paidAmount = Math.random() > 0.7 ? Math.floor(amount * Math.random() * 0.5) : 0;
      const daysOverdue = Math.max(0, Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      
      invoices.push({
        id: `INV-${invoiceId++}`,
        clientName: embassy,
        clientType: 'Embassy',
        invoiceNumber: `HSU-${invoiceId}-${format(invoiceDate, 'yyyy')}`,
        invoiceDate,
        dueDate,
        amount,
        paidAmount,
        outstandingAmount: amount - paidAmount,
        daysOverdue,
        status: daysOverdue > 0 ? (paidAmount > 0 ? 'Partially Paid' : 'Overdue') : 'Current',
        lastContactDate: daysOverdue > 30 ? subDays(new Date(), Math.floor(Math.random() * 14)) : undefined,
        nextFollowUpDate: daysOverdue > 30 ? subDays(new Date(), -Math.floor(Math.random() * 7)) : undefined,
        notes: daysOverdue > 90 ? 'Embassy payment approval process delayed' : undefined,
      });
    }
  });
  
  // Generate insurer invoices
  insurers.forEach(insurer => {
    const numInvoices = Math.floor(Math.random() * 10) + 8;
    for (let i = 0; i < numInvoices; i++) {
      const daysAgo = Math.floor(Math.random() * 120) + 15;
      const invoiceDate = subDays(new Date(), daysAgo);
      const dueDate = subDays(new Date(), daysAgo - 45); // 45 day payment terms
      const amount = Math.floor(Math.random() * 8000) + 2000;
      const paidAmount = Math.random() > 0.6 ? Math.floor(amount * Math.random() * 0.3) : 0;
      const daysOverdue = Math.max(0, Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      const inDispute = Math.random() > 0.85 && daysOverdue > 30;
      
      invoices.push({
        id: `INV-${invoiceId++}`,
        clientName: insurer,
        clientType: 'Insurance',
        invoiceNumber: `HSU-${invoiceId}-${format(invoiceDate, 'yyyy')}`,
        invoiceDate,
        dueDate,
        amount,
        paidAmount,
        outstandingAmount: amount - paidAmount,
        daysOverdue,
        status: inDispute ? 'In Dispute' : (daysOverdue > 0 ? (paidAmount > 0 ? 'Partially Paid' : 'Overdue') : 'Current'),
        lastContactDate: daysOverdue > 15 ? subDays(new Date(), Math.floor(Math.random() * 7)) : undefined,
        nextFollowUpDate: daysOverdue > 15 ? subDays(new Date(), -Math.floor(Math.random() * 5)) : undefined,
        notes: inDispute ? 'Claim documentation requested' : undefined,
      });
    }
  });
  
  // Generate corporate invoices (generally good payers)
  corporates.forEach(corporate => {
    const numInvoices = Math.floor(Math.random() * 6) + 3;
    for (let i = 0; i < numInvoices; i++) {
      const daysAgo = Math.floor(Math.random() * 60) + 5;
      const invoiceDate = subDays(new Date(), daysAgo);
      const dueDate = subDays(new Date(), daysAgo - 30); // 30 day payment terms
      const amount = Math.floor(Math.random() * 5000) + 1000;
      const paidAmount = 0; // Corporates usually pay in full
      const daysOverdue = Math.max(0, Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      
      invoices.push({
        id: `INV-${invoiceId++}`,
        clientName: corporate,
        clientType: 'Corporate',
        invoiceNumber: `HSU-${invoiceId}-${format(invoiceDate, 'yyyy')}`,
        invoiceDate,
        dueDate,
        amount,
        paidAmount,
        outstandingAmount: amount - paidAmount,
        daysOverdue,
        status: daysOverdue > 0 ? 'Overdue' : 'Current',
        lastContactDate: daysOverdue > 10 ? subDays(new Date(), Math.floor(Math.random() * 5)) : undefined,
        nextFollowUpDate: daysOverdue > 10 ? subDays(new Date(), -Math.floor(Math.random() * 3)) : undefined,
      });
    }
  });
  
  // Generate GP Practice invoices
  gpPractices.forEach(practice => {
    const numInvoices = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numInvoices; i++) {
      const daysAgo = Math.floor(Math.random() * 90) + 10;
      const invoiceDate = subDays(new Date(), daysAgo);
      const dueDate = subDays(new Date(), daysAgo - 30); // 30 day payment terms
      const amount = Math.floor(Math.random() * 3000) + 500;
      const paidAmount = Math.random() > 0.8 ? Math.floor(amount * Math.random() * 0.4) : 0;
      const daysOverdue = Math.max(0, Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      
      invoices.push({
        id: `INV-${invoiceId++}`,
        clientName: practice,
        clientType: 'GP Practice',
        invoiceNumber: `HSU-${invoiceId}-${format(invoiceDate, 'yyyy')}`,
        invoiceDate,
        dueDate,
        amount,
        paidAmount,
        outstandingAmount: amount - paidAmount,
        daysOverdue,
        status: daysOverdue > 0 ? (paidAmount > 0 ? 'Partially Paid' : 'Overdue') : 'Current',
        lastContactDate: daysOverdue > 20 ? subDays(new Date(), Math.floor(Math.random() * 10)) : undefined,
        nextFollowUpDate: daysOverdue > 20 ? subDays(new Date(), -Math.floor(Math.random() * 5)) : undefined,
      });
    }
  });
  
  return invoices.sort((a, b) => b.daysOverdue - a.daysOverdue);
};

// Calculate aging brackets
export const calculateAgingBrackets = (invoices: OutstandingInvoice[]): AgingBracket[] => {
  const brackets = [
    { bracket: 'Current', rangeStart: 0, rangeEnd: 0, count: 0, amount: 0 },
    { bracket: '1-30 days', rangeStart: 1, rangeEnd: 30, count: 0, amount: 0 },
    { bracket: '31-60 days', rangeStart: 31, rangeEnd: 60, count: 0, amount: 0 },
    { bracket: '61-90 days', rangeStart: 61, rangeEnd: 90, count: 0, amount: 0 },
    { bracket: 'Over 90 days', rangeStart: 91, rangeEnd: null, count: 0, amount: 0 },
  ];
  
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.outstandingAmount, 0);
  
  invoices.forEach(invoice => {
    const days = invoice.daysOverdue;
    if (days === 0) {
      brackets[0].count++;
      brackets[0].amount += invoice.outstandingAmount;
    } else if (days <= 30) {
      brackets[1].count++;
      brackets[1].amount += invoice.outstandingAmount;
    } else if (days <= 60) {
      brackets[2].count++;
      brackets[2].amount += invoice.outstandingAmount;
    } else if (days <= 90) {
      brackets[3].count++;
      brackets[3].amount += invoice.outstandingAmount;
    } else {
      brackets[4].count++;
      brackets[4].amount += invoice.outstandingAmount;
    }
  });
  
  return brackets.map(bracket => ({
    ...bracket,
    percentage: totalAmount > 0 ? (bracket.amount / totalAmount) * 100 : 0,
  }));
};

// Calculate aging by client type
export const calculateClientTypeAging = (invoices: OutstandingInvoice[]): ClientTypeAging[] => {
  const clientTypes = ['Embassy', 'Insurance', 'Corporate', 'GP Practice', 'Self-Pay', 'NHS'];
  
  return clientTypes.map(type => {
    const typeInvoices = invoices.filter(inv => inv.clientType === type);
    
    const aging = {
      clientType: type,
      current: 0,
      days1_30: 0,
      days31_60: 0,
      days61_90: 0,
      over90: 0,
      total: 0,
      avgDaysOutstanding: 0,
    };
    
    let totalDays = 0;
    let invoiceCount = 0;
    
    typeInvoices.forEach(invoice => {
      const amount = invoice.outstandingAmount;
      const days = invoice.daysOverdue;
      
      if (days === 0) aging.current += amount;
      else if (days <= 30) aging.days1_30 += amount;
      else if (days <= 60) aging.days31_60 += amount;
      else if (days <= 90) aging.days61_90 += amount;
      else aging.over90 += amount;
      
      aging.total += amount;
      totalDays += days;
      invoiceCount++;
    });
    
    aging.avgDaysOutstanding = invoiceCount > 0 ? Math.round(totalDays / invoiceCount) : 0;
    
    return aging;
  }).filter(aging => aging.total > 0);
};

// Generate weekly collection activities
export const generateCollectionActivities = (): CollectionActivity[] => {
  const activities: CollectionActivity[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const weekStart = subDays(new Date(), i * 7 + 7);
    const contacted = Math.floor(Math.random() * 30) + 20;
    const promisedPayment = Math.floor(contacted * (0.4 + Math.random() * 0.3));
    const collected = Math.floor(promisedPayment * (0.6 + Math.random() * 0.3));
    const disputed = Math.floor(contacted * (0.05 + Math.random() * 0.1));
    const writeOff = Math.floor(Math.random() * 3);
    
    activities.push({
      week: format(weekStart, 'MMM dd'),
      contacted,
      promisedPayment,
      collected,
      disputed,
      writeOff,
      collectionRate: (collected / contacted) * 100,
    });
  }
  
  return activities;
};

// Outstanding and Aging KPIs
export const outstandingAgingKPIs = {
  totalOutstanding: 487650,
  overdueAmount: 298340,
  overduePercentage: 61.2,
  avgDaysOutstanding: 42,
  over90DaysAmount: 89760,
  over90DaysPercentage: 18.4,
  disputedAmount: 34500,
  collectionRate: 68.5,
  monthlyWriteOff: 12300,
  topDebtorType: 'Embassy',
};

// High-risk accounts (over 90 days)
export const highRiskAccounts = [
  {
    clientName: 'Embassy of Saudi Arabia',
    outstandingAmount: 28500,
    daysOverdue: 125,
    lastPaymentDate: subDays(new Date(), 180),
    riskScore: 'High',
  },
  {
    clientName: 'Embassy of Nigeria',
    outstandingAmount: 22300,
    daysOverdue: 118,
    lastPaymentDate: subDays(new Date(), 150),
    riskScore: 'High',
  },
  {
    clientName: 'BUPA Global',
    outstandingAmount: 18900,
    daysOverdue: 95,
    lastPaymentDate: subDays(new Date(), 120),
    riskScore: 'Medium',
  },
  {
    clientName: 'Embassy of Kuwait',
    outstandingAmount: 16400,
    daysOverdue: 105,
    lastPaymentDate: subDays(new Date(), 140),
    riskScore: 'High',
  },
  {
    clientName: 'WPA Healthcare',
    outstandingAmount: 14200,
    daysOverdue: 92,
    lastPaymentDate: subDays(new Date(), 110),
    riskScore: 'Medium',
  },
]; 