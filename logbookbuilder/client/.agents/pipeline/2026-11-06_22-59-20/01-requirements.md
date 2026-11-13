# Requirements — LogbookBuilder UI Redesign (GLSI-Inspired Regulatory Grade)

**Document type:** Feature requirements  
**Scope:** `/logbookbuilder/client/src/` only — no server files, no API changes  
**Baseline:** Fully functional application with working toast, debounce, inline record create, change-password, personnel linking, export, and audit filters  

---

## Summary

Perform a complete visual overhaul of the LogbookBuilder client UI, replacing the current left-sidebar layout and card-heavy design with a professional, dense, regulatory-grade interface modelled on the GLSI application. The guiding principle is: information density first, zero decorative chrome. Every visual decision must reinforce trust in a GxP environment — clean navy authority, sharp edges, tabular data presentation, and a top horizontal nav replacing the sidebar entirely. No API calls, TypeScript types, routing, business logic, toast system, or debounce hooks may be changed. All pages listed must be updated; the compiler must emit zero TypeScript errors after the work is complete.

---

## Functional Requirements

### FR-1 Design System (index.css)

**FR-1.1** Replace the CSS variable set in `:root` with the canonical palette:
```
--brand: #193441   --brand-mid: #2a5068   --brand-light: #e8f0f4
--accent: #0b5ed7  --danger: #c53030      --warn: #d97706
--ok: #166534      --text: #1a202c        --muted: #718096
--border: #e2e8f0  --bg: #f7f8fa
```
The token `--navy` must be aliased to `--brand` (`#193441`) — not the old `#120e73` value currently in the legacy `:root` block.

**FR-1.2** All existing `pc-*` prefixed classes (e.g. `pc-btn`, `pc-badge`, `pc-input`, `pc-page`, `pc-card`, `pc-table`, `pc-pagination`, etc.) must remain, but their visual values must be updated to the new palette and geometry (border-radius 0 on cards/inputs, 2px max on buttons).

**FR-1.3** All unprefixed legacy alias classes (`btn`, `btn-primary`, `badge`, `inp`, `card`, `drt-table`, `alert`, etc.) used in `LogDetailPage.tsx`, `RelationshipsPage.tsx`, and `RecordEntryForm.tsx` must remain and be visually harmonized with the new system.

**FR-1.4** The following new utility classes must be added:

| Class | Description |
|---|---|
| `.nav` | Fixed top bar, `background: #193441`, `z-index: 1000` |
| `.nav-container` | Flex row, justify-content: space-between |
| `.nav-brand` | Left group: icon + wordmark |
| `.nav-links` | Center group: nav link list |
| `.nav-link` | Individual nav link — white text, hover highlight |
| `.nav-link.active` | Bold white, subtle navy-lighter background |
| `.nav-right` | Right group: user email chip + logout button |
| `.main-content` | Full-width main area below nav, `margin-top: 52px`, `background: var(--bg)` |
| `.section-title` | 11px uppercase bold, navy text, 2px bottom border, navy color |
| `.stat-grid` | Responsive grid, `minmax(140px, 1fr)`, 0.75rem gap |
| `.stat-card` | Flat white card, 1px border, no shadow, left-border accent |
| `.stat-card .stat-val` | 22px bold, brand color |
| `.stat-card .stat-lbl` | 10px uppercase muted |
| `.results-table` | 12px, full-width, border-collapse |
| `.results-table th` | `background: #193441`, white text, 11px bold uppercase |
| `.results-table td` | Light border-bottom, 0.5rem padding |
| `.flag-chip` | 10px bold, border-radius 2px, inline status chip |
| `.detail-panel` | Inline expansion panel inside a `<tr>` |
| `.detail-panel-header` | Navy background bar with record number + close button |
| `.tab-bar` | Flex row, 2px border-bottom |
| `.tab-btn` | Uppercase 11px, underline active style with accent color |
| `.tab-btn.active` | Accent underline (3px solid `--accent`) |
| `.drop-zone` | Dashed border, centered upload area |
| `.pag-btn` | Square pagination button, 11px |
| `.pag-btn.active` | Navy background, white text |
| `.search-input` | Square input, 12px, focus border accent |
| `.wordmark` | Two-tone brand wordmark: primary span white, secondary span `rgba(255,255,255,0.55)` |

**FR-1.5** Column type left-border helpers (`lb-col-text`, `lb-col-signature`, etc.) must be preserved unchanged.

