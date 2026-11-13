'use client'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-6 pt-[70px]">
      <div className="text-center max-w-lg">
        <span className="text-eyebrow uppercase tracking-widest text-green-mid font-bold block mb-4">
          Error
        </span>
        <h2 className="text-section-xl font-bold text-text-primary mb-4">Something went wrong</h2>
        <p className="text-body-md text-text-secondary mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <Button variant="primary" size="lg" onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
