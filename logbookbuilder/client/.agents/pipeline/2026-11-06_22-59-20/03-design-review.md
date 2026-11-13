# Design Review — LogbookBuilder UI Redesign (GLSI-Inspired)

**Document reviewed:** `02-design.md` (Revision 3)  
**Requirements reviewed:** `01-requirements.md`  
**Reviewer status:** Fresh read — no prior context  
**Source verified against:** `/logbookbuilder/client/src/` (all 16 target files read)

---

## Findings

### Finding 1 — MEDIUM

**Section 4 (DashboardPage JSX) uses different class names than the CSS defined in Section 1**

The CSS section (§1, "Stat card") defines `.pc-stat-card`, `.pc-stat-icon`, `.pc-stat-value`, `.pc-stat-label`.

The DashboardPage JSX section (§4) rewrites `StatCard` to emit:

```tsx
<div className={`stat-card ${modifier}`}>
  <p className="stat-val">{value}</p>
  <p className="stat-lbl">{label}</p>
</div>
```

Those are **unprefixed** `stat-card`, `stat-val`, `stat-lbl` — which are also defined in the CSS section under "Stat grid (unprefixed)." So there are _two_ stat-card systems defined in the CSS: `pc-stat-card` (with `pc-stat-icon`, `pc-stat-value`, `pc-stat-label`) and `stat-card` (with `stat-val`, `stat-lbl`).

The current `DashboardPage.tsx` source uses `pc-stat-card`, `pc-stat-icon`, `pc-stat-value`, `pc-stat-label`. The rewrite switches to the `stat-card` unprefixed system. This is a deliberate change, but the `pc-stat-card` family is now orphaned CSS with no JSX consumer, and `pc-stat-icon` is entirely absent from the redesigned `StatCard`. The FR-4.1 requirement says "No icon box inside the card" which validates removing the icon, but the class name switch is not stated explicitly — it will confuse the implementer.

**Fix:** In §4, add a line: "The `StatCard` sub-component switches from `pc-stat-card`/`pc-stat-value`/`pc-stat-label` to `stat-card`/`stat-val`/`stat-lbl` (the unprefixed system). The `pc-stat-card` CSS block in §1 is retained but will have no JSX consumer after this change; it may be left for future use or removed from `index.css` to avoid dead code."

---

### Finding 2 — MEDIUM

**`panelLoading` is a single shared boolean — concurrent expand clicks will produce incorrect loading state**

In §7 (RecordsPage), `panelLoading: boolean` is shared across all record expansions. The click handler sets `panelLoading(true)` before the `Promise.all` and `setPanelLoading(false)` in `.finally()`. If the user clicks row A (starts fetching, `panelLoading = true`), then immediately clicks row B before A resolves, the handler sets `expandedRecordId` to B's ID but `panelLoading` is still `true` from A's fetch. When A's promise resolves it calls `setPanelLoading(false)`, but B's data may not have arrived yet, so the loading indicator for B disappears before B's data is in `panelData`.

The expansion guard `{panelLoading && !panelData[record.id] ? <pc-loading>` uses both conditions, which partially mitigates this, but when A's `.finally()` fires, `panelLoading` becomes `false` and B's panel would show the "Failed to load" error state (since `panelData[B]` is also still undefined) before B's data arrives.

**Fix:** Replace the shared `panelLoading: boolean` with `panelLoading: Record<string, boolean>` keyed by record ID. Update the click handler:

```ts
setPanelLoading((prev) => ({ ...prev, [recordId]: true }));
// ...in .finally():
setPanelLoading((prev) => {
  const n = { ...prev };
  delete n[recordId];
  return n;
});
```

And update the conditional in the table:

```tsx
{panelLoading[record.id] && !panelData[record.id] ? (
  <div className="pc-loading">Loading…</div>
) : ...}
```

---

### Finding 3 — MEDIUM

**FR-1.4 requires `margin-top: 52px` on `.main-content`; the design omits it**

