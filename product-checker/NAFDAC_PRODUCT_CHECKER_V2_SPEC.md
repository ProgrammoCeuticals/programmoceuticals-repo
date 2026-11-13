# NAFDAC Product Regulatory Checker V2 — Amazon Q / Codex Implementation Specification

## 0. Mission

Upgrade the existing frontend-only Product Checker application in this repository. Do not rebuild the product from scratch and do not introduce a backend.

The purpose of V2 is to provide a trustworthy **NAFDAC/Nigeria pharmaceutical product regulatory screening experience** that lets a user search a product, active ingredient, combination, strength, dosage form, or directive-related term and see which regulatory restriction sources and product-specific directives apply.

This document is the implementation contract. Read it together with the existing source code and the supplied `data/` package.

## 1. Non-negotiable constraints

1. Frontend-only architecture. No database server, REST API, authentication service, Node backend, or hosted search service.
2. Keep React + Vite unless there is a compelling, documented reason to change the framework.
3. Keep existing PDF export functionality unless the upgrade replaces it with an equal or better implementation.
4. Regulatory data must be bundled locally and available offline after the app loads.
5. Do not fabricate or infer NAFDAC regulatory rules.
6. Do not present an unverified legacy NTI entry as an authoritative NAFDAC restriction.
7. Do not present a general pharmacovigilance/process directive as a product-specific prohibition merely because the word “directive” exists.
8. Do not use fuzzy matching as the sole basis for a hard regulatory hit. Fuzzy matches may power suggestions or a “possible match — verify” state.
9. Every displayed regulatory match must have provenance metadata.
10. Preserve historical/superseded regulatory records; never silently overwrite them.

## 2. Current V1 baseline

The supplied V1 uses:

- React 18
- Vite 5
- `src/components/ProductChecker.jsx`
- `src/components/ProductChecker.css`
- `src/utils/nafdacCeilingList.js` — 36 entries
- `src/utils/fivePlusFivePolicy.js` — 29 entries
- `src/utils/importProhibitionList.js` — 77 entries
- `src/utils/fdcRegulatoryDirective.js` + part2 — 353 entries
- `src/utils/narrowTherapeuticIndex.js` — 254 names
- `src/utils/synonyms.js`

The V1 search uses normalized strings, synonyms, and Jaccard similarity. Keep the useful ideas but replace regulatory determination logic with a typed, explainable matching engine.

## 3. V2 regulatory taxonomy

### REGULATORY RESTRICTIONS

- Ceiling List
- 5+5 Policy
- Import Prohibition List
- NTI List

### REGULATORY DIRECTIVES

- Product-specific directives
- Product-class directives
- General regulatory obligations (indexed, but not product-matched by default)

Optional reference data, such as Greenbook, must remain separate and must never be mistaken for a restriction list.

## 4. Regulatory semantics

The application must not collapse all findings to `FLAGGED`.

### Ceiling List
Meaning: the product/API is within the NAFDAC Ceiling List scope. The UI should use language such as “Ceiling List restriction / local-manufacturing registration scope”, subject to the exact source wording.

### 5+5
Meaning: the product is within the 5+5 validity policy. The UI should explain the local-manufacturing pathway and, where source data supports it, the strength/dosage-form limitation.

### Import Prohibition
Authority: Nigeria Customs Service (NCS), not NAFDAC. The result describes an import prohibition under the applicable trade/CET scope. Store HS code and exclusions where available. Do not claim that the item is prohibited in every conceivable context when the source is conditional.

### NTI
Meaning: narrow-therapeutic-index consideration for bioequivalence/biowaiver/regulatory review. NTI is not equivalent to a generic import ban. Legacy V1 entries marked unverified must display as reference/verification-required and must not produce an authoritative prohibition result.

### Directives
A directive hit must state the regulatory action and scope from the underlying directive. Examples include discontinuation of registration, ban, composition restriction, or other specified action. General obligations such as PSUR/PBRER must not appear as product-specific findings unless the directive actually has product/class applicability.

## 5. Data architecture

Move regulatory data into a normalized local data layer, preferably:

```text
src/
  data/
    regulatory/
      sources.json
      ceiling-list.json
      five-plus-five.json
      import-prohibition.json
      nti-reference.json
      directives/
        directives-index.json
        directive-affected-products.json
  catalog/
    ingredients.json
    dosage-forms.json
    synonyms.json
```

It is acceptable to keep JS modules instead of JSON if the resulting build is smaller/faster, but the schema must remain consistent.

### Common source object

Every source must support:

