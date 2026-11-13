'use client'
import { useState } from 'react'
import Link from 'next/link'
import { X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from '@/data/navigation'
import Button from '@/components/ui/Button'

interface Props { isOpen: boolean; onClose: () => void }

export default function MobileNav({ isOpen, onClose }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-sm bg-bg-card z-50 lg:hidden flex flex-col',
          'transition-transform duration-300 ease-out-expo',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-border-light">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-green flex items-center justify-center">
              <span className="text-white font-black text-xs">OS</span>
            </div>
            <span className="font-bold text-text-primary text-sm leading-none">
              Operation Smile<br />
              <span className="text-text-muted font-normal">Foundation</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-alt transition-colors"
            aria-label="Close navigation"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-alt transition-colors"
                    aria-expanded={expanded === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className={cn('transition-transform duration-200', expanded === item.label && 'rotate-180')}
                    />
                  </button>
                  {expanded === item.label && (
                    <div className="pl-4 pb-2 space-y-0.5">
                      {item.dropdown.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-bg-alt transition-colors group"
                        >
                          <span className="text-sm font-semibold text-text-primary group-hover:text-green-mid transition-colors">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="text-xs text-text-muted mt-0.5">{child.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center px-3 py-3 rounded-lg text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-alt transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom CTAs */}
        <div className="px-4 pb-6 pt-4 border-t border-border-light space-y-3">
          <Link href="/become-a-member" onClick={onClose} className="block">
            <Button variant="primary" fullWidth size="lg">Become a Member</Button>
          </Link>
          <Link href="/apply-for-a-loan" onClick={onClose} className="block">
            <Button variant="gold" fullWidth size="lg">Apply for a Loan</Button>
          </Link>
          <a
            href="tel:+2349139973419"
            className="flex items-center justify-center gap-2 py-2 text-sm text-text-muted hover:text-text-primary transition-colors"
            onClick={onClose}
          >
            <span>Call us:</span>
            <span className="font-semibold text-text-primary">+234-913-997-3419</span>
          </a>
        </div>
      </div>
    </>
  )
}
