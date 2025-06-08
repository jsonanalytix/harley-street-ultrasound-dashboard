import React, { createContext, useContext, useState } from 'react';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeContextType {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  presets: { label: string; range: DateRange }[];
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
};

export const DateRangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date()),
  });

  const presets = [
    {
      label: 'Last 7 days',
      range: {
        from: startOfDay(subDays(new Date(), 7)),
        to: endOfDay(new Date()),
      },
    },
    {
      label: 'Last 30 days',
      range: {
        from: startOfDay(subDays(new Date(), 30)),
        to: endOfDay(new Date()),
      },
    },
    {
      label: 'Last 90 days',
      range: {
        from: startOfDay(subDays(new Date(), 90)),
        to: endOfDay(new Date()),
      },
    },
    {
      label: 'Last 6 months',
      range: {
        from: startOfDay(subDays(new Date(), 180)),
        to: endOfDay(new Date()),
      },
    },
    {
      label: 'Last year',
      range: {
        from: startOfDay(subDays(new Date(), 365)),
        to: endOfDay(new Date()),
      },
    },
  ];

  const value = {
    dateRange,
    setDateRange,
    presets,
  };

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
};