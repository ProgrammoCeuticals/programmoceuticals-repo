interface HeroSectionProps {
  headline: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function HeroSection({ headline, subtext, ctaLabel, ctaHref }: HeroSectionProps) {
  return (
    <section
      className="relative bg-brand-950 text-white overflow-hidden"
      aria-label="Hero section"
    >
      {/* Dot-grid texture overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-100 pointer-events-none" />

      {/* Geometric accent — top-right circle */}
      <div
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0B5ED7 0%, transparent 70%)' }}
      />
      {/* Bottom-left accent */}
      <div
        className="absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0B5ED7 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36">
        {/* Eyebrow label */}
        <p className="animate-fade-in text-brand-300 text-sm font-semibold uppercase tracking-widest mb-4">
          Research Institute Management System
        </p>

        <h1 className="animate-fade-up text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl">
          {headline}
        </h1>

        {subtext && (
          <p className="animate-fade-up animation-delay-200 mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
            {subtext}
          </p>
        )}

        <div className="animate-fade-up animation-delay-300 mt-10 flex flex-wrap gap-4">
          {ctaLabel && ctaHref && (
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded transition-colors"
            >
              {ctaLabel}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
          <a
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-500 hover:border-slate-300 text-slate-300 hover:text-white font-semibold rounded transition-colors"
          >
            About the Institute
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </section>
  );
}
