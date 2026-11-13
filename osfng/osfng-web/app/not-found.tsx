import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-6 pt-[70px]">
      <div className="text-center max-w-lg">
        <span className="text-eyebrow uppercase tracking-widest text-green-mid font-bold block mb-4">
          404
        </span>
        <h1 className="text-section-xl font-bold text-text-primary mb-4">Page not found</h1>
        <p className="text-body-md text-text-secondary mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/">
            <Button variant="primary" size="lg">Back to Home</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
