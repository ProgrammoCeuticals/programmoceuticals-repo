# Poultry Farm Financial Management System (PFFMS)

## Project Overview

Build a modern web-based Poultry Farm Financial Management System that helps poultry farms manage:

- Egg production
- Farm expenses
- Feed/raw material purchases
- Mortality tracking
- Staff salaries
- Revenue
- Profit/loss
- Cost per egg/crate
- Smart egg pricing recommendations

The primary goal of the system is to help poultry farms know the exact cost of production and determine whether they are making profit or loss.

---

# TECH STACK

## Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

## Backend

- NestJS
- Prisma ORM
- PostgreSQL

## Authentication

- JWT Authentication
- Role-based access control

## Deployment

- Frontend: Vercel
- Backend: Railway or Render
- Database: PostgreSQL

---

# APPLICATION STRUCTURE

# FRONTEND STRUCTURE (Next.js)

```bash
src/
│
├── app/
│   ├── login/
│   ├── dashboard/
│   ├── production/
│   ├── expenses/
│   ├── inventory/
│   ├── sales/
│   ├── workers/
│   ├── reports/
│   ├── settings/
│   └── pricing/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── charts/
│   ├── forms/
│   ├── tables/
│   └── layout/
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── constants.ts
│
├── hooks/
│
├── store/
│
├── services/
│
├── types/
│
└── styles/
```

---

# BACKEND STRUCTURE (NestJS)

```bash
src/
│
├── modules/
│   │
│   ├── auth/
│   ├── users/
│   ├── farms/
│   ├── production/
│   ├── mortality/
│   ├── expenses/
│   ├── inventory/
│   ├── feed/
│   ├── sales/
│   ├── workers/
│   ├── payroll/
│   ├── pricing/
│   ├── analytics/
│   └── reports/
│
├── prisma/
│
├── common/
│   ├── guards/
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── utils/
│
├── config/
│
└── main.ts
```

---

# CORE MODULES

# 1. AUTH MODULE

Features:

- Login
- Register
- JWT authentication
- Password reset
- Role-based access

Roles:

- Admin
- Farm Manager
- Accountant
- Staff

---

# 2. DASHBOARD MODULE

Dashboard cards:

- Total birds available
- Eggs produced today
- Cracked eggs
- Mortality today
- Revenue today
- Expenses today
- Profit/loss today
- Cost per egg
- Recommended selling price

Charts:

- Production trends
- Revenue vs expenses
- Profit trends

---

# 3. PRODUCTION MODULE

Tracks:

- Daily egg production
- Cracked eggs
- Spoilt eggs
- Good eggs

Fields:

- Date
- Total eggs produced
- Cracked eggs
- Spoilt eggs
- Notes

Auto calculations:

- Good eggs
- Daily averages
- Weekly totals

Formula:

Good Eggs = Total Eggs Produced - Cracked Eggs - Spoilt Eggs

---

# 4. MORTALITY MODULE

Tracks:

- Dead birds
- Cause of death
- Date
- Bird batch

Fields:

- Date
- Number of deaths
- Cause
- Notes

Auto calculations:

- Remaining birds available

Formula:

Available Birds = Total Birds - Mortality

---

# 5. INVENTORY MODULE

Tracks:

- Feed stock
- Raw materials
- Medication
- Crates
- Vaccines

Features:

- Stock in
- Stock out
- Low stock alerts
- Supplier tracking

Inventory items:

- Dry maize
- Soya
- Layers mash
- Premix
- Medication

---

# 6. FEED COST MODULE

Tracks:

- Feed purchases
- Supplier prices
- Feed formulation costs

Fields:

- Item name
- Quantity
- Supplier
- Unit price
- Total cost
- Date purchased

Example:

- Dry maize = ₦450,000
- Supplier = ABC Agro

Purpose:
Track changing feed prices and their effect on egg pricing.

---

# 7. EXPENSE MODULE

Tracks all operational expenses.

