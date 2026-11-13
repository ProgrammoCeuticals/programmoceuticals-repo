# Implementation Plan — LogbookBuilder UI Redesign (GLSI-Inspired)

**Source design:** `02-design.md` (Revision 3, approved)
**Worktree:** `/Users/macbookpro/Desktop/ProgrammoCeuticals/logbookbuilder/client/`
**Stack:** React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 + lucide-react 1.52 + react-router-dom 7
**Build command:** `cd /Users/macbookpro/Desktop/ProgrammoCeuticals/logbookbuilder/client && npm run build` (runs `tsc -b && vite build`)
**Type-check command:** `cd /Users/macbookpro/Desktop/ProgrammoCeuticals/logbookbuilder/client && npx tsc --noEmit`
**No project-level tests** — verification is TypeScript compile + Vite build only. Baseline: both pass clean on the unmodified codebase.

---

## FEAT decomposition

This plan is decomposed into three sequential FEATs. Artifacts live at:
`/Users/macbookpro/Desktop/ProgrammoCeuticals/logbookbuilder/client/.agents/pipeline/2026-11-06_22-59-20/task-logbookbuilder-ui-redesign/`

- `task.json` — task metadata and feature order
- `context.json` — project context, commands, key patterns
- `features/FEAT-001.json` — CSS design system rewrite
- `features/FEAT-002.json` — AppShell + low/medium-risk page restyling (12 files)
- `features/FEAT-003.json` — RecordsPage inline panel + RelationshipsPage table (2 high-complexity files)

---

## Implementation Plan

