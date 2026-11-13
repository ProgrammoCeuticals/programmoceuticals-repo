import { useState } from "react";
import type { DeficiencySection } from "../types/report.types";
import { GMP_CATEGORIES, type CategoryDeficiency, type GmpCategory } from "../types/report.types";
import { Card, ExtractedTextBlock } from "./ui";

export function DeficienciesCard({
  section,
  categoryDeficiencies,
  onChange
}: {
  section: DeficiencySection;
  categoryDeficiencies: Record<GmpCategory, CategoryDeficiency>;
  onChange: (category: GmpCategory, patch: Partial<CategoryDeficiency>) => void;
}) {
  return (
    <Card title="Deficiencies">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Extracted from document</p>
      {section.deficiencyHtml ? (
        <div
          className="deficiency-html max-h-[640px] overflow-auto rounded-lg border border-slate-200 bg-white p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: section.deficiencyHtml }}
        />
      ) : (
        <ExtractedTextBlock text={section.rawText} fallback="Deficiency section could not be found" />
      )}

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Deficiency Count by GMP Category</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                <th className="w-24 pb-2 px-2 text-center text-xs font-semibold uppercase tracking-wide text-red-700">Critical</th>
                <th className="w-24 pb-2 px-2 text-center text-xs font-semibold uppercase tracking-wide text-warning">Major</th>
                <th className="w-24 pb-2 px-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Others</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {GMP_CATEGORIES.map((category) => {
                const row = categoryDeficiencies[category];
                return (
                  <tr key={category}>
                    <td className="py-2.5 pr-4 font-medium text-ink">{category}</td>
                    <td className="py-2.5 px-2">
                      <DeficiencyCell value={row.critical} onChange={(v) => onChange(category, { critical: v })} />
                    </td>
                    <td className="py-2.5 px-2">
                      <DeficiencyCell value={row.major} onChange={(v) => onChange(category, { major: v })} />
                    </td>
                    <td className="py-2.5 px-2">
                      <DeficiencyCell value={row.others} onChange={(v) => onChange(category, { others: v })} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

function DeficiencyCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const num = parseInt(value, 10);
  const isPositive = !isNaN(num) && num > 0;

  if (editing) {
    return (
      <input
        type="number"
        min="0"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center text-sm font-semibold text-ink outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />
    );
  }

  if (isPositive) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="w-full rounded-lg border border-red-200 bg-red-100 px-2 py-1.5 text-center text-sm font-semibold text-red-800"
      >
        {num}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="w-full rounded-lg border border-green-200 bg-green-100 px-2 py-1.5 text-center text-sm font-semibold text-green-800"
    >
      NIL
    </button>
  );
}
