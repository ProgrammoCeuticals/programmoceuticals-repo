# Implementation Plan — Analytics Improvements

> **File risk note**: App.jsx is 7014 lines and a single monolith. Every edit must use exact search anchors (unique strings) to locate insertion points — never rely solely on line numbers, as preceding insertions shift subsequent lines. styles.css is 3761 lines; similar care applies.  
> **Build check**: `cd /Users/macbookpro/Desktop/ProgrammoCeuticals/samples/client && npm run build`. No tests exist; a clean compile is the definition of "passing".  
> **clientSubmittedAt** does not exist in the data model. The turnaround's first segment uses `s.createdAt` as the submission timestamp.

---

## FEAT-001: Data & Compute Layer

- [ ] 1. **Gap-fill months in `buildAnalyticsTimeline`** — add missing-month zeroes between earliest and latest month.  
      **File**: `src/App.jsx`  
      **Anchor**: function `buildAnalyticsTimeline` at line 1704. After the `submissions.forEach(...)` block and before the `return {` statement.  
      **Change**: Insert the following block between the `forEach` closing brace and the `return`:
      ```js
      // Gap-fill: insert zero-count entries for months with no records
      const monthKeys = Object.keys(byMonth);
      if (monthKeys.length > 1) {
        const sortedKeys = monthKeys.slice().sort();
        const cursor = new Date(sortedKeys[0] + "-01");
        const last = new Date(sortedKeys[sortedKeys.length - 1] + "-01");
        while (cursor <= last) {
          const mk = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
          if (!byMonth[mk]) byMonth[mk] = 0;
          cursor.setMonth(cursor.getMonth() + 1);
        }
      }
      ```
      **Verify**: `npm run build` — 0 errors.

- [ ] 2. **Add 3 new state variables** for the date range filter.  
      **File**: `src/App.jsx`  
      **Anchor**: line 3015: `const [analyticsDateMode, setAnalyticsDateMode] = useState("sampling");`  
      **Change**: Immediately after that line, insert:
      ```js
      const [analyticsDateRangeMode, setAnalyticsDateRangeMode] = useState("all");
      const [analyticsDateFrom, setAnalyticsDateFrom] = useState("");
      const [analyticsDateTo, setAnalyticsDateTo] = useState("");
      ```
      **Verify**: `npm run build` — 0 errors.

- [ ] 3. **Reset new state variables in `clearAdminSession`**.  
      **File**: `src/App.jsx`  
      **Anchor**: `setAnalyticsDateMode("sampling");` inside `clearAdminSession` (~line 3500).  
      **Change**: After that line, add:
      ```js
      setAnalyticsDateRangeMode("all");
      setAnalyticsDateFrom("");
      setAnalyticsDateTo("");
      ```
      **Verify**: `npm run build` — 0 errors.

- [ ] 4. **Derive `analyticsSubmissions` useMemo** — filtered view of submissions for all analytics.  
      **File**: `src/App.jsx`  
      **Anchor**: The line `const analytics = useMemo(() => {` (line ~4841). Insert the new memo BEFORE this line.  
      **Change**: Insert:
      ```js
      const analyticsSubmissions = useMemo(() => {
        if (analyticsDateRangeMode === "all") return submissions;
        return submissions.filter((s) => {
          const raw = s.sampleReceivedDate || s.createdAt;
          const dk = getDateKeyFromValue(raw);
          if (!dk) return false;
          if (analyticsDateFrom && dk < analyticsDateFrom) return false;
          if (analyticsDateTo && dk > analyticsDateTo) return false;
          return true;
        });
      }, [submissions, analyticsDateRangeMode, analyticsDateFrom, analyticsDateTo]);
      ```
      **Verify**: `npm run build` — 0 errors.

