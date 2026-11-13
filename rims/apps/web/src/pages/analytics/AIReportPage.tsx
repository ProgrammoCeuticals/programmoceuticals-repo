import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Badge, Spinner } from "@rims/ui";
import api from "../../lib/api";

interface AiSummaryResult {
  summary: string | null;
  sourceData: Record<string, unknown>;
  isAiGenerated: boolean;
  generatedAt: string;
  disclaimer: string;
}

interface AiResponse {
  data: AiSummaryResult;
}

type SourceDataRecord = Record<string, unknown>;

function getDefaultDates(): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString().split("T")[0];
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  return { start, end };
}

function StatCard({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 text-center">
      <p className="text-lg font-semibold text-slate-800">{String(value ?? "—")}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

export function AIReportPage() {
  const defaults = getDefaultDates();
  const [periodStart, setPeriodStart] = useState(defaults.start);
  const [periodEnd, setPeriodEnd] = useState(defaults.end);
  const [result, setResult] = useState<AiSummaryResult | null>(null);
  const [sourceExpanded, setSourceExpanded] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post<AiResponse>("/ai-reports/executive-summary", {
          periodStart,
          periodEnd,
        })
        .then((r) => r.data.data),
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const sourceDataEntries = result
    ? Object.entries(result.sourceData).filter(([k]) => k !== "data")
    : [];

  const nestedData = result?.sourceData?.data as SourceDataRecord | undefined;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-800">
        AI-Assisted Executive Summary
      </h1>

      {/* Disclaimer */}
      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Important:</strong> AI summaries are generated from RIMS platform data.
        They are for informational purposes only and must not be used as the sole basis
        for employment, funding, or scientific decisions. Always verify figures against
        source records.
      </div>

      {/* Date range */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Period Start
          </label>
          <input
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Period End
          </label>
          <input
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          variant="primary"
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={!periodStart || !periodEnd}
        >
          Generate Summary
        </Button>
      </div>

      {/* Loading state */}
      {mutation.isPending && (
        <div className="flex items-center gap-3 text-slate-600">
          <Spinner />
          <span className="text-sm">Generating summary…</span>
        </div>
      )}

      {/* Error state */}
      {mutation.isError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to generate summary: {(mutation.error as Error).message}
        </div>
      )}

      {/* Result */}
      {result && !mutation.isPending && (
        <div className="space-y-4">
          {result.isAiGenerated ? (
            <>
              <div className="flex items-center gap-2">
                <Badge variant="suspended" label="AI-Generated" />
                <span className="text-xs text-slate-500">
                  Generated at {new Date(result.generatedAt).toLocaleString()}
                </span>
              </div>

              {result.summary && (
                <blockquote className="border-l-4 border-blue-300 bg-blue-50 pl-4 pr-3 py-3 text-sm text-slate-700 rounded-r-md italic">
                  {result.summary}
                </blockquote>
              )}

              <p className="text-xs text-slate-500 italic">{result.disclaimer}</p>
            </>
          ) : (
            <>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                No AI key configured — showing structured data
              </div>

              {nestedData && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(nestedData).map(([key, value]) => (
                    <StatCard key={key} label={key} value={value} />
                  ))}
                </div>
              )}

              {sourceDataEntries.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {sourceDataEntries.map(([key, value]) => (
                    <StatCard key={key} label={key} value={value} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Collapsible source data */}
          <div className="rounded-md border border-slate-200 bg-white">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setSourceExpanded((v) => !v)}
              aria-expanded={sourceExpanded}
            >
              <span>Source Data</span>
              <span className="text-slate-400">{sourceExpanded ? "▲" : "▼"}</span>
            </button>
            {sourceExpanded && (
              <div className="border-t border-slate-200 px-4 py-3 overflow-x-auto">
                <pre className="text-xs text-slate-600 whitespace-pre-wrap">
                  {JSON.stringify(result.sourceData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
