# Regulatory Data Audit — Product Checker V2

Date: 2026-10-05

## Executive finding

The existing V1 application is a useful functional baseline, but its regulatory datasets should **not** be treated as the final authoritative database.

The strongest immediate findings are:

- Ceiling List: V1 contains 36 records, matching the official 36-item NAFDAC PDF baseline.
- 5+5 Policy: V1 contains 29 records, matching the official 29-product NAFDAC policy list.
- Import Prohibition: V1 contains 77 broad trade records but labels them as NAFDAC. The current official NCS 2026 portal reports 111 import-prohibition items; the V1 source is stale and the authority attribution is wrong. This audit seeds the pharmaceutical subset from the current NCS/CET source and requires the full 111-item import dataset only if the application is intended to check non-pharmaceutical imports too.
- Regulatory Directives: V1 contains 353 flat `combination` records. The first 338 are in the FDC file (the part-2 file is explicitly labeled “Remaining FDC entries 101-338”), but entries 339-353 are mixed/unattributed regulatory items. The application therefore does not currently represent the directive repository as a directive database.
- NTI: V1 contains 254 names labeled “Source: NAFDAC Guidelines”. The current NAFDAC 2025 Bioequivalence guideline confirms NTI-specific BE requirements, but the verified material does not establish this 254-item array as an official NAFDAC master list. These records should therefore be treated as reference-only until individually sourced.

## Verified/current source observations

### Ceiling List

Official NAFDAC PDF: https://www.nafdac.gov.ng/wp-content/uploads/Files/Resources/UPDATED-NAFDAC-CEILING-LIST.pdf

The PDF baseline is 36 items and matches the V1 record count. NAFDAC's live Dossier ceiling-list page is also available: https://dossier.nafdac.gov.ng/ceiling-list. A current observation on that page includes **TRAMADOL**, which is not in the 36-item PDF baseline. This must be treated as a **source conflict requiring verification**, not silently merged into the canonical list.

### 5+5 Policy

Official NAFDAC source: https://www.nafdac.gov.ng/wp-content/uploads/Files/Resources/Note_To_Industry_2024/PRODUCTS-FOR-55-VALIDITY-POLICY.pdf

The policy source contains 29 products. The 5+5 data must retain strength/dosage-form scope and describe the policy as a local-manufacturing/validity pathway, not as a generic “ban” flag.

### Import Prohibition

Current authority: Nigeria Customs Service.

Current portal: https://demo-cet.customs.gov.ng/import-prohibition

The current portal reports **111 import-prohibition items**. The official CET schedules identify the pharmaceutical entries under the import-prohibition schedule. For this pharmaceutical checker, the seed dataset in this package contains the 29 V1-row pharmaceutical prohibition records corresponding to the current pharmaceutical descriptions; the broader NCS 111-item list should be imported only if non-pharmaceutical search is part of the product scope.

### Regulatory Directives

Repository: https://nafdac.gov.ng/wp-content/uploads/Files/Resources/Regulatory_Directive/2025-2030/Regulatory-Directive-on-the-Formulation-of-Veterinary-Product-With-not-More-Than-two2-Antimicrobials.pdf

The official FDC directive is NAFDAC-RDD-030-00, effective 2024-07-01, with review due 2029-06-30, and should be stored as one directive record with many affected FDC entries. The V1 353-entry array should be split into directive-level metadata plus affected entities. Entries 339-353 require individual source attribution.

The repository also has current 2026-2031 material, including directives concerning levamisole-containing human medicinal products and pharmacovigilance/PSUR/PBRER. These must not be omitted merely because they are not product-specific; instead, they should be classified as general obligations and excluded from default product matching unless their scope explicitly covers the searched product/class.

### NTI

NAFDAC 2025 Bioequivalence guideline: https://nafdac.gov.ng/regulatory-resources/regulatory-directive/

The guideline states that APIs identified as NTI may require narrower BE acceptance ranges and that NTI drugs are excluded from certain BCS biowaiver pathways. The V1 list of 254 names is therefore useful as a **legacy reference seed**, but should not drive a legal “prohibited” result until independently sourced.

## V2 source-of-truth policy

Every regulatory record must store:

- authority
- instrument/list type
- document title
- document/reference number, when applicable
- version/edition
- effective date
- review/expiry date, when applicable
- active/superseded/revoked/verification-required status
- source URL
- retrieval/verification date
- scope/applicability
- exact source wording or normalized excerpt where feasible
- relationship to prior/successor instruments

## Required implementation rule

Never convert a source match directly into a generic `FLAGGED` state. The UI and logic must distinguish:

- Ceiling List → local-manufacturing/registration restriction
- 5+5 → local-manufacturing/validity policy
- Import Prohibition → trade/import restriction governed by NCS/CET scope and, where relevant, HS code
- NTI → BE/biopharmaceutic review consideration, not automatically an import ban
- Regulatory Directive → specific action defined by directive scope

## Source URLs

- NAFDAC Regulatory Directives repository: https://nafdac.gov.ng/wp-content/uploads/Files/Resources/Regulatory_Directive/2025-2030/Regulatory-Directive-on-the-Formulation-of-Veterinary-Product-With-not-More-Than-two2-Antimicrobials.pdf
- NAFDAC Ceiling List PDF: https://www.nafdac.gov.ng/wp-content/uploads/Files/Resources/UPDATED-NAFDAC-CEILING-LIST.pdf
- NAFDAC Dossier Ceiling List: https://dossier.nafdac.gov.ng/ceiling-list
- NAFDAC 5+5 Policy: https://www.nafdac.gov.ng/wp-content/uploads/Files/Resources/Note_To_Industry_2024/PRODUCTS-FOR-55-VALIDITY-POLICY.pdf
- NCS 2026 Import Prohibition: https://demo-cet.customs.gov.ng/import-prohibition
- NAFDAC 2025 BE Guideline: https://nafdac.gov.ng/regulatory-resources/regulatory-directive/
