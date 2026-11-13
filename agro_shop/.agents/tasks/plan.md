# AgroVet POS & Inventory Management System — Implementation Plan

## Design Decisions

1. **Stack**: Vite + React 18 (not CRA like GLSI — Vite is faster, no ejection needed, same pattern). Build commands: `npm run dev` / `npm run build`.
2. **CSS approach**: Plain CSS files mirroring GLSI's App.css exactly — same tokens, same class names. Three CSS files: `globals.css` (base tokens + shared classes), `sidebar.css` (left-sidebar layout), `pos.css` (POS split-screen). No CSS modules, no Tailwind.
3. **Routing**: react-router-dom v6 with a single `AppShell` wrapping all protected routes; sidebar nav drives all 11 pages.
4. **State**: Zustand with two stores — `authStore` (session, user, role) and `posStore` (cart, active sale). Product/inventory data fetched directly via hooks in each page; no global product store (avoids stale data).
5. **Mock/fallback**: A `lib/mock.js` exports static arrays for every table. `lib/supabase.js` detects placeholder/missing env vars at runtime and exports a `useMock` flag. Every data hook checks `useMock` and returns mock data instead of calling Supabase.
6. **Auth**: Supabase Auth + `profiles` table (id, email, role, full_name). `authStore` subscribes to `onAuthStateChange`; `ProtectedRoute` reads `authStore` and redirects to `/login` when unauthenticated.
7. **POS receipt ID**: `RCPT-YYYYMMDD-XXXX` where XXXX is a zero-padded counter from the `settings` table (or in-memory counter in mock mode).
8. **Excel export**: `xlsx` library, same as GLSI. Used on Sales, Inventory, and Reports pages.
9. **Charts**: Recharts on Dashboard and Reports pages only.

---

## Implementation Plan

- [ ] 1. Scaffold the project directory and package.json.
     Create `/Users/macbookpro/Desktop/ProgrammoCeuticals/agro_shop/` as a Vite + React 18 project. Write `package.json` with exact pinned versions: react@18.2.0, react-dom@18.2.0, react-router-dom@6.8.1, zustand@4.4.1, @supabase/supabase-js@2.38.4, xlsx@0.18.5, recharts@2.10.1, vite@5.0.8, @vitejs/plugin-react@4.2.1. Write `vite.config.js`, `index.html`, `.env.example`.
     Files: `package.json`, `vite.config.js`, `index.html`, `.env.example`, `.gitignore`
     Verify: `npm install && npm run dev` starts without errors on localhost:5173.

- [ ] 2. Write the CSS design system — globals.css, sidebar.css, pos.css.
     `src/styles/globals.css` — copy every token, class, and pattern from GLSI's App.css verbatim: `:root` tokens, `.btn`/`.btn-accent`/`.btn-danger`/`.btn-ghost`/`.btn-ok`, `.card`, `.results-table`, `.flag-chip` variants, `.tab-bar`/`.tab-btn`, `.stat-grid`/`.stat-card`, `.search-input`, `.pagination`/`.pag-btn`, `.section-title`, `.progress-container`, `.drop-zone`, mobile breakpoints, print rules. All border-radius: 0. Font: system stack.
     `src/styles/sidebar.css` — `.app-shell` (flex row, full height), `.sidebar` (240px fixed left, brand bg, collapsible), `.sidebar-nav` items, `.sidebar-toggle` hamburger, `.page-content` (margin-left: 240px, margin-top: 52px nav height), `.sidebar.collapsed` (width: 0, overflow: hidden), mobile overlay sidebar.
     `src/styles/pos.css` — `.pos-layout` (flex row, 60/40 split), `.pos-products` (left 60%, overflow-y scroll, product grid), `.pos-cart` (right 40%, sticky, flex col), `.product-card` (white card, hover highlight), `.cart-item`, `.cart-totals`, `.receipt-modal`.
     Files: `src/styles/globals.css`, `src/styles/sidebar.css`, `src/styles/pos.css`
     Verify: Import all three in `src/main.jsx`; `npm run build` has zero CSS errors.

- [ ] 3. Write the Supabase client and mock data module.
     `src/lib/supabase.js` — creates Supabase client from `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`. Exports `supabase` client and `useMock` boolean (true when either env var is missing or equals the placeholder string `"your-supabase-url"`).
     `src/lib/mock.js` — exports static arrays: `mockProducts` (25 products: 10 vet drugs, 8 agro chemicals, 4 equipment, 3 consumables), `mockSuppliers` (4), `mockCustomers` (5), `mockSales` (15 historical), `mockSaleItems`, `mockPurchases` (8), `mockExpenses` (10), `mockSettings`. Each product has all required fields: name, category, sub_category, sku (AUTO-generated e.g. VD-001), unit, pack_size, quantity, reorder_level, cost_price, selling_price, supplier_id, batch_number, expiry_date, notes.
     Files: `src/lib/supabase.js`, `src/lib/mock.js`
     Verify: `npm run build` — no import errors; `console.log(useMock)` returns true without .env.

