# Harley Street Ultrasound BI Portal

A comprehensive business intelligence portal for Harley Street Ultrasound, built with React 18, TypeScript, and modern web technologies.

## Features

- **Authentication System**: Secure login with environment-based credentials
- **Comprehensive Dashboard**: 5 main sections with 15+ detailed report pages
- **Real-time Data Visualization**: Interactive charts and tables using Recharts
- **Responsive Design**: Mobile-first approach with collapsible navigation
- **Date Range Filtering**: Global date range picker affecting all reports
- **Export Functionality**: PNG export for charts and CSV for tables
- **Theme Support**: Light/dark mode toggle
- **Accessibility**: WCAG AA compliant design

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: TanStack Query, React Context
- **Routing**: React Router v6
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint, Prettier

## Environment Variables

Create a `.env` file in the root directory:

```env
# Authentication credentials
VITE_APP_USERNAME=admin@harleystreetultrasound.com
VITE_APP_PASSWORD=HSU2024!Portal

# Application settings
VITE_APP_NAME=Harley Street Ultrasound BI Portal
VITE_APP_VERSION=1.0.0
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run storybook` - Start Storybook development server

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (TopNav, SideNav, etc.)
│   └── ui/             # shadcn/ui components
├── contexts/           # React context providers
├── lib/               # Utility functions and configurations
├── mockData/          # Mock data generators
├── pages/             # Page components organized by section
└── hooks/             # Custom React hooks
```

## Navigation Structure

### 1. Clinical & Operations
- **Patient Volume**: Scan volume trends, modality breakdown, new vs returning patients
- **Referral Sources**: Top referrers, revenue by source, contact management
- **Waiting Times**: Lead time analysis, same-day availability, heat maps
- **Procedure Trends**: Volume vs revenue analysis, seasonal trends

### 2. Financial & Business
- **Revenue Breakdown**: MTD/QTD/YTD revenue, insurance breakdown, export functionality
- **Profitability**: Margin analysis, waterfall charts, procedure profitability
- **Outstanding & Aging**: Aging buckets, collection rates, progress indicators
- **Cancellation Impact**: Lost revenue analysis, cancellation reasons

### 3. Marketing & Conversion
- **Google Ads**: Keyword performance, ROAS analysis, campaign management
- **Website Funnel**: Conversion funnel analysis, Sankey diagrams
- **SEO & Organic**: Query performance, landing page analytics
- **Social & Email**: Engagement metrics, subject line optimization

### 4. Patient Experience & Quality
- **Feedback & NPS**: NPS scoring, satisfaction analysis, word clouds
- **Complaints & Incidents**: Incident tracking, SLA management, timelines

### 5. Strategic & Capacity
- **Utilization Forecast**: Capacity planning, ARIMA forecasting
- **Competitor Benchmark**: Market positioning, share-of-voice analysis
- **Patient Heatmap**: Geographic distribution, postcode analysis

## Authentication

The application uses a simple authentication system with hard-coded credentials:

- **Username**: `admin@harleystreetultrasound.com`
- **Password**: `HSU2024!Portal`

Upon successful login, a JWT-like token is stored in localStorage, and all routes are protected with a PrivateRoute wrapper.

## Data Layer

All data is generated using realistic mock data with the following characteristics:

- **50,000+ patients** with realistic NHS postcodes
- **120,000+ appointments** spanning 18 months
- **750+ clinicians and referrers** with contact information
- **Seasonal patterns** and weekend/weekday variations
- **500ms simulated API latency** for realistic loading states

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard

### Manual Build

1. Build the project:
   ```bash
   npm run build
   ```

2. Serve the `dist` folder using any static hosting service

## Development Guidelines

### Code Quality
- ESLint with Airbnb configuration
- Prettier for code formatting
- Husky pre-commit hooks for linting and type checking
- 100% TypeScript coverage

### Testing
- Unit tests with Vitest
- Component tests with React Testing Library
- Storybook for component documentation

### Accessibility
- WCAG AA compliant color contrasts
- Proper ARIA labels and keyboard navigation
- Screen reader support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary and confidential to Harley Street Ultrasound.

## Support

For technical support, contact the development team or refer to the project documentation.