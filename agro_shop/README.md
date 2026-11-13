# AgroVet POS — Veterinary & Agro-Chemical Point of Sale

A full-featured POS and inventory management system built for veterinary product and agro-chemical retailers. Designed to run entirely in the browser with mock data (no backend required), and scales to a live Supabase PostgreSQL backend when you're ready.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 18 |
| State | Zustand |
| Routing | React Router v6 |
| Charts | Recharts |
| Excel Export | xlsx |
| Database | Supabase / PostgreSQL |
| Styling | Plain CSS (GLSI design system) |

---

## Features

- **POS with receipt printing** — split-screen product browse + cart, complete sale flow, printable receipt modal
- **Inventory management** — full CRUD, expiry tracking, low-stock alerts, stock adjustment, Excel export
- **Sales history** — filterable table, expandable row detail, void sale with reason, Excel export
- **Purchase orders** — create POs with line items, receive stock to automatically update quantities
- **Supplier & customer management** — CRUD modals, customer credit tracking, record payments
- **Expenses tracking** — categorized expenses, monthly summary stats, Excel export
- **Reports** — Sales Summary, Inventory Report, Profit & Loss with Excel export per tab
- **Role-based access** — Admin / Manager / Cashier with per-page access control
- **Mock mode** — full app runs without any backend; all data is in-memory

---

## Setup

```bash
cd agro_shop
npm install
cp .env.example .env
# Fill in Supabase keys — OR leave blank to run in mock mode
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Mock Mode

When `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing or set to placeholder values, the app automatically runs in **mock mode**:

- Any click on "Sign In" logs you in as Demo Admin (role: `admin`)
- All data is seeded from `src/lib/mock.js`
- Write operations update in-memory arrays — data resets on page reload
- No backend required — perfect for demos and development

---

## User Roles

| Role | Access |
|---|---|
| **Admin** | Full access to all pages including Settings and Users management |
| **Manager** | All pages except Settings → Users tab |
| **Cashier** | POS, Sales (view own), Inventory (read-only) |

---

## Modules

| Module | Description |
|---|---|
| **Dashboard** | KPI stat cards, 7-day sales chart, revenue by payment method, recent sales and low stock tables |
| **POS** | Product search with category tabs, cart with discounts and override price, receipt modal with print |
| **Inventory** | Full product CRUD, tab filters (All / Low Stock / Expiring Soon), stock adjustment, Excel export |
| **Sales** | Sales history with filters, expandable item detail, void sale, Excel export |
| **Purchasing** | Purchase order management, line-item entry, receive PO to update stock |
| **Suppliers** | Supplier CRUD with search |
| **Customers** | Customer CRUD, credit limit tracking, record debt payments |
| **Expenses** | Expense records by category, monthly stats, Excel export |
| **Reports** | Sales Summary, Inventory Report, and P&L with date filters and Excel export |
| **Settings** | Shop details form; Admin-only Users tab to manage roles |

---

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run `supabase/schema.sql`
3. Run `supabase/seed.sql` to load initial data
4. In **Authentication → Users**, create two users:
   - `admin@agrovet.ng` / `AgroAdmin2024!`
   - `cashier@agrovet.ng` / `AgroCash2024!`
5. Insert their UUIDs into the `profiles` table (see comments in `seed.sql`)
6. Copy keys from **Project Settings → API** into your `.env`

---

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Leave either value blank or set to `your-supabase-url` / `your-supabase-anon-key` to enable mock mode.
