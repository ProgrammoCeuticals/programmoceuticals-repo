// Navigation
export interface NavItem {
  label: string
  href: string
  dropdown?: NavDropdownItem[]
}
export interface NavDropdownItem {
  label: string
  href: string
  description?: string
}

// Programmes
export interface Programme {
  id: string
  name: string
  category: 'financial-inclusion' | 'community' | 'youth' | 'women' | 'health' | 'agriculture' | 'entrepreneurship'
  tagline: string
  description: string
  status: 'active' | 'placeholder'
  icon: string
}

// Products
export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  features: string[]
  cta: { label: string; href: string }
  verified: boolean
}

// FAQ
export interface FAQItem {
  question: string
  answer: string
}

// Testimonial
export interface Testimonial {
  text: string
  theme: string
}

// Contact form
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  consent: boolean
}
