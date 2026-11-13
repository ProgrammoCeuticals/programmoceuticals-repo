"use client";

import { useState } from "react";
import { usePackageManifest, usePackageDownloadRef, useInvalidatePackage } from "@/lib/api/queries";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { ApiClientError } from "@/lib/api/client";
import { ShieldCheck, ShieldX, Download, ChevronDown, ChevronUp } from "lucide-react";
import type { SubmissionPackage } from "@/lib/api/client";

interface SubmissionPackageCardProps {
  pkg: SubmissionPackage;
}

export function SubmissionPackageCard({ pkg }: SubmissionPackageCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showInvalidate, setShowInvalidate] = useState(false);

  const { data: manifest } = usePackageManifest(expanded ? pkg.id : "");
  const { data: dlRef } = usePackageDownloadRef(expanded ? pkg.id : "");
  const { mutateAsync: invalidate, isPending } = useInvalidatePackage();

  const handleInvalidate = async () => {
    try {
      await invalidate({ packageId: pkg.id, reason: "Manually invalidated via UI" });
      toast.success("Package invalidated.");
      setShowInvalidate(false);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Invalidation failed.";
      toast.error(msg);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Header row */}
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium text-gray-800">
              v{pkg.packageVersion}
            </span>
            <StatusBadge status={pkg.status} />
            {manifest?.readyForTransmission && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Ready for Transmission
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-gray-400">
            Generated {new Date(pkg.generatedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pkg.status === "FINALIZED" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(`/api/v1/submission-packages/${pkg.id}/download`, "_blank")}
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download
            </Button>
          )}
          {pkg.status !== "INVALIDATED" && (
            <Button
              variant="secondary"
              size="sm"
              className="text-amber-700 border-amber-300 hover:bg-amber-50"
              onClick={() => setShowInvalidate(true)}
            >
              Invalidate
            </Button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse package details" : "Expand package details"}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded manifest */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-3 text-sm">
          {/* Checksum */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" aria-hidden="true" />
            <span className="font-medium">Checksum ({pkg.checksumAlgorithm}):</span>
            <span className="font-mono">{pkg.checksum}</span>
          </div>

          {/* File size */}
          <div className="text-xs text-gray-500">
            Size: {(Number(pkg.fileSize) / 1024).toFixed(1)} KB
          </div>

          {/* Download availability */}
          {dlRef && (
            <div className="flex items-center gap-1.5 text-xs">
              {dlRef.available ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                  <span className="text-green-700">Package file available in storage</span>
                </>
              ) : (
                <>
                  <ShieldX className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                  <span className="text-amber-700">Package file not available in storage</span>
                </>
              )}
            </div>
          )}

          {/* Linked run IDs */}
          {manifest?.validationRunId && (
            <div className="text-xs text-gray-500">
              Validation run:{" "}
              <span className="font-mono">{manifest.validationRunId.slice(0, 12)}…</span>
            </div>
          )}
          {manifest?.xmlGenerationRunId && (
            <div className="text-xs text-gray-500">
              XML generation run:{" "}
              <span className="font-mono">{manifest.xmlGenerationRunId.slice(0, 12)}…</span>
            </div>
          )}
          {manifest?.generatorVersion && (
            <div className="text-xs text-gray-500">
              Generator: {manifest.generatorVersion}
            </div>
          )}
        </div>
      )}

      <ConfirmationDialog
        open={showInvalidate}
        onClose={() => setShowInvalidate(false)}
        onConfirm={() => void handleInvalidate()}
        title="Invalidate Package"
        description="This will mark the package as INVALIDATED. It cannot be used for transmission. This action cannot be undone."
        confirmLabel="Invalidate"
        confirmVariant="danger"
        loading={isPending}
      />
    </div>
  );
}
