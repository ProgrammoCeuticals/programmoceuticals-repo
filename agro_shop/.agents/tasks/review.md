# AgroVet POS — FEAT-002 / FEAT-003 / FEAT-004 Implementation

This change delivers the full working POS application: login through receipt, every management page, the Supabase schema, seed data, and README. The implementation leans on a clean mock layer — a shared in-memory module (`src/lib/mock.js`) that all pages mutate directly, with a `useMock` flag in `supabase.js` controlling whether the app uses Supabase or that in-memory data. The design follows the GLSI sharp-corner system faithfully. Two prior review passes fixed six findings (payment method toggle, schema constraints, expense categories, cashier name, stock movements, border-radius on tab counts) and the build artifacts in `dist/assets/` confirm a passing `npm run build`.

Watch for: **missing `sku` field on historical `mockSaleItems`** (renders as "—" in the Sales detail rows, not a crash but a data gap); **`mockSaleItems` item totals don't sum to `mockSales.total` for sales 007, 008, 010, 014** (confirmed discrepancies); **`sale_items.subtotal` column name in schema vs. `total` used by the app** (confirmed field name mismatch — migration will fail silently on item totals); **`product_update_admin_manager` RLS policy allows cashiers to update product quantity at sale time, or conversely the app can't do it without bypassing RLS** (architectural gap when going live); **Settings page saves to a local copy of `mockSettings`, not the exported `mockSettings` object** — receipt footer changes in Settings won't appear on new receipts until a page reload.

**Verdict**: NEEDS_CHANGES

---

## High-level view

The POS flow is fully wired end-to-end: `posStore` accumulates the cart, `POS.jsx` calls `handleCompleteSale` on checkout, which mutates `mockSales`, `mockSaleItems`, `mockStockMovements`, and `mockProducts` in place, then opens the `Receipt` modal. Stock is capped at available quantity on both `addItem` and `updateQty`, so the cart cannot oversell. Role gates are layered at both the router level (`ProtectedRoute` with `allowedRoles`) and inside individual pages (Purchasing and Reports render an "Access Denied" card for cashiers, Inventory hides edit buttons).

All CRUD pages — Inventory, Suppliers, Customers, Expenses, Purchasing — carry real form fields, inline validation, and in-memory write-back to both local React state and the shared mock arrays, so changes persist across page navigations within the same session. The design system is applied correctly throughout: `.btn`, `.btn-accent`, `.btn-danger`, `.results-table`, `.stat-card`, `.tab-btn`, `.search-input`, `.pag-btn`, `.section-title` all appear on their expected elements, and no `border-radius` is introduced in the agro_shop CSS or JSX.

Dashboard and Reports charts use Recharts `BarChart` over computed mock data — sales totals aggregated by day, by payment method, and by product — not hardcoded values. The P&L tab in Reports calculates COGS by joining `mockSaleItems` against `mockProducts.cost_price`, making it sensitive to the item-total discrepancies noted below.

The SQL schema covers all 12 tables with correct FK references, `CHECK` constraints on enums, and RLS policies on every table. The seed data mirrors the mock layer exactly, making the mock-to-live transition straightforward. The gap is a field name inconsistency: the app writes `total` on sale items, but the schema column is `subtotal`.

The Settings page has a scoping issue: it copies `mockSettings` into a local `mockSettingsState` object at module load, saves back to that copy, but the `Receipt` component imports `mockSettings` directly from `mock.js`. A settings save in the current session will not be reflected on new receipts until reload.

---

<details>
<summary>Issues (6)</summary>

1. **Missing `sku` on historical `mockSaleItems`** — The 15 pre-seeded sale items have no `sku` field. Sales.jsx expanded rows display `i.sku || "—"`, so every historical sale shows "—" in the SKU column. Newly created sales (from POS) will have a `sku` field because `POS.jsx` copies it from the cart item. Add `sku` to each entry in `mockSaleItems` to match the product catalog.

2. **`mockSaleItems` totals don't match `mockSales.total` for several sales** — Confirmed discrepancies: `sale-007` items sum to ₦5,300 but `total` is ₦4,500; `sale-008` items sum to ₦10,600 but `total` is ₦9,900 (minus a ₦100 discount = ₦9,800, still off); `sale-010` items sum to ₦6,075 but `total` is ₦6,300; `sale-014` item is for ₦6,250 (0.5 × ₦12,500) but `total` is ₦5,500. These affect the P&L COGS calculation and the Revenue figure in Reports. Reconcile the item totals against the sale totals and discount fields.