- [ ] 4. Write the Zustand stores.
     `src/store/authStore.js` — state: `{ user, session, role, loading }`. Actions: `initialize()` (calls `supabase.auth.getSession()`, subscribes to `onAuthStateChange`, fetches role from `profiles` table — falls back to `{ role: "admin", full_name: "Demo User" }` in mock mode), `login(email, password)`, `logout()`. Role values: `"admin"`, `"manager"`, `"cashier"`.
     `src/store/posStore.js` — state: `{ items[], customer, paymentMethod, discount, discountType }`. Actions: `addItem(product)`, `removeItem(id)`, `updateQty(id, qty)`, `setOverridePrice(id, price)`, `setDiscount(value, type)`, `setCustomer(name)`, `setPaymentMethod(method)`, `clearCart()`, `getSubtotal()`, `getDiscountAmount()`, `getTotal()`.
     Files: `src/store/authStore.js`, `src/store/posStore.js`
     Verify: `npm run build` — no errors.

- [ ] 5. Write layout components: AppShell, Navbar, Sidebar, ProtectedRoute.
     `src/components/layout/ProtectedRoute.jsx` — reads authStore; if loading shows spinner; if no user redirects to `/login`; optionally checks `allowedRoles` prop.
     `src/components/layout/Navbar.jsx` — fixed top bar, brand title "AgroVet POS", hamburger button on mobile (toggles sidebar), user info + logout button on right. Uses `.nav`, `.nav-container`, `.nav-brand`, `.nav-title` classes from globals.css.
     `src/components/layout/Sidebar.jsx` — collapsible left sidebar. Nav items with inline SVG icons (no icon library): Dashboard, Inventory, POS, Sales, Purchasing, Suppliers, Customers, Expenses, Reports, Settings. Uses NavLink from react-router-dom with `.active` class. Collapsed state stored in localStorage. On mobile (< 768px) collapses to hamburger overlay. Uses classes from sidebar.css.
     `src/components/layout/AppShell.jsx` — wraps `<Navbar>` + `<Sidebar>` + `<main className="page-content">`. Manages sidebar open/collapsed state, passes toggle handler to Navbar.
     Files: `src/components/layout/ProtectedRoute.jsx`, `src/components/layout/Navbar.jsx`, `src/components/layout/Sidebar.jsx`, `src/components/layout/AppShell.jsx`
     Verify: `npm run dev` — shell renders, sidebar collapses, nav links highlight.

- [ ] 6. Write UI primitives: StatCard, Modal, Badge, Pagination, EmptyState.
     `src/components/ui/StatCard.jsx` — props: `value`, `label`, `variant` (default/danger/warn/ok). Uses `.stat-card`, `.stat-val`, `.stat-lbl` classes. Sharp corners.
     `src/components/ui/Modal.jsx` — props: `open`, `onClose`, `title`, `children`, `size` (sm/md/lg). Fixed overlay with brand-header panel. Close on backdrop click and Escape key.
     `src/components/ui/Badge.jsx` — props: `variant` (ok/danger/warn/info), `children`. Inline chip, 10px font, sharp corners. Maps to `.flag-chip` class variants.
     `src/components/ui/Pagination.jsx` — props: `page`, `totalPages`, `onChange`. Uses `.pagination`, `.pag-btn` classes from globals.css.
     `src/components/ui/EmptyState.jsx` — props: `icon`, `title`, `message`, `action`. Centered placeholder for empty tables/lists.
     Files: `src/components/ui/StatCard.jsx`, `src/components/ui/Modal.jsx`, `src/components/ui/Badge.jsx`, `src/components/ui/Pagination.jsx`, `src/components/ui/EmptyState.jsx`
     Verify: `npm run build` — zero errors.

- [ ] 7. Write POS components: ProductSearch, Cart, Receipt.
     `src/components/pos/ProductSearch.jsx` — search input + category filter tabs (All / Vet Drug / Agro Chemical / Equipment / Consumable). Product grid of `.product-card` tiles showing name, SKU, selling price, stock badge. Click adds to cart via posStore. Low-stock warning (quantity <= reorder_level) shown as warn badge. Uses mock data or Supabase fetch.
     `src/components/pos/Cart.jsx` — cart panel (right 40%). Lists cart items with qty +/- buttons, remove button, override price input (shown only if role is admin/manager). Discount row (% or flat N, toggle). Customer name input. Payment method selector (Cash/Transfer/Credit). Subtotal / Discount / Total rows. "Complete Sale" button triggers sale creation and opens receipt modal.
     `src/components/pos/Receipt.jsx` — modal receipt. Header: "AgroVet POS", receipt ID (RCPT-YYYYMMDD-XXXX), date, cashier name. Items table. Totals. Payment method + change (if Cash). Customer name. Print button calls `window.print()`. `.receipt-modal` class has print-specific CSS (hides everything except modal content).
     Files: `src/components/pos/ProductSearch.jsx`, `src/components/pos/Cart.jsx`, `src/components/pos/Receipt.jsx`
     Verify: `npm run dev` — POS page shows split layout, add product to cart, complete sale shows receipt.

