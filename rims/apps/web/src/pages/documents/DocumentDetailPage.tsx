import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PageHeader,
  Button,
  Badge,
  Modal,
  FormField,
  Input,
  Spinner,
} from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";
import { useAuthStore } from "../../store/auth.store";

// ── Types ──────────────────────────────────────────────────────────────────

interface DocumentVersion {
  id: string;
  versionNumber: number;
  fileKey: string | null;
  fileName: string | null;
  fileSizeBytes: number | null;
  uploadedById: string | null;
  createdAt: string;
  notes: string | null;
}

interface DocumentDetail {
  id: string;
  title: string;
  description: string | null;
  status: string;
  folderId: string | null;
  uploadedById: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  currentVersion: number | null;
  updatedAt: string;
  versions?: DocumentVersion[];
}

// ── Helpers ────────────────────────────────────────────────────────────────


function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── AddVersionModal ────────────────────────────────────────────────────────

interface AddVersionModalProps {
  open: boolean;
  onClose: () => void;
  documentId: string;
}

function AddVersionModal({ open, onClose, documentId }: AddVersionModalProps) {
  const queryClient = useQueryClient();
  const [fileKey, setFileKey] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSizeBytes, setFileSizeBytes] = useState("");
  const [notes, setNotes] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post(`/documents/${documentId}/versions`, {
          fileKey: fileKey || undefined,
          fileName: fileName || undefined,
          fileSizeBytes: fileSizeBytes ? Number(fileSizeBytes) : undefined,
          notes: notes || undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Version added", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      setFileKey("");
      setFileName("");
      setFileSizeBytes("");
      setNotes("");
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to add version",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Version"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
            disabled={!fileName.trim()}
          >
            Add Version
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="File Key" htmlFor="ver-filekey">
          <Input
            id="ver-filekey"
            value={fileKey}
            onChange={(e) => setFileKey(e.target.value)}
            placeholder="S3 key or storage path"
          />
        </FormField>
        <FormField label="File Name" htmlFor="ver-filename" required>
          <Input
            id="ver-filename"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g. report-v2.pdf"
          />
        </FormField>
        <FormField label="File Size (bytes)" htmlFor="ver-size">
          <Input
            id="ver-size"
            type="number"
            value={fileSizeBytes}
            onChange={(e) => setFileSizeBytes(e.target.value)}
            placeholder="e.g. 204800"
          />
        </FormField>
        <FormField label="Notes" htmlFor="ver-notes">
          <Input
            id="ver-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional release notes"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── DocumentDetailPage ─────────────────────────────────────────────────────

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [addVersionOpen, setAddVersionOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () =>
      api.get<{ data: DocumentDetail }>(`/documents/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const document: DocumentDetail | undefined = (
    data as { data?: DocumentDetail } | undefined
  )?.data;

  const approveMutation = useMutation({
    mutationFn: () => api.post(`/documents/${id}/approve`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Document approved", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["document", id] });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to approve",
        description: err.message,
        variant: "error",
      });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: () => api.post(`/documents/${id}/archive`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Document archived", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["document", id] });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to archive",
        description: err.message,
        variant: "error",
      });
    },
  });

  const getDownloadUrl = async () => {
    try {
      const res = await api
        .get<{
          data?: { url?: string };
          url?: string;
        }>(`/documents/${id}/download-url`)
        .then((r) => r.data);
      const url =
        (res as { data?: { url?: string } }).data?.url ??
        (res as { url?: string }).url ??
        null;
      setDownloadUrl(url);
      if (!url) {
        toast({ title: "No download URL returned", variant: "error" });
      }
    } catch (err) {
      toast({
        title: "Failed to get download URL",
        description: (err as Error).message,
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-8 text-center text-slate-500">Document not found.</div>
    );
  }

  const versions: DocumentVersion[] = document.versions ?? [];

  return (
    <div>
      <PageHeader
        title={document.title}
        actions={
          <Button variant="ghost" onClick={() => navigate("/documents")}>
            ← Back
          </Button>
        }
      />

      {/* Document info card */}
      <div className="bg-white border border-[#e2e8f0] p-6 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge
            label={document.status}
          />
        </div>

        {document.description && (
          <p className="text-sm text-slate-700 mb-4">{document.description}</p>
        )}

        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
              Folder
            </dt>
            <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
              {document.folderId ?? "Root"}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
              Uploaded By
            </dt>
            <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
              {document.uploadedById ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
              File Name
            </dt>
            <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
              {document.fileName ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
              MIME Type
            </dt>
            <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
              {document.mimeType ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
              File Size
            </dt>
            <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
              {formatFileSize(document.fileSizeBytes)}
            </dd>
          </div>
          <div>
            <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#718096]">
              Current Version
            </dt>
            <dd className="text-[13px] font-semibold text-[#193441] mt-0.5">
              {document.currentVersion ?? "—"}
            </dd>
          </div>
        </dl>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-6">
          {document.status === "UNDER_REVIEW" &&
            hasPermission("documents.approve") && (
              <Button
                variant="primary"
                onClick={() => approveMutation.mutate()}
                loading={approveMutation.isPending}
              >
                Approve
              </Button>
            )}
          {document.status !== "ARCHIVED" &&
            hasPermission("documents.archive") && (
              <Button
                variant="ghost"
                onClick={() => archiveMutation.mutate()}
                loading={archiveMutation.isPending}
              >
                Archive
              </Button>
            )}
          <Button variant="ghost" onClick={() => setAddVersionOpen(true)}>
            Add Version
          </Button>
          <Button variant="ghost" onClick={getDownloadUrl}>
            Get Download URL
          </Button>
        </div>

        {/* Download URL result */}
        {downloadUrl && (
          <div className="mt-3 bg-[#f7f8fa] border border-[#e2e8f0] px-3 py-2">
            <p className="text-xs text-slate-500 mb-1">Download URL:</p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#193441] underline break-all hover:opacity-70"
            >
              {downloadUrl}
            </a>
          </div>
        )}
      </div>

      {/* Version history */}
      <div className="mb-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#193441] border-b-2 border-[#193441] pb-1 mb-3">
          Version History
        </h2>
        {versions.length === 0 ? (
          <div className="bg-white border border-[#e2e8f0] px-4 py-8 text-center text-sm text-slate-500">
            No versions recorded yet.
          </div>
        ) : (
          <div className="bg-white border border-[#e2e8f0] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#193441]">
                <tr>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Version
                  </th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    File Name
                  </th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Size
                  </th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Uploaded By
                  </th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Date
                  </th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-white">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {versions.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-[#f0f4f7] border-b border-[#e2e8f0]"
                  >
                    <td className="px-4 py-3 font-mono font-medium text-[#193441]">
                      v{v.versionNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {v.fileName ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {formatFileSize(v.fileSizeBytes)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {v.uploadedById ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(v.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {v.notes ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddVersionModal
        open={addVersionOpen}
        onClose={() => setAddVersionOpen(false)}
        documentId={id!}
      />
    </div>
  );
}
