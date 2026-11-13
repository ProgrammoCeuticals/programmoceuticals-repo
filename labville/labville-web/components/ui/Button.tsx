'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'science' | 'light'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  asChild?: boolean
  href?: string
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent-blue text-white hover:bg-accent-blue-light active:scale-[0.98] shadow-[0_0_20px_rgba(30,111,217,0.3)] hover:shadow-[0_0_30px_rgba(30,111,217,0.5)]',
  secondary:
    'bg-white/10 text-white border border-white/15 hover:bg-white/15 hover:border-white/25 backdrop-blur-sm',
  ghost:
    'text-text-secondary hover:text-white hover:bg-white/8',
  outline:
    'border border-white/20 text-white hover:border-white/40 hover:bg-white/5',
  science:
    'bg-gradient-science text-white shadow-[0_0_24px_rgba(30,111,217,0.35)] hover:shadow-[0_0_40px_rgba(10,191,188,0.4)] active:scale-[0.98]',
  light:
    'bg-white text-text-dark hover:bg-bg-light shadow-sm hover:shadow-md active:scale-[0.98]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-13 px-8 text-base gap-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base
          'inline-flex items-center justify-center rounded-full font-medium',
          'transition-all duration-200 ease-out-expo',
          'select-none cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          // Variant
          variantClasses[variant],
          // Size
          sizeClasses[size],
          // Width
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