- [ ] 5. **Rewrite analytics useMemo** — 11 sub-changes, all inside the `const analytics = useMemo(() => { ... }, [submissions]);` block.  
      **File**: `src/App.jsx`  
      **Anchor**: `const analytics = useMemo(() => {` and closing `}, [submissions]);` at line ~4916.

      **(a)** Change `const total = submissions.length;` → `const total = analyticsSubmissions.length;`

      **(b)** Change `if (!total) return null;` — keep as-is.

      **(c)** After `const byGeneric = {};` add:
      ```js
      const byGenericDisplay = {};
      const byDosageForm = {};
      const byCountry = {};
      const byRejectionReason = {};
      ```

      **(d)** Change `for (const s of submissions) {` → `for (const s of analyticsSubmissions) {`

      **(e)** Replace the byGeneric block:
      ```js
      // BEFORE:
      const gen =
        `${s.genericName || s.productSampleAnswers?.generic_name || ""}`.trim();
      if (gen) byGeneric[gen] = (byGeneric[gen] || 0) + 1;

      // AFTER:
      const gen =
        `${s.genericName || s.productSampleAnswers?.generic_name || ""}`.trim();
      if (gen) {
        const genKey = gen.toLowerCase();
        byGeneric[genKey] = (byGeneric[genKey] || 0) + 1;
        if (!byGenericDisplay[genKey]) byGenericDisplay[genKey] = gen;
      }
      ```

      **(f)** After the `if (gen)` block, still inside the `for` loop, add:
      ```js
      const dosageForm = (
        s.dosageForm || s.productSampleAnswers?.dosage_form || ""
      ).trim();
      if (dosageForm) byDosageForm[dosageForm] = (byDosageForm[dosageForm] || 0) + 1;

      const country = (s.productSampleAnswers?.country_of_origin || "").trim();
      if (country) byCountry[country] = (byCountry[country] || 0) + 1;

      if (
        s.status === "REJECTED" &&
        s.decisionRemark &&
        s.decisionRemark.trim()
      ) {
        const rr = s.decisionRemark.trim();
        byRejectionReason[rr] = (byRejectionReason[rr] || 0) + 1;
      }
      ```

      **(g)** After the closing `}` of the `for` loop, add turnaround time computation:
      ```js
      function parseDayKey(val) {
        const dk = getDateKeyFromValue(val);
        return dk ? new Date(dk) : null;
      }
      function segmentStats(getter) {
        const diffs = [];
        for (const s of analyticsSubmissions) {
          const [start, end] = getter(s);
          const d0 = parseDayKey(start);
          const d1 = parseDayKey(end);
          if (!d0 || !d1) continue;
          const days = (d1 - d0) / 86400000;
          if (days < 0) continue;
          diffs.push(days);
        }
        if (!diffs.length) return { count: 0, avg: "N/A", min: "N/A", max: "N/A" };
        const avg = (diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(1);
        const min = Math.min(...diffs).toFixed(1);
        const max = Math.max(...diffs).toFixed(1);
        return { count: diffs.length, avg, min, max };
      }
      const turnaround = {
        submissionToReceived: segmentStats((s) => [s.createdAt, s.sampleReceivedDate]),
        receivedToLab: segmentStats((s) => [s.sampleReceivedDate, s.takenToLabDate]),
        labToReport: segmentStats((s) => [s.takenToLabDate, s.labReportReceivedDate]),
      };
      ```

      **(h)** After the `top` helper, replace the `topGeneric` line in the return object. Instead of:
      ```js
      topGeneric: top(byGeneric),
      ```
      use:
      ```js
      topGeneric: top(byGeneric).map(([k, v]) => [byGenericDisplay[k] || k, v]),
      ```

      **(i)** Change all 3 `buildAnalyticsTimeline(submissions, ...)` calls → `buildAnalyticsTimeline(analyticsSubmissions, ...)`.

      **(j)** Add to the return object (after `genericCount`):
      ```js
      topDosageForm: top(byDosageForm),
      topCountry: top(byCountry),
      topRejectionReasons: top(byRejectionReason),
      turnaround,
      dosageFormCount: Object.keys(byDosageForm).length,
      countryCount: Object.keys(byCountry).length,
      ```

      **(k)** Change closing dep array from `}, [submissions]);` → `}, [analyticsSubmissions]);`

      **Verify**: `npm run build` — 0 errors.

---

## FEAT-002: UI Layer

