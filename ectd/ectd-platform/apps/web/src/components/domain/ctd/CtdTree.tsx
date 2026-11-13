"use client";

import { useCtdSectionTree, useContextsOfUse } from "@/lib/api/queries";
import { useWorkspaceStore } from "@/lib/store/workspace";
import { CtdTreeNode } from "./CtdTreeNode";
import { LoadingSkeleton, ErrorState } from "@/components/ui/States";
import { RegulatoryGapBanner } from "@/components/ui/RegulatoryGapBanner";
import type { CtdSection, ContextOfUse } from "@/lib/api/client";
import type { CtdIndicator } from "./CtdIndicator";

interface CtdTreeProps {
  ctdStructurePackageId: string | null | undefined;
  submissionUnitId: string | null | undefined;
}

/**
 * Derives a section indicator from the CoUs assigned to it.
 * The backend is authoritative for validation state — this is display-only.
 */
function deriveIndicator(
  sectionId: string,
  cous: ContextOfUse[],
): CtdIndicator {
  const sectionCous = cous.filter((c) => {
    // CoU links to a section via contextDefinition — we match on ctdSectionId
    // when available, otherwise fall back to empty
    return (c as ContextOfUse & { ctdSectionId?: string }).ctdSectionId === sectionId;
  });

  if (sectionCous.length === 0) return "empty";
  if (sectionCous.some((c) => c.status === "SUSPENDED")) return "warning";
  return "complete";
}

function TreeBranch({
  sections,
  depth,
  cous,
}: {
  sections: CtdSection[];
  depth: number;
  cous: ContextOfUse[];
}) {
  const { selectedSectionId, expandedSectionIds, setSelectedSection, toggleSection } =
    useWorkspaceStore();

  return (
    <>
      {sections.map((section) => (
        <CtdTreeNode
          key={section.id}
          section={section}
          depth={depth}
          isExpanded={expandedSectionIds.has(section.id)}
          isSelected={selectedSectionId === section.id}
          indicator={deriveIndicator(section.id, cous)}
          onSelect={setSelectedSection}
          onToggle={toggleSection}
        >
          {section.children && section.children.length > 0 && (
            <TreeBranch
              sections={section.children}
              depth={depth + 1}
              cous={cous}
            />
          )}
        </CtdTreeNode>
      ))}
    </>
  );
}

export function CtdTree({ ctdStructurePackageId, submissionUnitId }: CtdTreeProps) {
  const {
    data: tree,
    isLoading: loadingTree,
    isError: treeError,
  } = useCtdSectionTree(ctdStructurePackageId);

  const { data: cous = [] } = useContextsOfUse(submissionUnitId ?? "");

  if (!ctdStructurePackageId) {
    return (
      <RegulatoryGapBanner
        title="CTD Structure Package"
        reason="No CTD structure package is linked to this Submission Unit."
        impact="The CTD tree cannot be rendered until a structure package is configured."
        className="m-3"
      />
    );
  }

  if (loadingTree) return <LoadingSkeleton rows={6} className="p-3" />;

  if (treeError || !tree) {
    return (
      <ErrorState
        title="Could not load CTD structure"
        message="The CTD structure package could not be loaded."
        className="m-3"
      />
    );
  }

  if (tree.length === 0) {
    return (
      <RegulatoryGapBanner
        title="CTD Structure Empty"
        reason="The linked CTD structure package contains no sections."
        impact="Seed the ICH baseline modules or import the authoritative CTD structure package."
        className="m-3"
      />
    );
  }

  return (
    <ul
      role="tree"
      aria-label="CTD Structure"
      className="py-2 text-sm"
    >
      <TreeBranch sections={tree} depth={0} cous={cous} />
    </ul>
  );
}
