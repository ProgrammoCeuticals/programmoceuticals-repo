# Labville Diagnostic Centre — Full Website Implementation Plan

## Summary

The project is a Next.js 15 / React 18 app already scaffolded with:
- Root layout (`app/layout.tsx`) with Header + Footer in place  
- Tailwind design tokens (dark sci-fi palette: `bg-primary #080C14`, `accent-blue #1E6FD9`, `accent-cyan #0ABFBC`)  
- `framer-motion ^11`, `@react-three/fiber ^8` + `@react-three/drei ^9`, `three ^0.169`, `gsap ^3.12`, `react-hook-form ^7`, `zod ^3`, `lucide-react ^0.460`  
- UI components: `Button`, `Badge`, `SectionHeading`, `SectionContainer`, `Header`, `Footer`, `DesktopNav`, `MobileNav`
- All page routes exist as stubs (only a `SectionHeading` with no body sections)  
- Data layer complete: `data/services.ts` (6 services), `data/content.ts` (brand, values, trust, testimonials, process), `data/navigation.ts`
- Types complete in `types/index.ts`  

The live site (labvillediagnostic.com) establishes the content: hero tagline, health concerns section, diagnostic solutions cards, journey-to-excellence about section, appointment booking CTA, benefits strip, testimonials, final CTA. The new site copies these sections, elevates them visually, and layers 3-D/motion on top.

All `'use client'` components that use browser APIs, Framer Motion, R3F, or form state must be isolated into separate files under `components/` and imported into RSC page files.

---

## Implementation Order

Items are ordered strictly by dependency. Items 1–3 are shared infrastructure used by everything else. Items 4–12 are page builds. Item 13 is the 3-D layer. Item 14 is the form/booking layer. Item 15 is final polish.

---

- [ ] 1. **Add `SectionHeading` gradient support and create `AnimatedSection` wrapper utility**

  `SectionHeading` accepts a `gradientWord` prop that already exists in the interface but is not implemented. Wire it up: split the headline on `gradientWord`, wrap that word in `<span className="gradient-text">`. Also create `components/ui/AnimatedSection.tsx` — a `'use client'` Framer Motion wrapper that fades-and-slides-up its children on viewport entry (uses `motion.div` with `whileInView`, `initial={{ opacity:0, y:24 }}`, `animate={{ opacity:1, y:0 }}`, `transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}`, `viewport={{ once:true, margin:'-80px' }}`). Components that need scroll-triggered animation import this instead of adding motion directly.

  Files:
  - `components/ui/SectionHeading.tsx` (modify — wire `gradientWord`)
  - `components/ui/AnimatedSection.tsx` (create)

  Verify: `npm run build` — zero TypeScript errors. Open dev server; gradient text and fade-up work on the placeholder homepage.

---

- [ ] 2. **Extend `SectionContainer` with `bg` and `id` props**

  Add optional `bg?: string` prop (arbitrary Tailwind class string) and `id?: string` prop to `SectionContainer`. Pass `id` directly to the `<Tag>` element. This lets page sections be independently styled and anchor-linked without wrapper divs.

  Files:
  - `components/ui/SectionContainer.tsx` (modify)

  Verify: `npm run build` — zero TypeScript errors.

---

- [ ] 3. **Create shared TypeScript types for 3-D scenes and booking form**

  Add to `types/index.ts`:
  ```ts
  // 3-D scene props
  export interface SceneProps { className?: string }
  
  // Extended booking step type already exists (BookingState); no change needed
  ```

  Files:
  - `types/index.ts` (modify — add `SceneProps`)

  Verify: `npm run build` — zero TypeScript errors.

---

