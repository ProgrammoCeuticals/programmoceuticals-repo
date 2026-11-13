# Technical Design — LogbookBuilder UI Redesign (GLSI-Inspired)

**Revision 3** — addresses NEW Finding 1 (mobile hamburger) and NEW Finding 2 (print media query) from `03-design-review.md`

**Document type:** Technical design  
**Stack locked at:** React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 + lucide-react 1.52 + react-router-dom 7  
**Scope:** `/logbookbuilder/client/src/` only — 16 files  
**Input documents:** `01-requirements.md`, full codebase exploration of all 16 target files, GLSI App.css reference, and `03-design-review.md` (revision loop — two new HIGH findings addressed)

---

## Overview

The redesign is a CSS-layer overhaul plus surgical JSX edits. No new npm packages are introduced. The strategy is: (1) replace `index.css` with a new design system that carries the GLSI token set, defines every `pc-*` class from scratch (they do not exist in the current file), resolves the two-`:root`-block conflict with a single canonical `:root`, provides a complete token mapping table for legacy `--color-*` aliases, includes a mobile hamburger nav at ≤768px, and includes a `@media print` block; (2) update AppShell to swap the sidebar for a horizontal sticky nav with mobile hamburger support; (3) restyle each page component, replacing inline-style-heavy constructs with the new class names, introducing the inline expand panel on RecordsPage, and harmonising all forms and tables. TypeScript must compile clean throughout — the refactors are JSX-structural only, no type changes.

The codebase has two coexisting class-name systems. Pages written during the original scaffold use `page`, `card`, `btn`, `badge`, `inp`, `alert`, `drt-table` (RelationshipsPage, LogDetailPage, RecordEntryForm, LogBuilderPage). Pages written during the functional build phase use `pc-*`-prefixed names (RecordsPage, RecordDetailPage, UsersPage, PersonnelPage, AuditPage, DashboardPage, LogsPage). Both sets of names must continue to resolve and must render identically using the new token values. `App.css` is cleared to an empty comment and its import statement in `App.tsx` is removed.

---

## 1. Design System — `index.css`

### Structure and approach

The file is fully rewritten. Sections in order:

1. Font import — `@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap")` retained.
2. Tailwind import — `@import "tailwindcss"` retained (Tailwind 4 plugin, required by Vite config).
3. Global reset — `*, *::before, *::after { box-sizing: border-box }`. Body: `font-family: Inter, Segoe UI, sans-serif; font-size: 13px; background: var(--bg); color: var(--text); margin: 0`.
4. **Single `:root` token block** — one block only (see below). No second `:root`. This resolves the dual-`:root` conflict.
5. Layout shell classes (`.app`, `.main-content`).
6. **Nav classes** (new — includes hamburger/mobile rules).
7. **Page scaffold** (`pc-page`, `pc-page-header`, etc. — written from scratch).
8. **`pc-*` component library** — all classes defined for the first time.
9. **Legacy alias classes** (`.btn`, `.badge`, `.inp`, `.card`, `.drt-table`, `.alert`, etc.) — rewritten to use canonical tokens.
10. Utility/layout helpers (`.section-title`, `.stat-grid`, `.stat-card`, `.results-table`, `.flag-chip`, `.detail-panel`, `.tab-bar`, `.drop-zone`, `.pagination`, etc.).
11. Auth classes.
12. Column type left-border helpers (`.lb-col-*`).
13. Dashboard two-panel layout (`.pc-dash-panels`, `.dash-panels`).
14. **Mobile media query** (≤768px — hamburger nav, 2-col stat grid, tight table padding, 42px min touch targets). **NEW Finding 1 addressed.**
15. **Print media query** (FR-1.9). **NEW Finding 2 addressed.**

---

### Single `:root` token block

```css
:root {
  /* ── Brand palette ─────────────────────────────── */
  --brand: #193441;
  --brand-mid: #2a5068;
  --brand-light: #e8f0f4;
  --accent: #0b5ed7;
  --danger: #c53030;
  --warn: #d97706;
  --ok: #166534;
  --text: #1a202c;
  --muted: #718096;
  --border: #e2e8f0;
  --bg: #f7f8fa;

  /* ── Semantic aliases (used by legacy and pc-* classes) ─ */
  --navy: #193441; /* same as --brand */
  --navy-h: #122630;
  --blue: #0b5ed7; /* same as --accent */
  --blue-h: #0a52c4;
  --bg-page: #f7f8fa; /* same as --bg */
  --bg-card: #ffffff;
  --bg-header: #f0f4f7;
  --bg-hover: #f0f4f7;
  --text-dark: #1a202c; /* same as --text */
  --text-mid: #334155;
  --text-muted: #718096; /* same as --muted */
  --text-faint: #94a3b8;
  --border-dark: #cbd5e1;

  /* ── Legacy --color-* token mapping ─────────────────────
   * The old index.css second :root block defined these and
   * the legacy alias classes referenced them. They are mapped
   * here so all legacy alias classes resolve correctly.
   * ─────────────────────────────────────────────────────── */
  --color-blue: #0b5ed7;
  --color-blue-h: #0a52c4;
  --color-blue-bg: #eff6ff;
  --color-blue-bdr: #bfdbfe;
  --color-text-900: #1a202c;
  --color-text-700: #334155;
  --color-text-500: #718096;
  --color-text-400: #718096;
  --color-text-300: #94a3b8;
  --color-border: #e2e8f0;
  --color-border-2: #cbd5e1;
  --color-bg-alt: #f0f4f7;
  --color-bg-hover: #f0f4f7;
}
```

---

### Geometry rules

`border-radius: 0` on `.card`, `.pc-card`, `.form-panel`, `.pc-form-panel`, `.inp`, `.pc-input`, `.auth-card`, `.modal-card`, `.detail-panel`, all table containers. `border-radius: 2px` on `.btn`, `.pc-btn`, `.badge`, `.pc-badge`, `.flag-chip`. No `8px`, `10px`, `12px`, or `999px` values anywhere in the new design system.

---

### `pc-*` class definitions (written from scratch)

These classes do not exist in the current `src/index.css`. They must be fully defined.

**Page scaffold:**

```css
.pc-page {
  padding: 1.5rem 2rem 3rem;
  max-width: 1280px;
  margin: 0 auto;
}
.pc-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 2px solid var(--brand);
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.pc-page-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.pc-page-subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: var(--muted);
}
```

**Breadcrumb:**

```css
.pc-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--muted);
  margin-bottom: 0.75rem;
}
.pc-breadcrumb a {
  color: var(--muted);
  text-decoration: none;
}
.pc-breadcrumb a:hover {
  color: var(--brand);
  text-decoration: underline;
}
.pc-breadcrumb-sep {
  color: var(--text-faint);
}
.pc-breadcrumb-current {
  color: var(--text-mid);
  font-weight: 500;
}
```

**Buttons:**

