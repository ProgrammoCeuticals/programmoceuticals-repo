"use client";

import { useContextsOfUse, useContextOfUse } from "@/lib/api/queries";
import { useWorkspaceStore } from "@/lib/store/workspace";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { LoadingSkeleton } from "@/components/ui/States";
import { SuspendCouDialog } from "@/components/domain/lifecycle/SuspendCouDialog";
import { ReplaceCouDialog } from "@/components/domain/lifecycle/ReplaceCouDialog";
import { AddCouDialog } from "@/components/domain/lifecycle/AddCouDialog";
import { CouLifecyclePanel } from "@/components/domain/lifecycle/CouLifecyclePanel";
import { useState } from "react";
import type { CtdSection } from "@/lib/api/client";

interface CouDetailPanelProps {
  submissionUnitId: string | null | undefined;
  ctdPackageId: string | null | undefined;
  applicationId: string;
  sections: CtdSection[];
}

type Dialog = "suspend" | "replace" | "add" | null;

export function CouDetailPanel({
  submissionUnitId,
  ctdPackageId,
  applicationId,
  sections,
}: CouDetailPanelProps) {
  const { selectedSectionId, selectedCouId, setSelectedCou } = useWorkspaceStore();
  const [dialog, setDialog] = useState<Dialog>(null);

  const { data: cous, isLoading: loadingCous } = useContextsOfUse(
    submissionUnitId ?? "",
  );

  const selectedSection = findSection(sections, selectedSectionId);

  const sectionCous = (cous ?? []).filter(
    (c) =>
      (c as typeof c & { ctdSectionId?: string }).ctdSectionId ===
      selectedSectionId,
  );

  const activeCou = selectedCouId
    ? sectionCous.find((c) => c.id === selectedCouId)
    : sectionCous[0];

  if (!selectedSectionId) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-sm text-gray-400">
        Select a CTD section to view its Context of Use
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Section header */}
      <div className="border-b border-gray-100 px-4 py-3">
        {selectedSection && (
          <>
            <p className="font-mono text-xs text-gray-400">
              {selectedSection.sectionCode}
            </p>
            <p className="mt-0.5 text-sm font-medium text-gray-900">
              {selectedSection.title}
            </p>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {loadingCous ? (
          <LoadingSkeleton rows={3} />
        ) : sectionCous.length === 0 ? (
          <EmptySectionState onAdd={() => setDialog("add")} />
        ) : (
          <>
            {sectionCous.length > 1 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">
                  Contexts of Use ({sectionCous.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {sectionCous.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCou(c.id)}
                      className={`rounded px-2 py-0.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        activeCou?.id === c.id
                          ? "bg-brand-100 text-brand-800 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {c.id.slice(0, 8)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeCou && (
              <CouDetail
                couId={activeCou.id}
                onSuspend={() => setDialog("suspend")}
                onReplace={() => setDialog("replace")}
              />
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      {activeCou && (
        <>
          <SuspendCouDialog
            couId={activeCou.id}
            open={dialog === "suspend"}
            onClose={() => setDialog(null)}
          />
          <ReplaceCouDialog
            couId={activeCou.id}
            open={dialog === "replace"}
            onClose={() => setDialog(null)}
          />
        </>
      )}

      {selectedSection && submissionUnitId && ctdPackageId && (
        <AddCouDialog
          open={dialog === "add"}
          onClose={() => setDialog(null)}
          submissionUnitId={submissionUnitId}
          ctdPackageId={ctdPackageId}
          applicationId={applicationId}
          section={selectedSection}
        />
      )}
    </div>
  );
}

function CouDetail({
  couId,
  onSuspend,
  onReplace,
}: {
  couId: string;
  onSuspend: () => void;
  onReplace: () => void;
}) {
  const { data: cou, isLoading } = useContextOfUse(couId);
  const [showLifecycle, setShowLifecycle] = useState(false);

  if (isLoading) return <LoadingSkeleton rows={4} />;
  if (!cou) return null;

  const couWithExtras = cou as typeof cou & {
    document?: { title: string; uuid: string };
    contextDefinition?: { code: string; name: string; codeSystem: string };
    keywords?: Array<{ id: string; value: string; keywordDefinition: { name: string } }>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={cou.status} />
      </div>

      {couWithExtras.document && (
        <DetailRow label="Document">
          <p className="font-medium text-gray-900">{couWithExtras.document.title}</p>
          <p className="font-mono text-xs text-gray-400">{couWithExtras.document.uuid}</p>
        </DetailRow>
      )}

      {couWithExtras.contextDefinition && (
        <DetailRow label="Context">
          <p className="text-gray-900">{couWithExtras.contextDefinition.name}</p>
          <p className="font-mono text-xs text-gray-400">
            {couWithExtras.contextDefinition.code}
          </p>
        </DetailRow>
      )}

      {couWithExtras.keywords && couWithExtras.keywords.length > 0 && (
        <DetailRow label="Keywords">
          <div className="space-y-1">
            {couWithExtras.keywords.map((kw) => (
              <div key={kw.id} className="flex justify-between text-xs">
                <span className="text-gray-500">{kw.keywordDefinition.name}</span>
                <span className="font-medium text-gray-800">{kw.value}</span>
              </div>
            ))}
          </div>
        </DetailRow>
      )}

      <DetailRow label="Context of Use ID">
        <p className="font-mono text-xs text-gray-500">{cou.uuid}</p>
      </DetailRow>

      {/* Lifecycle history toggle */}
      <div>
        <button
          onClick={() => setShowLifecycle((v) => !v)}
          className="text-xs text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {showLifecycle ? "Hide" : "Show"} lifecycle history
        </button>
        {showLifecycle && (
          <div className="mt-2">
            <CouLifecyclePanel couId={couId} />
          </div>
        )}
      </div>

      {cou.status === "ACTIVE" && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500">Actions</p>
          <div className="flex flex-col gap-1.5">
            <Button variant="secondary" size="sm" onClick={onReplace}>
              Replace
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-amber-700 border-amber-300 hover:bg-amber-50"
              onClick={onSuspend}
            >
              Suspend
            </Button>
          </div>
        </div>
      )}

      {cou.status === "SUSPENDED" && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          This Context of Use is suspended. Suspension is irreversible under the ICH lifecycle model.
        </div>
      )}
    </div>
  );
}

function EmptySectionState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        No Context of Use has been created for this section.
      </p>
      <div className="flex flex-col gap-1.5">
        <Button variant="secondary" size="sm" onClick={onAdd}>
          Add Document
        </Button>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-0.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      {children}
    </div>
  );
}

function findSection(
  sections: CtdSection[],
  id: string | null,
): CtdSection | undefined {
  if (!id) return undefined;
  for (const s of sections) {
    if (s.id === id) return s;
    if (s.children) {
      const found = findSection(s.children, id);
      if (found) return found;
    }
  }
  return undefined;
}