- [ ] 6. **Add date range filter strip** above the analytics-hero div.  
      **File**: `src/App.jsx`  
      **Anchor**: `<div className="analytics-shell">` (line 6215). Insert immediately after that line, before `<div className="analytics-hero">`.  
      **Change**: Insert:
      ```jsx
      <div className="analytics-filter-strip">
        <span className="analytics-filter-label">Filter by date received</span>
        <div className="analytics-filter-toggles" role="group" aria-label="Date range filter">
          {[
            { key: "all", label: "All time" },
            { key: "month", label: "This month" },
            { key: "custom", label: "Custom" },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`analytics-date-btn ${analyticsDateRangeMode === opt.key ? "is-active" : ""}`.trim()}
              onClick={() => {
                if (opt.key === "month") {
                  const now = new Date();
                  const y = now.getFullYear();
                  const m = String(now.getMonth() + 1).padStart(2, "0");
                  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
                  setAnalyticsDateFrom(`${y}-${m}-01`);
                  setAnalyticsDateTo(`${y}-${m}-${String(lastDay).padStart(2, "0")}`);
                } else if (opt.key === "all") {
                  setAnalyticsDateFrom("");
                  setAnalyticsDateTo("");
                }
                setAnalyticsDateRangeMode(opt.key);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {analyticsDateRangeMode === "custom" && (
          <div className="analytics-filter-dates">
            <label>
              From{" "}
              <input
                type="date"
                value={analyticsDateFrom}
                onChange={(e) => setAnalyticsDateFrom(e.target.value)}
              />
            </label>
            <label>
              To{" "}
              <input
                type="date"
                value={analyticsDateTo}
                onChange={(e) => setAnalyticsDateTo(e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      ```
      **Verify**: `npm run build` — 0 errors.

- [ ] 7. **Add dosage form + country of origin bar cards**.  
      **File**: `src/App.jsx`  
      **Anchor**: The closing `</div>` of the `analytics-card analytics-card-full` (Top generic names block). The unique search anchor is:
      ```
              <AnalyticsBar
                data={analytics.topGeneric}
                total={analytics.total}
                colorVar="var(--gold)"
              />
            </div>
      ```
      The second `</div>` there closes the analytics-card-full. After it, insert a new `analytics-grid` div:
      ```jsx
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-card-head">
            <div className="analytics-card-title-block">
              <span className="analytics-card-kicker">Dosage Forms</span>
              <h4 className="analytics-card-title">Top dosage forms</h4>
            </div>
            <span className="analytics-card-meta">
              {analytics.dosageFormCount} forms tracked
            </span>
          </div>
          <AnalyticsBar
            data={analytics.topDosageForm}
            total={analytics.total}
            colorVar="var(--accent-mid)"
          />
        </div>
        <div className="analytics-card">
          <div className="analytics-card-head">
            <div className="analytics-card-title-block">
              <span className="analytics-card-kicker">Origin</span>
              <h4 className="analytics-card-title">Top countries of origin</h4>
            </div>
            <span className="analytics-card-meta">
              {analytics.countryCount} countries tracked
            </span>
          </div>
          <AnalyticsBar
            data={analytics.topCountry}
            total={analytics.total}
            colorVar="var(--ok)"
          />
        </div>
      </div>
      ```
      **Verify**: `npm run build` — 0 errors.

- [ ] 8. **Add rejection reasons bar card** (conditional).  
      **File**: `src/App.jsx`  
      **Anchor**: Immediately after the closing `</div>` of the dosage form / country grid inserted in step 7.  
      **Change**: Insert:
      ```jsx
      {analytics.topRejectionReasons.length > 0 && (
        <div className="analytics-card analytics-card-full">
          <div className="analytics-card-head">
            <div className="analytics-card-title-block">
              <span className="analytics-card-kicker">Quality</span>
              <h4 className="analytics-card-title">
                Rejection reason frequency
              </h4>
            </div>
            <span className="analytics-card-meta">
              {analytics.topRejectionReasons.length} distinct reasons
            </span>
          </div>
          <AnalyticsBar
            data={analytics.topRejectionReasons}
            total={analytics.byStatus["REJECTED"] || 0}
            colorVar="var(--danger)"
          />
        </div>
      )}
      ```
      **Verify**: `npm run build` — 0 errors.