3. **`sale_items.subtotal` vs. app `total` field mismatch** — The schema defines `sale_items.subtotal numeric(12,2)` but `POS.jsx` writes `{ total: price * i.qty }` when building `saleItems`. When the app is wired to Supabase, the insert will likely fail or silently null the column. Rename the schema column to `total` or update `POS.jsx` to write `subtotal`.

4. **Settings save does not update the live `mockSettings` export** — `Settings.jsx` copies `mockSettings` to a module-local `mockSettingsState` and updates that copy on save. `Receipt.jsx` imports `mockSettings` directly from `mock.js`. A shop name or footer change in the Settings form during a session will not appear on subsequent receipts. Write back to the exported `mockSettings` object directly, or have `Receipt` read from the same writable ref.

5. **RLS gap: product quantity updates at sale time require admin/manager** — `products_update_admin_manager` restricts UPDATE to admin and manager roles. In live Supabase mode, completing a sale (which must decrement `products.quantity`) from a cashier session will be blocked. Either add a Postgres function/trigger to handle stock decrements server-side, or add a separate `products_update_cashier_qty` policy scoped to the `quantity` column.

6. **Fractional quantities on historical sale items** — `mockSaleItems` contains `quantity: 0.5` entries (si-007-2, si-008-3, si-010-3, si-014-1). The cart enforces integer quantities (the `updateQty` handler only increments by 1 and the UI has no decimal input), so these values are not reachable through the POS. They will be misleading in Sales history and break Reports COGS (`prod.cost_price * 0.5` will produce half-unit cost entries). Replace with whole-unit quantities that match the stated sale totals.

</details>

---

<details>
<summary>Details</summary>

## POS flow end-to-end

The payment method selector in `Cart` renders all four options (Cash, Transfer, Credit, POS) as inline toggle buttons — the prior finding about a missing POS option has been resolved. Stock is capped at available quantity on both `addItem` and `updateQty`, so the cart cannot oversell.

## `mockSaleItems` data integrity gaps

The 15 pre-seeded items in `mockSaleItems` are missing the `sku` field that `Sales.jsx` reads (`i.sku || "—"`). This is cosmetic for the table display but will cause the SKU column to always show "—" on historical records, which is misleading in a pharmaceutical context where SKU traceability matters.

More seriously, four sales have item totals that don't reconcile with the sale's `total` field:

- `sale-007`: items (₦4,400 + ₦900) = ₦5,300 vs. sale total ₦4,500
- `sale-008`: items (₦5,500 + ₦3,600 + ₦1,500) = ₦10,600 vs. sale total ₦9,900 (discount ₦100 → net ₦9,800, still ₦800 off)
- `sale-010`: items (₦2,900 + ₦2,700 + ₦475) = ₦6,075 vs. sale total ₦6,300
- `sale-014`: item ₦6,250 (0.5 × ₦12,500) vs. sale total ₦5,500

The P&L COGS calculation in `Reports.jsx` sums `prod.cost_price * item.quantity` across these items, so the gross profit figure for any date range that includes January–March 2024 will be incorrect.

The fractional quantities (0.5) on several line items are inconsistent with the POS's integer-only cart. They appear designed to fudge totals but introduce the discrepancies above and make the COGS calculation wrong.

## Schema field name mismatch: `sale_items.subtotal`

`POS.jsx` builds sale items as `{ product_name, sku, quantity, unit_price, total, product_id }` and pushes them to `mockSaleItems`. The Supabase schema defines the column as `subtotal`. When the live path is wired, the insert will either fail with a column-not-found error or silently drop the value depending on whether strict mode is enabled. The fix is a one-line rename in either the schema or `POS.jsx`.

## Settings save scope

`Settings.jsx` initialises `mockSettingsState` as `{ ...mockSettings }` at module load — a shallow copy. `handleSaveSettings` writes back to `mockSettingsState`, not to the `mockSettings` export from `mock.js`. `Receipt.jsx` imports `mockSettings` directly. Changes to shop name, address, phone, or receipt footer made through the Settings UI will not appear on receipts printed in the same session. Since all mock data is module-level mutable, the fix is to call `Object.assign(mockSettings, settings)` instead of `Object.assign(mockSettingsState, settings)`.

