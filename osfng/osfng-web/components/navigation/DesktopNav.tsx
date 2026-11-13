'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from '@/data/navigation'

interface Props { scrolled: boolean }

export default function DesktopNav({ scrolled }: Props) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
      {navItems.map((item) =>
        item.dropdown ? (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setOpen(item.label)}
            onMouseLeave={() => setOpen(null)}
          >
            <button
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-150',
                scrolled
                  ? 'text-text-secondary hover:text-text-primary hover:bg-bg-alt'
                  : 'text-text-light-muted hover:text-white hover:bg-white/10',
              )}
              aria-expanded={open === item.label}
              aria-haspopup="true"
            >
              {item.label}
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={cn('transition-transform duration-200', open === item.label && 'rotate-180')}
              />
            </button>

            {open === item.label && (
              <div className="absolute top-full left-0 pt-2 w-64 z-50">
                <div className="bg-bg-card border border-border-light rounded-xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                  {item.dropdown.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(null)}
                      className="flex flex-col px-4 py-3 rounded-lg hover:bg-bg-alt transition-colors group"
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
              </div>
            )}
          </div>
        ) : (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-150',
              scrolled
                ? 'text-text-secondary hover:text-text-primary hover:bg-bg-alt'
                : 'text-text-light-muted hover:text-white hover:bg-white/10',
            )}
          >
            {item.label}
          </Link>
        ),
      )}
    </nav>
  )
}