- [ ] 1. **Design system CSS rewrite** (`FEAT-001`)
      Fully rewrite `src/index.css` with: single canonical `:root` block (brand palette + semantic aliases + `--color-*` legacy mapping), all `pc-*` component classes written from scratch (they do not exist today), all legacy alias classes rewritten with geometry rules (border-radius 0 on blocks, 2px on inline chips), nav classes with mobile hamburger (`mobile-menu-toggle`, `hamburger`, `mobile-nav-overlay`), the `.stat-card` modifier classes (`.accent`, `.ok`, `.warn`, `.danger` apply `border-left-color` only), `.stat-val`/`.stat-lbl` inside `.stat-card` (these are the class names `DashboardPage` emits — NOT `pc-stat-value`/`pc-stat-label`), `@media (max-width: 768px)` block (hamburger toggle, fixed right-panel `.nav-links`, 2-col stat grid, 42px touch targets), and `@media print` block. Clear `App.css` to a single comment. `App.tsx` has no `App.css` import to remove (confirmed by reading the file).
      Files: `src/index.css`, `src/App.css`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 2. **AppShell — sidebar → horizontal sticky nav** (`FEAT-002`, step 1)
      Replace the `app-shell`/`sidebar` structure entirely. Remove unused icon imports (`LayoutDashboard`, `FileText`, `ClipboardList`, `Users`, `UserCheck`, `Building2`, `LogOut`). Add `useState`. Define flat `NAV_ITEMS` array (6 items, no section groups). Add `mobileOpen: boolean` state. Render: `mobile-nav-overlay` div + `nav.nav` with brand, nav-links, and nav-right (user chip + sign-out + hamburger toggle) + `main.main-content`.
      Files: `src/shared/components/AppShell.tsx`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 3. **Auth pages restyling** (`FEAT-002`, steps 2–3)
      Both pages: wrap in `.auth-root > .auth-card`. Add `.auth-card-header` with gradient icon square (26×26, borderRadius 3) + `BookOpen` (size 13) + `.wordmark` span. Body in `.auth-card-body` with `.auth-title` / `.auth-subtitle`. Replace all `lb-wordmark*` classes with `.wordmark` and `.wordmark span`. Remove the floating `.auth-logo` div above the card. Submit button gets `width: '100%'`. Form logic unchanged.
      Files: `src/auth/LoginPage.tsx`, `src/auth/RegisterPage.tsx`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 4. **SignatureModal restyling** (`FEAT-002`, step 4)
      Container: `className="card" style={{ borderRadius: 16 }}` → `className="modal-card"`. Header div → `<div className="modal-header">` (title in white). Close button → `className="modal-close"`. Remove gradient icon box from header. Canvas wrapper `borderRadius: 10` → 0. Intent block `borderRadius: 8` → `className="intent-block"`. All signature/verification logic unchanged. Must be done before FEAT-003 because `InlineDetailPanel` imports it.
      Files: `src/records/SignatureModal.tsx`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 5. **RecordEntryForm restyling** (`FEAT-002`, step 5)
      Replace inline label styles (`fontSize: '0.875rem', fontWeight: 600, color: '#334155'`) throughout with `className="field-label"`. Synced/calculated placeholder → `className="sync-placeholder"`. LinkedRecordPickers header → `<p className="section-title">`. Picker table: `drt-table` → `results-table`. Selected-row: remove `outline`, add `background: 'var(--brand-light)', borderLeft: '3px solid var(--accent)'`. File/image placeholder → add `className="drop-zone"`. Correction textarea → `className="inp"`, its label → `className="field-label"`. All form logic unchanged. Must be done before FEAT-003.
      Files: `src/records/RecordEntryForm.tsx`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 6. **RecordDetailPage restyling** (`FEAT-002`, step 6)
      Tab bar: `pc-seg-tabs`/`pc-seg-tab` → `tab-bar`/`tab-btn`. Data tab field rows: wrap in `.field-row`/`.fl`/`.fv` pattern. Sig panel per-item divs with `borderRadius: 8` → `.sig-row`. `LineageView` (line ~542): source block `borderRadius: 8` → 0, inner background `'#f8fafc'` → `'var(--brand-light)'`. `HistoryView` (line ~660): version chip `borderRadius: 4` → 2, `<pre>` `borderRadius: 8` → 0. Panel wrapper at line ~264 `borderRadius: 8` → 0. All data-fetching and action handlers unchanged.
      Files: `src/records/RecordDetailPage.tsx`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 7. **LogDetailPage, LogsPage restyling** (`FEAT-002`, steps 7–8)
      `LogDetailPage`: `card-header` title → `<p className="section-title">Columns</p>` above table; `drt-table` → `results-table`. Badges and page-header/title/subtitle class names stay.
      `LogsPage`: remove `LogCard` sub-component. Replace card grid with `.pc-card` wrapping `.results-table`. Columns: `#`, Name (clickable row), Description (truncated), Status (`StatusFlagChip`), Columns count, Created, Settings link. Add `StatusFlagChip` helper. Filter bar: `.pc-search-wrap` with `.pc-search-icon` + `.pc-input`. Status select: `.pc-input` with `style={{ width: 'auto', minWidth: 140 }}`. All pagination and modal logic unchanged.
      Files: `src/logs/LogDetailPage.tsx`, `src/logs/LogsPage.tsx`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 8. **AuditPage restyling** (`FEAT-002`, step 9)
      Replace flex event list with `.pc-card` + `.results-table`. Columns: Timestamp (90px), Event Type (monospace `flag-chip` with `background: 'var(--brand-light)', color: 'var(--brand)'`), Summary, User, Entity (truncated monospace). Remove left blue dot. Pagination: `pc-btn pc-btn-secondary pc-btn-sm` → `pag-btn`. Wrapper: add `.pc-pagination`. Data-fetching unchanged.
      Files: `src/audit/AuditPage.tsx`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 9. **UsersPage, PersonnelPage, LogBuilderPage — `lbl` deletion** (`FEAT-002`, steps 10–12)
      All three files: delete `const lbl: React.CSSProperties = { ... }` and replace every `style={lbl}` on `<label>` elements with `className="field-label"`.
      `PersonnelPage`: additionally change Link User panel `borderColor: '#c4b5fd'` → `style={{ borderColor: 'var(--brand-mid)' }}`.
      `UsersPage`: keep the Change Password panel's `style={{ borderColor: '#fde68a' }}` — it is an intentional one-off override.
      `LogBuilderPage`: section header labels in `ColumnEditor` expanded body → `<p className="section-title">`. Columns count label → `<p className="section-title">Columns ({columns.length})</p>`. Save and Preview toggle class names (`btn btn-primary`, `btn btn-secondary`) stay. `lb-col-*` classes unchanged.
      Files: `src/personnel/UsersPage.tsx`, `src/personnel/PersonnelPage.tsx`, `src/builder/LogBuilderPage.tsx`
      Verify: `npx tsc --noEmit` exits 0.