```ts
{
  id: string;
  authority: 'NAFDAC' | 'NCS' | string;
  type: string;
  title: string;
  documentRef?: string | null;
  version?: string | null;
  edition?: string | null;
  effectiveDate?: string | null;
  reviewDate?: string | null;
  url?: string | null;
  status: 'active' | 'superseded' | 'revoked' | 'expired' | 'verification_required';
  retrievedAt: string;
  verifiedAt?: string | null;
}
```

### Canonical ingredient

```ts
{
  id: string;
  canonicalName: string;
  aliases: string[];
  normalizedAliases: string[];
}
```

Do not make the raw display name the primary key.

### Restriction entry

```ts
{
  id: string;
  restrictionType: 'ceiling' | 'five_plus_five' | 'import_prohibition' | 'nti';
  sourceId: string;
  subjectType: 'ingredient' | 'combination' | 'product_class' | 'trade_item';
  subjectName: string;
  canonicalIngredientIds?: string[];
  strength?: string | null;
  dosageForm?: string | null;
  route?: string | null;
  hsCode?: string | null;
  exclusions?: string | null;
  notes?: string | null;
  effectCode: string;
  verificationStatus: 'verified' | 'verification_required' | 'legacy_reference';
}
```

### Directive

```ts
{
  id: string;
  authority: 'NAFDAC';
  documentRef?: string | null;
  title: string;
  category: 'product_specific' | 'product_class_specific' | 'general_regulatory_obligation';
  action: string;
  effectiveDate?: string | null;
  reviewDate?: string | null;
  status: 'active' | 'superseded' | 'revoked' | 'expired' | 'verification_required';
  sourceId: string;
  summary: string;
  scope: string;
}
```

### Directive affected entity

Do not store affected products merely as strings on the directive record.

```ts
{
  id: string;
  directiveId: string;
  subjectType: 'ingredient' | 'combination' | 'product_class' | 'dosage_form' | 'pack_size';
  subjectName: string;
  canonicalIngredientIds?: string[];
  strength?: string | null;
  dosageForm?: string | null;
  route?: string | null;
  packSize?: string | null;
  actionOverride?: string | null;
  evidence?: string | null;
}
```

## 6. Data migration requirements

### Ceiling List

Import the 36-item verified PDF baseline supplied in `data/ceiling-list.json`.

Important: the current NAFDAC Dossier ceiling page was observed to contain **TRAMADOL**, which is not in the 36-item PDF baseline. Do not add TRAMADOL to the canonical list until an authoritative source reconciliation has been performed. Store it in a source-conflict queue.

### 5+5

Import all 29 products from `data/five-plus-five.json`.

Retain exact strength/dosage-form language. Do not turn a row into an ingredient-wide match when the source only applies to certain forms/strengths.

### Import Prohibition

Replace the old V1 list. The current authority for the trade import prohibition dataset is NCS. The NCS 2026 portal reports 111 total prohibition items. The supplied seed `data/import-prohibition-pharma-2026.json` contains the pharmaceutical subset relevant to this application.

For each pharma entry, preserve:

- item description
- category
- HS code
- exclusions
- notes
- NCS authority
- current CET/edition

If future scope includes food, agriculture, industrial or other trade goods, extend the same schema to the full 111-item NCS dataset instead of appending arbitrary V1 items.

### NTI

Keep `data/nti-reference-legacy.json` isolated as reference-only.

The current NAFDAC 2025 Bioequivalence guideline supports NTI-specific regulatory treatment but the verified source material does not establish the V1 254-name array as an official master NAFDAC NTI list. Therefore:

- do not use legacy NTI entries for `authoritativeRestriction = true`;
- display a verification badge where a legacy entry matches;
- add an explicit data-migration hook so independently verified NTI entries can later be promoted to authoritative status;
- never call an NTI match “import prohibited” unless another authoritative source independently says so.

### Regulatory Directives

The V1 first 338 records are the affected-entry list of NAFDAC-RDD-030-00. The V1 entries 339-353 are mixed/unattributed and must not remain in one catch-all directive dataset.

Create the directive record for NAFDAC-RDD-030-00 and migrate the first 338 affected combinations to it.

For V1 entries 339-353:

