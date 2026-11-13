import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Badge,
  DataTable,
  Select,
  Input,
  Modal,
  FormField,
} from "@rims/ui";
import { toast } from "@rims/ui";
import api from "../../lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

interface Document {
  id: string;
  title: string;
  mimeType: string | null;
  currentVersion: number | null;
  status: string;
  updatedAt: string;
}

interface FoldersResponse {
  data: Folder[];
}

interface DocumentsResponse {
  data: Document[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

// ── Helpers ────────────────────────────────────────────────────────────────


function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
}

// ── NewFolderModal ─────────────────────────────────────────────────────────

interface NewFolderModalProps {
  open: boolean;
  onClose: () => void;
}

function NewFolderModal({ open, onClose }: NewFolderModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api.post("/documents/folders", { name }).then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Folder created", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["document-folders"] });
      setName("");
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to create folder",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Folder"
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
            disabled={!name.trim()}
          >
            Create Folder
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Folder Name" htmlFor="folder-name" required>
          <Input
            id="folder-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── UploadDocumentModal ────────────────────────────────────────────────────

interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  selectedFolderId: string | null;
}

function UploadDocumentModal({
  open,
  onClose,
  selectedFolderId,
}: UploadDocumentModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [fileSizeBytes, setFileSizeBytes] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api
        .post("/documents", {
          title,
          description: description || undefined,
          folderId: selectedFolderId || undefined,
          fileName: fileName || undefined,
          mimeType: mimeType || undefined,
          fileSizeBytes: fileSizeBytes ? Number(fileSizeBytes) : undefined,
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: "Document created", variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setTitle("");
      setDescription("");
      setFileName("");
      setMimeType("");
      setFileSizeBytes("");
      onClose();
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to create document",
        description: err.message,
        variant: "error",
      });
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upload Document"
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
            disabled={!title.trim()}
          >
            Create
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-md bg-blue-50 border border-blue-200 px-3 py-2 text-xs text-blue-700">
          Note: File upload to S3 not implemented in this phase — metadata only.
        </div>
        <FormField label="Title" htmlFor="doc-title" required>
          <Input
            id="doc-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
          />
        </FormField>
        <FormField label="Description" htmlFor="doc-desc">
          <Input
            id="doc-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </FormField>
        <FormField label="Folder" htmlFor="doc-folder">
          <Input
            id="doc-folder"
            value={selectedFolderId ?? ""}
            readOnly
            placeholder="No folder selected"
          />
        </FormField>
        <FormField label="File Name" htmlFor="doc-filename">
          <Input
            id="doc-filename"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g. report.pdf"
          />
        </FormField>
        <FormField label="MIME Type" htmlFor="doc-mime">
          <Input
            id="doc-mime"
            value={mimeType}
            onChange={(e) => setMimeType(e.target.value)}
            placeholder="e.g. application/pdf"
          />
        </FormField>
        <FormField label="File Size (bytes)" htmlFor="doc-size">
          <Input
            id="doc-size"
            type="number"
            value={fileSizeBytes}
            onChange={(e) => setFileSizeBytes(e.target.value)}
            placeholder="e.g. 204800"
          />
        </FormField>
      </div>
    </Modal>
  );
}

// ── DocumentsPage ──────────────────────────────────────────────────────────

export function DocumentsPage() {
  const navigate = useNavigate();

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Folders query
  const { data: foldersData } = useQuery({
    queryKey: ["document-folders"],
    queryFn: () =>
      api
        .get<FoldersResponse>("/documents/folders")
        .then((r) => r.data),
  });
  const folders: Folder[] =
    (foldersData as FoldersResponse | undefined)?.data ?? [];

  // Documents query
  const docParams = new URLSearchParams({
    page: String(page),
    pageSize: "20",
    ...(selectedFolderId && { folderId: selectedFolderId }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(search && { search }),
  });

  const { data: docsData, isLoading } = useQuery({
    queryKey: ["documents", page, selectedFolderId, statusFilter, search],
    queryFn: () =>
      api
        .get<DocumentsResponse>(`/documents?${docParams}`)
        .then((r) => r.data),
  });

  const documents: Document[] =
    (docsData as DocumentsResponse | undefined)?.data ?? [];
  const meta = (docsData as DocumentsResponse | undefined)?.meta;

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "mimeType",
      header: "MIME Type",
      render: (row: Document) => row.mimeType ?? "—",
    },
    {
      key: "currentVersion",
      header: "Version",
      render: (row: Document) =>
        row.currentVersion != null ? String(row.currentVersion) : "—",
    },
    {
      key: "status",
      header: "Status",
      render: (row: Document) => (
        <Badge label={row.status} />
      ),
    },
    {
      key: "updatedAt",
      header: "Last Modified",
      render: (row: Document) => formatDate(row.updatedAt),
    },
  ];

  return (
    <div className="flex gap-0 h-full">
      {/* Folder tree sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <span className="text-sm font-semibold text-slate-700">Folders</span>
          <Button size="sm" onClick={() => setNewFolderOpen(true)}>
            New Folder
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <button
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              selectedFolderId === null
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-slate-600 hover:bg-slate-50"
            }`}
            onClick={() => {
              setSelectedFolderId(null);
              setPage(1);
            }}
          >
            All Documents
          </button>
          {folders
            .filter((f) => f.parentId === null)
            .map((folder) => (
              <button
                key={folder.id}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  selectedFolderId === folder.id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => {
                  setSelectedFolderId(folder.id);
                  setPage(1);
                }}
              >
                📁 {folder.name}
              </button>
            ))}
        </div>
      </div>

      {/* Document list */}
      <div className="flex-1 min-w-0 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-slate-800">Documents</h1>
          <Button onClick={() => setUploadOpen(true)}>Upload Document</Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Select
            options={[
              { value: "all", label: "All Statuses" },
              { value: "DRAFT", label: "Draft" },
              { value: "UNDER_REVIEW", label: "Under Review" },
              { value: "APPROVED", label: "Approved" },
              { value: "ARCHIVED", label: "Archived" },
            ]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-48"
          />
          <Input
            placeholder="Search documents…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />
        </div>

        <DataTable<Document>
          columns={columns}
          data={documents}
          isLoading={isLoading}
          getRowKey={(row) => row.id}
          rowActions={(row) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/documents/${row.id}`)}
            >
              View
            </Button>
          )}
          pagination={
            meta
              ? {
                  page: meta.page,
                  pageSize: meta.pageSize,
                  total: meta.total,
                  totalPages: meta.totalPages,
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      </div>

      <NewFolderModal
        open={newFolderOpen}
        onClose={() => setNewFolderOpen(false)}
      />
      <UploadDocumentModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        selectedFolderId={selectedFolderId}
      />
    </div>
  );
}