- [ ] 4. **Build the full Homepage (`app/page.tsx`)**

  Replace the placeholder `app/page.tsx` with the complete homepage. The homepage is a server component that imports client section components. Sections mirror the live site content, upgraded with the new design system:

  **Section components to create (all `'use client'`):**

  **a) `components/hero/HeroSection.tsx`**
  - Full-viewport hero, `bg-bg-primary` with `bg-gradient-radial-blue` overlay  
  - Top eyebrow: `text-eyebrow uppercase tracking-[0.12em] text-accent-cyan font-semibold`  
  - H1: `text-hero-xl font-bold text-white` — headline "Where science becomes" + `<span className="gradient-text">clinical insight.</span>`  
  - Sub: `text-body-lg text-text-secondary max-w-2xl mx-auto`  
  - Two CTAs: `Button` variant `science` size `lg` (Book a Test → `/book-a-test`) + `Button` variant `outline` size `lg` (Explore Diagnostics → `/services`)  
  - Background: `div.absolute.inset-0.grid-pattern` for grid overlay + `div.absolute.inset-0.bg-gradient-radial-blue`  
  - Framer Motion: `AnimatedSection` wrapping the text block; counter-scroll parallax via `useScroll` / `useTransform` on the background layer  
  - Note: 3-D particle scene slot (`<div id="hero-3d-canvas" className="absolute inset-0 pointer-events-none" />`) — the R3F scene is wired in item 13

  **b) `components/sections/HealthConcernsSection.tsx`**
  - Mirrors live site "Health Concerns Addressed" section  
  - Background: `bg-bg-secondary`  
  - Data source: `healthConcerns` from `data/content.ts` (4 items)  
  - Desktop: numbered 2×2 grid; mobile: single column  
  - Each card: `bg-bg-elevated border border-white/8 rounded-xl p-8` with number tag (`text-section-xl font-bold gradient-text`) + title (`text-heading-md font-semibold text-white mb-3`) + description (`text-body-md text-text-secondary`)  
  - Animate: `AnimatedSection` with `delay` stagger (0.1s per card)

  **c) `components/sections/DiagnosticSolutionsSection.tsx`**
  - Mirrors live site "Our Diagnostic Solutions" cards  
  - Background: `bg-bg-primary`  
  - Data source: first 3 services from `services` array (laboratory, imaging, screening) — shown as feature cards  
  - `SectionHeading` centered with eyebrow "Our Diagnostic Solutions", `gradientWord` on last word of headline  
  - 3-column grid on desktop (`grid-cols-1 md:grid-cols-3 gap-6`), stacked on mobile  
  - Each card: `bg-bg-elevated border border-white/8 rounded-xl p-8 hover:border-accent-blue/30 transition-all group` with service name, tagline, short description, sub-service list, CTA link  
  - 3-D scene slot per card (a `<div className="h-48 rounded-lg overflow-hidden mb-6" />`) — wired in item 13  
  - Use `Badge` variant `science` for service label

  **d) `components/sections/JourneySection.tsx`**
  - Mirrors live site "Our Journey to Excellence" + about paragraph  
  - Background: alternating `bg-bg-secondary`  
  - Two-column layout (prose left, visual right) on desktop, stacked on mobile  
  - Left: `SectionHeading` left-aligned, then two paragraphs from `brand.mission` and the about content in `content.ts`  
  - Right: `processSteps` rendered as a vertical timeline — step number chip (`text-eyebrow font-bold text-accent-cyan bg-accent-blue/15 rounded-full px-2 py-1`) + step title + step description  
  - Framer Motion: timeline items stagger in as they scroll into view via `AnimatedSection`

  **e) `components/sections/BookingCTASection.tsx`**
  - Mirrors live site "Your Health is Our Priority / Schedule Diagnostic Appointment" CTA block  
  - Background: `bg-gradient-science` text on top; OR a dark card with gradient border  
  - Implementation choice: a full-width `bg-bg-elevated` section with a centered card that has `bg-gradient-science` as its top border (`border-t-2 border-accent-blue` or `border-gradient` CSS class)  
  - H2: `text-section-lg font-semibold text-white`  
  - Sub: tagline from `brand.tagline`  
  - Primary CTA: `Button` variant `science` size `lg` linking `/book-a-test`  
  - Secondary line: "OR Call Us At: 07034888629" as `<a href="tel:07034888629">` styled `text-text-secondary hover:text-white`

  **f) `components/sections/TrustBenefitsSection.tsx`**
  - Mirrors live site "Experience Exceptional Benefits"  
  - Data source: `trustPillars` from `data/content.ts` (4 items: Precision, Accessibility, Technology, Compassion)  
  - Background: `bg-bg-primary` with `grid-pattern` overlay  
  - Lucide icons mapped to `icon` field: `target` → `Target`, `users` → `Users`, `cpu` → `Cpu`, `heart` → `Heart`  
  - 2×2 grid desktop, 1-col mobile; each item: icon in `text-accent-cyan` + title + description  
  - `SectionHeading` centered at top with `eyebrow="Why Choose Labville"`

  **g) `components/sections/TestimonialsSection.tsx`**
  - Mirrors live site testimonials carousel  
  - Data source: `testimonials` from `data/content.ts` (4 items)  
  - Background: `bg-bg-secondary`  
  - Desktop: 2-column masonry-style layout; mobile: single column  
  - Each card: `bg-bg-elevated border border-white/8 rounded-xl p-8` with quote text + theme badge (`Badge` variant `dark`)  
  - No names or photos (as per spec)  
  - Framer Motion: cards fade-in staggered

  **h) `components/sections/FinalCTASection.tsx`**
  - Mirrors live site "Take Charge of Your Health Today" bottom CTA  
  - Full-width section, `bg-bg-secondary`, centered content  
  - H2: `text-section-xl font-semibold text-white` with `gradient-text` on key words  
  - Two CTAs: Book a Test (Button science) + Call Us link  
  - Background: `bg-gradient-radial-cyan` overlay for glow effect

  **Updated `app/page.tsx`:**
  ```tsx
  import HeroSection from '@/components/hero/HeroSection'
  import HealthConcernsSection from '@/components/sections/HealthConcernsSection'
  import DiagnosticSolutionsSection from '@/components/sections/DiagnosticSolutionsSection'
  import JourneySection from '@/components/sections/JourneySection'
  import BookingCTASection from '@/components/sections/BookingCTASection'
  import TrustBenefitsSection from '@/components/sections/TrustBenefitsSection'
  import TestimonialsSection from '@/components/sections/TestimonialsSection'
  import FinalCTASection from '@/components/sections/FinalCTASection'
  ```

  Files:
  - `app/page.tsx` (replace)
  - `components/hero/HeroSection.tsx` (create)
  - `components/sections/HealthConcernsSection.tsx` (create)
  - `components/sections/DiagnosticSolutionsSection.tsx` (create)
  - `components/sections/JourneySection.tsx` (create)
  - `components/sections/BookingCTASection.tsx` (create)
  - `components/sections/TrustBenefitsSection.tsx` (create)
  - `components/sections/TestimonialsSection.tsx` (create)
  - `components/sections/FinalCTASection.tsx` (create)

  Verify: `npm run build` — no errors. Dev server: homepage renders all 8 sections with correct colors and typography.