- [ ] 9. **Add turnaround time panel**.  
      **File**: `src/App.jsx`  
      **Anchor**: Immediately after the rejection reasons conditional block inserted in step 8, still inside the analytics-shell div.  
      **Change**: Insert:
      ```jsx
      <div className="analytics-card analytics-card-full">
        <div className="analytics-card-head">
          <div className="analytics-card-title-block">
            <span className="analytics-card-kicker">Efficiency</span>
            <h4 className="analytics-card-title">Turnaround time metrics</h4>
          </div>
          <span className="analytics-card-meta">
            Average days between workflow stages
          </span>
        </div>
        <div className="analytics-turnaround-row">
          {[
            {
              badge: "S→R",
              label: "Submission → Received",
              seg: analytics.turnaround.submissionToReceived,
            },
            {
              badge: "R→L",
              label: "Received → Lab",
              seg: analytics.turnaround.receivedToLab,
            },
            {
              badge: "L→P",
              label: "Lab → Report",
              seg: analytics.turnaround.labToReport,
            },
          ].map((item) => (
            <div
              key={item.badge}
              className="analytics-kpi-card analytics-kpi-card--sm"
              style={{ "--kpi-accent": "var(--accent-mid)" }}
            >
              <div className="analytics-kpi-card-head">
                <span className="analytics-kpi-icon">{item.badge}</span>
                <span className="analytics-kpi-label">{item.label}</span>
              </div>
              {item.seg.count > 0 ? (
                <>
                  <span className="analytics-kpi-value">{item.seg.avg}d</span>
                  <span className="analytics-kpi-meta">
                    min {item.seg.min}d / max {item.seg.max}d / n={item.seg.count}
                  </span>
                </>
              ) : (
                <span className="analytics-kpi-meta">No data yet</span>
              )}
            </div>
          ))}
        </div>
      </div>
      ```
      **Verify**: `npm run build` — 0 errors.

- [ ] 10. **Add new CSS rules** to `src/styles.css`.  
       **File**: `src/styles.css`  
       **Anchor**: The comment `/* ── Guide ── */` at line ~3288. Insert the new rules BEFORE that comment.  
       **Change**: Insert:
       ```css
       /* ── Analytics filter strip ── */
       .analytics-filter-strip {
         display: flex;
         flex-wrap: wrap;
         align-items: center;
         gap: 10px;
         padding: 12px 16px;
         background: var(--surface-raised);
         border: 1px solid var(--border);
         border-radius: var(--radius-lg);
         font-size: var(--text-sm);
       }
       .analytics-filter-label {
         color: var(--ink-muted);
         font-weight: 600;
         white-space: nowrap;
       }
       .analytics-filter-toggles {
         display: flex;
         flex-wrap: wrap;
         gap: 6px;
       }
       .analytics-filter-dates {
         display: flex;
         flex-wrap: wrap;
         align-items: center;
         gap: 8px;
       }
       .analytics-filter-dates label {
         display: flex;
         align-items: center;
         gap: 4px;
         color: var(--ink-muted);
         font-size: var(--text-sm);
         font-weight: 600;
       }
       .analytics-filter-dates input[type="date"] {
         padding: 4px 8px;
         border: 1px solid var(--border);
         border-radius: var(--radius-sm);
         background: var(--surface);
         color: var(--ink);
         font-size: var(--text-sm);
       }
       /* ── Analytics KPI card (small modifier) ── */
       .analytics-kpi-card--sm {
         padding: 12px 14px;
         gap: 8px;
       }
       .analytics-kpi-card--sm .analytics-kpi-value {
         font-size: clamp(1.25rem, 2vw, 1.6rem);
       }
       /* ── Turnaround row ── */
       .analytics-turnaround-row {
         display: grid;
         grid-template-columns: repeat(3, minmax(0, 1fr));
         gap: 12px;
       }
       ```
       Also, inside the existing `@media (max-width: 640px)` block (near line 3513), add:
       ```css
         .analytics-turnaround-row {
           grid-template-columns: 1fr;
         }
         .analytics-filter-strip {
           flex-direction: column;
           align-items: flex-start;
         }
       ```
       **Verify**: `npm run build` — 0 errors.

- [ ] 11. **Final build + smoke check**.  
       Run `npm run build` from the client directory. The build must complete with 0 errors. Check the compiled output includes the new class names by running:
       ```
       grep -c "analytics-filter-strip\|analytics-turnaround-row\|analytics-kpi-card--sm" build/static/css/main.*.css
       ```
       Expected: at least 1 match for each class name (3 total or more).  
       **Verify**: `npm run build` exits 0.
