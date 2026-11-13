interface TeamProfileCardProps {
  displayName: string;
  role?: string | null;
  department?: string | null;
  biography?: string | null;
  photoUrl?: string | null;
}

export function TeamProfileCard({
  displayName, role, department, biography, photoUrl,
}: TeamProfileCardProps) {
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <article className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:border-brand-300 hover:shadow-md transition-all group">
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={`Portrait of ${displayName}`}
          className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-slate-100 group-hover:ring-brand-200 transition-all"
        />
      ) : (
        <div
          className="w-20 h-20 rounded-full mx-auto bg-brand-600 text-white flex items-center justify-center text-xl font-bold ring-2 ring-brand-100 group-hover:ring-brand-300 transition-all"
          aria-label={`Initials for ${displayName}`}
        >
          {initials}
        </div>
      )}
      <h2 className="mt-4 text-base font-semibold text-slate-900">{displayName}</h2>
      {role && (
        <p className="mt-1 text-xs font-semibold text-brand-600 uppercase tracking-wide">{role}</p>
      )}
      {department && (
        <p className="text-xs text-slate-400 mt-0.5">{department}</p>
      )}
      {biography && (
        <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-3">{biography}</p>
      )}
    </article>
  );
}
