"use client";

import { useRef, useState, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useUploadDocument } from "@/lib/api/queries";
import { toast } from "@/components/ui/Toast";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "@/lib/cn";

const ALLOWED_MIME = [
  "application/pdf",
  "application/xml",
  "text/xml",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const MAX_BYTES = 200 * 1024 * 1024; // 200 MB

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
];

interface DocumentUploadModalProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
}

export function DocumentUploadModal({
  open,
  onClose,
  applicationId,
}: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("en");
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync, isPending } = useUploadDocument();

  const validateAndSet = useCallback((f: File) => {
    setFileError(null);
    if (!ALLOWED_MIME.includes(f.type)) {
      setFileError(`File type "${f.type}" is not permitted. Allowed: PDF, XML, DOCX, TXT.`);
      return;
    }
    if (f.size > MAX_BYTES) {
      setFileError(`File exceeds 200 MB limit.`);
      return;
    }
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }, [title]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) validateAndSet(dropped);
    },
    [validateAndSet],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    try {
      await mutateAsync({ file, title: title.trim(), language, applicationId });
      toast.success("Document uploaded successfully.");
      handleClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      toast.error(msg);
    }
  };

  const handleClose = () => {
    setFile(null);
    setTitle("");
    setLanguage("en");
    setFileError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Upload Document" size="md">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Drop zone — click or drag a file here"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
            dragOver
              ? "border-brand-400 bg-brand-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400",
          )}
        >
          {file ? (
            <>
              <FileText className="h-8 w-8 text-brand-500" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">{file.name}</span>
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setTitle(""); }}
                  className="rounded p-0.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <span className="text-xs text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type}
              </span>
            </>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-gray-400" aria-hidden="true" />
              <p className="text-sm text-gray-600">
                Drag & drop or <span className="text-brand-600 underline">browse</span>
              </p>
              <p className="text-xs text-gray-400">PDF, XML, DOCX, TXT · max 200 MB</p>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.xml,.docx,.doc,.txt"
          className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) validateAndSet(f); }}
          aria-hidden="true"
        />

        {fileError && (
          <p role="alert" className="text-xs text-red-600">{fileError}</p>
        )}

        {/* Title */}
        <div>
          <label htmlFor="doc-title" className="mb-1 block text-xs font-medium text-gray-700">
            Title <span aria-hidden="true">*</span>
          </label>
          <input
            id="doc-title"
            type="text"
            required
            maxLength={1000}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="e.g. Drug Product Description"
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="doc-language" className="mb-1 block text-xs font-medium text-gray-700">
            Language
          </label>
          <select
            id="doc-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!file || !title.trim() || !!fileError}
            loading={isPending}
          >
            Upload
          </Button>
        </div>
      </form>
    </Modal>
  );
}