- [ ] 8. Write the Login page.
     `src/pages/Login.jsx` — mirrors GLSI Login.js exactly: centered white card, brand logo (plant emoji), uppercase title "AgroVet POS", subtitle "Veterinary & Agro Chemical Point of Sale". Email + Password fields with uppercase labels, 11px font. Error message block. Submit calls `authStore.login()`. In mock mode, accepts any credentials and sets demo user (role: admin). Redirects to `/dashboard` on success.
     Files: `src/pages/Login.jsx`
     Verify: `npm run dev` — login works with any credentials in mock mode; redirects to dashboard.

- [ ] 9. Write Dashboard page.
     `src/pages/Dashboard.jsx` — stat grid: Today's Sales (N), Total Products, Low Stock Items, Pending Purchases. Two Recharts charts: BarChart of sales last 7 days, PieChart of sales by category. Recent Sales table (last 10, columns: Receipt ID, Customer, Amount, Payment, Cashier, Time). Low Stock Alert table (products where quantity <= reorder_level). Uses mock data or Supabase.
     Files: `src/pages/Dashboard.jsx`
     Verify: `npm run dev` — dashboard loads with stat cards and charts from mock data.

- [ ] 10. Write Inventory page.
      Full product CRUD. Table columns: SKU, Name, Category, Unit, Pack Size, Qty, Reorder Level, Cost N, Price N, Supplier, Expiry, Actions. Tab bar: All | Low Stock | Expiring Soon (<=90 days). Search input. Add/Edit product modal (all fields: name, category select, sub_category, SKU with auto-generate button, unit select, pack_size, quantity, reorder_level, cost_price, selling_price, supplier_id, batch_number, expiry_date, notes). Delete with confirm. Stock adjustment modal (add/remove stock with reason — creates stock_movement record). Export to Excel via xlsx. Admin/Manager can add/edit/delete; Cashier sees read-only table.
      Files: `src/pages/Inventory.jsx`
      Verify: `npm run dev` — table loads from mock, add modal opens and validates, export downloads xlsx.

- [ ] 11. Write POS page.
      `src/pages/POS.jsx` — renders `<ProductSearch>` (60%) + `<Cart>` (40%) side by side inside `.pos-layout`. Loads products from mock/Supabase. On "Complete Sale": if not mock — inserts into `sales` + `sale_items` tables, updates `products.quantity`, creates `stock_movement` record; in mock mode — updates in-memory arrays and increments receipt counter. Then opens `<Receipt>` modal. Accessible to Admin, Manager, Cashier.
      Files: `src/pages/POS.jsx`
      Verify: `npm run dev` — full POS flow works in mock mode end-to-end.

- [ ] 12. Write Sales page.
      Table of sales: Receipt ID, Date, Customer, Items, Total, Payment, Cashier, Status. Search + date range filter + payment method filter. Click row to expand sale_items detail. Export to Excel. Admin/Manager see all sales; Cashier sees own sales only (filtered by user_id). Void sale button (admin only) — sets status to 'voided'.
      Files: `src/pages/Sales.jsx`
      Verify: `npm run dev` — mock sales load, row expands to show items.

- [ ] 13. Write Purchasing page.
      Purchase orders CRUD. Table: PO number, Supplier, Date, Items, Total, Status (Draft/Ordered/Received/Cancelled). Add PO modal: select supplier, add line items (product, qty, cost). Receive PO button — updates product quantities, creates stock_movement records. Admin/Manager only.
      Files: `src/pages/Purchasing.jsx`
      Verify: `npm run dev` — mock purchases load, add PO modal works.

- [ ] 14. Write Suppliers page.
      Table: Name, Contact, Phone, Email, Address, Products Supplied count, Actions. Add/Edit/Delete supplier modal. Admin/Manager only.
      Files: `src/pages/Suppliers.jsx`
      Verify: `npm run dev` — mock suppliers load, CRUD modal works.

- [ ] 15. Write Customers page.
      Table: Name, Phone, Email, Total Purchases, Outstanding Credit, Last Purchase date, Actions. Add/Edit/Delete customer modal. Record payment modal (credit settlement — creates customer_payment record). Admin/Manager only.
      Files: `src/pages/Customers.jsx`
      Verify: `npm run dev` — mock customers load, payment modal opens.