```css
.pc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: 1px solid transparent;
  border-radius: 2px;
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  text-decoration: none;
  white-space: nowrap;
}
.pc-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pc-btn-primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.pc-btn-primary:not(:disabled):hover {
  background: var(--blue-h);
  border-color: var(--blue-h);
}
.pc-btn-secondary {
  background: #fff;
  color: var(--text-mid);
  border-color: var(--border-dark);
}
.pc-btn-secondary:not(:disabled):hover {
  background: var(--bg-header);
}
.pc-btn-danger {
  background: var(--danger);
  color: #fff;
  border-color: var(--danger);
}
.pc-btn-danger:not(:disabled):hover {
  background: #a82424;
  border-color: #a82424;
}
.pc-btn-ghost {
  background: transparent;
  color: var(--muted);
  border-color: transparent;
}
.pc-btn-ghost:not(:disabled):hover {
  background: var(--bg-hover);
  color: var(--text-mid);
}
.pc-btn-sm {
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
}
```

**Card:**

```css
.pc-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 0;
  margin-bottom: 1.25rem;
}
.pc-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border);
}
.pc-card-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Table:**

```css
.pc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.pc-table thead tr {
  background: var(--brand);
}
.pc-table thead th {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #ffffff;
  white-space: nowrap;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}
.pc-table thead th:last-child {
  border-right: none;
}
.pc-table tbody td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-mid);
  vertical-align: middle;
}
.pc-table tbody tr:hover td {
  background: var(--bg-hover);
}
.pc-table tbody tr.clickable {
  cursor: pointer;
}
.pc-col-chevron {
  width: 24px;
  text-align: center;
  color: var(--muted);
  font-size: 12px;
}
```

**Badges:**

```css
.pc-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 7px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 2px;
}
.pc-badge-green {
  background: #d4edda;
  color: #155724;
}
.pc-badge-amber {
  background: #fff3cd;
  color: #856404;
}
.pc-badge-red {
  background: #f8d7da;
  color: #721c24;
}
.pc-badge-blue {
  background: #d1ecf1;
  color: #0c5460;
}
.pc-badge-gray {
  background: #e9ecef;
  color: #495057;
}
.pc-badge-teal {
  background: #d1f2eb;
  color: #0e6655;
}
.pc-badge-purple {
  background: #e8daef;
  color: #6c3483;
}
.pc-badge-orange {
  background: #fdebd0;
  color: #784212;
}
.pc-badge-navy {
  background: var(--brand);
  color: #ffffff;
}
```

**Input:**

```css
.pc-input {
  width: 100%;
  border: 1px solid var(--border-dark);
  border-radius: 0;
  padding: 0.45rem 0.65rem;
  font-size: 12px;
  color: var(--text);
  font-family: inherit;
  background: #ffffff;
  transition: border-color 0.15s;
}
.pc-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(11, 94, 215, 0.12);
}
.pc-input::placeholder {
  color: var(--text-faint);
}
select.pc-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23718096' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.1rem;
  padding-right: 2rem;
}
```

**Form panel:**

```css
.pc-form-panel {
  background: #ffffff;
  border: 1px solid var(--border);
  border-top: 3px solid var(--brand);
  border-radius: 0;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}
