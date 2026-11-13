interface Section {
  id: string;
  sectionType: string;
  sortOrder: number;
  configJson: Record<string, unknown>;
}

interface SectionRendererProps {
  section: Section;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const cfg = section.configJson ?? {};

  switch (section.sectionType) {
    case 'RICH_TEXT':
      return (
        <section aria-label="Content section" className="prose max-w-none py-8 px-6">
          <div dangerouslySetInnerHTML={{ __html: (cfg['html'] as string) ?? '' }} />
        </section>
      );

    case 'IMAGE_TEXT': {
      const heading = (cfg['heading'] as string) ?? '';
      const text = (cfg['text'] as string) ?? '';
      const imageUrl = (cfg['imageUrl'] as string) ?? null;
      return (
        <section aria-label={heading || 'Image and text'} className="py-12 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="rounded-lg object-cover w-full" />
            )}
            <div>
              {heading && <h2 className="text-2xl font-bold text-slate-800">{heading}</h2>}
              {text && <p className="mt-4 text-slate-600">{text}</p>}
            </div>
          </div>
        </section>
      );
    }

    case 'STATISTICS': {
      const stats = (cfg['stats'] as { label: string; value: string }[]) ?? [];
      return (
        <section aria-label="Statistics" className="bg-brand-600 text-white py-12 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-4xl font-bold">{s.value}</p>
                <p className="mt-1 text-blue-100">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'CTA': {
      const heading = (cfg['heading'] as string) ?? '';
      const text = (cfg['text'] as string) ?? '';
      const ctaLabel = (cfg['ctaLabel'] as string) ?? 'Learn more';
      const ctaHref = (cfg['ctaHref'] as string) ?? '#';
      return (
        <section aria-label="Call to action" className="bg-slate-50 py-16 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            {heading && <h2 className="text-3xl font-bold text-slate-800">{heading}</h2>}
            {text && <p className="mt-4 text-slate-600">{text}</p>}
            <a
              href={ctaHref}
              className="mt-6 inline-block bg-brand-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-brand-700 transition-colors"
            >
              {ctaLabel}
            </a>
          </div>
        </section>
      );
    }

    default:
      // Unknown section type — render nothing
      return null;
  }
}
