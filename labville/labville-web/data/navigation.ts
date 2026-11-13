import type { NavItem } from '@/types'

export const navItems: NavItem[] = [
  {
    label: 'Diagnostics',
    href: '/services',
    dropdown: [
      {
        label: 'Laboratory Diagnostics',
        href: '/services/laboratory',
        description: 'Blood tests, urine analysis & specialized testing',
      },
      {
        label: 'Medical Imaging',
        href: '/services/imaging',
        description: 'X-rays, ultrasounds & CT scans',
      },
      {
        label: 'Health Screening',
        href: '/services/screening',
        description: 'Proactive health assessments & early detection',
      },
      {
        label: 'Specialized Diagnostics',
        href: '/services/specialized',
        description: 'Cardiovascular, hormonal & genetic testing',
      },
    ],
  },
  {
    label: 'Imaging',
    href: '/services/imaging',
  },
  {
    label: 'Health Screening',
    href: '/services/screening',
  },
  {
    label: 'Corporate',
    href: '/services/corporate',
  },
  {
    label: 'For Clinicians',
    href: '/professionals',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Resources',
    href: '/resources',
  },
]

export const contact = {
  phone: '07034888629',
  email: 'enquiries@labvillediagnostic.com',
  address: {
    street: 'No 10, AMUSA Arowolo Street, off Muniratu Alaje Street',
    landmark: 'Behind BRT Bus Terminal, Ikorodu Garage',
    city: 'Ikorodu',
    state: 'Lagos',
    country: 'Nigeria',
    full: 'No 10, AMUSA Arowolo Street, off Muniratu Alaje Street, Behind BRT Bus Terminal, Ikorodu Garage, Ikorodu, Lagos',
  },
  // PLACEHOLDER — Labville to confirm:
  hours: null as null | { weekdays: string; saturday: string; sunday: string },
  socialMedia: {
    instagram: null as null | string,
    facebook: null as null | string,
    twitter: null as null | string,
    linkedin: null as null | string,
  },
}