- [ ] 10. **DashboardPage restyling** (`FEAT-002`, step 13)
       `StatCard` sub-component: remove `icon`, `accent`, `accentBg` props; add `modifier: 'accent' | 'ok' | 'warn' | 'danger'`; render `<div className={\`stat-card ${modifier}\`}><p className="stat-val">{value}</p><p className="stat-lbl">{label}</p></div>`. Update all three call sites. Stat container div → `<div className="stat-grid">`. Remove unused imports (`TrendingUp`, `FileText`, `ClipboardList`). Recent Logs panel → `.pc-card`/`.pc-card-header` + `.results-table` (Name link, Status flag-chip, Columns count, Created). Recent Activity → `.results-table` (Timestamp, Event Type flag-chip, Summary; no left dot). Quick Actions → `<p className="section-title">` + flex row of three `<Link className="pc-btn pc-btn-ghost pc-btn-sm">` plain links. Remove icon boxes with `borderRadius: 10` and hover handlers.
       Files: `src/dashboard/DashboardPage.tsx`
       Verify: `npx tsc --noEmit` exits 0.

- [ ] 11. **RecordsPage — inline expand panel** (`FEAT-003`, steps 1–7)
       Read `RecordsPage.tsx` in full first. Add state: `expandedRecordId: string | null`, `panelData: Record<string, { record: LogRecord; history: RecordVersion[] }>`, `panelLoading: boolean`. Add `RecordVersion` import from `'../types'`, `SignatureModal` import from `'./SignatureModal'`. Replace row `onClick={navigate}` with `onClick={() => handleRowClick(record.id)}`. Add `handleRowClick` (toggle expand, lazy-fetch via `Promise.all([recordsApi.get, recordsApi.history])`, cache in `panelData`, error sentinel `record: null as unknown as LogRecord`). Add `handlePanelMutated` (cache eviction + `loadRecords(page)`). Add chevron `<th>` header and `<td className="pc-col-chevron">` (▾/▸) per row. After each data `<tr>`, inject expansion `<tr className="detail-panel-row">` when `expandedRecordId === record.id` with `colSpan={displayColumns.length + 4}`. Add sub-components in the same file: `InlineDetailPanel` (full detail-panel/detail-panel-header/detail-panel-body structure; tab-bar for lineage/history; inline `RecordEntryForm` for edit/correct; fixed-overlay void modal; `(record as any).signatures` cast), `PanelLineageView` (copy of `LineageView` from `RecordDetailPage`, `borderRadius: 8→0`, `'#f8fafc'→'var(--brand-light)'`), `PanelHistoryView` (copy of `HistoryView`, chip `borderRadius: 4→2`, pre `borderRadius: 8→0`). `RecordStatusBadge` helper renders a `pc-badge` with color variant by `record.status`.
       Files: `src/records/RecordsPage.tsx`
       Verify: `npx tsc --noEmit` exits 0.

- [ ] 12. **RelationshipsPage — table + expansion row** (`FEAT-003`, steps 8–9)
       Read `RelationshipsPage.tsx` in full first. Delete `const lbl: React.CSSProperties` (line ~598). Replace all `style={lbl}` on labels with `className="field-label"`. Section headers in `RelationshipForm` → `<p className="section-title">`. Replace the list of individual `.card` relationship items with `.results-table`. Columns: Name + expand chevron, Source Log (flag-chip, `background: 'var(--brand-light)', color: 'var(--brand)'`), Type (flag-chip), Target Log (flag-chip, `background: '#faf5ff', color: '#6d28d9'`), Mappings count, Delete (danger icon button). Add `expandedRelId: string | null` state. After each relationship row, inject expansion `<tr><td colSpan={6}>` showing field-mapping detail when `expandedRelId === rel.id`. Keep `.form-panel` create-relationship form in place. All CRUD logic unchanged.
       Files: `src/logs/RelationshipsPage.tsx`
       Verify: `npx tsc --noEmit` exits 0.

