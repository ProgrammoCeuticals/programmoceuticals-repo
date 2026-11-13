import Link from 'next/link';

/**
 * Landing page placeholder.
 * The full marketplace UI will be implemented in Phase 1 frontend sprints.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-brand-border bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span className="text-brand-blue font-bold text-xl tracking-tight">
            PharmIntern NG
          </span>
          <nav className="flex items-center gap-4">
            <Link
              href="/vacancies"
              className="text-sm text-brand-gray-mid hover:text-brand-blue transition-colors"
            >
              Browse Vacancies
            </Link>
            <Link href="/login" className="text-sm text-brand-gray-mid hover:text-brand-blue transition-colors">
              Log in
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-brand-gray-dark leading-tight mb-4">
            Find your pharmacy internship placement in Nigeria
          </h1>
          <p className="text-lg text-brand-gray-mid mb-8 leading-relaxed">
            PharmIntern NG connects pharmacy graduates with verified internship
            centres across community, hospital, industrial, and regulatory
            pharmacy settings.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/vacancies" className="btn-primary">
              Browse Vacancies
            </Link>
            <Link
              href="/register"
              className="text-sm text-brand-blue font-medium hover:underline"
            >
              Create an applicant account →
            </Link>
          </div>
          <p className="mt-8 text-xs text-brand-gray-mid">
            Are you an internship centre?{' '}
            <Link href="/employers/register" className="underline hover:text-brand-blue">
              Register your organisation
            </Link>
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="border-t border-brand-border px-6 py-4 text-center">
        <p className="text-xs text-brand-gray-mid">
          PharmIntern NG is an independent platform. It is not affiliated with,
          endorsed by, or operated by the Pharmacy Council of Nigeria (PCN) or
          any regulatory body. Platform approval of a centre does not constitute
          official regulatory accreditation.
        </p>
      </footer>
    </main>
  );
}
