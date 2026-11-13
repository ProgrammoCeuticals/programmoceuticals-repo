'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-6">
      <div className="text-center max-w-lg">
        <span className="text-eyebrow uppercase tracking-widest text-accent-cyan font-semibold block mb-4">
          Error
        </span>
        <h2 className="text-section-xl font-semibold text-white mb-4">
          Something went wrong
        </h2>
        <p className="text-text-secondary text-body-md mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center h-11 px-6 rounded-full bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue-light transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