- [ ] 16. Write Expenses page.
      Table: Date, Category (Rent/Salaries/Utilities/Repairs/Other), Description, Amount, Recorded By. Add/Edit/Delete expense modal. Monthly summary stat cards. Admin/Manager only.
      Files: `src/pages/Expenses.jsx`
      Verify: `npm run dev` — mock expenses load, add modal works.

- [ ] 17. Write Reports page.
      Tab bar: Sales Summary | Inventory | Profit & Loss. Sales Summary: date range picker, total sales, total items, best-selling products table, sales by category bar chart. Inventory: stock value report table (cost_price x quantity per product, total). P&L: total revenue vs total expenses, gross profit, net profit. Export each report to Excel. Admin/Manager only.
      Files: `src/pages/Reports.jsx`
      Verify: `npm run dev` — all three report tabs render with mock data.

- [ ] 18. Write Settings page.
      Tabs: General | Users | System. General: shop name, address, phone, currency symbol, receipt footer text (reads/writes settings table). Users tab (admin only): table of profiles with role column, Edit Role modal (change between admin/manager/cashier). System: clear local data button (mock mode only). Admin only.
      Files: `src/pages/Settings.jsx`
      Verify: `npm run dev` — settings tabs render, admin sees Users tab, manager does not.

- [ ] 19. Write the database schema SQL and seed data SQL.
      `supabase/schema.sql` — CREATE TABLE statements for: profiles, products, stock_movements, suppliers, customers, sales, sale_items, purchases, purchase_items, customer_payments, expenses, settings. Enable RLS with basic policies. Full column specs per design decisions section above.
      `supabase/seed.sql` — INSERT statements: 4 suppliers (AgriChem Ltd, VetPharm Distributors, FarmEquip Co, AgroInputs Nigeria), 5 customers, 25 products across all categories with realistic Nigerian vet/agro data, 10 expenses, 8 purchases, 15 sales with items, default settings.
      Files: `supabase/schema.sql`, `supabase/seed.sql`
      Verify: Both files are valid SQL. Can be applied to a fresh Supabase project.

- [ ] 20. Write App.jsx routing, main.jsx, and README.md.
      `src/main.jsx` — imports React, ReactDOM, BrowserRouter, all three CSS files, App. Mounts to `#root`.
      `src/App.jsx` — Routes tree: `/login` -> Login, all others wrapped in ProtectedRoute + AppShell: `/dashboard`, `/inventory`, `/pos`, `/sales`, `/purchasing`, `/suppliers`, `/customers`, `/expenses`, `/reports`, `/settings`. Role-based protection. Default redirect "/" -> "/dashboard". Call `authStore.initialize()` on mount.
      `README.md` — project overview, stack, setup instructions (npm install, cp .env.example .env, add Supabase keys or leave placeholder for mock mode, npm run dev), mock mode explanation, user roles table, module list.
      Files: `src/App.jsx`, `src/main.jsx`, `README.md`
      Verify: `npm run dev` — full app loads, all routes navigate correctly, mock mode works without .env keys.

---

## Key Design Rules

**Tokens** (copied from GLSI App.css verbatim):

- `--brand:#193441`, `--brand-mid:#2a5068`, `--brand-light:#e8f0f4`
- `--accent:#c17f24`, `--danger:#c53030`, `--warn:#d97706`, `--ok:#276749`
- `--text:#1a202c`, `--muted:#718096`, `--border:#e2e8f0`, `--bg:#f7f8fa`

**Shape**: `border-radius: 0` everywhere — no rounded corners, none.

**Typography**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto` — no Google Fonts.

**Tables**: `.results-table` with `--brand` header, white text, 11px font in th, 12px in td, hover row `#f0f4f7`.

**Buttons**: Use `.btn`, `.btn-accent`, `.btn-danger`, `.btn-ghost`, `.btn-ok` from globals.css. No inline button styling except in Layout.

**Stat cards**: `.stat-card` with `.stat-val` (22px, 800 weight, brand color) and `.stat-lbl` (10px, uppercase, muted). Variants: `.danger`, `.warn`, `.ok`.

**Tabs**: `.tab-bar` + `.tab-btn` + `.tab-btn.active` — uppercase 11px, brand bottom border on active.

**Section titles**: `.section-title` class — uppercase 11px, 700 weight, brand color, brand bottom border.

**Nav**: Fixed top, `.nav` with `--brand` bg. Height 52px. Left: brand title. Right: user info + logout.

**Sidebar**: Fixed left, 240px wide, `--brand` bg. Collapses on mobile. Items: 0.9rem text, semi-transparent on hover, white on active.

**Currency**: All money values formatted as `N X,XXX.XX` (Naira symbol).

**Mock mode**: When `useMock === true`, all data hooks return mock arrays; write operations update in-memory state only and succeed silently; auth accepts any credentials as admin.
