# Harley Street Ultrasound Business Intelligence Portal

A comprehensive Business Intelligence (BI) dashboard for Harley Street Ultrasound clinic, providing real-time insights into clinical operations, financial performance, marketing effectiveness, and patient experience.

## 🏥 Overview

This React-based dashboard integrates with Zoho CRM and other data sources to provide actionable insights for:
- Clinical operations and patient flow
- Financial performance and profitability analysis
- Marketing campaign effectiveness
- Patient experience metrics
- Strategic planning and capacity forecasting

## 🚀 Features

### Clinical & Operations
- **Patient Volume Report**: Track daily/weekly/monthly scan volumes with new vs returning patient analysis
- **Referral Sources**: Analyze referral patterns from GPs, consultants, insurance companies, and marketing channels
- **Waiting Times**: Monitor lead times by service type, location, and clinician
- **Procedure Trends**: Identify seasonal patterns and high-demand services
- **Profitability Analysis**: Gross margin analysis by procedure type with cost breakdowns

### Financial & Business
- **Revenue Breakdown**: Analyze revenue by modality, clinician, and location
- **Service Line Profitability**: Identify high-margin vs low-margin services
- **Outstanding & Aging**: Monitor payment collection and aging receivables
- **Cancellation Impact**: Track revenue impact from cancellations and no-shows

### Marketing & Conversion
- **Google Ads Performance**: ROI tracking by campaign and keyword
- **Website Funnel Analysis**: Conversion tracking from visit to booking
- **SEO & Organic Performance**: Monitor organic search performance
- **Social & Email Campaigns**: Track campaign effectiveness

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Build Tool**: Vite
- **Authentication**: Mock auth (ready for Zoho OAuth integration)

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/jsonanalytix/harley-street-ultrasound-dashboard.git
cd harley-street-ultrasound-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration (currently using mock data)

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔐 Authentication

Currently using mock authentication. Login with:
- **Email**: admin@harleystreetultrasound.com
- **Password**: demo123

## 📊 Mock Data

The application currently uses comprehensive mock data that simulates:
- Real clinic operations (closed Sundays, reduced Saturday hours)
- Actual service offerings from Harley Street Ultrasound
- Realistic referral patterns and seasonal trends
- Accurate cost structures for profitability analysis

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (navigation, wrapper)
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts (auth, date range)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── mockData/           # Mock data generators
├── pages/              # Page components
│   ├── clinical/       # Clinical dashboard pages
│   └── financial/      # Financial dashboard pages
└── App.tsx            # Main application component
```

## 🔄 Data Integration

The dashboard is designed to integrate with:
- **Zoho CRM**: Patient records, appointments, invoices
- **Google Ads API**: Campaign performance data
- **Google Analytics 4**: Website analytics
- **Payment Systems**: Revenue and collection data

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The build output will be in the `dist` directory, ready for deployment to any static hosting service.

## 📈 Future Enhancements

- [ ] Real-time data integration with Zoho CRM
- [ ] Advanced predictive analytics
- [ ] Mobile responsive improvements
- [ ] Export functionality for all reports
- [ ] Role-based access control
- [ ] Email report scheduling
- [ ] Custom dashboard builder

## 🤝 Contributing

This is a private repository for Harley Street Ultrasound. For any questions or issues, please contact the development team.

## 📄 License

Proprietary - All rights reserved by Harley Street Ultrasound

---

Built with ❤️ by [JSON Analytix](https://github.com/jsonanalytix)