## RLS policy gap for cashier sale completion

The `products_update_admin_manager` policy blocks any UPDATE on the `products` table for cashiers. In live Supabase mode, completing a sale from a cashier login requires decrementing `quantity` — that UPDATE will be rejected. The mock layer never hits this because it mutates the in-memory array directly. Before going live, add either a server-side trigger that handles the decrement on sale insert, or a targeted RLS policy that permits cashiers to update `quantity` only.

## Seed/mock category divergence for expenses

The seed's expenses INSERT uses `('Utilities', ...)` for both electricity and water rows, but the mock data (and the schema's CHECK constraint) include `'Electricity'` and `'Water'` as distinct category values. The seed drops that granularity. Any report or filter that groups by those categories will behave differently against a seeded Supabase database versus the in-memory mock. Not a blocking issue, but the seed should match the mock layer.

## Test coverage

There are no automated tests. The mock layer functions as an integration harness — navigating between pages in the browser exercises the full mutation path — but nothing is verified programmatically. For a production POS, the COGS calculation, discount math, and stock deduction logic are the highest-risk untested paths.

</details>

---

<details>
<summary>File map</summary>

| File                                   | What changed                                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/Login.jsx`                  | Login form with mock bypass, useMock flag wired                                                                               |
| `src/pages/Dashboard.jsx`              | KPI stat cards, 7-day sales chart, payment method chart, recent sales table, low stock alert                                  |
| `src/pages/POS.jsx`                    | Sale completion logic — receipt ID gen, mock mutations, stock deduction, stock movement recording                             |
| `src/components/pos/ProductSearch.jsx` | Category tabs, text search, product card grid                                                                                 |
| `src/components/pos/Cart.jsx`          | Cart body, payment method toggle (all 4 methods), discount, cash tendered, complete sale                                      |
| `src/components/pos/Receipt.jsx`       | Receipt modal with shop settings, item table, totals, print button                                                            |
| `src/pages/Inventory.jsx`              | Full CRUD modal, stock adjust modal, export Excel, tab filters, pagination                                                    |
| `src/pages/Sales.jsx`                  | Sales history, expandable row detail, void sale modal, stats, export                                                          |
| `src/pages/Purchasing.jsx`             | PO list, new PO modal with line items, view modal, receive PO (updates stock + movements)                                     |
| `src/pages/Suppliers.jsx`              | Supplier CRUD modal, search                                                                                                   |
| `src/pages/Customers.jsx`              | Customer CRUD modal, debt guard on delete, record payment modal                                                               |
| `src/pages/Expenses.jsx`               | Expense CRUD modal, category tab filter, monthly stat cards, export                                                           |
| `src/pages/Reports.jsx`                | Three tabs: Sales Summary (date range, chart, top 5), Inventory (value table), P&L (COGS + expenses)                          |
| `src/pages/Settings.jsx`               | General settings form, admin-only Users tab with role edit modal                                                              |
| `src/lib/mock.js`                      | All seed data: 4 suppliers, 5 customers, 25 products, 15 sales, 15+ sale items, 8 POs, 10 expenses, settings, stock movements |
| `src/lib/supabase.js`                  | useMock flag derivation, conditional Supabase client                                                                          |
| `src/store/authStore.js`               | Zustand auth store with mock and Supabase paths                                                                               |
| `src/store/posStore.js`                | Cart state, addItem (with stock cap), updateQty, discount, clearCart                                                          |
| `src/App.jsx`                          | All routes with ProtectedRoute role gates, lazy loading                                                                       |
| `src/styles/globals.css`               | Full GLSI design system — buttons, tables, tabs, stat cards, search inputs, pagination                                        |
| `src/styles/pos.css`                   | POS split-screen layout, product grid, cart item styles, receipt modal                                                        |
| `supabase/schema.sql`                  | 12-table schema with FK constraints, CHECK enums, RLS policies                                                                |
| `supabase/seed.sql`                    | Seed data matching mock layer; auth user creation instructions                                                                |
| `README.md`                            | Setup, mock mode docs, role table, module descriptions, Supabase setup steps                                                  |

[Full diff: `git diff main -- 'agro_shop/src/**' 'agro_shop/supabase/**' 'agro_shop/README.md'`]

</details>
