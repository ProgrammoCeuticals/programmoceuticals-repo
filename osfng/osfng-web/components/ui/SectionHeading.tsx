import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?:     string
  headline:     string
  subheadline?: string
  align?:       'left' | 'center'
  theme?:       'light' | 'dark'
  divider?:     boolean
  className?:   string
}

export default function SectionHeading({
  eyebrow,
  headline,
  subheadline,
  align = 'left',
  theme = 'light',
  divider = true,
  className,
}: SectionHeadingProps) {
  const isDark = theme === 'dark'

  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'text-eyebrow uppercase tracking-[0.1em] font-bold mb-3',
            isDark ? 'text-gold-light' : 'text-green-mid',
          )}
        >
          {eyebrow}
        </span>
      )}

      {divider && (
        <div
          className={cn(
            'w-10 h-[3px] rounded-full mb-5',
            'bg-gradient-gold',
            align === 'center' && 'mx-auto',
          )}
        />
      )}

      <h2
        className={cn(
          'text-section-xl font-bold tracking-tight',
          isDark ? 'text-white' : 'text-text-primary',
        )}
      >
        {headline}
      </h2>

      {subheadline && (
        <p
          className={cn(
            'text-body-lg mt-4 max-w-2xl',
            isDark ? 'text-text-light-muted' : 'text-text-secondary',
            align === 'center' && 'mx-auto',
          )}
        >
          {subheadline}
        </p>
      )}
    </div>
  )
}
