import type { NavItem } from '@/types'

// Navigation mirrors the actual website structure from the indexed footer
export const navItems: NavItem[] = [
  {
    label: 'Company',
    href:  '#',
    dropdown: [
      { label: 'About Us',    href: '/about',           description: 'Our mission, values and story' },
      { label: 'Contact Us',  href: '/contact',          description: 'Get in touch with our team'    },
      { label: 'Become a Member', href: '/become-a-member', description: 'Join the OSF community'   },
      { label: 'Apply for a Loan',href: '/apply-for-a-loan',description: 'Start your loan application'},
    ],
  },
  {
    label: 'Products',
    href:  '#',
    dropdown: [
      { label: 'Loans',    href: '/loans',    description: 'Business and working capital loans' },
      { label: 'Savings',  href: '/savings',  description: 'Savings and investment plans'       },
      { label: 'CSR',      href: '/csr',      description: 'Corporate social responsibility'    },
    ],
  },
  {
    label: 'Programmes',
    href: '/programmes',
  },
]

export const footerColumns = [
  {
    heading: 'Company',
    links: [
      { label: 'About Us',        href: '/about'           },
      { label: 'Contact Us',      href: '/contact'         },
      { label: 'Become a Member', href: '/become-a-member' },
      { label: 'Apply for a Loan',href: '/apply-for-a-loan'},
    ],
  },
  {
    heading: 'Products',
    links: [
      { label: 'Loans',   href: '/loans'   },
      { label: 'Savings', href: '/savings' },
      { label: 'CSR',     href: '/csr'     },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',     href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms'          },
    ],
  },
]