FR-1.4 explicitly lists `.main-content` with `margin-top: 52px` as a required utility class. The design's nav switches from `position: fixed` (sidebar model) to `position: sticky`. With a sticky nav, `margin-top` is unnecessary — the nav occupies space in flow and the content follows naturally.

However, the requirement was written before the sticky decision was locked, and the spec still says `52px`. An implementer following the requirements literally (AC #2 requires the sticky top nav; FR-1.4 says `52px`) would be confused: if they add `margin-top: 52px` on `.main-content` with a `sticky` nav, the first 52px of content will be hidden behind the nav on first load or after scrolling.

**Fix:** Add a clarifying note in §1 under the `.main-content` definition: "FR-1.4's `margin-top: 52px` requirement was written for a fixed-position nav. The nav is now `position: sticky` (in-flow), so `.main-content` carries `margin-top: 0`. The 52px requirement is superseded by the sticky nav decision documented in §2."

---

### Finding 4 — MEDIUM

**The `--color-*` tokens the design maps in the new `:root` are not defined in the current `index.css` — the existing CSS is already broken for legacy alias classes**

The design states (§1, "Legacy alias classes"): "All `var(--color-*)` references replaced with canonical tokens via the mapping table."

Reading `src/index.css` directly: the legacy alias section (second half of the file) uses `var(--color-blue)`, `var(--color-text-900)`, `var(--color-text-700)`, `var(--color-border-2)`, `var(--color-bg-alt)`, `var(--color-bg-hover)`, `var(--color-border)`, `var(--color-blue-bg)`, `var(--color-blue-bdr)`, etc. **None of these are defined anywhere in the current `index.css`** — neither in the first `:root` block nor the second. The second `:root` block redefines `--navy`, `--bg`, `--accent`, etc. but not `--color-*`.

This means the legacy alias classes (`btn`, `badge`, `card`, `drt-table`, `form-panel`, `breadcrumb`, etc.) in the current codebase are rendering with missing token values (CSS falls back to initial/transparent/inherit). This is a pre-existing defect, not introduced by the design. The design correctly resolves it by defining all `--color-*` tokens in the new `:root`. However, the design should explicitly call out that **this is a live bug** being fixed, so the implementer understands why those aliases look broken before the CSS is rewritten (no surprise during intermediate states).

**Fix:** Add a callout box in §1 before the `:root` block: "⚠ Pre-existing defect: `var(--color-*)` tokens referenced by legacy alias classes in the current `index.css` are undefined. Pages using `btn`, `badge`, `card`, `drt-table`, etc. (LogDetailPage, RelationshipsPage, RecordEntryForm, SignatureModal) currently render with fallback/broken styles. The new `:root` block below fixes this."

---

### Finding 5 — NIT

**§10 (SignatureModal) misidentifies the current outer container class**

The design says: "Outer container: `<div className="card" style={{ borderRadius: 16 }}>` → `<div className="modal-card">`."

Reading `SignatureModal.tsx`: the outer container already uses `className="card"` with `style={{ borderRadius: 16, overflow: "hidden" }}`. This matches. However, the existing header does **not** use `background: '#f8fafc'` as stated in the design — it uses `background: "#f8fafc"` AND `borderBottom: "1px solid #e2e8f0"`. The design's description says "Header `<div>` with `background: '#f8fafc'`" which is accurate, but the replacement instruction ("→ `<div className="modal-header">`") drops the `borderBottom`.

The new `.modal-header` CSS sets `background: var(--brand)` (navy), which gives a navy header as required. However, the existing header contains a gradient icon box (`background: "linear-gradient(135deg, #120e73 0%, #0b5ed7 100%)"`) with `PenLine` icon. The design says "Remove gradient icon box in the header" — this is correct per FR-10.2, but the icon removal should be explicit in the header transformation description so it is not accidentally preserved.

**Fix:** Update §10 header note: "Remove the gradient icon `<div>` (`PenLine` icon box) and the whitespace-title `<span>` — replace with plain white text `Electronic Signature` inside `.modal-header`. The `borderBottom` on the old header is dropped (absorbed by `.modal-header`'s navy background)."

---

### Finding 6 — NIT

**§8 (RecordDetailPage) tab class rename not grounded in current code**

The design says "pc-seg-tabs / pc-seg-tab segment control → .tab-bar / .tab-btn underline bar." This is correct — `RecordDetailPage.tsx` line 340 uses `pc-seg-tabs` / `pc-seg-tab`. However, the design's CSS in §1 defines **both** `pc-seg-tabs`/`pc-seg-tab` as underline-style tabs AND `tab-bar`/`tab-btn` as underline-style tabs — they are visually identical. The comment in §1 says "class names preserved, now render as underline tabs" for `pc-seg-tabs`, yet §8 then says to replace them with `tab-bar`/`tab-btn`.

The result is: after the redesign, `RecordDetailPage` uses `tab-bar`/`tab-btn`, while `InlineDetailPanel` (inside RecordsPage) also uses `tab-bar`/`tab-btn`. The old `pc-seg-tabs`/`pc-seg-tab` CSS rules exist but have no consumers. This is dead CSS, not a functional bug, but it is unnecessary duplication.

**Fix:** Either (a) keep `pc-seg-tabs` in `RecordDetailPage` (the CSS already makes them look like underline tabs) and drop the rename in §8, or (b) rename in §8 as planned and remove the `pc-seg-tabs`/`pc-seg-tab` CSS block from §1. State the choice explicitly.

---

### Finding 7 — NIT

**§2 (AppShell) removes `LogOut` icon import but the design doesn't document the nav-logout button icon**

The design removes `LogOut` from lucide-react imports because "LogOut icon is explicitly dropped." The new `nav-logout` button renders: `<button className="nav-logout" onClick={handleLogout}>Sign out</button>` — text only, no icon.

FR-2.2 describes the right side as "user email chip + 'Sign out' button styled as `.btn btn-ghost`". The design renders it as `.nav-logout` instead of `.btn btn-ghost`. This is acceptable since `nav-logout` is defined in CSS. But the btn class mismatch with the requirement should be noted.

More importantly: the design lists `LogOut` in the "remove imports" list, which is fine. But it does not confirm whether `LayoutDashboard`, `FileText`, `ClipboardList`, `Users`, `UserCheck`, `Building2` are all unused after the sidebar removal. All six are imported for the sidebar icons in the current `NAV` array. The design correctly removes the `NAV` array and replaces with `NAV_ITEMS` (text-only links), so all six icons become unused. The import removal instruction should explicitly list all six.

**Fix:** Update the import removal note in §2: "Remove imports no longer used: `LayoutDashboard`, `FileText`, `ClipboardList`, `Users`, `UserCheck`, `Building2`, `LogOut` (7 total). `BookOpen` remains for the brand icon."

---

### Finding 8 — NIT

**§6 (LogDetailPage) does not specify what happens to the `drt-table` → `results-table` rename**

The design says "`drt-table` → `results-table` (cosmetic rename; both get the same CSS treatment)." But then it adds "JSX pages using `drt-table` don't need JSX class rename" in the results-table CSS definition. This is contradictory — §6 says to rename in LogDetailPage, but the CSS comment says no JSX rename needed.

Reading `LogDetailPage.tsx`: the table uses `className="drt-table"`. The design's new CSS gives both `.drt-table` and `.results-table` the same navy-header treatment. So no JSX rename is actually required. But §6 says to rename, creating an ambiguity for the implementer.

**Fix:** Clarify in §6: "No JSX class rename required in `LogDetailPage.tsx`. The `.drt-table` CSS alias is updated to match `.results-table` (navy header, white text). The name in JSX stays `drt-table`."

---

## Verified Assumptions

| #   | Assumption                                                                        | Verification                                                                                                                                                                                                                                           |
| --- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A1  | `--navy` token exists in current `:root` pointing to `#193441`                    | **CONFIRMED** — First `:root` block in `index.css` has `--navy: #193441`. Second `:root` has `--navy: #120e73` (legacy alias section). The design correctly collapses both into one.                                                                   |
| A3  | No `pc-*` class exists in current `src/index.css`                                 | **CONFIRMED** — Searched `index.css`; zero `.pc-` matches. All `pc-*` classes in TSX files are currently unstyled.                                                                                                                                     |
| A4  | `recordsApi.get()` and `recordsApi.history()` are valid call signatures           | **CONFIRMED** — `RecordDetailPage.tsx` calls both: `recordsApi.get(logId, recordId)` and `recordsApi.history(logId, recordId)`, and extracts `.versions` from history result.                                                                          |
| A5  | `LogRecord.recordNumber: string` and `LogRecord.id: string`                       | **CONFIRMED** — `types/index.ts` defines both fields on `LogRecord`.                                                                                                                                                                                   |
| A7  | `App.css` content is unused in production TSX                                     | **CONFIRMED** — `App.css` contains Vite scaffold code (`.counter`, `.hero`, `#center`, etc.). None of these classes appear in any production `.tsx` file. `App.css` is not imported by `App.tsx` or `main.tsx`, so clearing it has zero visual effect. |
| A8  | Tailwind 4 `@import "tailwindcss"` in `index.css`                                 | **CONFIRMED** — `main.tsx` imports `./index.css`. Current `index.css` line 2: `@import "tailwindcss"`.                                                                                                                                                 |
| A9  | Mobile hamburger uses CSS-only breakpoint detection                               | **CONFIRMED** — Design correctly uses `display: none` (default) / `display: flex` (≤768px) for `.mobile-menu-toggle`. No JS media query needed.                                                                                                        |
| A10 | `NavLink.onClick` accepts `React.MouseEventHandler<HTMLAnchorElement>` in RRD v7  | **CONFIRMED** — `NavLink` renders as `<a>`. The `onClick={() => setMobileOpen(false)}` signature is valid.                                                                                                                                             |
| —   | `(record as any).signatures` cast already used in existing code                   | **CONFIRMED** — `RecordDetailPage.tsx` uses `(record as any).signatures?.find(...)`. `LogRecord` in `types/index.ts` has no `signatures` property. The `as any` cast is consistent with existing practice.                                             |
| —   | `recordsApi.history()` returns `{ record: LogRecord; versions: RecordVersion[] }` | **CONFIRMED** — `RecordDetailPage.tsx` calls `recordsApi.history(logId, recordId)` and destructures as `h.versions` in the `.then(([l, r, h]) => { setHistory(h.versions) })` pattern.                                                                 |
| —   | `LogsPage.tsx` currently uses a card grid (`LogCard` sub-component)               | **CONFIRMED** — `LogsPage.tsx` renders a CSS Grid with `LogCard` components; a `results-table` replacement is correct.                                                                                                                                 |
| —   | `AppShell.tsx` currently renders a sidebar `<aside>` with grouped nav items       | **CONFIRMED** — Full sidebar structure with `sidebar-brand`, `sidebar-nav`, section labels, icons, and `sidebar-footer` with user info. The design's complete structural replacement is accurate.                                                      |
| —   | `App.css` is not imported by `App.tsx` or `main.tsx`                              | **CONFIRMED** — `App.tsx` has no CSS import. `main.tsx` imports `./index.css` only. The "remove import" step in §1 is a no-op (already absent) but harmless.                                                                                           |
| —   | Current `index.css` has two `:root` blocks                                        | **CONFIRMED** — First `:root` at line ~20 (brand tokens). Second `:root` near the bottom (legacy aliases block redefining many of the same names with different values). This dual-`:root` conflict is real and correctly identified.                  |
| —   | `RecordDetailPage.tsx` uses `pc-seg-tabs`/`pc-seg-tab`                            | **CONFIRMED** — Line 340: `<div className="pc-seg-tabs">` with `pc-seg-tab` buttons.                                                                                                                                                                   |
| —   | `RecordVersion` type is exported from `types/index.ts`                            | **CONFIRMED** — `RecordVersion` interface defined in `types/index.ts` and already imported in `RecordDetailPage.tsx`.                                                                                                                                  |

---

## Unverified / Wrong Assumptions

| #   | Assumption in design                                                                                                 | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A2  | "Org name / division info currently in the sidebar footer" — dropped safely                                          | **PARTIALLY WRONG** — `AppShell.tsx` shows not just org name but also user name, user email, division role label ("Division user" / "Admin"). The design drops all of this except email. The user's `name` and admin/division role labels are silently removed from the UI. This is confirmed by design intent (FR-2.4, A2) but no explicit call-out is made in §2 that user name disappears from the nav. Worth noting to avoid an accidental omission report.                               |
| —   | `DashboardPage.tsx` `StatCard` uses `accent`/`accentBg` inline style props that can be dropped                       | **CORRECT BUT INCOMPLETE** — The current `StatCard` uses `pc-stat-card`, `pc-stat-icon`, `pc-stat-value`, `pc-stat-label` with `--stat-accent`/`--stat-bg` CSS custom properties via inline style. The design's rewrite switches to `stat-card ${modifier}` with `stat-val`/`stat-lbl`. The CSS token injection (`--stat-accent`, `--stat-bg`) is abandoned entirely. This is intentional and valid, but the CSS definitions for `pc-stat-card` etc. in §1 are now dead code (see Finding 1). |
| —   | `lb-wordmark`/`lb-wordmark-primary`/`lb-wordmark-secondary` "are classes in LoginPage/RegisterPage"                  | **CONFIRMED CLAIM, BUT** — These classes are used in both auth pages but are **not defined anywhere in the current `index.css`** or `App.css`. They are undefined classes rendering with browser defaults. The design correctly replaces them with `wordmark`/`wordmark span` (which is defined in the current and new CSS).                                                                                                                                                                  |
| —   | "current `App.tsx` source does not have `import './App.css'`"                                                        | **CONFIRMED** — `App.tsx` has no CSS import statement at all. The step is correctly labelled "safety" and is harmless.                                                                                                                                                                                                                                                                                                                                                                        |
| —   | `LogDetailPage.tsx` uses unprefixed `page`, `page-header`, `page-title`, `card`, `btn`, `badge`, `drt-table` classes | **CONFIRMED PARTIALLY** — `LogDetailPage.tsx` uses `page`, `breadcrumb`, `page-header`, `page-title`, `card`, `btn btn-secondary`, `btn-primary`, `drt-table`. Also uses `loading` (not `pc-loading`). The design accounts for all of these.                                                                                                                                                                                                                                                  |

---

## Verdict

**Finding count:** 0 HIGH · 4 MEDIUM · 4 NIT

**VERDICT: CHANGES_REQUESTED**

The four MEDIUM findings must be addressed before implementation:

1. **Finding 1** — Class name conflict between `pc-stat-card` CSS definitions and the DashboardPage JSX rewrite (which uses `stat-card`/`stat-val`/`stat-lbl`). Implementer will be confused about which system to use.
2. **Finding 2** — `panelLoading` single-boolean race condition when two rows are clicked in rapid succession. Needs per-record boolean map.
3. **Finding 3** — `margin-top: 52px` in FR-1.4 conflicts with `position: sticky` nav. A clarifying note is needed so the implementer doesn't add a dead margin.
4. **Finding 4** — Pre-existing `--color-*` broken tokens should be explicitly called out so the implementer understands intermediate breakage during the CSS rewrite.