- [ ] 13. **Final compile + build verification**
       Run `npx tsc --noEmit` — must exit 0. Then run `npm run build` — must complete with no errors. Fix any remaining TypeScript errors before marking done. This step catches cross-file issues (e.g., a prop type mismatch between `InlineDetailPanel` and a call site, or a missing import).
       Files: none (verification only)
       Verify: `cd /Users/macbookpro/Desktop/ProgrammoCeuticals/logbookbuilder/client && npx tsc --noEmit && npm run build`

---

## Digest

| File | Block to change | What was verified |
|------|----------------|-------------------|
| `src/index.css` | Full file (1189 lines → rewrite) | Baseline `tsc --noEmit` passes; file has two `:root` blocks today (to be unified) |
| `src/App.css` | Full file → single comment | Contains `.counter`, `.hero`, `#center` — confirmed unused in all TSX |
| `src/App.tsx` | No change needed — no `App.css` import present | Confirmed by reading the file |
| `src/shared/components/AppShell.tsx` | Entire component (~75 lines) — replace `app-shell`/`sidebar` with `nav`/`main-content`; add `mobileOpen` state | File read; current import list confirmed |
| `src/auth/LoginPage.tsx` | JSX structure (139 lines) — auth-card layout, wordmark class swap | File size confirmed |
| `src/auth/RegisterPage.tsx` | JSX structure (140 lines) — same as LoginPage | File size confirmed |
| `src/records/SignatureModal.tsx` | Container/header/canvas/intent-block classes (405 lines) | File size confirmed |
| `src/records/RecordEntryForm.tsx` | Label styles → field-label, sync-placeholder, drop-zone, results-table (469 lines) | File size confirmed |
| `src/records/RecordDetailPage.tsx` | Tab system (pc-seg-tab→tab-btn), field-row/fl/fv, sig-row, LineageView/HistoryView borderRadius (772 lines, key lines: 264, 340, 542, 605, 660, 697, 734) | Lines confirmed by grep |
| `src/logs/LogDetailPage.tsx` | section-title, drt-table→results-table (195 lines) | File size confirmed |
| `src/logs/LogsPage.tsx` | Card grid → results-table, StatusFlagChip, filter bar (267 lines) | File size confirmed |
| `src/logs/RelationshipsPage.tsx` | Card list → results-table, expansion row, lbl→field-label (606 lines; `const lbl` at line ~598) | Line confirmed by grep |
| `src/records/RecordsPage.tsx` | +3 state vars, handleRowClick, expansion row, InlineDetailPanel + PanelLineageView + PanelHistoryView sub-components, chevron col (400 lines → ~600 lines) | Current imports confirmed; `recordsApi.history()` returns `{ record, versions }` — use `hist.versions` |
| `src/audit/AuditPage.tsx` | Flex list → results-table, pag-btn pagination (285 lines) | File size confirmed |
| `src/personnel/UsersPage.tsx` | `const lbl` delete + style→className (455 lines; lbl at line ~447) | Line confirmed by grep |
| `src/personnel/PersonnelPage.tsx` | `const lbl` delete + style→className, brand-mid border (475 lines; lbl at line ~467) | Line confirmed by grep |
| `src/builder/LogBuilderPage.tsx` | `const lbl` delete + style→className, section-title (1337 lines; lbl at line ~837) | Line confirmed by grep |
| `src/dashboard/DashboardPage.tsx` | StatCard rewrite (stat-card/stat-val/stat-lbl + modifier), stat-grid, results-table panels, quick-action links (411 lines) | Current imports: TrendingUp, FileText, ClipboardList confirmed unused after rewrite |

**Key TypeScript constraints confirmed during exploration:**
- `RecordVersion` is exported from `src/types/index.ts` — import it in `RecordsPage.tsx`
- `LogRecord` has no `signatures` property — use `(record as any).signatures` (same pattern as `RecordDetailPage.tsx`)
- `recordsApi.history()` return shape: `{ record: LogRecord; versions: RecordVersion[] }` — extract via `hist.versions`
- `NavLink.onClick` in react-router-dom v7 is a standard mouse event handler — no type annotation needed
- `panelData` null sentinel: `record: null as unknown as LogRecord` for error case
- `colSpan={displayColumns.length + 4}` — TypeScript JSX accepts a number, valid
