import { useState } from "react";

const acceptedExtensions = [".doc", ".docx", ".pdf"];

export function UploadForm({
  loading,
  onSubmit,
  compact = false
}: {
  loading: boolean;
  onSubmit: (reports: File[]) => void;
  compact?: boolean;
}) {
  const [reports, setReports] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState("");

  function addFiles(fileList: FileList | File[]) {
    const incomingFiles = Array.from(fileList);
    const validFiles = incomingFiles.filter(isAcceptedReport);
    const invalidCount = incomingFiles.length - validFiles.length;

    setFileError(invalidCount ? `${invalidCount} file${invalidCount === 1 ? "" : "s"} ignored. Use .doc, .docx or .pdf reports.` : "");
    setReports((current) => {
      const existingKeys = new Set(current.map(fileKey));
      const uniqueNewFiles = validFiles.filter((file) => !existingKeys.has(fileKey(file)));
      return [...current, ...uniqueNewFiles];
    });
  }

  async function addDroppedItems(dataTransfer: DataTransfer) {
    const files = await filesFromDataTransfer(dataTransfer);
    addFiles(files);
  }

  function removeFile(file: File) {
    setReports((current) => current.filter((item) => fileKey(item) !== fileKey(file)));
  }

  if (compact) {
    return (
      <form
        className="flex items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (reports.length) onSubmit(reports);
        }}
      >
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-card transition hover:border-blue-800 hover:text-blue-800">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Upload more
          <input
            className="sr-only"
            type="file"
            accept=".doc,.docx,.pdf"
            multiple
            onChange={(e) => { addFiles(e.target.files ?? []); e.target.value = ""; }}
          />
        </label>
        {reports.length > 0 && (
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:opacity-50"
          >
            {loading ? "Extracting..." : `Extract ${reports.length} file${reports.length === 1 ? "" : "s"}`}
          </button>
        )}
      </form>
    );
  }

  return (
    <form
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-card"
      onSubmit={(event) => {
        event.preventDefault();
        if (reports.length) onSubmit(reports);
      }}
    >
      <label
          className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
            dragActive ? "border-brand bg-brand-light/30" : "border-slate-200 bg-slate-50 hover:border-brand"
          }`}
          onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }}
          onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
          onDragLeave={(event) => { event.preventDefault(); setDragActive(false); }}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            void addDroppedItems(event.dataTransfer);
          }}
        >
          <svg className="mb-3 h-8 w-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span className="text-sm font-semibold text-ink">Drop reports or folders here</span>
          <span className="mt-1 text-xs text-slate-400">or click to choose .doc / .docx / .pdf files</span>
          <input
            className="sr-only"
            type="file"
            accept=".doc,.docx,.pdf"
            multiple
            onChange={(event) => {
              addFiles(event.target.files ?? []);
              event.target.value = "";
            }}
          />
        </label>

        <button
          type="submit"
          disabled={!reports.length || loading}
          className="w-full rounded-lg bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Extracting..." : "Extract Report Sections"}
        </button>

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand hover:text-brand">
          Choose Folder
          <input
            className="sr-only"
            type="file"
            multiple
            webkitdirectory=""
            onChange={(event) => {
              addFiles(event.target.files ?? []);
              event.target.value = "";
            }}
          />
        </label>
        <p className="text-xs text-slate-400">Folder upload includes only .doc, .docx and .pdf files.</p>
      </div>

      {fileError && <p className="text-sm font-medium text-warning">{fileError}</p>}

      {reports.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-700">{reports.length} file{reports.length === 1 ? "" : "s"} selected</p>
            <button type="button" className="text-xs font-semibold text-slate-400 hover:text-danger" onClick={() => setReports([])}>
              Clear all
            </button>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {reports.map((file) => (
              <div key={fileKey(file)} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm shadow-sm">
                <span className="truncate text-slate-700">{file.name}</span>
                <button type="button" className="text-xs font-semibold text-slate-400 hover:text-danger" onClick={() => removeFile(file)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

function isAcceptedReport(file: File): boolean {
  const name = file.name.toLowerCase();
  return acceptedExtensions.some((extension) => name.endsWith(extension));
}

function fileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

async function filesFromDataTransfer(dataTransfer: DataTransfer): Promise<File[]> {
  const items = Array.from(dataTransfer.items ?? []);
  const entries = items
    .map((item) => item.webkitGetAsEntry?.())
    .filter((entry): entry is FileSystemEntry => Boolean(entry));

  if (!entries.length) return Array.from(dataTransfer.files);

  const nestedFiles = await Promise.all(entries.map(readEntryFiles));
  return nestedFiles.flat();
}

function readEntryFiles(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    return new Promise((resolve) => {
      (entry as FileSystemFileEntry).file((file) => resolve([file]), () => resolve([]));
    });
  }

  if (entry.isDirectory) {
    return readDirectoryFiles(entry as FileSystemDirectoryEntry);
  }

  return Promise.resolve([]);
}

async function readDirectoryFiles(entry: FileSystemDirectoryEntry): Promise<File[]> {
  const reader = entry.createReader();
  const entries = await readAllDirectoryEntries(reader);
  const nestedFiles = await Promise.all(entries.map(readEntryFiles));
  return nestedFiles.flat();
}

function readAllDirectoryEntries(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
  const entries: FileSystemEntry[] = [];

  return new Promise((resolve) => {
    const readBatch = () => {
      reader.readEntries((batch) => {
        if (!batch.length) {
          resolve(entries);
          return;
        }
        entries.push(...batch);
        readBatch();
      }, () => resolve(entries));
    };

    readBatch();
  });
}
