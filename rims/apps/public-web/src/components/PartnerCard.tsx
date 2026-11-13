interface PartnerCardProps {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
}

export function PartnerCard({ name, description, logoUrl, websiteUrl }: PartnerCardProps) {
  const card = (
    <article className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={`Logo of ${name}`}
          className="h-16 object-contain"
        />
      ) : (
        <div className="h-16 flex items-center justify-center">
          <span className="text-lg font-semibold text-brand-600">{name}</span>
        </div>
      )}
      <h2 className="mt-4 text-base font-semibold text-slate-800">{name}</h2>
      {description && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{description}</p>}
    </article>
  );

  if (websiteUrl) {
    return (
      <a
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${name} website`}
      >
        {card}
      </a>
    );
  }

  return card;
}