```text
339 Cyproheptadine (2mg & 4mg) in Combination with Multivitamin
340 Halofantrine
341 Multi-Dose Anti-Malaria Oral Suspensions
342 Ketoconazole Tablet
343 Diclofenac Sodium 50mg + Paracetamol 325mg + Chlorzoxazone 250mg
344 Diclofenac Potassium 100mg
345 Chloroquine Injection
346 Analgin (Metamizole) / Novalgin (Dipyrone)
347 Aceclofenac Sodium 100mg + Paracetamol 500mg + Chlorzoxazone 250mg
348 Dichlorvos (DDVP) <=100ml pack sizes
349 Antibiotics as Growth Promoters in Livestock
350 Banned Veterinary Pharmaceuticals in Food-Producing Animals
351 Colistin as Coccidiostat
352 Ethoxyquin in Feed for Food-Producing Animals
353 Paraquat
```

Keep them in the verification queue until each one is linked to its exact official NAFDAC directive and action.

The current official directive repository must also be indexed for current 2025-2030 and 2026-2031 documents. Include general directives such as PSUR/PBRER and pharmacovigilance obligations in the index, but classify them as `general_regulatory_obligation` so they do not create false product hits.

## 7. Search model

Create a search pipeline:

```text
input
  ↓
parse product fields
  ↓
normalize
  ↓
expand trusted aliases
  ↓
canonicalize ingredients
  ↓
match exact / normalized / synonym / combination
  ↓
apply scope constraints (strength/form/route/pack size)
  ↓
apply source status
  ↓
produce evidence-rich result
```

### Match tiers

Use explicit match types:

- `exact`
- `normalized_exact`
- `canonical_alias`
- `combination_exact`
- `combination_normalized`
- `scope_match`
- `possible_fuzzy_match`
- `source_conflict`

Only the first six may produce an authoritative match. `possible_fuzzy_match` is advisory.

### Combination rules

For a source combination entry containing multiple active ingredients, all required ingredients should be present in the user-entered combination before returning an authoritative combination match, unless the source explicitly defines a single active ingredient/product-class rule.

Do not use the V1 rule “two matched terms is enough” as the universal rule.

### Strength and dosage form

If source data specify strength and dosage form, evaluate them. An ingredient name match alone must not override an explicit source scope.

For `ALL STRENGTHS` / `ALL DOSAGE FORMS`, treat these as explicit wildcards.

For exclusions, implement explicit negative conditions where the source permits it.

### Generic-name aliases

Keep the existing synonym dictionary as a seed, but clean it and avoid unsafe aliases. `acetaminophen → paracetamol` is acceptable as an alias. Product brand names should not be mapped as authoritative ingredient aliases unless the mapping is verified.

### RxNorm

RxNorm may be used for autocomplete or non-authoritative suggestions, but never for the final regulatory match. The application must remain functional and regulatory-deterministic when RxNorm is unavailable.

## 8. Regulatory assessment engine

Return a typed assessment object:

```ts
{
  productQuery: { raw: string; ingredients: string[]; strength?: string; dosageForm?: string };
  restrictions: {
    ceiling: RegulatoryResult;
    fivePlusFive: RegulatoryResult;
    importProhibition: RegulatoryResult;
    nti: RegulatoryResult;
  };
  directives: DirectiveResult[];
  overall: {
    level: 'clear' | 'review' | 'restricted' | 'prohibited' | 'verification_required';
    headline: string;
    reasons: string[];
  };
}
```

Do not derive `overall = prohibited` from a Ceiling/5+5/NTI finding alone.

A prohibited overall result should require a source whose action is actually prohibitive for the matched scope (e.g. an applicable import-prohibition or ban directive).

## 9. UI redesign

The UI should feel like a professional regulatory intelligence tool, not a generic list checker.

### Home/search area

- Strong title: “NAFDAC Product Regulatory Checker”
- Search by product/ingredient/combination
- Optional structured fields: strength, dosage form, route
- Recent/suggested searches
- Clear explanation that this is a regulatory screening tool and users should consult the source documents for final decisions

### Results summary

Show an at-a-glance regulatory matrix:

```text
Ceiling List          FOUND / CLEAR / VERIFY
5+5 Policy            FOUND / CLEAR / VERIFY
Import Prohibition    FOUND / CLEAR / VERIFY
NTI                   REVIEW / CLEAR / VERIFY
Directives            0 / 1 / N
```

### Result cards

Every result card should display:

- outcome
- what matched
- match tier
- regulatory meaning
- source authority
- document/reference
- effective/review date where applicable
- source link
- “Why this matched” section

### Directive view

Clicking a directive result should show:

- directive title
- document ref
- action
- scope
- effective date
- review date
- affected entity
- exact source evidence where available
- official source link

### Source conflicts

If two official/current-looking sources disagree, show:

> “Source conflict — verification required”

Never silently choose a source.

## 10. Data freshness UX

Display a small “Data verified” or “Data last reviewed” indicator.