---

- [ ] 5. **Build the Services overview page (`app/services/page.tsx`)**

  Replace stub with full services page.

  **Section components to create:**

  **a) `components/services/ServicesHero.tsx`** (`'use client'`)
  - Page hero with `bg-bg-primary` + `bg-gradient-radial-blue`
  - `SectionContainer` width `content`
  - `SectionHeading` eyebrow "Our Services", headline with `gradientWord`
  - Brief intro paragraph from `services` preamble

  **b) `components/services/ServicesGrid.tsx`** (`'use client'`)
  - Loops all 6 services from `data/services.ts`
  - Desktop: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8`
  - Each card: `bg-bg-elevated border border-white/8 rounded-xl overflow-hidden hover:border-accent-blue/30 transition-all duration-300 group`
  - Card anatomy: top color bar (`h-1 bg-gradient-science`), content area with service name, tagline, short description, sub-service count badge, CTA arrow link
  - Link wraps entire card with `href={/services/${service.slug}}`
  - `Badge` variant `science` for service.shortName
  - `AnimatedSection` stagger per card

  Files:
  - `app/services/page.tsx` (replace)
  - `components/services/ServicesHero.tsx` (create)
  - `components/services/ServicesGrid.tsx` (create)

  Verify: `npm run build` — no errors. Services page renders all 6 cards.

---

- [ ] 6. **Build each service detail page (6 pages, same template pattern)**

  All 6 service pages follow the identical layout. Create a shared `components/services/ServicePageTemplate.tsx` (`'use client'`) that accepts `ServiceCategory` prop and renders:
  1. Page hero: eyebrow = service.shortName, headline = service.tagline with gradientWord, sub = service.shortDescription. Background `bg-bg-primary` + radial glow.  
  2. Full description block: `bg-bg-secondary` section, `SectionContainer` width `narrow`, service.fullDescription as `text-body-lg text-text-secondary`  
  3. Sub-services: `bg-bg-primary` section, 3-column card grid of `service.subServices[]` — name as `text-heading-md`, description as `text-body-md text-text-secondary`, `verified` shown as `Badge` variant `science` "Verified" or `Badge` variant `dark` "Coming Soon"  
  4. 3-D scene slot: `<div id={`3d-${service.id}`} className="h-96 rounded-xl overflow-hidden" />` — wired in item 13  
  5. CTA strip: `BookingCTASection` (reuse from homepage)

  Each of the 6 page files (`laboratory`, `imaging`, `screening`, `specialized`, `corporate`, `home-collection`) replaces its stub, imports `ServicePageTemplate` + `getServiceById`, and passes the service data.

  ```ts
  // Import pattern:
  import { getServiceById } from '@/data/services'
  import ServicePageTemplate from '@/components/services/ServicePageTemplate'
  ```

  Files:
  - `components/services/ServicePageTemplate.tsx` (create)
  - `app/services/laboratory/page.tsx` (replace)
  - `app/services/imaging/page.tsx` (replace)
  - `app/services/screening/page.tsx` (replace)
  - `app/services/specialized/page.tsx` (replace)
  - `app/services/corporate/page.tsx` (replace)
  - `app/services/home-collection/page.tsx` (replace)

  Verify: `npm run build` — no errors. Visit `/services/laboratory` and `/services/imaging` — both render with hero, description, sub-services, 3-D slot.

---

- [ ] 7. **Build the About page (`app/about/page.tsx`)**

  Replace stub with full about page. Sections:

  **a) `components/sections/AboutHeroSection.tsx`** (`'use client'`)
  - Hero: eyebrow "About Labville", headline with gradient, mission statement as sub
  - Background: `bg-bg-primary`, full-height, text centered

  **b) `components/sections/MissionValuesSection.tsx`** (`'use client'`)
  - `bg-bg-secondary`; two columns: left = mission paragraph (`brand.mission`), right = core values grid
  - Core values from `coreValues` (6 items in `data/content.ts`): 2-col grid of value cards
  - Each card: `bg-bg-elevated border border-white/8 rounded-xl p-6`, value title bold, description secondary

  **c) `components/sections/DiagnosticProcessSection.tsx`** (`'use client'`)
  - "The diagnostic process" section
  - `processSteps` array (7 steps) rendered as horizontal scrollable timeline on mobile, vertical steps on desktop
  - Each step: number chip (gradient text), title, description
  - Animated in sequence with Framer Motion `AnimatedSection` stagger

  **d) Re-use**: `TrustBenefitsSection`, `FinalCTASection` already built in item 4

  Files:
  - `app/about/page.tsx` (replace)
  - `components/sections/AboutHeroSection.tsx` (create)
  - `components/sections/MissionValuesSection.tsx` (create)
  - `components/sections/DiagnosticProcessSection.tsx` (create)

  Verify: `npm run build` — no errors. `/about` renders hero, mission/values, process timeline.

---

- [ ] 8. **Build the Contact page (`app/contact/page.tsx`)**

  The existing contact page has info blocks but a placeholder form. Replace with a full form.

  **a) `components/forms/ContactForm.tsx`** (`'use client'`)
  - Uses `react-hook-form` + `zod` schema for `ContactFormData` (already in `types/index.ts`)
  - Zod schema (validate in the component file):
    ```ts
    import { z } from 'zod'
    const contactSchema = z.object({
      name:    z.string().min(2, 'Name required'),
      email:   z.string().email('Valid email required'),
      phone:   z.string().min(7, 'Phone required'),
      subject: z.string().min(3, 'Subject required'),
      message: z.string().min(10, 'Message required (min 10 characters)'),
    })
    ```
  - `@hookform/resolvers/zod` for validation
  - Fields: name, email, phone, subject (select with options: General Inquiry, Book a Test, Corporate Health, Home Collection, Other), message textarea
  - Submit: `fetch('/api/contact', { method:'POST', body: JSON.stringify(data) })` — endpoint stubbed as `app/api/contact/route.ts` returning `{ ok: true }` placeholder  
  - Form field classes: `w-full bg-bg-elevated border border-white/12 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:border-accent-blue/60 focus:outline-none transition-colors`
  - Error messages: `text-red-400 text-sm mt-1`
  - Submit button: `Button` variant `science` size `lg` fullWidth; shows spinner text "Sending…" when submitting
  - On success: show inline success message with `text-accent-cyan`

  **b) Update `app/contact/page.tsx`**
  - Replace form placeholder with `<ContactForm />`
  - Keep contact info column (phone, email, address) from current page
  - Add opening hours placeholder row
  - Add embedded Google Maps iframe placeholder `<div className="h-64 rounded-xl bg-bg-elevated border border-white/8 flex items-center justify-center text-text-muted text-sm">Map — coordinates to be confirmed</div>`

  **c) Create `app/api/contact/route.ts`**
  - POST handler: parses body, logs (console.log for now), returns `NextResponse.json({ ok: true })`
  - Add `export const runtime = 'edge'` for Vercel Edge compatibility

  Files:
  - `components/forms/ContactForm.tsx` (create)
  - `app/contact/page.tsx` (replace)
  - `app/api/contact/route.ts` (create)

  Verify: `npm run build` — no errors. `/contact` renders form with all 5 fields. Submitting shows success state.

---

- [ ] 9. **Build the Book-a-Test page (`app/book-a-test/page.tsx`)**

  Multi-step booking wizard.

  **a) `components/forms/BookingWizard.tsx`** (`'use client'`)
  - Uses React `useState` for `BookingState` (already in `types/index.ts`, step 1–7)
  - Step progress bar: `flex gap-2` of `step.number` pills — active = `bg-accent-blue`, done = `bg-accent-cyan/40`, future = `bg-white/10`
  - Steps:
    1. **Service Category** — card grid of 6 service categories from `services` array; click selects, highlights with `border-accent-blue`
    2. **Collection Method** — two cards: "Visit Centre" + "Home Collection"
    3. **Preferred Date** — date input (`<input type="date">`) with min = today
    4. **Preferred Time** — time slot grid (Morning / Afternoon / Evening as labeled options, not real API)
    5. **Contact Info** — name, email, phone, optional notes (react-hook-form, zod `ContactInfo` schema)
    6. **Review** — summary of all selections
    7. **Confirmation** — success state with booking reference (random 8-char alphanumeric), next steps text
  - Back/Next buttons at bottom of each step
  - Step 5 uses `react-hook-form` with `@hookform/resolvers/zod`
  - Step 7 submit: `fetch('/api/booking', { method:'POST' })` — create `app/api/booking/route.ts` returning `{ ok: true, reference: crypto.randomUUID().slice(0,8).toUpperCase() }`

  **b) `app/api/booking/route.ts`** — POST handler, same pattern as contact route

  Files:
  - `components/forms/BookingWizard.tsx` (create)
  - `app/book-a-test/page.tsx` (replace)
  - `app/api/booking/route.ts` (create)

  Verify: `npm run build` — no errors. `/book-a-test` renders wizard; can click through all 7 steps; step 5 form validates; step 7 shows confirmation.

---

- [ ] 10. **Build the Quality & Trust page (`app/quality/page.tsx`)**

  Sections:
  - Hero: `SectionHeading` eyebrow "Quality & Trust", headline, sub
  - Quality pillars: same `TrustBenefitsSection` reused (or inline variant)
  - "Our Standards" section: 4 text cards about accuracy, QC, technology, staff (content from `coreValues` filtered or paraphrased — no fabricated certifications; leave cert slots as explicit placeholders)
  - Process section: reuse `DiagnosticProcessSection` from item 7

  Files:
  - `app/quality/page.tsx` (replace)

  Verify: `npm run build` — no errors. `/quality` renders with 3 sections.

---

- [ ] 11. **Build the For Clinicians page (`app/professionals/page.tsx`)**

  Sections:
  - Hero: eyebrow "For Healthcare Professionals", headline "Professional diagnostic resources"
  - Referral pathway section: 4 steps (Request referral → Sample collection → Analysis → Report delivery) as `processSteps`-style horizontal timeline
  - Test directory placeholder section: a card with `bg-bg-elevated border border-white/8 rounded-xl p-8` stating "Full test directory coming soon — contact us for a test list"
  - CTA: BookingCTASection reused (linking to /contact?subject=clinician)

  Files:
  - `app/professionals/page.tsx` (replace)

  Verify: `npm run build` — no errors. `/professionals` renders.

---

- [ ] 12. **Build the Resources page (`app/resources/page.tsx`)**

  Sections:
  - Hero: SectionHeading with eyebrow, headline, sub
  - FAQ accordion (`'use client'`):
    - Create `components/sections/FAQSection.tsx`
    - 6–8 hardcoded FAQ items (from live site implied content: How do I prepare for a blood test? How long do results take? Can I get home collection? etc.)
    - Accordion: `useState<number|null>(null)` for open index; animate height with Framer Motion `AnimatePresence` + `motion.div`
    - Item: `button` with chevron icon (Lucide `ChevronDown`) + answer `p` below
  - Preparation guides: 3 cards (Blood Test Prep / Imaging Prep / General Prep) as `bg-bg-elevated` cards with bullet-point prep instructions
  - CTA: BookingCTASection reused

  Files:
  - `app/resources/page.tsx` (replace)
  - `components/sections/FAQSection.tsx` (create)

  Verify: `npm run build` — no errors. `/resources` renders; accordion toggles; preparation cards show.

---

- [ ] 13. **Implement 3-D scenes with R3F/Three.js (dynamic import, SSR-safe)**

  Every 3-D component must be:
  - A `'use client'` component in `components/3d/`
  - Dynamically imported with `next/dynamic` + `{ ssr: false }` at call sites
  - Wrapped in `<Suspense fallback={<div className="h-full bg-bg-elevated animate-pulse rounded-xl" />}>`
  - Canvas sized to fill its container via `style={{ width:'100%', height:'100%' }}`

  **Scenes to build:**

  **a) `components/3d/HeroParticleField.tsx`**
  - Float 200 small sphere particles in a DNA-helix arrangement rotating slowly (gsap `to` on rotation Y, `duration: 20, repeat: -1, ease:'none'`)  
  - Particles: `<Points>` from drei with `PointMaterial` — color `#1E6FD9` (accent-blue) + `#0ABFBC` (accent-cyan) alternating  
  - Camera: `PerspectiveCamera` at `[0, 0, 8]`, `fov 60`  
  - Ambient light at 0.4 intensity  
  - Placed in `HeroSection.tsx` inside `#hero-3d-canvas` slot

  **b) `components/3d/MolecularScene.tsx`** (for Laboratory service card + page)
  - 5–7 spheres connected by `<Line>` components forming a molecule model  
  - Slow auto-rotation via `useFrame` rotating `groupRef.current.rotation.y += 0.005`  
  - Materials: `MeshPhysicalMaterial` roughness 0.1, metalness 0.8, color `#1E6FD9`

  **c) `components/3d/ImagingScene.tsx`** (for Imaging service)
  - A torus and inner sphere suggesting a CT gantry or scan ring  
  - Animated: torus rotates on X axis, inner sphere pulses scale with sine via `useFrame`  
  - Color: `#0ABFBC` torus + white inner sphere

  **d) `components/3d/HealthProfileScene.tsx`** (for Screening service)
  - Concentric rings (3 toruses, different radii, different rotation speeds)  
  - Suggests bio-profile / orbit motif  
  - Colors: gradient from `accent-blue` to `accent-cyan`

  **e) `components/3d/BiomarkerScene.tsx`** (for Specialized service)
  - Grid of small cubes (6×6) with varying heights animated up/down (bar chart motif)  
  - Each cube: `MeshStandardMaterial` color mapped from height (blue→cyan range)  
  - `useFrame` oscillates heights with `Math.sin(clock.elapsedTime + i)`

  **f) `components/3d/NetworkScene.tsx`** (for Corporate service)
  - 8 sphere nodes connected by lines in a network/org-chart layout  
  - Nodes pulse gently in size; edges drawn as `<Line>` components  
  - Rotation: slow Y rotation

  **g) `components/3d/HomeCollectionScene.tsx`** (for Home Collection service)
  - Simple animated droplet shape (distorted sphere with `MeshPhysicalMaterial` transparency)  
  - Slow float animation: `useFrame` with sine on Y position

  **Wiring scenes into service detail pages:**
  - `ServicePageTemplate.tsx` maps `service.visual3DScene` to a dynamic import registry:
    ```ts
    const sceneMap: Record<string, React.ComponentType<SceneProps>> = {
      MolecularScene:     dynamic(() => import('@/components/3d/MolecularScene'), { ssr:false }),
      ImagingScene:       dynamic(() => import('@/components/3d/ImagingScene'),   { ssr:false }),
      HealthProfileScene: dynamic(() => import('@/components/3d/HealthProfileScene'), { ssr:false }),
      BiomarkerScene:     dynamic(() => import('@/components/3d/BiomarkerScene'), { ssr:false }),
      NetworkScene:       dynamic(() => import('@/components/3d/NetworkScene'),   { ssr:false }),
      HomeCollectionScene:dynamic(() => import('@/components/3d/HomeCollectionScene'), { ssr:false }),
    }
    ```
  - In `HeroSection.tsx`, dynamically import `HeroParticleField` same way

  Files:
  - `components/3d/HeroParticleField.tsx` (create)
  - `components/3d/MolecularScene.tsx` (create)
  - `components/3d/ImagingScene.tsx` (create)
  - `components/3d/HealthProfileScene.tsx` (create)
  - `components/3d/BiomarkerScene.tsx` (create)
  - `components/3d/NetworkScene.tsx` (create)
  - `components/3d/HomeCollectionScene.tsx` (create)
  - `components/hero/HeroSection.tsx` (modify — wire HeroParticleField)
  - `components/services/ServicePageTemplate.tsx` (modify — wire sceneMap)
  - `components/sections/DiagnosticSolutionsSection.tsx` (modify — wire per-card scenes)

  Verify: `npm run build` — no errors. Dev server: 3-D canvas renders inside hero and on service pages without hydration errors or SSR errors.

