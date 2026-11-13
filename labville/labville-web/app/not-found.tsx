import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-6">
      <div className="text-center max-w-lg">
        <span className="text-eyebrow uppercase tracking-widest text-accent-cyan font-semibold block mb-4">
          404
        </span>
        <h1 className="text-section-xl font-semibold text-white mb-4">
          Page not found
        </h1>
        <p className="text-text-secondary text-body-md mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center h-11 px-6 rounded-full bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue-light transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center h-11 px-6 rounded-full border border-white/20 text-white text-sm font-medium hover:border-white/40 hover:bg-white/5 transition-colors"
          >
            Our Services
          </Link>
        </div>
      </div>
    </div>
  )
}