**FR-1.6** Global geometry: `border-radius: 0` on `.card`, `.inp`, `.pc-card`, `.pc-input`; `border-radius: 2px` max on `.btn` and badge variants. No `border-radius: 8px`, `10px`, or `12px` anywhere in the new system.

**FR-1.7** Typography: body base 13px Inter. Tables 12px. Labels/meta 11px. Page titles uppercase, letter-spacing 0.04em.

**FR-1.8** Mobile breakpoint at 768px: nav links collapse to a hamburger menu (slide-in panel from right). Stat grid collapses to 2 columns. Table cells tighten padding. All interactive elements meet 42px minimum touch target.

**FR-1.9** Print media query: hide nav and all buttons.

---

### FR-2 Navigation Shell (AppShell.tsx)

**FR-2.1** Remove the entire `<aside className="sidebar">` element and all sidebar CSS classes from AppShell.

**FR-2.2** Replace with a `<nav className="nav">` fixed top bar containing:
- **Left** (`nav-brand`): `<BookOpen>` icon (gradient background 28×28px square, border-radius 3px) + two-tone `<span className="wordmark">` with `Logbook` in white and `Builder` in `rgba(255,255,255,0.55)`, separated by a vertical rule
- **Center** (`nav-links`): `<NavLink>` elements for Dashboard, Logs, Relationships, Personnel, Users, Audit Trail. Active link uses `.nav-link.active`. No section labels. Nav links are in a flat horizontal list.
- **Right** (`nav-right`): User email displayed in a small chip (truncated if long) + "Sign out" button styled as `.btn btn-ghost` (transparent border, white text)

**FR-2.3** The `<main>` area must use `className="main-content"` (not `main-area`), be full-width with no left offset, and have `background: var(--bg)`.

**FR-2.4** Org name / division info currently in the sidebar footer must be dropped (or moved to user chip tooltip — see assumptions).

**FR-2.5** Nav items: Dashboard (`/`), Logs (`/logs`), Relationships (`/relationships`), Personnel (`/personnel`), Users (`/users`), Audit Trail (`/audit`). No Templates or Divisions links (those pages exist but are not in the primary nav).

---

### FR-3 Auth Pages (LoginPage.tsx, RegisterPage.tsx)

**FR-3.1** Centered auth card, max-width 440px, on `background: var(--bg)`.

**FR-3.2** Card has a full-width navy header bar (`background: #193441`) containing the wordmark (icon + two-tone text), replacing the floating logo above the card.

**FR-3.3** Card body: white, 1px border, zero border-radius. Title is uppercase, 1rem, navy. Subtitle is 12px muted.

**FR-3.4** All inputs use the new `inp` / `pc-input` style: square, 12px, navy focus ring.

**FR-3.5** Primary action button spans full width, square, accent blue `#0b5ed7`.

**FR-3.6** Password toggle button preserved.

**FR-3.7** Footnote link to register/login preserved.

---

### FR-4 Dashboard (DashboardPage.tsx)

**FR-4.1** Stat grid uses `.stat-grid` / `.stat-card`. Each card has a colored left-border (4px). No icon box inside the card — stat value is the dominant element (22px bold). Labels are 10px uppercase muted.

**FR-4.2** Recent Logs panel: rendered as a `.results-table` (dense table) instead of stacked link cards. Columns: Name, Status, Columns, Created. Clicking a row navigates to the log's records.

**FR-4.3** Recent Activity panel: event list with monospace `flag-chip` for event type, event summary text, user name, and timestamp. No bullet dots — use a left-border accent line on rows.

**FR-4.4** Quick-action cards at the bottom are replaced by a `.section-title` + plain text links row (no decorative icon boxes).

**FR-4.5** Page header: `.page-title` uppercase + `.page-subtitle`. "New Log" button is accent blue, square.

---

### FR-5 Logs Page (LogsPage.tsx)

**FR-5.1** Replace the card grid layout with a `.results-table` (one log per row).

