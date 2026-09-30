export interface SampleDataset {
  id: string;
  title: string;
  category: string;
  description: string;
  defaultQuestion: string;
  files: {
    id: string;
    name: string;
    type: string;
    size: number;
    content: string;
    charCount: number;
    wordCount: number;
  }[];
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'saas-plans',
    title: 'SaaS Tiers (Plan A vs Plan B)',
    category: 'Pricing & Features',
    description: 'Compare two enterprise cloud subscriptions across pricing, limits, SLA, and support.',
    defaultQuestion: 'Compare Plan A vs Plan B across pricing, storage, seats, API limits, and SLA uptime.',
    files: [
      {
        id: 'sample_doc_1a',
        name: 'CloudScale_Pro_Plan_A.txt',
        type: 'text/plain',
        size: 1420,
        charCount: 1420,
        wordCount: 220,
        content: `CLOUDSCALE PRO (PLAN A) — PRODUCT SPECIFICATION SHEET

Overview:
CloudScale Pro is engineered for high-growth development teams needing predictable scaling and reliable cloud infrastructure.

Pricing & Billing:
- Monthly Fee: $49 per user/month, billed annually ($588/yr per user).
- Month-to-Month Option: $59 per user/month.
- Trial Period: 14-day free trial with no credit card required.

Infrastructure & Capacity:
- Storage Allowance: 500 GB NVMe fast SSD storage included per workspace.
- Additional Storage: $0.08 per GB per month.
- Team Seats: Up to 25 seats included. Additional seats are $35/month each.
- API Rate Limit: 10,000 requests per minute with soft bursts up to 15,000 req/min.
- Bandwidth: 2 TB egress included; $0.05/GB thereafter.

Security & Compliance:
- Single Sign-On (SSO): Google Workspace & Microsoft 365 standard OAuth included. Okta SAML 2.0 requires enterprise add-on ($200/mo).
- Encryption: AES-256 at rest, TLS 1.3 in transit.
- Compliance: SOC 2 Type II certified. HIPAA compliance is not supported.

Reliability & Support:
- SLA Uptime Guarantee: 99.9% monthly uptime guarantee with financial credits for downtime.
- Support Channel: 24/7 Email and Priority Slack channel support.
- Guaranteed First Response Time: Under 1 hour for critical severity, under 4 hours for standard tickets.
- Phone Support: Not available on this tier.`,
      },
      {
        id: 'sample_doc_1b',
        name: 'EnterpriseGrid_Standard_Plan_B.txt',
        type: 'text/plain',
        size: 1540,
        charCount: 1540,
        wordCount: 240,
        content: `ENTERPRISEGRID STANDARD (PLAN B) — PRODUCT SPECIFICATION SHEET

Overview:
EnterpriseGrid Standard delivers unified workspace collaboration and backend workflow automation for medium-to-large business units.

Pricing & Billing:
- Monthly Fee: $65 per workspace/month (flat rate up to 10 users), then $12/user/month billed annually.
- Month-to-Month Option: $79 per workspace/month.
- Trial Period: 30-day sandbox trial.

Infrastructure & Capacity:
- Storage Allowance: 1.5 TB distributed cloud storage included.
- Additional Storage: $0.12 per GB per month.
- Team Seats: Unlimited workspace team members supported.
- API Rate Limit: 5,000 requests per minute. Bursting not permitted without custom quota review.
- Bandwidth: Unlimited data egress within fair usage policy.

Security & Compliance:
- Single Sign-On (SSO): Native SAML 2.0 and SCIM directory provisioning included at no extra cost (Okta, Ping, Azure AD, Google).
- Encryption: End-to-end zero-knowledge encryption with custom key management (BYOK).
- Compliance: SOC 2 Type II, ISO 27001, and HIPAA compliance BAA available upon request.

Reliability & Support:
- SLA Uptime Guarantee: 99.95% uptime backing with 10x credit multiplier for outages exceeding 30 minutes.
- Support Channel: 24/7 dedicated telephone hotline and live in-app agent chat.
- Guaranteed First Response Time: Under 15 minutes for critical incidents, under 2 hours for standard tickets.
- Dedicated Account Manager: Assigned to accounts with 50+ active seats.`,
      },
    ],
  },
  {
    id: 'financial-reports',
    title: 'Financial Reports (Q3 vs Q4)',
    category: 'Financial Performance',
    description: 'Compare quarterly revenue, gross margins, net income, churn rate, and CAC.',
    defaultQuestion: 'Compare Q3 vs Q4 financial performance including revenue, margins, expenses, CAC, and net income.',
    files: [
      {
        id: 'sample_doc_2a',
        name: 'AcmeCorp_Q3_Financial_Summary.txt',
        type: 'text/plain',
        size: 1350,
        charCount: 1350,
        wordCount: 210,
        content: `ACMECORP FINANCIAL & OPERATIONAL REPORT — Q3 (PERIOD ENDED SEPT 30)

Executive Summary:
Q3 demonstrated resilient customer retention despite seasonal software procurement cycles. Expansion in mid-market accounts supported sustained top-line growth.

Revenue & Margins:
- Total Revenue: $14.2 Million (representing a 12% YoY increase).
- Subscription Recurring Revenue (ARR): $52.8 Million.
- Gross Margin: 68.4% (compressed by 1.2% due to ongoing European cloud data center migration costs).
- Professional Services Revenue: $1.1 Million.

Operating Expenses & Profitability:
- Research & Development (R&D): $4.6 Million (32.4% of revenue).
- Sales & Marketing (S&M): $5.8 Million (40.8% of revenue).
- General & Administrative (G&A): $2.2 Million.
- Total Operating Expenses: $12.6 Million.
- Net Income: $1.15 Million (Net Margin: 8.1%).
- EBITDA: $2.05 Million.

Key SaaS & Operational Metrics:
- Monthly Active Users (MAU): 1,220,000 users.
- Customer Acquisition Cost (CAC): $420 blended average.
- Customer Lifetime Value (LTV): $2,850.
- Net Revenue Retention (NRR): 108%.
- Gross Logo Churn Rate: 2.1% monthly.
- Cash & Equivalents: $24.8 Million remaining on balance sheet.`,
      },
      {
        id: 'sample_doc_2b',
        name: 'AcmeCorp_Q4_Financial_Summary.txt',
        type: 'text/plain',
        size: 1410,
        charCount: 1410,
        wordCount: 225,
        content: `ACMECORP FINANCIAL & OPERATIONAL REPORT — Q4 (PERIOD ENDED DEC 31)

Executive Summary:
Q4 closed with record annual performance driven by enterprise deal closures, improved sales efficiency, and normalized server infrastructure costs.

Revenue & Margins:
- Total Revenue: $17.8 Million (a 25.3% sequential growth over Q3 and 22% YoY increase).
- Subscription Recurring Revenue (ARR): $64.5 Million.
- Gross Margin: 71.8% (up 3.4% as infrastructure optimization completed).
- Professional Services Revenue: $1.6 Million.

Operating Expenses & Profitability:
- Research & Development (R&D): $4.9 Million (27.5% of revenue).
- Sales & Marketing (S&M): $6.1 Million (34.3% of revenue, demonstrating higher capital efficiency).
- General & Administrative (G&A): $2.4 Million.
- Total Operating Expenses: $13.4 Million.
- Net Income: $3.42 Million (Net Margin: 19.2%).
- EBITDA: $4.40 Million.

Key SaaS & Operational Metrics:
- Monthly Active Users (MAU): 1,560,000 users (+27.8% gain).
- Customer Acquisition Cost (CAC): $385 (decreased by $35 due to organic referral loop).
- Customer Lifetime Value (LTV): $3,400.
- Net Revenue Retention (NRR): 114%.
- Gross Logo Churn Rate: 1.7% monthly (improved by 40 bps).
- Cash & Equivalents: $29.4 Million.`,
      },
    ],
  },
  {
    id: 'insurance-policies',
    title: 'Insurance Policies (Gold vs Silver)',
    category: 'Healthcare Coverage',
    description: 'Compare deductibles, copays, out-of-pocket maximums, and coverage exclusions.',
    defaultQuestion: 'Compare the Gold vs Silver insurance policy coverage, copays, premiums, and out-of-pocket limits.',
    files: [
      {
        id: 'sample_doc_3a',
        name: 'ApexHealth_Gold_Plan.txt',
        type: 'text/plain',
        size: 1390,
        charCount: 1390,
        wordCount: 215,
        content: `APEXHEALTH GOLD CARE BENEFIT SCHEDULE — POLICY YEAR 2026

Plan Summary:
Comprehensive health plan designed for individuals and families requiring regular doctor visits, ongoing prescriptions, and lower out-of-pocket risk.

Financial Breakdown:
- Monthly Premium: $450 individual / $1,150 family.
- Annual In-Network Deductible: $750 individual / $1,500 family.
- Out-of-Pocket Maximum: $3,200 individual / $6,400 family.
- Coinsurance: 10% after deductible for inpatient procedures.

Outpatient & Office Visits:
- Primary Care Physician (PCP): $20 fixed copay, deductible waived.
- Specialist Consultation: $40 fixed copay, deductible waived.
- Urgent Care Clinic: $35 fixed copay.
- Emergency Room Visit: $175 copay (waived if admitted to hospital).
- Telehealth Virtual Visits: $0 copay through partner app.

Pharmacy Benefits:
- Tier 1 (Generic drugs): $10 copay per 30-day supply.
- Tier 2 (Preferred brand): $35 copay per 30-day supply.
- Tier 3 (Non-preferred brand): $75 copay after deductible.
- Tier 4 (Specialty drugs): 20% coinsurance up to $250 maximum per prescription.

Supplemental Benefits & Exclusions:
- Dental & Vision: Preventive dental (2 exams/cleanings per year) and 1 vision exam per year included at $0 copay.
- Acupuncture & Chiropractic: Covered up to 20 visits per calendar year at $25 copay.
- Exclusions: Cosmetic surgery, elective bariatric procedures unless medically pre-authorized, out-of-network non-emergency treatments.`,
      },
      {
        id: 'sample_doc_3b',
        name: 'ApexHealth_Silver_Plan.txt',
        type: 'text/plain',
        size: 1410,
        charCount: 1410,
        wordCount: 220,
        content: `APEXHEALTH SILVER ESSENTIALS BENEFIT SCHEDULE — POLICY YEAR 2026

Plan Summary:
Cost-effective balance of lower monthly premiums with higher deductible coverage, ideal for healthy adults with moderate medical needs.

Financial Breakdown:
- Monthly Premium: $290 individual / $780 family.
- Annual In-Network Deductible: $2,250 individual / $4,500 family.
- Out-of-Pocket Maximum: $6,800 individual / $13,600 family.
- Coinsurance: 25% after deductible for hospital stays and surgeries.

Outpatient & Office Visits:
- Primary Care Physician (PCP): $40 fixed copay, deductible waived for first 3 visits; then subject to deductible.
- Specialist Consultation: $75 copay, subject to deductible.
- Urgent Care Clinic: $65 fixed copay.
- Emergency Room Visit: 25% coinsurance after deductible is met.
- Telehealth Virtual Visits: $15 copay.

Pharmacy Benefits:
- Tier 1 (Generic drugs): $18 copay per 30-day supply.
- Tier 2 (Preferred brand): $60 copay per 30-day supply after deductible.
- Tier 3 (Non-preferred brand): 35% coinsurance after deductible.
- Tier 4 (Specialty drugs): 40% coinsurance after deductible.

Supplemental Benefits & Exclusions:
- Dental & Vision: Not included in standard policy; available as an add-on rider for $38/month.
- Acupuncture & Chiropractic: Not covered.
- Exclusions: Out-of-network services (0% reimbursement except certified life-threatening emergencies), experimental treatments, travel immunization shots.`,
      },
    ],
  },
  {
    id: 'real-estate-listings',
    title: 'Real Estate Listings (Oak St vs Maple Ave)',
    category: 'Property Comparison',
    description: 'Compare purchase price, square footage, HOA fees, parking, and building amenities.',
    defaultQuestion: 'Compare 452 Oak Street vs 718 Maple Avenue on price, sqft, HOA fees, bedrooms, and amenities.',
    files: [
      {
        id: 'sample_doc_4a',
        name: 'Property_452_Oak_Street_Condo.txt',
        type: 'text/plain',
        size: 1320,
        charCount: 1320,
        wordCount: 205,
        content: `RESIDENTIAL PROPERTY SPECIFICATION — 452 OAK STREET, UNIT 4B

Property Overview:
Modern luxury condominium situated in the heart of Downtown Arts District. Walking distance to transit hub and central park.

Pricing & Financials:
- Asking Price: $549,000.
- Estimated Property Taxes: $4,850/year.
- Homeowners Association (HOA) Fee: $385/month.
- Price per Square Foot: $477/sqft.

Dimensions & Layout:
- Total Interior Living Area: 1,150 sq ft.
- Bedrooms: 2 Bedrooms.
- Bathrooms: 2 Full Bathrooms (primary bath features soaking tub and double vanity).
- Balcony/Terrace: Private 85 sq ft covered balcony facing south courtyard.
- Year Built: 2019 (LEED Silver certified building).

Interior Features:
- Flooring: Engineered wide-plank white oak hardwood throughout.
- Kitchen: Quartz waterfall countertops, Bosch stainless appliances, gas cooktop.
- Climate: Multi-zone ductless mini-split heating & cooling with smart thermostats.
- Laundry: In-unit stackable washer and dryer closet.

Parking & Building Amenities:
- Parking: 1 deeded underground secure garage space with EV charger prep.
- Storage: Dedicated 6x8 ft locked basement storage cage.
- Building Amenities: Rooftop terrace with community grills, 24-hour fitness center, package locker concierge room, bike storage room.
- Pet Policy: Pets allowed; limit 2 domestic pets up to 50 lbs each.`,
      },
      {
        id: 'sample_doc_4b',
        name: 'Property_718_Maple_Avenue_Townhome.txt',
        type: 'text/plain',
        size: 1380,
        charCount: 1380,
        wordCount: 215,
        content: `RESIDENTIAL PROPERTY SPECIFICATION — 718 MAPLE AVENUE

Property Overview:
Spacious end-unit three-story townhome in the peaceful Westside Greenbelt neighborhood. Close to top-ranked public schools and trail systems.

Pricing & Financials:
- Asking Price: $595,000.
- Estimated Property Taxes: $5,420/year.
- Homeowners Association (HOA) Fee: $175/month (covers exterior maintenance, roof reserves, and common landscaping).
- Price per Square Foot: $402/sqft.

Dimensions & Layout:
- Total Interior Living Area: 1,480 sq ft.
- Bedrooms: 3 Bedrooms (all located on upper level).
- Bathrooms: 2.5 Bathrooms (powder room on ground floor, 2 full baths upstairs).
- Outdoor Space: Private fenced ground-floor patio garden (approx. 240 sq ft).
- Year Built: 2014.

Interior Features:
- Flooring: Natural hickory hardwood on main level, plush wool carpeting in bedrooms.
- Kitchen: Granite slab countertops, KitchenAid appliance suite, pantry cabinet.
- Climate: Central dual-zone forced air heating and electric AC unit.
- Laundry: Dedicated second-floor laundry room with utility sink.

Parking & Building Amenities:
- Parking: Attached 2-car tandem garage with direct interior access and overhead storage racks.
- Storage: Extra storage mezzanine in garage and walk-in attic space.
- Community Amenities: Community playground, private greenbelt dog park, community garden plots. No gym or rooftop lounge.
- Pet Policy: Pets warmly welcomed; no breed or weight limitations.`,
      },
    ],
  },
];
