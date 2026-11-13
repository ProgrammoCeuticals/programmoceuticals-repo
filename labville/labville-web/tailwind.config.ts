import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background scale
        'bg-primary':    '#080C14',
        'bg-secondary':  '#0E1420',
        'bg-elevated':   '#141B28',
        'bg-light':      '#F4F6FA',
        'bg-light-alt':  '#EAECF2',

        // Text
        'text-primary':   '#FFFFFF',
        'text-secondary': '#A0AABB',
        'text-muted':     '#606880',
        'text-dark':      '#0D1117',
        'text-dark-secondary': '#3D4452',

        // Brand accents
        'accent-blue':   '#1E6FD9',
        'accent-cyan':   '#0ABFBC',
        'accent-teal':   '#0E7C7B',
        'accent-blue-light': '#4A9AEA',

        // Borders
        'border-dark':   'rgba(255,255,255,0.08)',
        'border-light':  'rgba(0,0,0,0.08)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero-xl':   ['clamp(56px, 7vw, 96px)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'hero-lg':   ['clamp(40px, 5.5vw, 72px)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'section-xl':['clamp(36px, 4.5vw, 64px)', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'section-lg':['clamp(28px, 3.5vw, 48px)', { lineHeight: '1.15', letterSpacing: '-0.015em'}],
        'heading-md':['clamp(20px, 2.5vw, 32px)', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'body-lg':   ['clamp(17px, 1.5vw, 20px)', { lineHeight: '1.65' }],
        'body-md':   ['clamp(15px, 1.2vw, 17px)', { lineHeight: '1.65' }],
        'body-sm':   ['13px',                       { lineHeight: '1.5'  }],
        'eyebrow':   ['12px',                       { lineHeight: '1.4', letterSpacing: '0.12em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      borderRadius: {
        'sm':   '6px',
        'md':   '12px',
        'lg':   '20px',
        'xl':   '32px',
        '2xl':  '48px',
      },
      boxShadow: {
        'card':        '0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2)',
        'card-hover':  '0 4px 12px rgba(0,0,0,0.4), 0 24px 48px rgba(0,0,0,0.3)',
        'glow-blue':   '0 0 40px rgba(30,111,217,0.25)',
        'glow-cyan':   '0 0 40px rgba(10,191,188,0.2)',
      },
      backgroundImage: {
        'gradient-science': 'linear-gradient(135deg, #1E6FD9 0%, #0ABFBC 100%)',
        'gradient-dark':    'linear-gradient(180deg, #080C14 0%, #0E1420 100%)',
        'gradient-radial-blue': 'radial-gradient(ellipse at 50% 0%, rgba(30,111,217,0.15) 0%, transparent 70%)',
        'gradient-radial-cyan': 'radial-gradient(ellipse at 50% 100%, rgba(10,191,188,0.1) 0%, transparent 60%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slow-spin':  'spin 20s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'out-expo':      'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-sine':   'cubic-bezier(0.37, 0, 0.63, 1)',
        'in-out-quart':  'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}

export default config
