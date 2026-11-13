import { cn } from '@/lib/utils'

interface BadgeProps {
  children:  React.ReactNode
  variant?:  'green' | 'gold' | 'light' | 'outline-green' | 'outline-gold'
  className?: string
}

export default function Badge({ children, variant = 'green', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-eyebrow font-bold uppercase tracking-widest',
        variant === 'green'        && 'bg-green-deep/10 text-green-mid border border-green-deep/15',
        variant === 'gold'         && 'bg-gold-pale text-gold border border-gold/20',
        variant === 'light'        && 'bg-white text-green-deep border border-border-light',
        variant === 'outline-green'&& 'border border-green-deep text-green-deep',
        variant === 'outline-gold' && 'border border-gold text-gold',
        className,
      )}
    >
      {children}
    </span>
  )
}
