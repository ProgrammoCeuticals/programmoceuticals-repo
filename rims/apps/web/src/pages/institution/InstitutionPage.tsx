import { useQuery } from "@tanstack/react-query";
import { PageHeader, Badge } from "@rims/ui";
import api from "../../lib/api";

interface Institution {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  website: string;
  email?: string;
  description?: string;
  logoUrl?: string;
  accreditationNumber?: string;
  establishedYear?: number;
  country?: string;
  city?: string;
}

export function InstitutionPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["institution"],
    queryFn: () =>
      api.get<{ data: Institution }>("/institution").then((r) => r.data),
  });

  const inst = (data as { data?: Institution } | undefined)?.data;

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Institution" />
        <div className="animate-pulse space-y-4 mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!inst) return <div className="p-6"><div className="h-8 w-48 bg-slate-200 animate-pulse rounded" /></div>;

  const fields: { label: string; value?: string | number | null }[] = [
    { label: "Name", value: inst.name },
    { label: "Type", value: inst.type },
    { label: "Address", value: inst.address },
    { label: "Phone", value: inst.phone },
    { label: "Website", value: inst.website },
    { label: "Email", value: inst.email },
    { label: "Country", value: inst.country },
    { label: "City", value: inst.city },
    { label: "Established Year", value: inst.establishedYear },
    { label: "Accreditation No.", value: inst.accreditationNumber },
    { label: "Description", value: inst.description },
  ].filter((f) => f.value != null && f.value !== "");

  return (
    <div>
      <PageHeader title="Institution" />
      <div className="mt-4 bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex items-start px-6 py-4 gap-4">
            <span className="w-48 shrink-0 text-sm font-medium text-slate-500">
              {label}
            </span>
            {label === "Type" ? (
              <Badge label={String(value)} />
            ) : (
              <span className="text-sm text-slate-900">{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
