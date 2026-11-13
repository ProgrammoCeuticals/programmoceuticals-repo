// ─────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
}

export interface NavDropdownItem {
  label: string;
  href: string;
  description?: string;
}

// ─────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────
export type ServiceId =
  | "laboratory"
  | "imaging"
  | "screening"
  | "specialized"
  | "corporate"
  | "home-collection";

export interface ServiceCategory {
  id: ServiceId;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  visual3DScene: string;
  cta: { label: string; href: string };
  subServices?: SubService[];
  icon?: string;
}

export interface SubService {
  name: string;
  description: string;
  verified: boolean; // false = placeholder
}

// ─────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────
export interface Testimonial {
  text: string;
  theme: string;
  // name withheld until Labville confirms consent for each individual
}

// ─────────────────────────────────────────
// TRUST PILLARS
// ─────────────────────────────────────────
export interface TrustPillar {
  title: string;
  description: string;
  icon: string;
}

// ─────────────────────────────────────────
// PROCESS STEPS
// ─────────────────────────────────────────
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

// ─────────────────────────────────────────
// RESOURCES
// ─────────────────────────────────────────
export interface ResourceItem {
  title: string;
  description: string;
  category: "faq" | "preparation" | "education";
  href: string;
}

// ─────────────────────────────────────────
// FORMS
// ─────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface BookingState {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  serviceCategory: ServiceId | null;
  specificTest: string | null;
  collectionMethod: "centre" | "home" | null;
  preferredDate: string | null;
  preferredTime: string | null;
  contactInfo: ContactInfo | null;
  status: "idle" | "submitting" | "success" | "error";
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

// ─────────────────────────────────────────
// SEO
// ─────────────────────────────────────────
export interface PageSEO {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

// ─────────────────────────────────────────
// 3D SCENE PROPS
// ─────────────────────────────────────────
export interface SceneProps {
  className?: string;
}