**FR-5.2** Columns: Name, Description (truncated), Status (flag-chip), Columns (#), Created. Last column is a settings icon linking to `/logs/:id`.

**FR-5.3** Status badges are `flag-chip` style (2px border-radius, small, square).

**FR-5.4** Clicking a row navigates to `/logs/:id/records`.

**FR-5.5** Search and status filter preserved and re-styled as `.search-input` + `.pc-input` select, displayed in a single filter bar above the table.

**FR-5.6** "New Log" button in page header: accent blue, square.

---

### FR-6 Log Detail Page (LogDetailPage.tsx)

**FR-6.1** Columns table uses `.results-table` with navy header row.

**FR-6.2** Section header "Columns" uses `.section-title` pattern.

**FR-6.3** Data type, behavior, and flag cells use `flag-chip` / small square badges.

**FR-6.4** Page header has uppercase title, View Records button (accent blue), Edit Log button (ghost/secondary), and status badge — all square.

**FR-6.5** Breadcrumb preserved, re-styled with muted text.

---

### FR-7 Records Page — CRITICAL (RecordsPage.tsx)

**FR-7.1** Records are displayed in a `.results-table`, not navigated on click to a separate page by default.

**FR-7.2** The component must manage state `expandedRecordId: string | null` (initial value `null`).

**FR-7.3** Clicking a table row toggles `expandedRecordId`:
- If the clicked record's ID equals `expandedRecordId`, set to `null` (collapse).
- Otherwise, set to the clicked record's ID (expand, collapsing any previously expanded row).

**FR-7.4** After each `<tr>` for a record, if `expandedRecordId === record.id`, render an additional `<tr className="detail-panel-row">` containing a `<td colSpan={totalColumnCount}>` that holds the inline detail panel.

**FR-7.5** The inline detail panel must:
- Fetch full record detail (`recordsApi.get(logId, record.id)`) and history (`recordsApi.history(logId, record.id)`) when `expandedRecordId` is first set to that record's ID. Show a loading indicator during fetch.
- Display a `.detail-panel-header` (navy background): record number (monospace, white) + status `flag-chip` + close `×` button (sets `expandedRecordId` to `null`).
- Panel body: two-column layout (left: field values in label/value grid; right: signatures section + action buttons Edit, Correct, Void).
- Below the two-column body: `.tab-bar` with tabs "Lineage" and "History". Tab content mirrors the existing `LineageView` and `HistoryView` logic from `RecordDetailPage.tsx`, adapted inline.
- Status banners (corrected/voided reason) appear inside the panel when applicable.

**FR-7.6** The row chevron column (`pc-col-chevron`) is replaced by a `▾`/`▸` toggle indicator reflecting expanded state.

**FR-7.7** The inline new-record form (controlled by `showForm`) is preserved and re-styled using `section-title` + square inputs.

**FR-7.8** Search, status filter, export buttons, and pagination are preserved.

**FR-7.9** `RecordDetailPage` at `/logs/:logId/records/:recordId` continues to exist as a deep-link full-page view. It is not removed.

---

### FR-8 Record Detail Page (RecordDetailPage.tsx)

**FR-8.1** Layout mirrors the inline panel from FR-7.5 but rendered full-page in a `pc-page` container.

**FR-8.2** Segment tabs replaced by `.tab-bar` / `.tab-btn` underline style.

**FR-8.3** Signatures panel uses `.section-title` + dense row layout (no rounded cards per signature).

**FR-8.4** History `<pre>` block preserved. Version chip and timestamps styled with monospace `flag-chip`.

**FR-8.5** Void modal: square modal card, navy header bar, no border-radius.

---

### FR-9 Record Entry Form (RecordEntryForm.tsx)

**FR-9.1** Field labels use `field-label` class: 11px uppercase, muted, letter-spacing.

**FR-9.2** All inputs (`inp` / `pc-input`) are square (border-radius 0).

**FR-9.3** Synchronized/calculated field placeholders: flat muted background, italic text, square border.

**FR-9.4** Linked record pickers: header uses `.section-title`. Table uses `.results-table`. Selected row highlight uses accent left-border instead of outline.

**FR-9.5** Correction reason textarea: square, dense label.

**FR-9.6** Submit/Cancel button row: right-aligned, square buttons.

---

### FR-10 Signature Modal (SignatureModal.tsx)

**FR-10.1** Modal backdrop preserved. Modal container: square (border-radius 0), max-width 520px.

**FR-10.2** Header bar: navy background (`#193441`), white text "Electronic Signature", close button. No gradient icon box in the header.

**FR-10.3** Canvas container: square border (border-radius 0), 2px border, changes color to accent on draw.

**FR-10.4** Intent statement block: square, navy-light background, left-border accent.

**FR-10.5** Password input: square `inp` style.

**FR-10.6** Footer: white background, 1px top border, right-aligned buttons, all square.

---

### FR-11 Relationships Page (RelationshipsPage.tsx)

**FR-11.1** Relationships listed as a `.results-table` (one relationship per row) instead of individual cards.

**FR-11.2** Columns: Name, Source Log, Type, Target Log, Mappings (#), Actions.

**FR-11.3** Source/target log names are rendered as `flag-chip` / small square badges (navy-light for source, brand-light for target).

**FR-11.4** Delete button per row (danger, square, icon only).

**FR-11.5** "New Relationship" form panel (`.form-panel`) is preserved with `.section-title` section headers and square inputs.

**FR-11.6** Page uses `.page` + `.page-header` pattern with `.section-title` for the form.

---

### FR-12 Audit Trail (AuditPage.tsx)

**FR-12.1** Events rendered as `.results-table` rows (not flex-column event items).

**FR-12.2** Columns: Timestamp, Event Type (monospace `flag-chip`), Summary, User, Entity.

**FR-12.3** Event type chip uses monospace font, 10px, square, light grey background.

**FR-12.4** Filters (event type select, user ID input) preserved and re-styled.

**FR-12.5** Pagination uses `.pag-btn` / `.pagination` classes.

---

### FR-13 Users Page (UsersPage.tsx)

**FR-13.1** Users displayed in `.results-table` (already table-based — update header styles to navy background).

**FR-13.2** Status badges: `flag-chip` style, 2px border-radius.

**FR-13.3** Add User form panel and Change Password form panel preserved; re-styled with `.section-title`, square inputs.

**FR-13.4** Change-password form panel border color uses `--warn` (#d97706) for visual differentiation.

---

### FR-14 Personnel Page (PersonnelPage.tsx)

**FR-14.1** Personnel displayed in `.results-table` with navy headers.

**FR-14.2** Active/Inactive and Linked badges: `flag-chip` style.

**FR-14.3** Add Personnel form and Link User form panels preserved; re-styled with `.section-title`, square inputs.

**FR-14.4** Link User panel border color uses `--brand-mid` (#2a5068) for visual differentiation.

---

### FR-15 Log Builder Page (LogBuilderPage.tsx)

**FR-15.1** Page header uses `.page-header` + `.page-title` pattern, uppercase.

**FR-15.2** Column cards use existing `lb-col-{type}` left-border classes (preserved unchanged from FR-1.5).

**FR-15.3** Column label/name/type section uses `.section-title` headers for each logical group (e.g., "Basic", "Behavior", "Validation").

**FR-15.4** Expand/collapse accordions for column settings preserved; chevron icons preserved.

**FR-15.5** All inputs square, using `inp` or `pc-input` class.

**FR-15.6** Save / Publish / Archive buttons use correct color semantics (accent blue, ok green, danger red).

---

## Non-Functional Requirements

**NFR-1 TypeScript:** `npx tsc --noEmit` must exit with code 0 after all changes. No new TypeScript errors may be introduced.

**NFR-2 No server changes:** No file outside `logbookbuilder/client/src/` may be modified.

**NFR-3 No API changes:** No changes to any file under `client/src/api/`. No changes to API call signatures, URLs, or data shapes.

**NFR-4 No routing changes:** All routes in `App.tsx` are preserved. `RecordDetailPage` at `/logs/:logId/records/:recordId` is not removed.

**NFR-5 Preserved functionality:** Toast notifications, debounce hooks, inline record create form, change-password, personnel linking, audit filters, export links (CSV/Excel/PDF), and all navigation continue to work after the redesign.

**NFR-6 Performance:** No new runtime dependencies introduced. CSS is plain (no CSS-in-JS, no new Tailwind plugins). Existing Tailwind import in `index.css` is preserved if it does not conflict.

**NFR-7 Accessibility:** All interactive elements retain `aria-label` where currently present. Focus ring is visible. Color is not the sole differentiator for status (text label always accompanies status color).

**NFR-8 Consistency:** Inline styles (`style={{ … }}`) in components should be minimized. Class names from the design system should be used where a class exists. Inline styles are acceptable for one-off geometric overrides (e.g., `colSpan`) or values driven by runtime data.

---

## Acceptance Criteria

1. After the redesign, running `npx tsc --noEmit` in `/logbookbuilder/client/` exits with code 0.
2. The left sidebar is absent from every authenticated page. A horizontal sticky top nav replaces it on all authenticated pages.
3. The top nav bar has a dark navy (`#193441`) background, the two-tone "LogbookBuilder" wordmark on the left, nav links in the center, and user email + logout on the right.
4. No card, input, modal, or panel uses `border-radius` greater than 2px anywhere in the redesigned pages.
5. All `.results-table` (and `pc-table`) table headers have `background: #193441` and white text.
6. Clicking a row in RecordsPage expands an inline detail panel within the same table (no navigation occurs). Clicking the same row again (or the panel's close button) collapses the panel.
7. The inline detail panel on RecordsPage fetches and displays full field values, signatures, Edit/Correct/Void action buttons, and a Lineage + History tab bar.
8. RecordDetailPage (`/logs/:logId/records/:recordId`) remains navigable via direct URL and renders a full-page version of the record detail layout.
9. Stat cards on the Dashboard use the flat left-border accent style (no shadow, no icon box) with a large bold number and a 10px uppercase label.
10. Recent Logs on the Dashboard is a dense table, not a card grid.
11. Logs Page displays logs in a `.results-table`, not a card grid.
12. All badge/status indicators use the `flag-chip` style (2px border-radius, dense padding, colored text on tinted background).
13. The Signature Modal has a navy header bar and a square canvas border; no rounded corners on any element.
14. The auth pages (Login, Register) have a navy header bar inside the card and no rounded corners.
15. The Audit Trail page shows events as dense table rows, with event type in a monospace chip column.
16. The `.section-title` pattern (11px uppercase, 2px navy bottom border) appears as section headers in the detail panel, forms, and builder page.
17. Existing functionality — toast notifications, debounce search, inline record creation, change-password, personnel linking, export buttons, filter selects — works identically after the redesign.
18. No file outside `logbookbuilder/client/src/` is modified.
19. Mobile viewport (≤768px): the top nav collapses to a hamburger toggle; stat grids collapse to 2 columns; tables remain scrollable horizontally.
20. The wordmark reads "Logbook" in white and "Builder" in `rgba(255,255,255,0.55)` in the nav bar; in auth pages the same two-tone treatment is applied.

---

## Out of Scope

- Changes to any server-side file (API, database, middleware, routes)
- Changes to any file in `client/src/api/`
- Changes to TypeScript types in `client/src/types/`
- Changes to routing structure in `App.tsx` beyond class/style updates
- Adding any new npm dependencies
- Adding Tailwind utility classes not already present in the project
- Redesigning the `DivisionsPage.tsx`, `TemplatesPage.tsx`, `TemplateDetailPage.tsx`, or `RecordsIndexPage.tsx` (these pages are secondary and not in the primary nav)
- WCAG full audit (visual compliance is targeted but full accessibility testing with assistive technologies is out of scope)
- Dark mode
- Animations beyond existing CSS transitions

---

## Assumptions

> These were inferred from the request and the codebase. The design review should flag any that do not hold.

**A1** — The `--navy` CSS token is remapped to `#193441` (matching `--brand`). The old value `#120e73` in the legacy `:root` block is replaced. Pages that reference `var(--navy)` will adopt the new brand navy automatically.

**A2** — The org name / division label currently shown in the sidebar footer is dropped. The user chip in the top nav right shows only the user's email (truncated). Org name is not surfaced in the nav. If this is undesirable, a tooltip on the user chip is the minimal addition.

**A3** — The `pc-*` prefix is the canonical class prefix going forward. Unprefixed aliases (`btn`, `badge`, `inp`, `card`, etc.) are kept only for backward compatibility with pages that already use them (`LogDetailPage`, `RelationshipsPage`, `RecordEntryForm`). New code in redesigned pages should use `pc-*` classes or the new utility classes (`.results-table`, `.flag-chip`, etc.).

**A4** — The inline detail panel in RecordsPage makes two API calls on first expand: `recordsApi.get()` and `recordsApi.history()`. These are called lazily (only when a row is first expanded) and cached in component state for the duration of the page session. If the user edits or corrects a record through the panel's action buttons, the panel data is reloaded.

**A5** — The `expandedRecordId` detail panel replaces row-click navigation for the common use case. The chevron column is repurposed as an expand toggle indicator. The record number link (monospace blue) in the panel header can optionally still deep-link to RecordDetailPage — this is left as an implementation detail.

**A6** — "Logs" in the nav refers to `/logs` (LogsPage). The builder route `/logs/new` and `/logs/:id/edit` are accessed from within the Logs page, not directly from the nav.

**A7** — `App.css` (in the same `src/` directory) exists but its content is minimal. Any conflicting rules in `App.css` may be cleared or overridden by `index.css`. The implementer should audit `App.css` to avoid conflicts.

**A8** — The Tailwind `@import "tailwindcss"` directive in `index.css` is preserved. If Tailwind utility classes are used in components, they must not conflict with the new custom classes.
