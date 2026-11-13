"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useDocuments, useCtdContextDefinitions, useCreateContextOfUse } from "@/lib/api/queries";
import { toast } from "@/components/ui/Toast";
import { ApiClientError } from "@/lib/api/client";
import type { CtdSection } from "@/lib/api/client";

interface AddCouDialogProps {
  open: boolean;
  onClose: () => void;
  submissionUnitId: string;
  ctdPackageId: string;
  applicationId: string;
  section: CtdSection;
}

export function AddCouDialog({
  open,
  onClose,
  submissionUnitId,
  ctdPackageId,
  applicationId,
  section,
}: AddCouDialogProps) {
  const [documentId, setDocumentId] = useState("");
  const [contextDefinitionId, setContextDefinitionId] = useState("");

  const { data: docsPage } = useDocuments(applicationId);
  const { data: contextDefs } = useCtdContextDefinitions(ctdPackageId);
  const { mutateAsync, isPending } = useCreateContextOfUse();

  // Only show context definitions for this section
  const sectionDefs = (contextDefs ?? []).filter(
    (cd) => cd.ctdSectionId === section.id,
  );

  const handleClose = () => {
    setDocumentId("");
    setContextDefinitionId("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId || !contextDefinitionId) return;
    try {
      await mutateAsync({ submissionUnitId, documentId, contextDefinitionId });
      toast.success("Context of Use created.");
      handleClose();
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Failed to create Context of Use.";
      toast.error(msg);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Document to Section" size="md">
      <div className="mb-4 rounded-md bg-gray-50 px-3 py-2 text-sm">
        <p className="font-mono text-xs text-gray-400">{section.sectionCode}</p>
        <p className="font-medium text-gray-900">{section.title}</p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        {/* Document picker */}
        <div>
          <label htmlFor="cou-document" className="mb-1 block text-xs font-medium text-gray-700">
            Document <span aria-hidden="true">*</span>
          </label>
          <select
            id="cou-document"
            required
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Select a document…</option>
            {(docsPage?.data ?? []).map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title}
              </option>
            ))}
          </select>
        </div>

        {/* Context definition picker */}
        <div>
          <label htmlFor="cou-context-def" className="mb-1 block text-xs font-medium text-gray-700">
            Context Definition <span aria-hidden="true">*</span>
          </label>
          {sectionDefs.length === 0 ? (
            <p className="text-xs text-amber-700">
              No context definitions found for this section in the linked CTD package.
            </p>
          ) : (
            <select
              id="cou-context-def"
              required
              value={contextDefinitionId}
              onChange={(e) => setContextDefinitionId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Select a context definition…</option>
              {sectionDefs.map((cd) => (
                <option key={cd.id} value={cd.id}>
                  {cd.name} ({cd.code})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!documentId || !contextDefinitionId || sectionDefs.length === 0}
            loading={isPending}
          >
            Assign
          </Button>
        </div>
      </form>
    </Modal>
  );
}
