# Labville Diagnostic Centre — Web Application

This is the greenfield rebuild of the Labville Diagnostic Centre website.

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables
- **3D:** React Three Fiber + Drei
- **Animation:** Framer Motion + GSAP
- **Forms:** React Hook Form + Zod
- **State:** Zustand

## Development

```bash
# Install dependencies
npm install

# Start development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure

```
app/                      # Next.js App Router pages
components/
  ├── layout/            # Header, Footer
  ├── navigation/        # Desktop and mobile nav
  ├── ui/                # Base UI components
  ├── hero/              # Hero section components
  ├── 3d/                # Three.js scenes
  ├── services/          # Service explorer and cards
  ├── sections/          # Homepage sections
  └── forms/             # Contact and booking forms
data/                    # Structured content (services, navigation, etc.)
lib/                     # Utilities
types/                   # TypeScript interfaces
```

## Design System

All design tokens are centralized in:
- `tailwind.config.ts` — Tailwind theme
- `app/globals.css` — CSS custom properties

## Development Phases

**Phase 1 (Current):** Project foundation — design system, navigation, footer, route stubs ✅  
**Phase 2:** 3D prototype validation  
**Phase 3:** Homepage full narrative  
**Phase 4:** Service pages  
**Phase 5:** Internal pages (About, Quality, Professionals, Resources, Contact)  
**Phase 6:** Booking flow  
**Phase 7:** Integration (email, forms, analytics)  
**Phase 8:** Performance optimization  
**Phase 9:** Accessibility audit  
**Phase 10:** SEO validation  
**Phase 11:** QA  

## Content Placeholders

Items marked `[PLACEHOLDER]` or `[Labville to confirm]` require Labville input before publication:
- Operating hours
- Real facility photography
- Specific test catalogue
- Certifications and accreditations
- Pricing (if publicly displayed)
- Opening hours

## Important Notes

- No fabrications: No fake doctors, stats, certifications, client logos or medical claims.
- 3D scenes are lazy-loaded via Intersection Observer.
- All animations respect `prefers-reduced-motion`.
- SEO metadata is in each page's `metadata` export.

## License

Proprietary — Labville Diagnostic Centre