Expense categories:

- Fuel
- Construction
- Salary
- Medication
- Repairs
- Transport
- Electricity
- Water
- Miscellaneous

Fields:

- Amount
- Category
- Date
- Description
- Receipt upload

---

# 8. WORKERS MODULE

Tracks:

- Staff information
- Roles
- Salary
- Payment history

Fields:

- Name
- Phone
- Role
- Salary
- Employment date

---

# 9. PAYROLL MODULE

Tracks:

- Salary payments
- Outstanding salaries
- Payroll history

Features:

- Mark salary as paid
- Generate payroll reports

---

# 10. SALES MODULE

Tracks:

- Egg sales
- Crates sold
- Customers
- Selling price
- Outstanding debts

Fields:

- Customer
- Quantity sold
- Price per crate
- Total amount
- Payment status

Features:

- Invoice generation
- Debt tracking

---

# 11. PRICING ENGINE MODULE

MAIN BUSINESS LOGIC

Purpose:
Calculate:

- Cost per egg
- Cost per crate
- Minimum selling price
- Expected profit
- Loss warning

Core formulas:

## Total Expenses

Total Expenses =
Feed + Salary + Fuel + Construction + Other Expenses

## Cost Per Egg

Cost Per Egg =
Total Expenses / Total Good Eggs

## Cost Per Crate

Cost Per Crate =
Cost Per Egg × 30

## Profit

Profit =
Revenue - Expenses

## Suggested Selling Price

Selling Price =
Cost Price + Desired Profit Margin

Features:

- Profit margin calculator
- Loss detection
- Smart pricing recommendation

---

# 12. ANALYTICS MODULE

Reports:

- Daily reports
- Weekly reports
- Monthly reports
- Annual reports

Charts:

- Production trends
- Expense trends
- Mortality trends
- Profit trends

Export:

- PDF
- Excel

---

# DATABASE TABLES

## Users

```sql
id
name
email
password
role
created_at
```

## Farms

```sql
id
name
location
owner
created_at
```

## Production

```sql
id
date
total_eggs
cracked_eggs
spoilt_eggs
good_eggs
farm_id
```

## Mortality

```sql
id
date
count
cause
farm_id
```

## Expenses

```sql
id
category
amount
description
date
farm_id
```

## Inventory

```sql
id
item_name
quantity
unit
unit_price
farm_id
```

## Sales

```sql
id
customer_name
quantity
price
total
payment_status
date
farm_id
```

## Workers

```sql
id
name
role
salary
phone
farm_id
```

## Payroll

```sql
id
worker_id
amount
payment_date
status
```

---

# SIDEBAR NAVIGATION

- Dashboard
- Production
- Mortality
- Inventory
- Feed Costs
- Expenses
- Sales
- Workers
- Payroll
- Pricing Engine
- Analytics
- Reports
- Settings

---

# MVP REQUIREMENTS (VERSION 1)

Build first:

- Authentication
- Dashboard
- Production tracking
- Expense management
- Mortality tracking
- Sales tracking
- Profit/loss calculations
- Smart pricing engine

Do NOT overengineer version 1.

---

# UI DESIGN DIRECTION

Style:

- Modern SaaS dashboard
- Clean cards
- Data-heavy UI
- Responsive design
- Mobile friendly

Use:

- shadcn/ui
- Tables
- Charts
- KPI cards
- Sidebar layout

Theme:

- Professional agritech platform
- Financial intelligence dashboard

---

# FUTURE FEATURES

Phase 2:

- Mobile app
- SMS alerts
- WhatsApp notifications
- AI forecasting
- Multi-farm support
- Offline sync
- IoT sensor integration
- Feed forecasting
- Mortality prediction

---

# BUSINESS POSITIONING

This is NOT just a farm management app.

This is:

“A financial intelligence and cost accounting platform for poultry farms.”

Main value proposition:
Help poultry farms determine the true production cost of eggs and avoid selling at a loss.
