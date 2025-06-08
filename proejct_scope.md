
## 1. Objectives & Scope

| Pillar                   | What Success Looks Like                                                       |
| ------------------------ | ----------------------------------------------------------------------------- |
| **Clinical & Ops**       | Daily insight into patient flow, capacity bottlenecks, referral mix.          |
| **Financial**            | Clear margin visibility, aging risk flagged, actionable cash-collection cues. |
| **Marketing**            | Single source of truth for ad & funnel spend → bookings → \$ return.          |
| **Experience & Quality** | Continuous pulse on NPS/complaints tied to service line & clinician.          |
| **Strategic**            | Data-driven capacity forecasts and expansion heatmaps.                        |

*Must-have v1*: Reports **1-5** and **9** (booking engine ROI) – these are revenue-critical.
*Nice-to-have v1.5*: Remaining reports once foundations prove out.

---

## 2. Data Sources & Integration Map

| Source                  | Connector                                                 | Notes                                           |
| ----------------------- | --------------------------------------------------------- | ----------------------------------------------- |
| **Zoho CRM**            | Zoho REST API (Bulk Read for history, Webhooks for delta) | Core patient, appointment, invoice, NPS fields. |
| **Google Ads**          | Google Ads API ➔ BigQuery (existing pipeline)             | Keyword/ad ROAS, GCLID → booking link.          |
| **GA4 / Website**       | GA4 Reporting API                                         | Sessions, funnel steps, events.                 |
| **Payment / Invoicing** | Zoho Books or Stripe (if used)                            | Needed for real-time collections & aging.       |
| **Email & Social**      | Mailchimp, Meta Marketing API                             | Campaign IDs ↔ bookings.                        |
| **Competitor intel**    | Manual upload / periodic scraper                          | For benchmark report.                           |

**One-way sync**: Copy source data into an **Ops Warehouse (Postgres or BigQuery)** every hour; never push back to Zoho.
Advantage: heavy queries run off the warehouse, not production CRM.

---

## 3. High-Level Architecture

```text
┌──────────────────┐  Webhooks  ┌───────────────┐
│  Zoho CRM        ├───────────►│ETL / Worker   │
└──────────────────┘  Bulk Read │  (Node/FastAPI│
           ▲                    └───────────────┘
           │  GraphQL / REST           │
           │                        ┌───────────┐
           │                        │Postgres / │
           ▼                        │BigQuery   │
     React Front-End  ◄─────────────┴───────────┘
 (Next.js or Vite)     SQL & Cache     ▲
     │ Chart UI                       │
     ▼ OAuth                          └────── Google/GA4 APIs
 User Auth (Zoho SSO)                       (existing)
```

* **Backend**: FastAPI (Python) or NestJS (Node) – whichever aligns with your current infra.
* **Front-end**: React + TanStack Query for data fetching, Recharts for visuals, shadcn/ui & Tailwind for UI.
* **Auth**: Zoho OAuth2 → issue JWT with role claims (Admin, Analyst, Marketing).
* **Deployment**: Fly.io or Vercel (edge functions for SSR).
* **Testing & QA**: Storybook for UI, pytest/Jest for logic, Playwright for e2e.

---

## 4. Data Model Essentials (v1)

| Fact Table          | Grain                  | Critical Fields                                                                                   |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Appointment**     | one row per booking    | patient\_id, modality, referrer\_type, room\_id, clinician\_id, start\_ts, status, revenue, GCLID |
| **Patient**         | unique patient         | demographics, first\_seen\_ts, postcode                                                           |
| **Invoice**         | one per invoice        | appointment\_id, amount\_due, amount\_paid, payer\_type, issue\_ts, paid\_ts                      |
| **Referral**        | one per referral event | referrer\_id, type (GP/Consultant/etc.), patient\_id, first\_scan\_ts                             |
| **Marketing Touch** | GCLID / session        | source / medium / campaign / keyword, landing\_page, booking\_flag                                |

Slowly Changing Dimension tables for Clinician, Room, Equipment allow historical utilization snapshots.

---

## 5. Report-to-Data Mapping

| Report ID            | Primary Tables           | Special Logic / KPI                              |
| -------------------- | ------------------------ | ------------------------------------------------ |
| 1. Patient Volume    | Appointment, Patient     | `new_vs_returning = min(1, scans_per_patient>1)` |
| 2. Referral Source   | Referral, Invoice        | 30-day trailing revenue window per referrer      |
| 3. Waiting Time      | Appointment              | `lead_time = start_ts - create_ts`               |
| 4. Procedure Trends  | Appointment, Invoice     | seasonal = DATE\_TRUNC('month', start\_ts)       |
| 5. Revenue Breakdown | Invoice                  | join modality, clinician, location dims          |
| 9. Google Ads Perf   | Marketing Touch, Invoice | ROAS = revenue / ad\_cost (from Ads API)         |
| …                    | …                        | …                                                |

*Most other reports are aggregations on the same fact tables once core measures exist.*

---

## 6. Delivery Phases & Timeline (aggressive)

| Phase                                   | Length  | Milestones                                                                                                             |
| --------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| **0. Discovery & Field Mapping**        | 5 days  | Confirm Zoho modules/field IDs, data quality audit, spec freeze.                                                       |
| **1. Data Pipeline MVP**                | 10 days | Warehouse spun up, nightly bulk extract, webhook delta ingest.                                                         |
| **2. Core Dashboards (Reports 1-5, 9)** | 15 days | API endpoints ready ➔ React pages, role-based auth, export to CSV/PDF.                                                 |
| **3. Enhancement Pack**                 | 15 days | Remaining reports, scheduler for automated e-mail PDF snapshots, alert rules (e.g., low utilization, aging > 30 days). |
| **4. Polishing & Handover**             | 5 days  | UAT fixes, docs, CI/CD pipelines, admin training.                                                                      |

*Total: \~45 working days* – front-load dev so you can demo tangible value at the week-3 meeting.

---

## 7. Additional Quick-Win Reports You Could Pitch

* **Lifetime Value Heatmap** – revenue per patient cohort vs. referral source.
* **Same-Sonographer Recall Rate** – shows continuity of care impact on NPS.
* **Upsell Opportunity Radar** – identify patients who had MSK scan but never booked physio follow-up.
* **Search-Term Emerging Trends** – auto-flag new high-intent queries in Google Ads weekly.

---

## 8. Open Questions for Ayman / IT

1. Which Zoho modules store appointment & invoice data? (CRM, Books, custom?)
2. Are payment settlements always logged in Zoho, or partly in Stripe/BACS?
3. Any GDPR/PHI constraints requiring on-prem or EU cloud residency?
4. Preferred BI export formats (CSV, Excel, PDF) for board reports?
5. Who owns sign-off on clinical data definitions (e.g., “new patient” rule)?

---