The footer/about area should show:

- data version
- last verified date
- source authorities
- source links

Use `verification_required` when a record has not been reconciled.

## 11. Performance

The app is frontend-only, so do not load enormous raw structures into React state on every keystroke.

- Build a precomputed normalized index at module load or build time.
- Keep search computations pure and memoized where useful.
- Debounce remote autocomplete only.
- Local regulatory matching must be instant.
- Avoid rerendering the entire result page while the user types.

If the final local dataset becomes very large, use a build-time compact index or browser-side SQLite/WASM only after measuring the need. Do not add complexity prematurely.

## 12. Accessibility

- Keyboard-accessible search and results.
- ARIA labels for badges and expandable evidence.
- Do not rely on color alone for `FOUND`, `CLEAR`, `REVIEW`, `PROHIBITED`.
- Mobile-friendly layout.
- Good print/PDF layout.

## 13. Testing requirements

Create unit tests for the regulatory engine.

At minimum test:

### Case A — Ciprofloxacin 500 mg Tablet
Expected: Ceiling match; 5+5 match; import prohibition should be evaluated independently; NTI should only match if an authoritative NTI record exists; directives should be scoped correctly.

### Case B — Paracetamol Tablet
Expected: import-prohibition scope check; ceiling/5+5 results evaluated independently.

### Case C — Paraquat
Expected: product-specific directive match once its official directive record is populated; do not mislabel it merely because it appears in the legacy V1 directive tail.

### Case D — Levamisole Syrup
Expected: current NCS pharmaceutical import prohibition and current NAFDAC levamisole directive are evaluated independently; do not merge them into one generic prohibition.

### Case E — Non-matching common product
Expected: all sources clear/none and an overall clear state.

### Case F — FDC exact combination
Expected: all required active ingredients must be present before a directive hit is authoritative.

### Case G — Source conflict (Tramadol)
Expected: `verification_required` / source-conflict state, not an automatic Ceiling List hit.

## 14. Build-quality gates

The build should fail or tests should fail when:

- a regulatory record has no sourceId;
- an authoritative record has no verification status;
- a directive affected entity has no directiveId;
- a source has no authority/title;
- duplicate canonical IDs exist;
- an active record has an impossible date order;
- a fuzzy-only match is upgraded to an authoritative restriction;
- a general directive appears in default product-specific results without explicit applicability.

## 15. Suggested project structure

```text
src/
  components/
    ProductChecker/
      ProductChecker.jsx
      SearchBar.jsx
      SearchSummary.jsx
      RestrictionGrid.jsx
      RestrictionCard.jsx
      DirectiveResults.jsx
      DirectiveDetail.jsx
      EvidencePanel.jsx
      DataStatus.jsx
  data/
    regulatory/
      sources.json
      ceiling-list.json
      five-plus-five.json
      import-prohibition.json
      nti-reference.json
      directives/
        directives-index.json
        directive-affected-products.json
  services/
    regulatoryEngine.js
    normalization.js
    ingredientMatcher.js
    directiveMatcher.js
    sourceResolver.js
  utils/
    synonyms.js
  styles/
    ...
```

It is acceptable to simplify this structure if the existing codebase can be upgraded cleanly without excessive file fragmentation.

## 16. Legacy cleanup

After migration:

- remove the old `importProhibitionList.js` as a source of truth;
- remove direct regulatory matching against `fdcRegulatoryDirective_part2.js` as a flat array;
- remove “NAFDAC” attribution from the NCS import-prohibition dataset;
- isolate the legacy NTI array;
- keep a migration note rather than deleting historical data silently;
- keep source URLs centralized.

## 17. Final UX language

Prefer:

- “Found on Ceiling List”
- “5+5 policy applies”
- “Import prohibition match”
- “NTI / BE review”
- “Applicable directive found”
- “Verification required”

Avoid:

- “Banned” when the source only indicates a local-manufacturing restriction.
- “Prohibited” when the source is a policy/BE consideration.
- “NAFDAC Import Prohibition List” when the source is NCS.

## 18. Source references

Official sources to use as the primary provenance layer:

