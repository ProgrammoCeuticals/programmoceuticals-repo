import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDossier } from "../hooks/useDossier";
import EnhancedProgressIndicator from "./EnhancedProgressIndicator";

const MAX_ZIP_SIZE_BYTES = 10 * 1024 * 1024 * 1024;
const ZIP_STORAGE_EXPANSION_FACTOR = 2.5;
const STORAGE_SAFETY_BUFFER_BYTES = 256 * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "Unknown size";
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let size = bytes, unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) { size /= 1024; unitIndex++; }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const sectionLabel = {
  fontSize: "11px", fontWeight: "600", color: "#555",
  textTransform: "uppercase", letterSpacing: "0.4px",
  display: "block", marginBottom: "0.75rem",
};

const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadMode, setUploadMode] = useState("zip");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStartTime, setUploadStartTime] = useState(null);
  const { uploadDossier, addFiles, dossier, clearDossier, loading } = useDossier();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const isSupportedArchive = (fileName = "") => {
    const lower = fileName.toLowerCase();
    return lower.endsWith(".zip") || lower.endsWith(".rar");
  };

  const getSelectedSizeBytes = useCallback(() =>
    selectedFiles.reduce((sum, f) => sum + (f?.size || 0), 0), [selectedFiles]);

  const getEstimatedStorageBytes = useCallback(() => {
    const s = getSelectedSizeBytes();
    return uploadMode === "zip" ? Math.ceil(s * ZIP_STORAGE_EXPANSION_FACTOR) : s;
  }, [getSelectedSizeBytes, uploadMode]);

  const checkBrowserStorageCapacity = useCallback(async (needed) => {
    if (!navigator.storage?.estimate) return { ok: true };
    try {
      if (navigator.storage.persist) await navigator.storage.persist();
      const { quota = 0, usage = 0 } = await navigator.storage.estimate();
      const available = Math.max(0, quota - usage);
      if (quota > 0 && needed > quota * 0.95)
        return { ok: false, message: `Not enough browser storage. Needed: ${formatFileSize(needed)}, quota: ${formatFileSize(quota)}.` };
      if (available > 0 && needed + STORAGE_SAFETY_BUFFER_BYTES > available)
        return { ok: false, message: `Not enough free storage. Needed: ${formatFileSize(needed)}, available: ${formatFileSize(available)}.` };
      return { ok: true };
    } catch { return { ok: true }; }
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (uploadMode === "zip") {
      const file = files[0];
      if (!file?.name || !isSupportedArchive(file.name)) { setStatus("Please select a ZIP or RAR archive"); return; }
      if (file.size > MAX_ZIP_SIZE_BYTES) { setStatus(`Archive exceeds 10GB limit (${formatFileSize(file.size)})`); return; }
      setSelectedFiles([file]);
    } else {
      const valid = files.filter(f => f?.name && f?.size && ["pdf","doc","docx"].includes(f.name.toLowerCase().split(".").pop()));
      if (!valid.length) { setStatus("Please select PDF, DOC, or DOCX files"); return; }
      setSelectedFiles(uploadMode === "folder" ? valid : prev => [...prev, ...valid]);
    }
    setStatus("");
  };

  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }, []);

  const readDirectoryEntries = async (reader) => {
    const entries = [];
    let batch = await new Promise(r => reader.readEntries(r));
    while (batch.length) { entries.push(...batch); batch = await new Promise(r => reader.readEntries(r)); }
    return entries;
  };

  const collectFilesFromEntry = async (entry) => {
    if (entry.isFile) {
      const file = await new Promise(r => entry.file(f => r(f), () => r(null)));
      if (file && entry.fullPath) {
        try { Object.defineProperty(file, "relativePath", { value: entry.fullPath.replace(/^\//, ""), configurable: true }); } catch {}
      }
      return file ? [file] : [];
    }
    if (entry.isDirectory) {
      const entries = await readDirectoryEntries(entry.createReader());
      return (await Promise.all(entries.map(collectFilesFromEntry))).flat();
    }
    return [];
  };

  const collectFilesFromDataTransfer = async (dt) => {
    const entries = Array.from(dt.items || []).map(i => i.webkitGetAsEntry?.()).filter(Boolean);
    if (entries.length) return (await Promise.all(entries.map(collectFilesFromEntry))).flat();
    return Array.from(dt.files || []);
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
    const files = await collectFilesFromDataTransfer(e.dataTransfer);
    if (uploadMode === "zip") {
      const zip = files.find(f => f?.name && isSupportedArchive(f.name));
      if (zip) {
        if (zip.size > MAX_ZIP_SIZE_BYTES) { setStatus(`Archive exceeds 10GB limit (${formatFileSize(zip.size)})`); return; }
        setSelectedFiles([zip]);
      } else { setStatus("Please drop a ZIP or RAR archive"); }
    } else {
      const valid = files.filter(f => f?.name && ["pdf","doc","docx"].includes(f.name.toLowerCase().split(".").pop()));
      if (valid.length) { setSelectedFiles(prev => [...prev, ...valid]); setStatus(""); }
      else setStatus("No valid PDF, DOC, or DOCX files found");
    }
  }, [uploadMode]);

  const handleProgress = useCallback((p) => {
    if (typeof p === "number") {
      setProgress({ type: "basic", value: p, startTime: uploadStartTime });
      setStatus(`Processing... ${Math.round(p)}%`);
    } else if (p.type === "tree_ready") {
      setStatus("File structure ready, processing files...");
      setProgress({ type: "basic", value: 25, startTime: uploadStartTime });
    } else if (p.type === "batch_progress") {
      const label = p.stage === "complete" ? "Finalizing" : p.stage === "saving" ? "Saving files" : "Processing files";
      setProgress({ type: "basic", value: p.progress, processed: p.processed, total: p.total, startTime: uploadStartTime, currentItem: p.currentFile });
      setStatus(`${label}... ${p.processed}/${p.total} (${Math.round(p.progress)}%)`);
    } else if (p.type === "file_progress") {
      const name = p.file.split("/").pop();
      setProgress({ type: "basic", value: p.progress, startTime: uploadStartTime, currentItem: name });
      setStatus(`Processing: ${name}... ${Math.round(p.progress)}%`);
    }
  }, [uploadStartTime]);

  const handleUpload = async () => {
    if (!selectedFiles.length) { setStatus("Please select files first"); return; }
    if (uploadMode === "zip" && selectedFiles[0]?.size > MAX_ZIP_SIZE_BYTES) { setStatus(`Archive exceeds 10GB limit`); return; }
    const storageCheck = await checkBrowserStorageCapacity(getEstimatedStorageBytes());
    if (!storageCheck.ok) { setStatus(storageCheck.message); return; }
    const startTime = Date.now();
    setUploadStartTime(startTime);
    setStatus(uploadMode === "zip" ? "Processing archive..." : "Processing files...");
    setProgress({ type: "basic", value: 0, startTime });
    let result;
    if (uploadMode === "zip") result = await uploadDossier(selectedFiles[0], handleProgress);
    else if (uploadMode === "folder") result = await uploadDossier(selectedFiles, handleProgress);
    else result = await addFiles(selectedFiles, handleProgress);
    if (result.success) {
      setProgress(null); setStatus("Files uploaded successfully!");
      if (uploadMode !== "zip") setSelectedFiles([]);
      setTimeout(() => navigate("/screening"), 1500);
    } else {
      setStatus(`Error: ${result.error || "Upload failed"}`); setProgress(null); setUploadStartTime(null);
    }
  };

  const removeFile = (i) => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));
  const handleClearAll = () => { clearDossier(); setSelectedFiles([]); setStatus("All data cleared"); setProgress(null); };

  const modes = [
    { id: "zip", label: "Archive Dossier", desc: "Complete dossier as ZIP/RAR" },
    { id: "files", label: "Individual Files", desc: "PDF/DOC files from external sources" },
    { id: "folder", label: "Folder Upload", desc: "Folder with downloaded files" },
  ];

  const isError = status.includes("Error") || status.includes("Please") || status.includes("No valid") || status.includes("exceeds") || status.includes("Not enough");
  const isSuccess = status.includes("successfully") || status.includes("cleared");

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "1rem 0.5rem" }}>

      {/* Header */}
      <div style={{ background: "white", border: "1px solid #ddd", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "1rem" }}>
        <div style={{ borderBottom: "3px solid #193441", paddingBottom: "1rem", marginBottom: "0" }}>
          <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "20px", fontWeight: "700", color: "#2c3e50", textTransform: "uppercase", letterSpacing: "1px" }}>
            Dossier Upload
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
            Upload your pharmaceutical dossier archive for regulatory screening and review
          </p>
        </div>
      </div>

      {/* Upload Mode */}
      <div style={{ background: "white", border: "1px solid #ddd", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "1rem" }}>
        <span style={sectionLabel}>Upload Mode</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          {modes.map(({ id, label, desc }) => (
            <button key={id} onClick={() => { setUploadMode(id); setSelectedFiles([]); }}
              style={{ padding: "0.75rem 1rem", border: `2px solid ${uploadMode === id ? "#193441" : "#ddd"}`, background: uploadMode === id ? "#f0f4f6" : "white", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontWeight: "600", color: "#193441", fontSize: "13px", marginBottom: "2px" }}>{label}</div>
              <div style={{ fontSize: "11px", color: "#666" }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div style={{ background: "white", border: "1px solid #ddd", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "1rem" }}>
        <span style={sectionLabel}>Select Files</span>
        <div
          style={{ border: `2px dashed ${isDragOver ? "#193441" : "#ccc"}`, padding: "2rem 1rem", textAlign: "center", background: isDragOver ? "#f0f4f6" : "#fafbfc", cursor: "pointer", transition: "all 0.2s", marginBottom: "1rem" }}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          onClick={() => (uploadMode === "files" ? fileInputRef : folderInputRef).current?.click()}
        >
          <div style={{ fontSize: "32px", marginBottom: "0.75rem", color: isDragOver ? "#193441" : "#999" }}>
            {isDragOver ? "📂" : uploadMode === "zip" ? "📁" : "📄"}
          </div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#2c3e50", marginBottom: "0.25rem" }}>
            {uploadMode === "zip"
              ? selectedFiles.length > 0 ? selectedFiles[0].name : "Drop archive here or click to browse"
              : selectedFiles.length > 0 ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected` : "Drop files here or click to browse"}
          </div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {uploadMode === "zip" ? "ZIP or RAR • Maximum 10GB" : "PDF, DOC, DOCX • Multiple files allowed"}
          </div>
          {selectedFiles.length > 0 && (
            <div style={{ marginTop: "0.5rem", fontSize: "12px", color: "#555" }}>
              Estimated storage: <strong>{formatFileSize(getEstimatedStorageBytes())}</strong>
              {uploadMode === "zip" && <span style={{ color: "#888" }}> (expands after extraction)</span>}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" multiple={uploadMode !== "zip"} onChange={handleFileSelect} disabled={loading} style={{ display: "none" }} />
          <input ref={folderInputRef} type="file" accept={uploadMode === "zip" ? ".zip,.rar" : ".pdf,.doc,.docx"} webkitdirectory={uploadMode === "folder"} multiple={uploadMode === "folder"} onChange={handleFileSelect} disabled={loading} style={{ display: "none" }} />
        </div>

        {/* File list */}
        {selectedFiles.length > 0 && uploadMode !== "zip" && (
          <div style={{ marginBottom: "1rem" }}>
            <span style={sectionLabel}>Selected Files ({selectedFiles.length})</span>
            <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #e2e8f0" }}>
              {selectedFiles.map((file, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", borderBottom: i < selectedFiles.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: "#2c3e50", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{file.size ? (file.size / 1024).toFixed(1) + " KB" : "Unknown size"}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} style={{ background: "none", border: "none", color: "#c53030", cursor: "pointer", fontSize: "16px", padding: "2px 6px" }}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current dossier */}
        {dossier && (
          <div style={{ padding: "0.6rem 0.75rem", background: "#f0fff4", border: "1px solid #c6f6d5", fontSize: "13px", marginBottom: "1rem" }}>
            <strong>Current Dossier:</strong> {dossier.name}
            {uploadMode !== "zip" && <span style={{ color: "#666" }}> — files will be added to this dossier</span>}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <button onClick={handleUpload} disabled={!selectedFiles.length || loading}
            style={{ padding: "0.65rem", fontSize: "13px", fontWeight: "600", background: !selectedFiles.length || loading ? "#f5f5f5" : "#193441", color: !selectedFiles.length || loading ? "#bbb" : "white", border: "none", cursor: !selectedFiles.length || loading ? "default" : "pointer" }}>
            {loading ? "Processing..." : uploadMode === "zip" ? "Upload Dossier" : dossier ? "Add Files" : "Upload Files"}
          </button>
          <button onClick={handleClearAll} disabled={loading}
            style={{ padding: "0.65rem", fontSize: "13px", fontWeight: "600", background: loading ? "#f5f5f5" : "white", color: loading ? "#bbb" : "#c53030", border: `1px solid ${loading ? "#ddd" : "#c53030"}`, cursor: loading ? "default" : "pointer" }}>
            Clear All Data
          </button>
        </div>
      </div>

      {/* Status */}
      {(status || progress) && (
        <div style={{ background: "white", border: "1px solid #ddd", borderLeft: `4px solid ${isSuccess ? "#276749" : isError ? "#c53030" : "#193441"}`, padding: "1rem 1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {status && (
            <div style={{ fontSize: "13px", fontWeight: "600", color: isSuccess ? "#276749" : isError ? "#c53030" : "#193441", marginBottom: progress ? "0.75rem" : 0 }}>
              {status}
            </div>
          )}
          {progress && (
            <EnhancedProgressIndicator
              progress={progress.value || 0} type={progress.type} startTime={progress.startTime}
              totalItems={progress.total} processedItems={progress.processed} currentItem={progress.currentItem}
              showTimeEstimate={true} showThroughput={progress.type === "batch"}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
