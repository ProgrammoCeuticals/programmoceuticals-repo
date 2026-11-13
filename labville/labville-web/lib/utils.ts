import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format phone number for display */
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
}

/** Scroll to an element with offset for fixed header */
export function scrollToSection(id: string, offset = 80) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}
