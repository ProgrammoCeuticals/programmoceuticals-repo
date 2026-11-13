# GLSI — Global Listing Supermarket Inventory Vetter

Frontend-only React app for automated vetting of NAFDAC Global Listing Inventory submissions.

## Credentials
- Username: `glsi`
- Password: `glsi`

## Getting Started

```bash
npm install
npm start      # dev server at localhost:3000
npm run build  # production build
```

## Vetting Checks
Applies all 19 NAFDAC Global Listing checklist codes to every inventory row:

| Code | What it checks |
|------|----------------|
| Inc.T | Pack units × Cartons = Total quantity |
| Rep | Duplicate rows |
| Typo | Spelling errors in pack type, brand |
| Fill | Empty required columns |
| Unit | Missing unit of measurement |
| Ban | Banned product categories |
| N/A reg | Products with therapeutic claims |
| Abbv. | Abbreviated/coded product names |
| Itemise | SET/KIT products needing individual listing |
| Country | Missing or multi-country origin |
| Desc | Vague/generic description |
| Clarify | Ambiguous product name |
| P.T | Unknown pack type |
| Brand | Missing brand |
| Reg | Product found in NAFDAC Greenbook (live lookup) |

## Excel Format
Expected column headers (case-insensitive):
- BRAND OF PRODUCT
- NAME OF PRODUCT
- DESCRIPTION OF PRODUCT
- ORIGIN OF PRODUCT
- PACK SIZE (format: `48X100ML`)
- PACK TYPE
- NO. OF CTN PER SHIPPING
- TOTAL QUANTITY

## Greenbook Lookup
Live queries to `greenbook.nafdac.gov.ng` use the DataTables API with `X-Requested-With: XMLHttpRequest`.
CORS restrictions apply in browser context — a server-side proxy is needed for production deployment.
