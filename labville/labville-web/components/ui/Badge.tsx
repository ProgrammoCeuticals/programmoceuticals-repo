import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'science' | 'dark' | 'light' | 'outline'
  className?: string
}

export default function Badge({
  children,
  variant = 'science',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-eyebrow font-semibold uppercase tracking-widest',
        variant === 'science' &&
          'bg-accent-blue/15 text-accent-cyan border border-accent-blue/20',
        variant === 'dark' &&
          'bg-white/8 text-text-secondary border border-white/10',
        variant === 'light' &&
          'bg-accent-blue/10 text-accent-blue border border-accent-blue/15',
        variant === 'outline' &&
          'border border-white/20 text-text-secondary',
        className
      )}
    >
      {children}
    </span>
  )
}
