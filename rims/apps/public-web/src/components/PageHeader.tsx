interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <section className="bg-brand-950 text-white py-14 px-6 border-b border-brand-900" aria-label="Page header">
      <div className="max-w-7xl mx-auto">
        {eyebrow && (
          <p className="text-brand-300 text-sm font-semibold uppercase tracking-widest mb-3">{eyebrow}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {description && (
          <p className="mt-3 text-slate-300 text-lg max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  );
}
