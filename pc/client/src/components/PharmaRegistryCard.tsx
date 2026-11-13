import type { PharmaRegistryMatch } from "../types/report.types";
import { Badge, Card } from "./ui";

export function PharmaRegistryCard({ match }: { match: PharmaRegistryMatch }) {
  return (
    <Card title="Pharma Registry">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Known Pharma Company</p>
          <div className="mt-1.5">
            <Badge
              label={match.isKnownPharmaCompany ? "Yes — Found in registry" : "No match found"}
              variant={match.isKnownPharmaCompany ? "success" : "warning"}
            />
          </div>
        </div>
        {match.isKnownPharmaCompany && match.matchedCompany && (
          <div className="border-l border-slate-200 pl-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Matched</p>
            <p className="mt-1 text-sm font-medium text-ink">{match.matchedCompany}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
