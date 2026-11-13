import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds (light-first) ──
        'bg-base':       '#FAFAF8',   // warm off-white — primary page background
        'bg-alt':        '#F2F1EE',   // slightly darker cream — alternate sections
        'bg-card':       '#FFFFFF',   // pure white cards
        'bg-dark':       '#0D3B2E',   // deep forest green — hero, footer, CTA
        'bg-dark-alt':   '#0A2E23',   // deeper green for hover/variation
        'bg-dark-card':  '#133D2F',   // elevated card on dark section

        // ── Text ──
        'text-primary':       '#0F1A12',   // near-black with green tint
        'text-secondary':     '#3D5247',   // medium green-grey
        'text-muted':         '#7A9085',   // muted for captions
        'text-light':         '#FFFFFF',   // text on dark sections
        'text-light-muted':   '#B8CEBF',   // muted text on dark

        // ── Brand ──
        'green-deep':    '#0D3B2E',   // primary brand green
        'green-mid':     '#1A6B4A',   // mid green for accents
        'green-light':   '#2D9A6A',   // light green for hover
        'gold':          '#C8922A',   // warm gold — primary accent
        'gold-light':    '#E5B04A',   // lighter gold for hover
        'gold-pale':     '#FDF0D5',   // pale gold tint for backgrounds

        // ── Borders ──
        'border-light':  'rgba(0,0,0,0.08)',
        'border-green':  'rgba(13,59,46,0.15)',
        'border-dark':   'rgba(255,255,255,0.12)',
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'hero-xl':    ['clamp(48px, 6vw, 80px)',  { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'hero-lg':    ['clamp(36px, 4.5vw, 60px)', { lineHeight: '1.1',  letterSpacing: '-0.02em'  }],
        'section-xl': ['clamp(30px, 3.5vw, 52px)', { lineHeight: '1.15', letterSpacing: '-0.018em' }],
        'section-lg': ['clamp(24px, 2.8vw, 40px)', { lineHeight: '1.2',  letterSpacing: '-0.015em' }],
        'heading-md': ['clamp(18px, 2vw, 28px)',   { lineHeight: '1.3',  letterSpacing: '-0.01em'  }],
        'body-lg':    ['clamp(16px, 1.4vw, 19px)', { lineHeight: '1.7'  }],
        'body-md':    ['clamp(15px, 1.2vw, 17px)', { lineHeight: '1.7'  }],
        'body-sm':    ['14px',                      { lineHeight: '1.6'  }],
        'eyebrow':    ['12px',                      { lineHeight: '1.4',  letterSpacing: '0.1em'   }],
      },

      borderRadius: {
        'sm':   '6px',
        'md':   '12px',
        'lg':   '18px',
        'xl':   '28px',
        'full': '9999px',
      },

      boxShadow: {
        'card':        '0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.05)',
        'card-hover':  '0 4px 16px rgba(0,0,0,0.1), 0 16px 40px rgba(0,0,0,0.08)',
        'green-glow':  '0 0 32px rgba(13,59,46,0.2)',
        'gold-glow':   '0 0 24px rgba(200,146,42,0.3)',
        'header':      '0 1px 0 rgba(0,0,0,0.06), 0 2px 16px rgba(0,0,0,0.04)',
      },

      backgroundImage: {
        'gradient-green':       'linear-gradient(135deg, #0D3B2E 0%, #1A6B4A 100%)',
        'gradient-gold':        'linear-gradient(135deg, #C8922A 0%, #E5B04A 100%)',
        'gradient-hero':        'linear-gradient(160deg, #0D3B2E 0%, #0A4535 50%, #0D3B2E 100%)',
        'gradient-section':     'linear-gradient(180deg, #FAFAF8 0%, #F2F1EE 100%)',
        'gradient-radial-gold': 'radial-gradient(ellipse at 60% 0%, rgba(200,146,42,0.12) 0%, transparent 60%)',
        'gradient-radial-green':'radial-gradient(ellipse at 40% 100%, rgba(13,59,46,0.08) 0%, transparent 60%)',
      },

      transitionTimingFunction: {
        'out-expo':     'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },

      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },

      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