```

**Alerts:**

```css
.pc-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.65rem 0.85rem;
  font-size: 0.82rem;
  line-height: 1.5;
  border-left: 4px solid;
  margin-bottom: 1rem;
}
.pc-alert-info {
  background: #d1ecf1;
  border-color: #0c5460;
  color: #0c5460;
}
.pc-alert-error {
  background: #f8d7da;
  border-color: #721c24;
  color: #721c24;
}
.pc-alert-warn {
  background: #fff3cd;
  border-color: #856404;
  color: #856404;
}
.pc-alert-success {
  background: #d4edda;
  border-color: #155724;
  color: #155724;
}
```

**Pagination:**

```css
.pc-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  border-top: 1px solid var(--border);
  font-size: 0.78rem;
  color: var(--muted);
  background: var(--bg-header);
}
```

**Segment tabs** (underline style — class names preserved, now render as underline tabs):

```css
.pc-seg-tabs {
  display: flex;
  border-bottom: 2px solid var(--border);
  margin-bottom: 1.25rem;
  gap: 0;
}
.pc-seg-tab {
  padding: 0.45rem 1rem;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition:
    color 0.12s,
    border-color 0.12s;
}
.pc-seg-tab:hover {
  color: var(--text);
}
.pc-seg-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
```

**Stat card:**

```css
.pc-stat-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-left: 4px solid var(--brand);
  border-radius: 0;
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.pc-stat-icon {
  width: 38px;
  height: 38px;
  background: var(--brand-light);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pc-stat-value {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}
.pc-stat-label {
  margin: 0.2rem 0 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Search wrap:**

```css
.pc-search-wrap {
  position: relative;
  margin-bottom: 1rem;
}
.pc-search-icon {
  position: absolute;
  left: 0.65rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-faint);
  pointer-events: none;
}
.pc-search-wrap .pc-input {
  padding-left: 2rem;
}
```

**Loading / empty:**

```css
.pc-loading {
  padding: 3rem 1rem;
  text-align: center;
  font-size: 0.82rem;
  color: var(--text-faint);
}
.pc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--muted);
}
.pc-empty-icon {
  margin-bottom: 0.75rem;
  color: var(--border-dark);
}
.pc-empty-title {
  font-weight: 700;
  color: var(--text-mid);
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}
```

**Dash panels:**

```css
.pc-dash-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
@media (max-width: 860px) {
  .pc-dash-panels {
    grid-template-columns: 1fr;
  }
}
```

---

### New utility classes

**Nav classes** (includes mobile hamburger — NEW Finding 1 addressed):

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--brand);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.nav-container {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 1.5rem;
  gap: 1.5rem;
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
  text-decoration: none;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  flex: 1;
}
.nav-link {
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition:
    color 0.12s,
    border-color 0.12s;
  white-space: nowrap;
}
.nav-link:hover {
  color: #ffffff;
}
.nav-link.active {
  color: #ffffff;
  border-bottom-color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}
.nav-user-chip {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nav-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 2px;
  color: #ffffff;
  transition: background 0.12s;
}
.nav-logout:hover {
  background: rgba(255, 255, 255, 0.12);
}
.main-content {
  flex: 1;
  overflow-y: auto;
  background: var(--bg);
}

/* ── Mobile hamburger (FR-1.8) ── */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #ffffff;
  flex-shrink: 0;
}
.hamburger {
  display: block;
  width: 20px;
  height: 2px;
  background: white;
  position: relative;
  transition: background 0.3s;
}
.hamburger::before,
.hamburger::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 2px;
  background: white;
  transition: all 0.3s;
}
.hamburger::before {
  top: -6px;
}
.hamburger::after {
  top: 6px;
}
.hamburger.open {
  background: transparent;
}
.hamburger.open::before {
  transform: rotate(45deg);
  top: 0;
}
.hamburger.open::after {
  transform: rotate(-45deg);
  top: 0;
}
/* Overlay for mobile menu — closes on click outside */
.mobile-nav-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.35);
}
.mobile-nav-overlay.open {
  display: block;
}
```

**Wordmark:**

```css
.wordmark {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
}
.wordmark span {
  color: rgba(255, 255, 255, 0.55);
}
```

**Results table:**

```css
.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.results-table thead tr {
  background: var(--brand);
}
.results-table thead th {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #ffffff;
  white-space: nowrap;
}
.results-table tbody td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-mid);
  vertical-align: middle;
}
.results-table tbody tr:hover td {
  background: var(--bg-hover);
}
.results-table tbody tr.clickable {
  cursor: pointer;
}
```

Update `.drt-table` in the legacy block to match (navy header). JSX pages using `drt-table` don't need JSX class rename.

**Flag chips:**

```css
.flag-chip {
  display: inline-block;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 2px;
}
.flag-active {
  background: #d4edda;
  color: #155724;
}
.flag-draft {
  background: #fff3cd;
  color: #856404;
}
.flag-archived {
  background: #e9ecef;
  color: #495057;
}
.flag-corrected {
  background: #d1ecf1;
  color: #0c5460;
}
.flag-voided {
  background: #f8d7da;
  color: #721c24;
}
```

**Section title:**

```css
.section-title {
  margin: 0 0 0.5rem;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brand);
  border-bottom: 2px solid var(--brand);
  padding-bottom: 3px;
}
```

**Field label:**

```css
.field-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.3rem;
}
```

**Detail panel:**

```css
.detail-panel {
  border: 1px solid var(--border);
  background: #ffffff;
  border-radius: 0;
}
.detail-panel-header {
  background: var(--brand);
  padding: 0.65rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.detail-panel-header .record-num {
  font-family: monospace;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}
.detail-panel-body {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.25rem;
  padding: 1rem;
}
.detail-panel-fields {
  display: grid;
  gap: 0;
}
.field-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.35rem 0;
  border-bottom: 1px solid var(--border);
}
.field-row:last-child {
  border-bottom: none;
}
.fl {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}
.fv {
  font-size: 13px;
  color: var(--text);
}
.detail-panel-row td {
  padding: 0 !important;
  border-bottom: none !important;
}
.sig-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0;
  border-bottom: 1px solid var(--border);
  gap: 0.5rem;
}
.sig-row:last-child {
  border-bottom: none;
}
```

**Tab bar:**

```css
.tab-bar {
  display: flex;
  border-bottom: 2px solid var(--border);
  margin: 0.85rem 0 0.75rem;
}
.tab-btn {
  padding: 0.45rem 1rem;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition:
    color 0.12s,
    border-color 0.12s;
}
.tab-btn:hover {
  color: var(--text);
}
.tab-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
```

**Stat grid (unprefixed):**

```css
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.stat-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-left: 4px solid var(--brand);
  border-radius: 0;
  padding: 1rem 1.1rem;
}
/* Modifier classes — border-left-color only (NIT 4 from prior review) */
.stat-card.accent {
  border-left-color: var(--accent);
}
.stat-card.ok {
  border-left-color: var(--ok);
}
.stat-card.warn {
  border-left-color: var(--warn);
}
.stat-card.danger {
  border-left-color: var(--danger);
}
.stat-card .stat-val {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}
.stat-card .stat-lbl {
  margin: 0.2rem 0 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Pagination buttons:**

```css
.pag-btn {
  padding: 0.3rem 0.55rem;
  border: 1px solid var(--border-dark);
  border-radius: 2px;
  background: #ffffff;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  color: var(--text-mid);
  transition: background 0.12s;
}
.pag-btn:hover:not(:disabled) {
  background: var(--bg-header);
}
.pag-btn.active {
  background: var(--brand);
  color: #ffffff;
  border-color: var(--brand);
}
.pag-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

**Drop zone:**

```css
.drop-zone {
  border: 2px dashed var(--border-dark);
  padding: 1rem;
  text-align: center;
  font-size: 0.82rem;
  color: var(--muted);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
}
.drop-zone:hover {
  border-color: var(--accent);
  background: var(--brand-light);
}
```

**Misc utility:**

```css
.search-input {
  width: 100%;
  border: 1px solid var(--border-dark);
  border-radius: 0;
  padding: 0.45rem 0.65rem;
  font-size: 12px;
  color: var(--text);
  font-family: inherit;
  background: #ffffff;
}
.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(11, 94, 215, 0.12);
}
.sync-placeholder {
  background: var(--brand-light);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  padding: 0.45rem 0.65rem;
  font-size: 12px;
  color: var(--muted);
  font-style: italic;
}
.modal-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 0;
  overflow: hidden;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.22);
}
.modal-header {
  background: var(--brand);
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
}
.modal-close:hover {
  color: #ffffff;
}
.intent-block {
  background: var(--brand-light);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  padding: 0.75rem 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
```

---

### Legacy alias classes (rewritten)

The full set of unprefixed aliases (`.btn`, `.badge`, `.inp`, `.card`, `.drt-table`, `.alert`, `.form-panel`, `.page`, `.page-header`, `.page-title`, `.page-subtitle`, `.breadcrumb`, `.seg-tabs`, `.seg-tab`, `.pagination`, `.search-wrap`, `.empty`, `.loading`, `.stat-grid`, `.stat-card`, `.form-panel`, `.field-label`) is rewritten. The rule bodies remain structurally identical to the first half of the current `index.css` but:

1. All `var(--color-*)` references replaced with canonical tokens via the mapping table above.
2. All `border-radius` values > 2px set to `0` on block-level, `2px` on inline chips.
3. `.btn-primary` gets `background: var(--accent)` (action blue, not brand navy).
4. `.drt-table thead tr` gets `background: var(--brand); color: #ffffff`.
5. `.badge` gets `border-radius: 2px`.

---

### Auth classes

```css
.auth-root {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.auth-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 0;
  overflow: hidden;
}
.auth-card-header {
  background: var(--brand);
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.auth-card-body {
  padding: 1.75rem;
}
.auth-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.auth-subtitle {
  margin: 0 0 1.5rem;
  font-size: 0.8rem;
  color: var(--muted);
}
.auth-form {
  display: grid;
  gap: 1rem;
}
.auth-footnote {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--muted);
}
.auth-footnote a {
  color: var(--brand);
  font-weight: 600;
  text-decoration: none;
}
.auth-footnote a:hover {
  text-decoration: underline;
}
```

---

### Column type left-border helpers (preserved exactly)

```css
.lb-col-text {
  border-left: 3px solid #60a5fa;
}
.lb-col-long_text {
  border-left: 3px solid #93c5fd;
}
.lb-col-integer {
  border-left: 3px solid #34d399;
}
.lb-col-decimal {
  border-left: 3px solid #6ee7b7;
}
.lb-col-date {
  border-left: 3px solid #a78bfa;
}
.lb-col-time {
  border-left: 3px solid #c4b5fd;
}
.lb-col-datetime {
  border-left: 3px solid #818cf8;
}
.lb-col-boolean {
  border-left: 3px solid #f472b6;
}
.lb-col-dropdown {
  border-left: 3px solid #fb923c;
}
.lb-col-multi_select {
  border-left: 3px solid #fbbf24;
}
.lb-col-user {
  border-left: 3px solid #4fa9da;
}
.lb-col-person {
  border-left: 3px solid #38bdf8;
}
.lb-col-reference {
  border-left: 3px solid #818cf8;
}
.lb-col-calculated {
  border-left: 3px solid #f97316;
}
.lb-col-file {
  border-left: 3px solid #94a3b8;
}
.lb-col-image {
  border-left: 3px solid #64748b;
}
.lb-col-signature {
  border-left: 3px solid #193441;
}
```

---

### Mobile media query — FR-1.8 (NEW Finding 1 addressed)

```css
@media (max-width: 768px) {
  /* ── Hamburger toggle replaces inline nav links ── */
  .mobile-menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-links {
    /* Slide-in panel from right */
    position: fixed;
    top: 0;
    right: -100%;
    width: 260px;
    height: 100vh;
    background: var(--brand);
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 64px 0 20px;
    transition: right 0.3s ease;
    z-index: 999;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    /* Override the desktop flex:1 */
    flex: unset;
  }
  .nav-links.mobile-open {
    right: 0;
  }

  /* Stack links vertically */
  .nav-link {
    padding: 0.85rem 1.5rem;
    font-size: 0.9rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom-color: rgba(
      255,
      255,
      255,
      0.08
    ); /* override the underline-active style */
    min-height: 48px;
    display: flex;
    align-items: center;
  }
  .nav-link.active {
    border-bottom-color: rgba(255, 255, 255, 0.08);
    border-left: 3px solid #ffffff;
  }

  /* Hide user chip on very small nav */
  .nav-user-chip {
    display: none;
  }

  /* ── Content adjustments ── */
  .main-content {
    padding: 0;
  }
  .pc-page {
    padding: 1rem 1rem 2rem;
  }

  /* ── Stat grids collapse to 2 columns ── */
  .stat-grid {
    grid-template-columns: 1fr 1fr;
  }

  /* ── Table compaction ── */
  .results-table {
    font-size: 11px;
  }
  .results-table th,
  .results-table td {
    padding: 0.4rem 0.5rem;
  }
  .pc-table th,
  .pc-table td {
    padding: 0.4rem 0.5rem;
  }

  /* ── Minimum 42px touch target for all interactive elements ── */
  .pc-btn,
  .btn,
  .nav-logout,
  .pag-btn {
    min-height: 42px;
  }
  .tab-btn,
  .pc-seg-tab {
    min-height: 42px;
  }
}

@media (max-width: 480px) {
  .stat-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .tab-btn {
    padding: 0.55rem 0.75rem;
    font-size: 10px;
  }
}
```

---

### Print media query — FR-1.9 (NEW Finding 2 addressed)

```css
/* ── Print media query (FR-1.9) ────────────────── */
@media print {
  .nav,
  .sidebar,
  .btn,
  .pc-btn,
  button,
  .nav-logout,
  .pagination,
  .pc-pagination,
  .pag-btn,
  .mobile-menu-toggle {
    display: none !important;
  }
  .main-content {
    margin-top: 0;
    padding: 0;
    overflow: visible;
  }
}
```

---

### App.css

`App.css` is cleared to a single comment: `/* Reserved — production styles live in index.css */`.

**Additionally, the `import './App.css'` statement in `App.tsx` is removed.** After removing the import, run a grep to confirm no other file imports `App.css`. (Note: current `App.tsx` source does not have this import; `main.tsx` imports `./index.css`. The instruction is a safety step and is harmless.)

---

## 2. AppShell — `AppShell.tsx`

### Current state

Renders `<div className="app-shell">`, an `<aside className="sidebar">` with grouped `NavLink` items, section labels, a footer with user info, and `<main className="main-area">`.

### New structure (with mobile hamburger — NEW Finding 1 addressed)

```tsx
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Mobile overlay — closes menu on outside click */}
      <div
        className={`mobile-nav-overlay${mobileOpen ? " open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <nav className="nav">
        <div className="nav-container">
          {/* Left: brand */}
          <div className="nav-brand">
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <BookOpen size={13} color="#ffffff" />
            </div>
            <span className="wordmark">
              Logbook<span>Builder</span>
            </span>
          </div>

          {/* Center: nav links (hidden on mobile, replaced by slide-in panel) */}
          <div className={`nav-links${mobileOpen ? " mobile-open" : ""}`}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right: user + logout + hamburger */}
          <div className="nav-right">
            <span className="nav-user-chip">{user?.email}</span>
            <button className="nav-logout" onClick={handleLogout}>
              Sign out
            </button>
            {/* Hamburger toggle — visible only at ≤768px via CSS */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span className={`hamburger${mobileOpen ? " open" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
}
```

### NAV_ITEMS array

```ts
const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/logs", label: "Logs", end: false },
  { to: "/relationships", label: "Relationships", end: false },
  { to: "/personnel", label: "Personnel", end: false },
  { to: "/users", label: "Users", end: false },
  { to: "/audit", label: "Audit Trail", end: false },
];
```

Templates and Divisions routes remain in App.tsx but are not in the nav.

### TypeScript notes

Imports needed: `BookOpen` from lucide-react, `NavLink`, `useNavigate` from react-router-dom, `useAuth` from AuthContext, `useState` from react.

Remove imports no longer used: `LayoutDashboard`, `FileText`, `ClipboardList`, `Users`, `UserCheck`, `Building2`, `LogOut`. The `LogOut` icon is explicitly dropped — it is no longer rendered.

The `NAV` array (with section groups) and the `rendered` loop are removed entirely and replaced with the flat `NAV_ITEMS` array above.

### Mobile behavior

`mobileOpen` state controls both the `.nav-links.mobile-open` class and the `.hamburger.open` class. The `mobile-nav-overlay` div is always in the DOM but `display: none` until the `.open` class is applied. Clicking any nav link calls `setMobileOpen(false)` via the `onClick` on each `NavLink` — this ensures the slide-in panel closes on navigation. Clicking the overlay calls `setMobileOpen(false)`.

The hamburger button is `display: none` at desktop widths (via CSS — `.mobile-menu-toggle { display: none }` at default, `display: flex` inside `@media (max-width: 768px)`). No JavaScript-based breakpoint detection is needed.

---

## 3. Auth Pages — `LoginPage.tsx` and `RegisterPage.tsx`

### Common layout

Both pages:

```tsx
<div className="auth-root">
  <div style={{ width: "100%", maxWidth: 440 }}>
    <div className="auth-card">
      <div className="auth-card-header">
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 3,
            background: "linear-gradient(135deg, var(--brand), var(--accent))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BookOpen size={13} color="#fff" />
        </div>
        <span className="wordmark">
          Logbook<span>Builder</span>
        </span>
      </div>
      <div className="auth-card-body">
        <h1 className="auth-title">SIGN IN TO YOUR WORKSPACE</h1>
        <p className="auth-subtitle">Enter your credentials to continue</p>
        {/* form unchanged */}
      </div>
    </div>
  </div>
</div>
```

The `lb-wordmark`, `lb-wordmark-primary`, `lb-wordmark-secondary` class references are replaced with the `wordmark` / `wordmark span` classes. The floating `.auth-logo` div above the card is removed (the header is now inside the card). The `btn btn-primary` submit button gets `width: 100%`. Form logic is entirely preserved.

**Confirmed:** `RegisterPage.tsx` uses the same `lb-wordmark`/`lb-wordmark-primary`/`lb-wordmark-secondary` classes — replace identically. Form fields and submission logic unchanged.

---

## 4. Dashboard — `DashboardPage.tsx`

### Stat cards (using modifier-class-only approach)

`StatCard` sub-component is rewritten. Uses only the modifier class for border color — no inline `style` prop:

```tsx
function StatCard({
  label,
  value,
  modifier,
}: {
  label: string;
  value: number;
  modifier: "accent" | "ok" | "warn" | "danger";
}) {
  return (
    <div className={`stat-card ${modifier}`}>
      <p className="stat-val">{value}</p>
      <p className="stat-lbl">{label}</p>
    </div>
  );
}
```

Three call sites:

```tsx
<div className="stat-grid">
  <StatCard label="Total Logs" value={totalLogs} modifier="accent" />
  <StatCard label="Active Logs" value={activeLogs} modifier="ok" />
  <StatCard label="Draft Logs" value={draftLogs} modifier="warn" />
</div>
```

Remove props `icon`, `accent`, `accentBg`. Remove imports `TrendingUp`, `FileText`, `ClipboardList` (no longer used in stat cards; `BookOpen`, `GitBranch`, `Clock`, `Plus` remain used in page body).

### Recent Logs panel

Replace `<Link>` block list with `.results-table`. Columns: Name (bold, link to `/logs/${log.id}/records`), Status (`flag-chip`), Columns (count), Created. Outer panel: `.pc-card` / `.pc-card-header`.

Remove: icon box with `borderRadius: 8`, `onMouseEnter/onMouseLeave` background toggles.

### Recent Activity panel

Each event: a `<tr>` in `.results-table`. Columns: Timestamp (`font-size: 11px`), Event Type (monospace `flag-chip`, `background: var(--brand-light)`, `color: var(--brand)`), Summary. Remove the left blue dot.

### Quick-action section

Three `<Link>` boxes with `borderRadius: 10` icon squares → `<p className="section-title">Quick Actions</p>` followed by a flex row of three plain text links: `<Link className="pc-btn pc-btn-ghost pc-btn-sm">`. No decorative boxes.

---

## 5. Logs Page — `LogsPage.tsx`

Card grid replaced with `.pc-card` wrapping `.results-table`. Columns: `#` (row number, 40px), Name (bold, full row clickable → `/logs/${log.id}/records`), Description (truncated, `color: var(--muted)`, max-width 260px, `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`), Status (`flag-chip`), Columns (numeric, 60px), Created (date), Settings icon (links to `/logs/${log.id}`, `pc-btn pc-btn-ghost pc-btn-sm`).

The `LogCard` sub-component is removed. `StatusFlagChip` helper:

```tsx
function StatusFlagChip({ status }: { status: string }) {
  const cls: Record<string, string> = {
    active: "flag-active",
    draft: "flag-draft",
    archived: "flag-archived",
  };
  return <span className={`flag-chip ${cls[status] ?? ""}`}>{status}</span>;
}
```

Filter bar: `<div className="pc-search-wrap"><Search ... className="pc-search-icon" /><input className="pc-input" ... /></div>`. Status filter: `<select className="pc-input" style={{ width: 'auto', minWidth: 140 }}>`.

---

## 6. Log Detail Page — `LogDetailPage.tsx`

`drt-table` → `results-table` (cosmetic rename; both get the same CSS treatment). `.card-header` title "Columns" → `<p className="section-title">Columns</p>` placed above the table. `.page-header` / `.page-title` / `.page-subtitle` stay; CSS update makes page-title uppercase, 1.1rem. Badges: `badge badge-blue` etc. stay; CSS update squares them.

---

## 7. Records Page — `RecordsPage.tsx` (CRITICAL)

### State additions

```tsx
const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
const [panelData, setPanelData] = useState<
  Record<string, { record: LogRecord; history: RecordVersion[] }>
>({});
const [panelLoading, setPanelLoading] = useState(false);
```

`panelData` is keyed by record ID. Re-expand does not re-fetch (cache hit).

### Row click handler

Replace existing `onClick={() => navigate(...)}`:

```tsx
function handleRowClick(recordId: string) {
  if (expandedRecordId === recordId) {
    setExpandedRecordId(null);
    return;
  }
  setExpandedRecordId(recordId);
  if (panelData[recordId]) return; // cache hit
  setPanelLoading(true);
  Promise.all([
    recordsApi.get(logId!, recordId),
    recordsApi.history(logId!, recordId),
  ])
    .then(([rec, hist]) => {
      // hist = { record: LogRecord; versions: RecordVersion[] }
      setPanelData((prev) => ({
        ...prev,
        [recordId]: { record: rec, history: hist.versions },
      }));
    })
    .catch(() => {
      setPanelData((prev) => ({
        ...prev,
        [recordId]: { record: null as unknown as LogRecord, history: [] },
      }));
    })
    .finally(() => setPanelLoading(false));
}

function handlePanelMutated(recordId: string) {
  setPanelData((prev) => {
    const n = { ...prev };
    delete n[recordId];
    return n;
  });
  loadRecords(page);
}
```

### Table structure and colSpan

**RecordsPage does NOT get a row-number `#` column.** Columns: Record # (1) + displayColumns (N) + Status (1) + Created (1) + chevron (1) = **N + 4**.

`colSpan = displayColumns.length + 4`. The `pc-col-chevron` cell shows `▾` when expanded, `▸` otherwise.

### Detail row injection

After each `<tr key={record.id}>`:

```tsx
{
  expandedRecordId === record.id && (
    <tr className="detail-panel-row">
      <td
        colSpan={displayColumns.length + 4}
        style={{ padding: 0, borderBottom: "none" }}
      >
        {panelLoading && !panelData[record.id] ? (
          <div className="pc-loading">Loading…</div>
        ) : panelData[record.id]?.record == null ? (
          <div
            className="pc-alert pc-alert-error"
            style={{ margin: "0.75rem" }}
          >
            Failed to load record detail.
          </div>
        ) : (
          <InlineDetailPanel
            log={log}
            record={panelData[record.id].record}
            history={panelData[record.id].history}
            logId={logId!}
            onClose={() => setExpandedRecordId(null)}
            onMutated={() => handlePanelMutated(record.id)}
          />
        )}
      </td>
    </tr>
  );
}
```

### InlineDetailPanel component (same file)

Interface:

```tsx
interface PanelProps {
  log: LogDefinition;
  record: LogRecord;
  history: RecordVersion[];
  logId: string;
  onClose: () => void;
  onMutated: () => void;
}
```

Internal state: `panelTab: 'lineage' | 'history'`, `mode: 'view' | 'edit' | 'correct'`, `sigColumn: string | null`, `voidModal: boolean`, `voidReason: string`, `voidError: string`.

Panel structure:

```
<div className="detail-panel">
  <div className="detail-panel-header">
    <span className="record-num">{record.recordNumber}</span>
    <RecordStatusBadge status={record.status} />
    <button onClick={onClose} style={{ marginLeft: 'auto', ... }}>×</button>
  </div>

  {mode === 'view' && (
    <>
      <div className="detail-panel-body">
        {/* Left: field values */}
        <div className="detail-panel-fields">
          {log.columns.filter(c => c.dataType !== 'signature').map(col => (
            <div className="field-row" key={col.id}>
              <span className="fl">{col.label}</span>
              <span className="fv">{formatCellValue(record.data[col.name])}</span>
            </div>
          ))}
        </div>
        {/* Right: signatures + actions */}
        <div>
          {sigColumns.length > 0 && (
            <>
              <p className="section-title">Signatures</p>
              {sigColumns.map(col => {
                const sig = (record as any).signatures?.find(
                  (s: any) => s.columnId === col.id && s.status === 'signed'
                );
                return (
                  <div key={col.id} className="sig-row">
                    <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>{col.label}</span>
                    {sig
                      ? <span style={{ fontSize: 11, color: 'var(--ok)' }}>✓ Signed {new Date(sig.signedAt).toLocaleString()}</span>
                      : canEdit
                        ? <button className="pc-btn pc-btn-primary pc-btn-sm" onClick={() => setSigColumn(col.id)}>Sign</button>
                        : <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>Unsigned</span>
                    }
                  </div>
                );
              })}
            </>
          )}
          {canEdit && (
            <>
              <p className="section-title" style={{ marginTop: '0.75rem' }}>Actions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <button className="pc-btn pc-btn-secondary pc-btn-sm" onClick={() => setMode('edit')}>Edit</button>
                <button className="pc-btn pc-btn-secondary pc-btn-sm" onClick={() => setMode('correct')}>Correct</button>
                <button className="pc-btn pc-btn-danger pc-btn-sm" onClick={() => setVoidModal(true)}>Void</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: '0 1rem 1rem' }}>
        <div className="tab-bar">
          <button className={`tab-btn${panelTab === 'lineage' ? ' active' : ''}`} onClick={() => setPanelTab('lineage')}>Lineage</button>
          <button className={`tab-btn${panelTab === 'history' ? ' active' : ''}`} onClick={() => setPanelTab('history')}>History</button>
        </div>
        {panelTab === 'lineage' && <PanelLineageView record={record} />}
        {panelTab === 'history' && <PanelHistoryView history={history} />}
      </div>
    </>
  )}

  {(mode === 'edit' || mode === 'correct') && (
    <div style={{ padding: '1rem' }}>
      <RecordEntryForm
        log={log} columns={log.columns} existingRecord={record} mode={mode}
        onSuccess={() => { setMode('view'); onMutated(); }}
        onCancel={() => setMode('view')}
      />
    </div>
  )}
</div>
```

**Signature type note:** Signature data is accessed via `(record as any).signatures` — `LogRecord` does not declare this property in `types/index.ts`. The `as any` cast is required. `types/index.ts` is out of scope for modification. The same cast is already used in `RecordDetailPage.tsx`.

**PanelLineageView:** Direct copy of `LineageView` from `RecordDetailPage`, using `record` prop. Replace `borderRadius: 8` on source block with `0`. Replace inner background `#f8fafc` with `var(--brand-light)`.

**PanelHistoryView:** Direct copy of `HistoryView`, using `history` prop. Version chip `borderRadius: 4` → `2`. `<pre>` `borderRadius: 8` → `0`.

**Void modal inside panel:** Fixed-position overlay, `.pc-card` with `borderRadius: 0`, `pc-input` textarea, `handleVoid` calls `recordsApi.void()` then `onMutated()`.

**Imports added to RecordsPage:** `RecordVersion` from `'../types'`, `SignatureModal` from `'./SignatureModal'`.

**`recordsApi.history()` return shape:** Returns `{ record: LogRecord; versions: RecordVersion[] }`. Extract via `hist.versions`.

### Export group

The inline export group loses its `borderRadius` (currently `8`) → `0`. All other export/filter/pagination/search/showForm functionality is unchanged.

---

## 8. Record Detail Page — `RecordDetailPage.tsx`

### Tab system

`pc-seg-tabs` / `pc-seg-tab` segment control → `.tab-bar` / `.tab-btn` underline bar:

```tsx
<div className="tab-bar">
  {(["data", "lineage", "history"] as const).map((t) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      className={`tab-btn${tab === t ? " active" : ""}`}
    >
      {t}
    </button>
  ))}
</div>
```

### Data tab

Per-column flex rows → `.field-row` / `.fl` / `.fv` pattern. Outer `.pc-card` wrapper stays.

### Signatures panel

Per-signature `div` with `borderRadius: 8` → `.sig-row`. Remove inline `background`, inline `borderRadius`. `ShieldCheck` icon in panel header stays.

### Void modal

`.pc-card` container has `border-radius: 0` globally via CSS. No JSX change needed.

### Lineage and history views

`LineageView`: source block `borderRadius: 8` → `0`. Inner background `#f8fafc` → `var(--brand-light)`.  
`HistoryView`: version chip `borderRadius: 4` → `2`. `<pre>` `borderRadius: 8` → `0`.

---

## 9. Record Entry Form — `RecordEntryForm.tsx`

Label inline styles (`fontSize: '0.875rem', fontWeight: 600, color: '#334155'`) → `className="field-label"`.

Synced/calculated placeholder `div` with `borderRadius: 8` → `className="sync-placeholder"`.

`LinkedRecordPickers` header `div` (`background: '#eff6ff', borderRadius: 8`) → `<p className="section-title">`. Picker table: `drt-table` → `results-table`. Selected-row: remove `outline`, use `background: var(--brand-light); borderLeft: '3px solid var(--accent)'`.

File/image placeholder → `className="drop-zone"`.

Correction reason textarea → `className="inp"`, label → `<label className="field-label">`.

---

## 10. Signature Modal — `SignatureModal.tsx`

Header `<div>` with `background: '#f8fafc'` → `<div className="modal-header">`. Title "Electronic Signature" in white. Close button uses `className="modal-close"`. Remove gradient icon box in the header.

Outer container: `<div className="card" style={{ borderRadius: 16 }}>` → `<div className="modal-card">`.

Canvas wrapper `borderRadius: 10` → `0`.

Intent block: `borderRadius: 8` → `className="intent-block"`.

Password input: `className="inp"` stays.

---

## 11. Relationships Page — `RelationshipsPage.tsx`

Individual `.card` elements → single `.results-table`. Columns: Name (with expand chevron), Source Log (`flag-chip`), Type (`flag-chip`), Target Log (`flag-chip`), Mappings # (numeric), Delete (danger icon button).

Add `expandedRelId: string | null` state. Expansion row: `<tr><td colSpan={6}>` showing field mappings in monospace.

Source log chip: `<span className="flag-chip" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>`.  
Target log chip: `<span className="flag-chip" style={{ background: '#faf5ff', color: '#6d28d9' }}>`.

Form panel: `.form-panel` stays (CSS update handles square corners). Section headers inside `RelationshipForm` → `<p className="section-title">`.

`const lbl: React.CSSProperties` is **deleted**. All `style={lbl}` on `<label>` elements replaced with `className="field-label"`.

---

## 12. Audit Page — `AuditPage.tsx`

Flex-column event list → `.pc-card` wrapping `.results-table`. Columns: Timestamp (90px), Event Type (monospace `flag-chip`), Summary, User (name, 12px), Entity (truncated monospace ID, 10px). Left dot removed.

Pagination: `pc-btn pc-btn-secondary pc-btn-sm` → `.pag-btn`. Wrapper: `.pc-pagination`.

---

## 13. Users Page — `UsersPage.tsx`

`pc-table` stays. CSS update (navy header) applies globally. `const lbl: React.CSSProperties` **deleted**; `style={lbl}` → `className="field-label"` everywhere in this file.

Change Password panel: `style={{ borderColor: '#fde68a' }}` kept as-is (intentional one-off warn-color override, compliant with NFR-8's exception clause).

---

## 14. Personnel Page — `PersonnelPage.tsx`

Same treatment as UsersPage. `const lbl: React.CSSProperties` **deleted**; `style={lbl}` → `className="field-label"`.

Link User panel: `borderColor: '#c4b5fd'` → `style={{ borderColor: 'var(--brand-mid)' }}`. This is a single one-off override, compliant with NFR-8.

---

## 15. Log Builder Page — `LogBuilderPage.tsx`

`LogBuilderPage` has **only a Save button and a Preview toggle** — no Publish or Archive buttons exist. `pc-btn-ok` is not referenced. The Save button (`className="btn btn-primary"`) and Preview toggle (`className="btn btn-secondary"`) stay as-is; CSS update gives them accent blue and grey respectively.

Section header labels in `ColumnEditor`'s expanded body → `<p className="section-title">`. "Columns (N)" label → `<p className="section-title">Columns ({columns.length})</p>`.

`const lbl: React.CSSProperties` **deleted**; `style={lbl}` on `<label>` elements → `className="field-label"`.

`lb-col-{type}` left-border classes preserved unchanged.

---

## 16. File-by-file change matrix

| File                    | CSS scope                                 | JSX scope                                                            | Net new state                                   | Risk             |
| ----------------------- | ----------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- | ---------------- |
| `index.css`             | Full rewrite incl. mobile + print         | —                                                                    | none                                            | High (catch-all) |
| `App.css`               | Clear to comment                          | Remove `import './App.css'` from `App.tsx`                           | none                                            | Low              |
| `AppShell.tsx`          | nav + hamburger classes                   | Replace sidebar with nav, `NAV_ITEMS` flat array, `mobileOpen` state | `mobileOpen: boolean`                           | Medium           |
| `LoginPage.tsx`         | auth-card-header/body                     | wordmark classes updated, floating logo div removed                  | none                                            | Low              |
| `RegisterPage.tsx`      | same                                      | same                                                                 | none                                            | Low              |
| `DashboardPage.tsx`     | stat-card modifiers, results-table        | StatCard rewrite, table for logs, quick-action links                 | none                                            | Medium           |
| `LogsPage.tsx`          | results-table, flag-chip                  | Card grid → table, LogCard removed                                   | none                                            | Medium           |
| `LogDetailPage.tsx`     | section-title, results-table              | class rename + section title                                         | none                                            | Low              |
| `RecordsPage.tsx`       | detail-panel, tab-bar, sig-row            | Inline panel, `InlineDetailPanel` sub-component, row toggle          | `expandedRecordId`, `panelData`, `panelLoading` | High             |
| `RecordDetailPage.tsx`  | tab-bar, field-row, sig-row               | Tab refactor, sig panel flatten, lineage/history border cleanup      | none                                            | Medium           |
| `RecordEntryForm.tsx`   | field-label, sync-placeholder, drop-zone  | Label className, LinkedPickers update, drop-zone class               | none                                            | Low              |
| `SignatureModal.tsx`    | modal-card, modal-header, intent-block    | Header refactor, canvas border, container class                      | none                                            | Low              |
| `RelationshipsPage.tsx` | results-table, section-title, field-label | Card list → table, expansion row, `lbl` removed                      | `expandedRelId: string \| null`                 | Medium           |
| `AuditPage.tsx`         | results-table, pag-btn                    | Flex list → table, pagination update                                 | none                                            | Medium           |
| `UsersPage.tsx`         | field-label                               | `lbl` object deleted, `className="field-label"` used                 | none                                            | Low              |
| `PersonnelPage.tsx`     | field-label                               | `lbl` object deleted, `className="field-label"` used                 | none                                            | Low              |
| `LogBuilderPage.tsx`    | section-title, field-label                | Section label class swap, `lbl` object deleted                       | none                                            | Low              |

---

## Error handling

**InlineDetailPanel fetch (RecordsPage):** `Promise.all` for `recordsApi.get` and `recordsApi.history` can fail if the record is deleted between table load and expand. On rejection, store `null` sentinel in `panelData[recordId]` (typed as `record: null as unknown as LogRecord`), render `.pc-alert pc-alert-error` inside the panel: "Failed to load record detail." `expandedRecordId` is NOT reset — user can close manually or click again to retry. Recoverable.

**Void inside panel:** `voidError` state, shown as `<p style={{ color: 'var(--danger)' }}>`. Non-fatal; modal stays open.

**Correct/Edit via RecordEntryForm inside panel:** `RecordEntryForm` handles its own `serverError`. `onSuccess` triggers `onMutated` (cache eviction + table reload). `onCancel` resets `mode` to `'view'`.

**Mobile menu:** No error states. Overlay click and nav link click both call `setMobileOpen(false)`. If JavaScript fails to load, the nav links are still in the DOM (just may overflow on small screens); the app remains functional.

---

## Validation and constraints

**Input validation** unchanged.

**`tsc --noEmit` pitfalls:**

1. `AppShell` — `mobileOpen: boolean` via `useState<boolean>(false)`. `NavLink` `onClick` prop type is `React.MouseEventHandler<HTMLAnchorElement>` in react-router-dom v7 — no type annotation needed, inference handles it.
2. `RecordsPage` — `expandedRecordId: string | null`, `panelData: Record<string, { record: LogRecord; history: RecordVersion[] }>`, `panelLoading: boolean`. `RecordVersion` imported from `'../types'`.
3. `panelData` null sentinel — `record: null as unknown as LogRecord` for error case. Alternatively, use union `{ record: LogRecord; history: RecordVersion[] } | { error: true }` for cleaner TypeScript.
4. `recordsApi.history()` returns `{ record: LogRecord; versions: RecordVersion[] }`. Extract via `hist.versions`.
5. `(record as any).signatures` — `LogRecord` has no `signatures` property. `as any` cast required. `types/index.ts` out of scope.
6. `colSpan = displayColumns.length + 4` — TypeScript JSX accepts a number. Valid.
7. `DashboardPage.StatCard` — `icon`, `accent`, `accentBg` props removed; `modifier: 'accent' | 'ok' | 'warn' | 'danger'` added. All three call sites updated simultaneously.
8. `mobileOpen` state in `AppShell` — `useState<boolean>(false)`. `onClick={() => setMobileOpen((o) => !o)}` is valid for `HTMLButtonElement`. No type issues.

---

## Implementation order

1. **`App.tsx`** — remove `import './App.css'` statement (first to avoid runtime token conflicts)
2. **`App.css`** — clear to comment
3. **`index.css`** — full rewrite (all other files depend on this; includes mobile + print)
4. **`AppShell.tsx`** — layout switch with hamburger menu (affects all pages visually)
5. **`LoginPage.tsx`**, **`RegisterPage.tsx`** — self-contained
6. **`SignatureModal.tsx`** — self-contained, used by RecordsPage
7. **`RecordEntryForm.tsx`** — used by RecordsPage and RecordDetailPage
8. **`RecordDetailPage.tsx`** — tab/sig panel changes
9. **`RecordsPage.tsx`** — most complex, last among record-related files
10. **`LogDetailPage.tsx`**, **`LogsPage.tsx`**
11. **`RelationshipsPage.tsx`**
12. **`AuditPage.tsx`**
13. **`UsersPage.tsx`**, **`PersonnelPage.tsx`**
14. **`DashboardPage.tsx`**
15. **`LogBuilderPage.tsx`**
16. **Run `npx tsc --noEmit`** and fix all errors before declaring done

---

## Assumptions

| #   | Assumption                                                                      | Status                                                                                                              |
| --- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| A1  | `--navy` maps to `#193441` in new `:root`                                       | CONFIRMED                                                                                                           |
| A2  | Org name dropped from nav; user email only                                      | CONFIRMED — `AuthUser.organizationName` is optional; dropping from nav display is safe                              |
| A3  | `pc-*` classes written from scratch (not preserved)                             | CONFIRMED — no `pc-*` class exists in current `src/index.css`                                                       |
| A4  | Lazy fetch on expand, cached in `panelData`, evicted on mutation                | CONFIRMED — consistent with `recordsApi.get` and `recordsApi.history` signatures                                    |
| A5  | `record.recordNumber` in panel header; `record.id` for cache key                | CONFIRMED — `LogRecord.recordNumber: string` and `LogRecord.id: string` in `types/index.ts`                         |
| A6  | Logs nav → `/logs`; builder accessed from within logs                           | CONFIRMED — routes unchanged                                                                                        |
| A7  | `App.css` content is truly unused                                               | CONFIRMED — `.counter`, `.hero`, `#center` absent from all production TSX                                           |
| A8  | Tailwind 4 `@import "tailwindcss"` retained                                     | CONFIRMED — `package.json`: tailwindcss `^4.3.3`                                                                    |
| A9  | Mobile hamburger uses CSS-only breakpoint detection                             | CONFIRMED — `display: none` at desktop, `display: flex` at ≤768px in media query; no JS breakpoint detection needed |
| A10 | `NavLink.onClick` in react-router-dom v7 accepts a standard mouse event handler | CONFIRMED — `NavLink` renders as `<a>`, its `onClick` is `React.MouseEventHandler<HTMLAnchorElement>`               |

---

## Responses to design review findings

### Prior findings (Revision 1 → Revision 2) — all remain CLOSED

All 10 prior findings (5 HIGH, 5 MEDIUM) and 5 NITs from the first design review were addressed in Revision 2. Their resolutions are unchanged in Revision 3. See Revision 2 for detailed responses to each.

---

### NEW Finding 1 (HIGH) — FR-1.8: Mobile hamburger menu required, previously deferred

**ADDRESSED in Revision 3.** The prior design deferred mobile hamburger as a "later enhancement," which directly contradicted FR-1.8 and AC #19.

**Resolution:** The mobile hamburger menu is now fully designed and included in both §1 (CSS) and §2 (AppShell JSX):

- **CSS (§1, Mobile media query):** At ≤768px, `.mobile-menu-toggle` switches from `display: none` to `display: flex`. `.nav-links` transitions from a flex row to a fixed-position panel sliding in from the right (`right: -100%` default → `right: 0` on `.mobile-open`). Nav links stack vertically with `min-height: 48px`. `.mobile-nav-overlay` (a full-screen dimmed backdrop) becomes visible on `.open`. Stat grids collapse to 2 columns. Tables tighten padding. All interactive elements get `min-height: 42px` for touch targets.

- **JSX (§2, AppShell):** `mobileOpen: boolean` state via `useState(false)`. A `<button className="mobile-menu-toggle">` renders in `nav-right`, hidden at desktop by CSS. Clicking it calls `setMobileOpen((o) => !o)`. A `<div className="mobile-nav-overlay">` with `open` class on `mobileOpen` is placed before the `<nav>` — clicking it calls `setMobileOpen(false)`. Each `NavLink` has `onClick={() => setMobileOpen(false)}` to close on navigation. The hamburger span uses `className={"hamburger" + (mobileOpen ? " open" : "")}` for CSS-animated open/close state.

This implementation is directly modelled on the GLSI App.css reference, which uses the same pattern (`.hamburger`, `.hamburger.open`, `.nav-links.mobile-open`, `fixed` + `right: -100%` panel).

---

### NEW Finding 2 (HIGH) — FR-1.9: Print media query required, previously omitted

**ADDRESSED in Revision 3.** The prior design included 14 CSS sections but no `@media print` block.

**Resolution:** A `@media print` block is now added as section 15 of the `index.css` rewrite (§1):

```css
@media print {
  .nav,
  .sidebar,
  .btn,
  .pc-btn,
  button,
  .nav-logout,
  .pagination,
  .pc-pagination,
  .pag-btn,
  .mobile-menu-toggle {
    display: none !important;
  }
  .main-content {
    margin-top: 0;
    padding: 0;
    overflow: visible;
  }
}
```

This is placed as the final section of `index.css` so it has the highest specificity among the custom rules and is not accidentally overridden. The selector list covers all nav elements, all button variants across both class systems, and both pagination variants. `.sidebar` is included for forward-compatibility (it no longer renders but the class may still appear in legacy JSX that hasn't been updated). `overflow: visible` on `.main-content` ensures the full page body renders when printing (no scroll clipping).
