'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'light'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-green-deep text-white hover:bg-bg-dark-alt shadow-[0_2px_8px_rgba(13,59,46,0.25)] hover:shadow-[0_4px_16px_rgba(13,59,46,0.35)]',
  secondary:
    'bg-bg-alt text-text-primary border border-border-light hover:bg-bg-card hover:border-border-green',
  outline:
    'border border-green-deep text-green-deep hover:bg-green-deep hover:text-white',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-bg-alt',
  gold:
    'bg-gradient-gold text-white shadow-[0_2px_8px_rgba(200,146,42,0.3)] hover:shadow-[0_4px_20px_rgba(200,146,42,0.4)]',
  light:
    'bg-white text-green-deep hover:bg-gold-pale border border-white/20',
}

const sizes: Record<Size, string> = {
  sm: 'h-9  px-4 text-sm  gap-1.5',
  md: 'h-11 px-6 text-sm  gap-2',
  lg: 'h-13 px-8 text-base gap-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold',
        'transition-all duration-200 ease-out-expo select-none cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
export default Button