- NAFDAC Ceiling List PDF: https://www.nafdac.gov.ng/wp-content/uploads/Files/Resources/UPDATED-NAFDAC-CEILING-LIST.pdf
- NAFDAC Dossier Ceiling List: https://dossier.nafdac.gov.ng/ceiling-list
- NAFDAC 5+5 Policy: https://www.nafdac.gov.ng/wp-content/uploads/Files/Resources/Note_To_Industry_2024/PRODUCTS-FOR-55-VALIDITY-POLICY.pdf
- NAFDAC Regulatory Directives repository: https://nafdac.gov.ng/regulatory-resources/regulatory-directive/
- NAFDAC FDC Directive NAFDAC-RDD-030-00: https://nafdac.gov.ng/wp-content/uploads/Files/Resources/Regulatory_Directive/2025-2030/NAFDAC-Regulatory-Directives-on-the-Discontinuation-of-Some-Fixed-Dose-Combination-FDCs-Drugs.pdf
- NAFDAC Paraquat directive: https://nafdac.gov.ng/wp-content/uploads/Files/Resources/Regulatory_Directive/2025-2030/Regulatory-Directive-on-the-ban-on-Paraquat.pdf
- NAFDAC 2025 Bioequivalence Guideline: https://www.nafdac.gov.ng/wp-content/uploads/Files/Resources/Guidelines/ICH_Guidelines/NAFDAC-Guidelines-on-the-Investigation-of-Bioequivalence-2025.pdf
- NAFDAC 2026-2031 Levamisole directive: https://nafdac.gov.ng/wp-content/uploads/Files/Resources/Regulatory_Directive/2026-2031/Regulatory-Directive-On-Levamisole-Containing-Human-Medicinal-Products.pdf
- NAFDAC 2026-2031 PSUR/PBRER directive: https://nafdac.gov.ng/wp-content/uploads/Files/Resources/Regulatory_Directive/2026-2031/Regulatory-Directive-on-PSUR-PBRER.pdf
- NAFDAC 2026-2031 Pharmacovigilance reporting timelines directive: https://nafdac.gov.ng/wp-content/uploads/Files/Resources/Regulatory_Directive/2026-2031/Regulatory-Directive-on-Reporting-timelines-Pharmacovigilance.pdf
- NAFDAC 2026-2031 local MAH pharmacovigilance directive: https://nafdac.gov.ng/wp-content/uploads/Files/Resources/Regulatory_Directive/2026-2031/Regulatory-Directive-On-Pharmcovigilance-Activities-For-Local-Marketing-Authorization-Holders-MAHs.pdf
- NAFDAC veterinary antimicrobial formulation directive: https://nafdac.gov.ng/wp-content/uploads/Files/Resources/Regulatory_Directive/2025-2030/Regulatory-Directive-on-the-Formulation-of-Veterinary-Product-With-not-More-Than-two2-Antimicrobials.pdf
- NCS current import prohibition portal: https://demo-cet.customs.gov.ng/import-prohibition

## 19. Implementation sequence

### Phase 1 — data migration

1. Create the new regulatory data directories.
2. Add the supplied datasets.
3. Add source metadata.
4. Map the 36 Ceiling entries.
5. Map the 29 5+5 entries.
6. Replace the stale NCS import list with the supplied NCS 2026 pharmaceutical subset.
7. Isolate NTI legacy reference records.
8. Create the directive index and migrate the first 338 FDC entries.
9. Put V1 entries 339-353 into the verification queue.

### Phase 2 — search engine

1. Implement normalization.
2. Implement canonical ingredients and aliases.
3. Implement exact/scope-aware combination matching.
4. Implement source status handling.
5. Implement explainable result objects.
6. Add unit tests.

### Phase 3 — UI

1. Redesign the search header.
2. Build the regulatory summary matrix.
3. Build source-specific result cards.
4. Build directive details/evidence.
5. Build source conflict/verification displays.
6. Preserve and improve PDF export.

### Phase 4 — verification and hardening

1. Run all tests.
2. Run `npm run build`.
3. Test offline functionality.
4. Test mobile and print views.
5. Confirm no general directive false positives.
6. Confirm every authoritative result has provenance.
7. Produce a migration/data-quality report.

## 20. Definition of Done

V2 is complete only when:

- the app remains frontend-only;
- users can search across the four restriction sources plus directives;
- results are source-specific and explainable;
- NCS is correctly identified as the authority for trade import prohibition;
- 36 Ceiling and 29 5+5 records are represented with provenance;
- the 2026 NCS pharmaceutical prohibition seed is represented with HS/context data;
- the legacy 254-name NTI list cannot silently become an authoritative ban;
- the FDC directive is stored as a directive record plus affected entities;
- V1 directive entries 339-353 are no longer misrepresented as part of the FDC directive;
- current 2026-2031 directive records are indexed by applicability;
- source conflicts produce verification-required results;
- no authoritative result is based only on fuzzy matching;
- the app provides clear official source links and data-verification status;
- existing working behavior that remains valid is preserved.