---

- [ ] 14. **Verify full build, fix any type errors, run lint**

  Run the full build and ESLint check. Fix any remaining TypeScript errors or ESLint warnings introduced during implementation.

  ```
  npm run build
  npm run lint
  ```

  Common fixes expected:
  - `@types/three` usage alignment in 3-D components (use `THREE.Mesh`, `THREE.Group` from `import * as THREE from 'three'`)
  - `react-hook-form` Controller vs register pattern consistency in forms

  Files: any files with lint/type errors

  Verify: `npm run build` exits 0. `npm run lint` exits 0.

---

- [ ] 15. **Final polish — responsive audit and accessibility pass**

  For each page, check and fix:
  - Mobile layout at 375px viewport (all grids collapse to single column, hero text doesn't overflow, CTA buttons stack)
  - `aria-label` on all icon-only buttons (already done in Header/MobileNav — confirm new components follow same pattern)
  - Every `<img>` must have `alt` attribute (no images added yet, but any inline SVGs used as decorative should have `aria-hidden="true"`)
  - `focus-visible` outline works on all interactive elements (already in globals.css)
  - `prefers-reduced-motion` — R3F `useFrame` animations should check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and skip updates when true; Framer Motion respects this natively
  - Color contrast: `text-text-secondary` (#A0AABB on #080C14) passes WCAG AA at body sizes; `text-text-muted` (#606880) only used for non-critical decorative text — confirm this is the case

  Files: any components failing the above checks

  Verify: `npm run build` — clean. Manual dev-server review at 375px and 1440px viewport.

---

## Dependency Map

```
Item 1 (AnimatedSection + gradientWord) ← used by items 4, 5, 6, 7, 8, 9, 10, 11, 12
Item 2 (SectionContainer props) ← used by items 4–12
Item 3 (types) ← used by items 13
Items 4–12 (page builds) ← each independent; BookingCTASection/FinalCTASection built in 4 and reused 6–12
Item 13 (3-D scenes) ← depends on items 4, 5, 6 (needs hero slot and service template slot to exist)
Item 14 (build verification) ← depends on all prior items
Item 15 (polish) ← depends on all prior items
```

## Import Reference

All files import from these paths:
- `@/components/ui/*` — Button, Badge, SectionHeading, SectionContainer, AnimatedSection
- `@/components/layout/*` — Header, Footer (in layout only)
- `@/components/navigation/*` — DesktopNav, MobileNav (in Header only)
- `@/components/sections/*` — section components
- `@/components/hero/*` — HeroSection
- `@/components/services/*` — ServicesHero, ServicesGrid, ServicePageTemplate
- `@/components/forms/*` — ContactForm, BookingWizard
- `@/components/3d/*` — dynamically imported only
- `@/data/services` — `services`, `getServiceById`
- `@/data/content` — `brand`, `coreValues`, `trustPillars`, `processSteps`, `testimonials`, `healthConcerns`
- `@/data/navigation` — `navItems`, `contact`
- `@/types` — `ServiceCategory`, `ServiceId`, `BookingState`, `ContactInfo`, `SceneProps`
- `@/lib/utils` — `cn`
- External: `framer-motion`, `lucide-react`, `react-hook-form`, `zod`, `@hookform/resolvers/zod`
- R3F: `@react-three/fiber` (`Canvas`, `useFrame`, `useThree`), `@react-three/drei` (`OrbitControls`, `Points`, `PointMaterial`, `Line`, `Float`)
- Next.js: `next/dynamic`, `next/link`, `next/font/google`
