import React, { useState, useEffect, useRef } from "react";
import { DMF_CHECKLIST, DMF_GATEWAY_QUESTIONS } from "../utils/dmfChecklist";
import { usePrompt } from "./PromptProvider";
import EnhancedPDFViewer from "./EnhancedPDFViewer";
import {
  saveQueueMeta,
  loadQueueMeta,
  clearQueue,
  saveFile,
  loadFile,
  saveReport,
  generateZip,
} from "../services/dmfQueueService";

const getPreviewSearchTerms = (item) => {
  const terms = item.searchTerms?.length
    ? item.searchTerms
    : item.moduleRef
      ? [item.moduleRef]
      : [];
  const moduleRefs = terms
    .map((term) => String(term).match(/\b\d+(?:\.\d+)*\.[A-Z](?:\.\d+)+\b/i)?.[0])
    .filter(Boolean);

  return moduleRefs.length ? moduleRefs : terms;
};

const normalizeModuleText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const findModulePdfFiles = (files, item) => {
  const moduleRefs = getPreviewSearchTerms(item).map(normalizeModuleText);
  if (!moduleRefs.length) return [];

  return files
    .filter((file) => file.name?.toLowerCase().endsWith(".pdf"))
    .map((file) => {
      const searchablePath = normalizeModuleText(
        `${file.relativePath || file.path || ""} ${file.name || ""}`
      );
      const matchedRef = moduleRefs.find((ref) => searchablePath.includes(ref));
      return matchedRef ? { ...file, matchedRef } : null;
    })
    .filter(Boolean);
};

const getDmfScopeRoot = (path) => {
  const parts = String(path || "").split("/").filter(Boolean);
  if (parts.length <= 1) return path || "";
  return parts.slice(0, -1).join("/");
};

const getFilesForQueueItem = (files, queueItem) => {
  if (!queueItem?.path) return [];

  const scopeRoot = queueItem.scopeRoot ?? getDmfScopeRoot(queueItem.path);
  if (!scopeRoot) {
    return files.filter((file) => file.path === queueItem.path);
  }

  const scoped = files.filter(
    (file) => file.path === queueItem.path || file.path?.startsWith(`${scopeRoot}/`)
  );

  return scoped.length
    ? scoped
    : files.filter((file) => file.path === queueItem.path);
};

const readDroppedEntries = async (dataTransferItems) => {
  const files = [];
  const readEntry = (entry, path = "") =>
    new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((file) => {
          try {
            Object.defineProperty(file, "webkitRelativePath", {
              value: path + file.name,
              configurable: true,
            });
          } catch {}
          files.push(file);
          resolve();
        });
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const readAll = () =>
          reader.readEntries(async (entries) => {
            if (!entries.length) return resolve();
            await Promise.all(
              entries.map((child) => readEntry(child, path + entry.name + "/"))
            );
            readAll();
          });
        readAll();
      } else {
        resolve();
      }
    });

  await Promise.all(
    Array.from(dataTransferItems).map((item) => {
      const entry = item.webkitGetAsEntry?.();
      return entry ? readEntry(entry) : Promise.resolve();
    })
  );

  return files;
};

// ─── IndexedDB for single DMF PDF (legacy single-mode) ───────────────────────
const DMF_PDF_DB = "dmf-pdf-store";
const DMF_PDF_KEY = "dmf-pdf-file";
const openPdfDB = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DMF_PDF_DB, 1);
    req.onupgradeneeded = (e) => e.target.result.createObjectStore(DMF_PDF_DB);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
const savePdfToDB = async (file) => {
  const db = await openPdfDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DMF_PDF_DB, "readwrite");
    tx.objectStore(DMF_PDF_DB).put(
      { blob: file, name: file.name },
      DMF_PDF_KEY
    );
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
};
const loadPdfFromDB = async () => {
  try {
    const db = await openPdfDB();
    return new Promise((resolve) => {
      const req = db
        .transaction(DMF_PDF_DB, "readonly")
        .objectStore(DMF_PDF_DB)
        .get(DMF_PDF_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};
const clearPdfFromDB = async () => {
  try {
    const db = await openPdfDB();
    db.transaction(DMF_PDF_DB, "readwrite")
      .objectStore(DMF_PDF_DB)
      .delete(DMF_PDF_KEY);
  } catch {}
};

const SCREENING_KEY = (id) => `dmf-screening-${id}`;

// ─── Checkbox display ─────────────────────────────────────────────────────────
const td = (extra = {}) => ({
  border: "1px solid #000",
  padding: "6px 8px",
  fontSize: "12px",
  verticalAlign: "top",
  ...extra,
});

// ─── STEP constants ───────────────────────────────────────────────────────────
const STEP_HOME = "home";
const STEP_SELECT = "select";
const STEP_QUEUE = "queue";
const STEP_SCREEN = "screen";

const DEFAULT_NO_IDS  = new Set([18, 19, 21]);
const DEFAULT_NA_IDS  = new Set([6, 7, 23]);
const getDefaultChecklistResponses = () =>
  new Map(DMF_CHECKLIST.map((item) =>
    [item.id, DEFAULT_NO_IDS.has(item.id) ? "no" : DEFAULT_NA_IDS.has(item.id) ? "na" : "yes"]
  ));

const DMFScreening = () => {
  const prompt = usePrompt();

  // ── Global step ──
  const [step, setStep] = useState(STEP_HOME);

  // ── Folder upload ──
  const [folderName, setFolderName] = useState("");
  const [allFiles, setAllFiles] = useState([]); // all files from folder
  const [pdfFiles, setPdfFiles] = useState([]); // only PDFs
  const [selected, setSelected] = useState(new Set()); // selected DMF paths
  const [isLoadingFolder, setIsLoadingFolder] = useState(false);
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // ── Queue ──
  const [queueItems, setQueueItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [batchApplicantName, setBatchApplicantName] = useState("");

  // ── Active screening state ──
  const [dmfName, setDmfName] = useState("");
  const [dmfMeta, setDmfMeta] = useState({
    applicantName: "",
    dmfNumber: "",
    dmfHolder: "",
    submitDate: "",
    receivedDate: "",
    submissionType: "",
    expeditedRequest: "",
  });
  const [reviewerName, setReviewerName] = useState("");
  const [screeningDate, setScreeningDate] = useState(
    new Date().toLocaleDateString("en-GB")
  );
  const [screeningStatus, setScreeningStatus] = useState("incomplete");
  const [additionalComments, setAdditionalComments] = useState("");
  const [gatewayResponses, setGatewayResponses] = useState(new Map());
  const [responses, setResponses] = useState(new Map());
  const [notes, setNotes] = useState(new Map());
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showHolderPdf, setShowHolderPdf] = useState(false);
  const [activePreview, setActivePreview] = useState(null);
  const activePreviewUrlRef = useRef(null);

  // ── Single-mode PDF (legacy) ──
  const [singlePdfUrl, setSinglePdfUrl] = useState(null);
  const [singlePdfName, setSinglePdfName] = useState("");
  const singlePdfInputRef = useRef(null);

  const clearActivePreview = () => {
    if (activePreviewUrlRef.current) {
      URL.revokeObjectURL(activePreviewUrlRef.current);
      activePreviewUrlRef.current = null;
    }
    setActivePreview(null);
  };

  // Restore queue from IndexedDB on mount
  useEffect(() => {
    loadQueueMeta().then((meta) => {
      if (!meta) return;
      setFolderName(meta.folderName || "");
      setAllFiles(meta.allFiles || []);
      setPdfFiles(meta.pdfFiles || []);
      setSelected(new Set(meta.selected || []));
      setQueueItems(meta.items || []);
      setBatchApplicantName(meta.batchApplicantName || "");
      if (meta.items?.length > 0) setStep(STEP_QUEUE);
    });
    // Restore single PDF
    loadPdfFromDB().then((stored) => {
      if (stored?.blob) {
        setSinglePdfUrl(URL.createObjectURL(stored.blob));
        setSinglePdfName(stored.name || "DMF.pdf");
      }
    });
  }, []);

  // Cleanup PDF blob on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      if (activePreviewUrlRef.current) {
        URL.revokeObjectURL(activePreviewUrlRef.current);
      }
    };
  }, [pdfUrl]);

  // ── Persist queue meta ──
  const persistQueue = (items, extra = {}) => {
    saveQueueMeta({
      folderName,
      allFiles,
      pdfFiles,
      selected: [...selected],
      items,
      batchApplicantName,
      ...extra,
    });
  };

  // ── Folder / loose files upload handler ──
  const handleFolderUpload = async (files, options = {}) => {
    setIsLoadingFolder(true);
    const fileList = Array.from(files);
    if (!fileList.length) {
      setIsLoadingFolder(false);
      return;
    }
    const fileEntries = [];
    const pdfs = [];
    const seenPaths = new Map();

    for (const [index, file] of fileList.entries()) {
      const rawPath = file.webkitRelativePath || file.name;
      const basePath = options.looseFiles && !file.webkitRelativePath
        ? `Loose Files/${rawPath}`
        : rawPath;
      const duplicateCount = seenPaths.get(basePath) || 0;
      seenPaths.set(basePath, duplicateCount + 1);
      const relativePath = duplicateCount
        ? `${basePath.replace(/(\.[^/.]+)?$/, "")} (${duplicateCount + 1})${basePath.match(/(\.[^/.]+)$/)?.[1] || ""}`
        : basePath || `Loose Files/file-${index + 1}`;
      const entry = { path: relativePath, name: file.name, relativePath };
      fileEntries.push(entry);
      await saveFile(relativePath, file);
      if (file.name.toLowerCase().endsWith(".pdf")) pdfs.push(entry);
    }

    const rootName =
      options.rootName ||
      fileList[0]?.webkitRelativePath?.split("/")[0] ||
      "DMF Files";
    setFolderName(rootName);
    setAllFiles(fileEntries);
    setPdfFiles(pdfs);
    setSelected(new Set(pdfs.map((f) => f.path)));
    setStep(STEP_SELECT);
    setIsLoadingFolder(false);
  };

  const handleSinglePdfUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      prompt.alert("Please upload a PDF file for single DMF screening.");
      return;
    }

    if (singlePdfUrl) URL.revokeObjectURL(singlePdfUrl);
    setSinglePdfUrl(URL.createObjectURL(file));
    setSinglePdfName(file.name);
    await savePdfToDB(file);

    const item = {
      path: file.name,
      name: file.name,
      apiName: file.name.replace(/\.pdf$/i, ""),
      scopeRoot: "",
      status: "pending",
      reportData: null,
    };
    setQueueItems([item]);
    setFolderName("");
    setAllFiles([{ path: file.name, name: file.name }]);
    setPdfFiles([{ path: file.name, name: file.name }]);
    setSelected(new Set([file.name]));
    await saveFile(file.name, file);
    setStep(STEP_QUEUE);
  };

  const handleLooseFilesDrop = async (dataTransfer) => {
    const files =
      dataTransfer.items?.length
        ? await readDroppedEntries(dataTransfer.items)
        : Array.from(dataTransfer.files || []);
    if (files.length) {
      handleFolderUpload(files, {
        looseFiles: true,
        rootName: "Loose DMF Files",
      });
    }
  };

  // ── Start queue from selection ──
  const handleStartQueue = () => {
    if (selected.size === 0) {
      prompt.alert("Please select at least one DMF to screen.");
      return;
    }
    const items = [...selected].map((path) => {
      const file = pdfFiles.find((f) => f.path === path);
      return {
        path,
        name: file?.name || path.split("/").pop(),
        apiName: (file?.name || "").replace(/\.pdf$/i, ""),
        scopeRoot: getDmfScopeRoot(path),
        status: "pending",
        reportData: null,
      };
    });
    setQueueItems(items);
    persistQueue(items);
    setStep(STEP_QUEUE);
  };

  // ── Open a DMF for screening ──
  const handleScreenDMF = async (index) => {
    const item = queueItems[index];
    setActiveIndex(index);

    // Load saved screening state if exists
    const saved = localStorage.getItem(SCREENING_KEY(item.path));
    if (saved) {
      const data = JSON.parse(saved);
      setDmfName((data.dmfName || item.apiName).toUpperCase());
      setDmfMeta({
        applicantName: "",
        dmfNumber: "",
        dmfHolder: "",
        submitDate: "",
        receivedDate: "",
        submissionType: "",
        expeditedRequest: "",
        ...(data.dmfMeta || {}),
        // always sync applicant from batch if individual hasn't been set
        applicantName: data.dmfMeta?.applicantName || batchApplicantName,
      });
      setReviewerName(data.reviewerName || "");
      setScreeningDate(
        data.screeningDate || new Date().toLocaleDateString("en-GB")
      );
      setScreeningStatus(data.screeningStatus || "incomplete");
      setAdditionalComments(
        data.additionalComments || "The DMF was mostly adequate."
      );
      setGatewayResponses(new Map(data.gatewayResponses || []));
      setResponses(
        new Map([...getDefaultChecklistResponses(), ...(data.responses || [])])
      );
      setNotes(new Map(data.notes || []));
    } else {
      setDmfName(item.apiName.toUpperCase());
      const today = new Date().toLocaleDateString("en-GB");
      setDmfMeta({
        applicantName: batchApplicantName,
        dmfNumber: "",
        dmfHolder: "",
        submitDate: today,
        receivedDate: today,
        submissionType: "PAPER",
        expeditedRequest: "N/A",
      });
      setReviewerName("Onunkwo Chinemerem E.");
      setScreeningDate(today);
      setScreeningStatus("complete");
      setAdditionalComments("The DMF was mostly adequate.");
      setGatewayResponses(new Map([["g1", "yes"], ["g2", "no"]]));
      setResponses(getDefaultChecklistResponses());
      setNotes(new Map());
    }

    // Load PDF blob
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    const blob = await loadFile(item.path);
    if (blob) setPdfUrl(URL.createObjectURL(blob));
    else setPdfUrl(null);

    clearActivePreview();
    setStep(STEP_SCREEN);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Mark as in-progress
    const updated = queueItems.map((q, i) =>
      i === index && q.status === "pending" ? { ...q, status: "inprogress" } : q
    );
    setQueueItems(updated);
    persistQueue(updated);
  };

  // ── Persist screening state ──
  const persistScreening = (updates) => {
    if (activeIndex === null) return;
    const item = queueItems[activeIndex];
    const current = JSON.parse(
      localStorage.getItem(SCREENING_KEY(item.path)) || "{}"
    );
    localStorage.setItem(
      SCREENING_KEY(item.path),
      JSON.stringify({ ...current, ...updates })
    );
  };

  const handleGatewayResponse = (id, value) => {
    setGatewayResponses((prev) => {
      const next = new Map(prev).set(id, value);
      persistScreening({ gatewayResponses: [...next] });
      return next;
    });
  };

  const handleMetaChange = (key, value) => {
    setDmfMeta((prev) => {
      const next = { ...prev, [key]: value.toUpperCase() };
      persistScreening({ dmfMeta: next });
      return next;
    });
  };

  const handleScreeningStatus = (value) => {
    setScreeningStatus(value);
    persistScreening({ screeningStatus: value });
  };

  const handleResponse = (id, value) => {
    setResponses((prev) => {
      const next = new Map(prev).set(id, value);
      persistScreening({ responses: [...next] });
      return next;
    });
  };

  const handleNote = (id, value) => {
    setNotes((prev) => {
      const next = new Map(prev).set(id, value);
      persistScreening({ notes: [...next] });
      return next;
    });
  };

  // ── Mark DMF as done and save report ──
  const handleMarkDone = async () => {
    const confirmed = await prompt.confirm(
      "Mark this DMF screening as complete and return to the queue?",
      { title: "Complete Screening", confirmLabel: "Mark Done" }
    );
    if (!confirmed) return;

    const item = queueItems[activeIndex];
    const reportData = {
      dmfName,
      dmfMeta,
      reviewerName,
      screeningDate,
      screeningStatus,
      additionalComments,
      gatewayResponses,
      responses,
      notes,
      checklist: DMF_CHECKLIST,
      gatewayQuestions: DMF_GATEWAY_QUESTIONS,
      generatedAt: new Date().toISOString(),
    };

    await saveReport(item.path, reportData);

    const updated = queueItems.map((q, i) =>
      i === activeIndex ? { ...q, status: "done", reportData } : q
    );
    setQueueItems(updated);
    persistQueue(updated);

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    clearActivePreview();
    setActiveIndex(null);
    setStep(STEP_QUEUE);
  };

  // ── Download ZIP ──
  const handleDownloadZip = async () => {
    prompt.toast("Generating ZIP, please wait...", { tone: "info" });
    try {
      const blob = await generateZip(
        { folderName, items: queueItems },
        allFiles
      );
      const { saveAs } = await import("file-saver");
      saveAs(blob, `${folderName || "DMF_Screening"}.zip`);
    } catch (e) {
      console.error(e);
      prompt.alert("Error generating ZIP: " + e.message);
    }
  };

  // ── Reset everything ──
  const handleResetAll = async () => {
    const confirmed = await prompt.confirm(
      "Reset everything? This will clear all uploaded files, queue, and screening data.",
      { title: "Reset All", confirmLabel: "Reset" }
    );
    if (!confirmed) return;
    await clearQueue();
    queueItems.forEach((item) =>
      localStorage.removeItem(SCREENING_KEY(item.path))
    );
    setStep(STEP_HOME);
    setFolderName("");
    setAllFiles([]);
    setPdfFiles([]);
    setSelected(new Set());
    setQueueItems([]);
    clearActivePreview();
    setActiveIndex(null);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const openPreview = async (item) => {
    if (activePreview?.itemId === item.id) {
      clearActivePreview();
      return;
    }

    const activeQueueItem = activeIndex !== null ? queueItems[activeIndex] : null;
    const scopeFiles = getFilesForQueueItem(
      allFiles.length ? allFiles : pdfFiles,
      activeQueueItem
    );
    const matches = findModulePdfFiles(scopeFiles, item);
    const preferredFile =
      matches.find((file) => file.path === activeQueueItem?.path) ||
      matches[0] ||
      (activeQueueItem ? { path: activeQueueItem.path, name: activeQueueItem.name } : null);

    if (!preferredFile && !pdfUrl) {
      prompt.alert("No PDF loaded for this DMF.");
      return;
    }

    clearActivePreview();

    let fileUrl = pdfUrl;
    let sourceName = activeQueueItem?.name || dmfName || "Current DMF PDF";
    if (preferredFile?.path && preferredFile.path !== activeQueueItem?.path) {
      const blob = await loadFile(preferredFile.path);
      if (!blob) {
        prompt.alert(`Could not open ${preferredFile.name || preferredFile.path}.`);
        return;
      }
      fileUrl = URL.createObjectURL(blob);
      activePreviewUrlRef.current = fileUrl;
      sourceName = preferredFile.name || preferredFile.path.split("/").pop();
    }

    setActivePreview({
      itemId: item.id,
      searchTerms: getPreviewSearchTerms(item),
      matches,
      selectedFilePath: preferredFile?.path || activeQueueItem?.path || null,
      fileUrl,
      sourceName,
    });
  };

  const selectPreviewFile = async (file) => {
    if (!activePreview || !file?.path) return;
    const activeQueueItem = activeIndex !== null ? queueItems[activeIndex] : null;

    if (file.path === activeQueueItem?.path) {
      if (activePreviewUrlRef.current) {
        URL.revokeObjectURL(activePreviewUrlRef.current);
        activePreviewUrlRef.current = null;
      }
      setActivePreview((prev) => ({
        ...prev,
        selectedFilePath: file.path,
        fileUrl: pdfUrl,
        sourceName: file.name || activeQueueItem?.name || "Current DMF PDF",
      }));
      return;
    }

    const blob = await loadFile(file.path);
    if (!blob) {
      prompt.alert(`Could not open ${file.name || file.path}.`);
      return;
    }

    if (activePreviewUrlRef.current) {
      URL.revokeObjectURL(activePreviewUrlRef.current);
    }
    const fileUrl = URL.createObjectURL(blob);
    activePreviewUrlRef.current = fileUrl;
    setActivePreview((prev) => ({
      ...prev,
      selectedFilePath: file.path,
      fileUrl,
      sourceName: file.name || file.path.split("/").pop(),
    }));
  };

  const g1 = gatewayResponses.get("g1");
  const g2 = gatewayResponses.get("g2");
  const isBlocked = g1 === "no" || g2 === "yes";
  const answered = responses.size;
  const total = DMF_CHECKLIST.length;
  const sections = [...new Set(DMF_CHECKLIST.map((i) => i.section))];

  const doneCount = queueItems.filter((i) => i.status === "done").length;
  const allDone = queueItems.length > 0 && doneCount === queueItems.length;

  // ─── STEP: HOME ───────────────────────────────────────────────────────────────
  if (step === STEP_HOME) {
    return (
      <div
        style={{ maxWidth: "700px", margin: "0 auto", padding: "1rem 0.5rem" }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #ddd",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              borderBottom: "3px solid #193441",
              paddingBottom: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <h1
              style={{
                margin: "0 0 0.25rem 0",
                fontSize: "16px",
                fontWeight: "700",
                color: "#2c3e50",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              NAFDAC API DMF/ASMF Screening
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
              Upload a DMF folder, loose files, or a single PDF to begin
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Folder upload */}
            <div
              onClick={() => folderInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#193441";
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = "#ddd";
              }}
              onDrop={async (e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#ddd";
                const files = await readDroppedEntries(e.dataTransfer.items);
                if (files.length) handleFolderUpload(files);
              }}
              style={{
                border: "2px dashed #ddd",
                padding: "2rem",
                textAlign: "center",
                cursor: "pointer",
                background: "#fafbfc",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "0.5rem" }}>📁</div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#2c3e50",
                  marginBottom: "0.25rem",
                }}
              >
                Upload DMF Folder
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                Drop folder here or click to browse
              </div>
              <input
                ref={folderInputRef}
                type="file"
                webkitdirectory="true"
                multiple
                onChange={(e) => handleFolderUpload(e.target.files)}
                style={{ display: "none" }}
              />
            </div>

            {/* Loose files upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#193441";
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = "#ddd";
              }}
              onDrop={async (e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#ddd";
                await handleLooseFilesDrop(e.dataTransfer);
              }}
              style={{
                border: "2px dashed #ddd",
                padding: "2rem",
                textAlign: "center",
                cursor: "pointer",
                background: "#fafbfc",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "0.5rem" }}>📚</div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#2c3e50",
                  marginBottom: "0.25rem",
                }}
              >
                Upload DMF Files
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                Drop files here or select multiple loose documents
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) =>
                  handleFolderUpload(e.target.files, {
                    looseFiles: true,
                    rootName: "Loose DMF Files",
                  })
                }
                style={{ display: "none" }}
              />
            </div>

            {/* Single DMF mode */}
            <div
              onClick={() => singlePdfInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#193441";
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = "#ddd";
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#ddd";
                handleSinglePdfUpload(e.dataTransfer.files?.[0]);
              }}
              style={{
                border: "2px dashed #ddd",
                padding: "2rem",
                textAlign: "center",
                cursor: "pointer",
                background: "#fafbfc",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "0.5rem" }}>📄</div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#2c3e50",
                  marginBottom: "0.25rem",
                }}
              >
                Single DMF
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                Drop one PDF here or click to browse
              </div>
              <input
                ref={singlePdfInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => handleSinglePdfUpload(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {isLoadingFolder && (
            <div
              style={{
                textAlign: "center",
                padding: "1rem",
                color: "#666",
                fontSize: "13px",
              }}
            >
              ⏳ Loading folder files...
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── STEP: SELECT ─────────────────────────────────────────────────────────────
  if (step === STEP_SELECT) {
    return (
      <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem 0.5rem" }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #ddd",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              borderBottom: "3px solid #193441",
              paddingBottom: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <h1
              style={{
                margin: "0 0 0.25rem 0",
                fontSize: "15px",
                fontWeight: "700",
                color: "#2c3e50",
                textTransform: "uppercase",
              }}
            >
              Select DMFs to Screen
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
              Folder: <strong>{folderName}</strong> — {pdfFiles.length} PDF
              {pdfFiles.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setSelected(new Set(pdfFiles.map((f) => f.path)))}
              style={{
                padding: "0.4rem 0.75rem",
                fontSize: "12px",
                background: "#f8f9fa",
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              Select All
            </button>
            <button
              onClick={() => setSelected(new Set())}
              style={{
                padding: "0.4rem 0.75rem",
                fontSize: "12px",
                background: "#f8f9fa",
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              Deselect All
            </button>
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              marginBottom: "1.5rem",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {pdfFiles.map((file) => (
              <div
                key={file.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.6rem 1rem",
                  borderBottom: "1px solid #f0f0f0",
                  background: selected.has(file.path) ? "#f0fff4" : "white",
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.has(file.path)}
                  onChange={(e) => {
                    const next = new Set(selected);
                    e.target.checked
                      ? next.add(file.path)
                      : next.delete(file.path);
                    setSelected(next);
                  }}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#2c3e50",
                    }}
                  >
                    {file.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>
                    {file.path}
                  </div>
                </div>
                {selected.has(file.path) && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#28a745",
                      fontWeight: "600",
                    }}
                  >
                    ✓ Selected for screening
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleStartQueue}
              disabled={selected.size === 0}
              style={{
                padding: "0.75rem 1.5rem",
                background: selected.size === 0 ? "#f8f9fa" : "#193441",
                color: selected.size === 0 ? "#666" : "white",
                border: selected.size === 0 ? "1px solid #ddd" : "none",
                cursor: selected.size === 0 ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Start Screening ({selected.size} DMF
              {selected.size !== 1 ? "s" : ""})
            </button>
            <button
              onClick={() => setStep(STEP_HOME)}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#f8f9fa",
                color: "#666",
                border: "1px solid #ddd",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP: QUEUE ──────────────────────────────────────────────────────────────
  if (step === STEP_QUEUE) {
    const statusColor = {
      pending: "#6c757d",
      inprogress: "#ffc107",
      done: "#28a745",
    };
    const statusLabel = {
      pending: "Pending",
      inprogress: "In Progress",
      done: "Done ✓",
    };
    return (
      <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem 0.5rem" }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #ddd",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              borderBottom: "3px solid #193441",
              paddingBottom: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <h1
              style={{
                margin: "0 0 0.25rem 0",
                fontSize: "15px",
                fontWeight: "700",
                color: "#2c3e50",
                textTransform: "uppercase",
              }}
            >
              DMF Screening Queue
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
              {doneCount}/{queueItems.length} screened
              {folderName && (
                <span>
                  {" "}
                  — Folder: <strong>{folderName}</strong>
                </span>
              )}
            </p>
          </div>

          {/* Batch applicant name */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#2c3e50", display: "block", marginBottom: "0.4rem" }}>
              NAME OF APPLICANT (applies to all DMFs in this batch)
            </label>
            <input
              value={batchApplicantName}
              onChange={(e) => {
                setBatchApplicantName(e.target.value);
                saveQueueMeta({ folderName, allFiles, pdfFiles, selected: [...selected], items: queueItems, batchApplicantName: e.target.value });
              }}
              placeholder="e.g. DRUGFIELD PHARMACEUTICAL LIMITED"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                fontSize: "13px",
                border: "1px solid #ccc",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "#dee2e6",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: `${
                  queueItems.length > 0
                    ? (doneCount / queueItems.length) * 100
                    : 0
                }%`,
                height: "100%",
                background: "linear-gradient(90deg, #3498db, #2ecc71)",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Queue list */}
          <div style={{ border: "1px solid #ddd", marginBottom: "1.5rem" }}>
            {queueItems.map((item, index) => (
              <div
                key={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.75rem 1rem",
                  borderBottom:
                    index < queueItems.length - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                  background:
                    item.status === "done"
                      ? "#f0fff4"
                      : item.status === "inprogress"
                      ? "#fffbeb"
                      : "white",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: statusColor[item.status],
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#2c3e50",
                    }}
                  >
                    {item.apiName || item.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>
                    {item.name}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: statusColor[item.status],
                    minWidth: "80px",
                    textAlign: "right",
                  }}
                >
                  {statusLabel[item.status]}
                </span>
                {item.status !== "done" && (
                  <button
                    onClick={() => handleScreenDMF(index)}
                    style={{
                      padding: "0.4rem 0.9rem",
                      background: "#193441",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.status === "inprogress" ? "Continue" : "Screen"}
                  </button>
                )}
                {item.status === "done" && (
                  <button
                    onClick={() => handleScreenDMF(index)}
                    style={{
                      padding: "0.4rem 0.9rem",
                      background: "#f8f9fa",
                      color: "#666",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Review
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {doneCount > 0 && (
              <button
                onClick={handleDownloadZip}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                📥 Download ZIP ({doneCount}/{queueItems.length} done)
              </button>
            )}
            <button
              onClick={handleResetAll}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#dc3545",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP: SCREEN ─────────────────────────────────────────────────────────────
  const currentItem = activeIndex !== null ? queueItems[activeIndex] : null;

  const checklistGroups = [
    {
      section: "",
      heading: "GENERAL INFORMATION",
      intro: "",
      items: [
        {
          id: 1,
          text: "Subject of the DMF is a single API produced by one manufacturing process",
        },
        {
          id: 2,
          text: "For previously submitted DMFs, the DMF holder has submitted a complete update.",
        },
        {
          id: 3,
          text: "Provides current Good Manufacturing Practice (cGMP) Statement of Commitment.",
        },
        {
          id: 4,
          text: "Provides complete name, address, and contact information for holder.",
        },
        {
          id: 5,
          text: "Contains label with storage conditions and expiry date.",
        },
        {
          id: 6,
          text: "Contains bovine spongiform encephalopathy (BSE)/ transmissible spongiform encephalopathy (TSE) certification if animal sourced.",
          hasNA: true,
        },
        {
          id: 7,
          text: "Contains information on presence of pesticides if plant-sourced.",
          hasNA: true,
        },
      ],
    },
    { moduleBreak: true },
    {
      section: "3.2. S.1",
      heading: "General Information",
      intro: "Contains complete General Information on the following:",
      items: [
        { id: 8, text: "Nomenclature." },
        { id: 9, text: "Structure." },
        {
          id: 10,
          text: "General Properties: basic information regarding the general properties of the API.",
        },
      ],
    },
    {
      section: "3.2. S.2",
      heading: "Manufacture",
      intro:
        "3.2.S.2.1 Contains complete Manufacturer Information on the following on each site:",
      items: [
        {
          id: 11,
          text: "Name and full address(es) of the manufacturing facility(ies), contact name of on-site Individual, phone and fax numbers, and e-mail address.",
        },
      ],
    },
    {
      section: "",
      heading: "3.2.S.2.2",
      intro:
        "Contains Description of Manufacturing Process and Process Controls addressing the following:",
      items: [
        { id: 12, text: "Flow chart for every stage." },
        { id: 13, text: "Description of the manufacturing process." },
      ],
    },
    {
      section: "",
      heading: "3.2.S.2.3",
      intro:
        "Contains information on the Control of Materials, as follows: Starting Material:",
      items: [
        {
          id: 14,
          text: "Starting material, clearly designated, with appropriate justification.",
        },
        { id: 15, text: "Name of each manufacturer." },
        { id: 16, text: "Specification." },
        { id: 17, text: "Analytical method." },
        { id: 18, text: "Certificate of Analysis (CoA) from manufacturer." },
        { id: 19, text: "CoAs from the DMF holder." },
      ],
    },
    {
      section: "",
      heading: "Reagents/Solvents",
      intro: "",
      items: [
        { id: 20, text: "Specifications." },
        { id: 21, text: "Representative CoAs." },
      ],
    },
    {
      section: "3.2. S.2.5",
      heading: "Process Validation and/or Evaluation",
      intro: "",
      items: [
        {
          id: 22,
          text: "Contains a summary of Process Validation and/or Evaluation information.",
        },
        {
          id: 23,
          text: "Provides sterility assurance data for sterile API.",
          hasNA: true,
        },
      ],
    },
    {
      section: "3.2. S.2.6",
      heading: "Manufacturing Process Development",
      intro: "",
      items: [
        {
          id: 24,
          text: "Contains a summary of Manufacturing Process Development.",
        },
      ],
    },
    {
      section: "3.2. S.3",
      heading: "Characterization",
      intro: "3.2.S.3.2 Provides information on Impurities, as follows:",
      items: [
        {
          id: 25,
          text: "A table including the name(s), structure(s), origin (degradant, process impurity) of observed/potential organic impurities.",
        },
        {
          id: 26,
          text: "Information on potential inorganic impurities (inorganic) (e.g., metal catalysts, reagents).",
        },
        { id: 27, text: "Potential residual solvents." },
      ],
    },
    {
      section: "3.2. S.4",
      heading: "Control of the API",
      intro:
        "Provides information to support the Control of the API, as follows:",
      items: [
        { id: 28, text: "Full test specification." },
        { id: 29, text: "Description of the analytical methods." },
        {
          id: 30,
          text: "Method validation and/or method verification reports.",
        },
        { id: 31, text: "CoAs for representative batches (batch analysis)." },
      ],
    },
    {
      section: "3.2. S.6",
      heading: "Container/Closure System",
      intro:
        "Provides information to support the Container/Closure System, as follows:",
      items: [
        {
          id: 32,
          text: "Description of container/ closure system (including contact material and secondary material).",
        },
        {
          id: 33,
          text: "Certification statements for contact materials for use in food and drugs.",
        },
        {
          id: 34,
          text: "Manufacturer, specifications, and representative CoA for primary contact material and functional secondary packaging component.",
        },
      ],
    },
    {
      section: "3.2.S.7",
      heading: "Stability of the API",
      intro:
        "Provides information to support the Stability of the API, as follows:",
      items: [
        {
          id: 35,
          text: "3.2.S.7.1 Stability Summary and Conclusions — Clearly indicates the retest date or expiration date of API.",
        },
        { id: 36, text: "3.2.S.7.3 Stability Data — Provides Stability Data." },
      ],
    },
  ];

  const renderStatus = (item) => {
    const r = responses.get(item.id);
    return (
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span
          onClick={() => handleResponse(item.id, "yes")}
          style={{ cursor: "pointer", whiteSpace: "nowrap" }}
        >
          <span style={{ fontSize: "16px" }}>{r === "yes" ? "☒" : "☐"}</span>{" "}
          YES
        </span>
        <span
          onClick={() => handleResponse(item.id, "no")}
          style={{ cursor: "pointer", whiteSpace: "nowrap" }}
        >
          <span style={{ fontSize: "16px" }}>{r === "no" ? "☒" : "☐"}</span> NO
        </span>
        {item.hasNA && (
          <span
            onClick={() => handleResponse(item.id, "na")}
            style={{ cursor: "pointer", whiteSpace: "nowrap" }}
          >
            <span style={{ fontSize: "16px" }}>{r === "na" ? "☒" : "☐"}</span>{" "}
            NA
          </span>
        )}
      </div>
    );
  };

  const checklistNotes = {
    1: "For #1: The DMF is limited to: (i) one API, although multiple manufacturing sites for a single API are permitted when the same process is used in each of those sites; (ii) one manufacturing process, although certain process alternatives/changes may be permissible with sufficient supportive information provided. Examples include: validated reprocess/rework procedures; micronization leading to different particle sizes; addition of a stabilizing agent for stability purposes; and minor process variation that leaves the chemical transformation the same, with little risk to the impurity profile. A separate DMF should be filed for: different salt form; different synthetic route; and significant process variation resulting in a different impurity profile and requiring a different control strategy.",
    2: "For #2: The complete update should reflect the current state of the process and not require reference to any previous submission for information. This requirement does not apply if the entire DMF is in eCTD format.",
    6: "For #6: If not included, should be submitted separately/uploaded.",
    11: "For #11: Separate facilities used for release testing of the API and for additional processing, e.g. micronization, should also be listed. CFN, FEI, and DUNS numbers should be provided if available.",
    14: "For #14: Justification for designation of each starting material should be in agreement with ICH Q11. This can include name, address, and contact information of the manufacturer(s), and a flow diagram/description outlining the synthetic route and conditions of each proposed starting material.",
    18: "Stated to be in the closed part of the DMF.",
    20: "For #20: Specifications should clearly identify the test methods. For non-compendial methods, the method description should be provided.",
    21: "Stated to be in the closed part of the DMF.",
    22: "For #22: If validation has been performed, the DMF holder should provide a validation summary, including batch descriptions with traceability among steps/stages, and analytical test results for starting materials, intermediates, in-process controls, and final API, preferably in tabular format.",
    23: "For #23: The full sterilization process validation and the method validation of sterility tests for the sterilized API should be provided.",
    25: "For #25: Potential genotoxic impurities can be included in this table or summarized in a separate table.",
    30: "For #30: Method verification reports should be provided for compendial methods, such as assay or related substance by HPLC; the method equivalency study should be provided when an in-house method is used in lieu of a compendial method. Stated to be in the closed part of the DMF.",
    33: "For #33: The certification statement from the supplier should state that each primary packaging material for the drug substance is safe to use in contact with food.",
  };

  const groupCell = (extra = {}) => td({ ...extra });
  const groupItemCell = (isLast, extra = {}) =>
    td({ borderTop: 0, borderBottom: isLast ? "1px solid #000" : 0, ...extra });

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1rem" }}>
      {/* Action bar */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setStep(STEP_QUEUE)}
          style={{
            padding: "0.6rem 1rem",
            background: "#f8f9fa",
            color: "#2c3e50",
            border: "1px solid #ddd",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          ← Queue
        </button>
        <button
          onClick={handleMarkDone}
          style={{
            padding: "0.6rem 1.25rem",
            background: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          ✓ Mark as Done
        </button>
        <button
          onClick={() => window.print()}
          style={{
            padding: "0.6rem 1.25rem",
            background: "#193441",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Export A4 / PDF
        </button>
        <button
          onClick={async () => {
            const { generateDMFWordReport } = await import(
              "../services/dmfWordExport"
            );
            generateDMFWordReport({
              dmfName,
              dmfMeta,
              reviewerName,
              screeningDate,
              screeningStatus,
              additionalComments,
              gatewayResponses: [...gatewayResponses],
              responses: [...responses],
              notes: [...notes],
              checklist: DMF_CHECKLIST,
              gatewayQuestions: DMF_GATEWAY_QUESTIONS,
            });
          }}
          style={{
            padding: "0.6rem 1.25rem",
            background: "#f8f9fa",
            color: "#193441",
            border: "1px solid #193441",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          Export Word
        </button>
        <div style={{ marginLeft: "auto", fontSize: "13px", color: "#666" }}>
          {currentItem && (
            <span>
              <strong>{currentItem.apiName}</strong> — {answered}/{total} items
            </span>
          )}
          {pdfUrl && (
            <span style={{ marginLeft: "1rem", color: "#276749" }}>
              📄 PDF loaded
            </span>
          )}
        </div>
      </div>

      <style>{`
        @page { size: A4; margin: 15mm 12mm; }
        @media print {
          body * { visibility: hidden; }
          .dmf-print-root, .dmf-print-root * { visibility: visible; }
          .dmf-print-root { position: absolute; left: 0; top: 0; width: 100%; border: 0 !important; padding: 0 !important; }
          .dmf-app-only, .dmf-app-only * { display: none !important; visibility: hidden !important; }
        }
      `}</style>

      {/* FORM */}
      <div
        className="dmf-print-root"
        style={{
          background: "white",
          border: "1px solid #000",
          padding: "2rem",
          fontFamily: "Arial, sans-serif",
          fontSize: "10pt",
          lineHeight: 1.4,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "15px",
          }}
        >
          <tbody>
            <tr>
              <td style={td({ width: "22%", fontWeight: "700" })}>
                ANNEXURE - 4
              </td>
              <td style={td({ width: "28%" })}>
                <strong>SOP Ref. No.:</strong> DER-303-02
              </td>
              <td style={td({ width: "50%" })}>
                <strong>Title of Annexure:</strong> API DMF/ASMF Screening for
                Completeness Form
              </td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            border: "1px solid #000",
            padding: "10px",
            background: "#f9f9f9",
            marginBottom: "15px",
          }}
        >
          {[
            ["NAME OF APPLICANT:", "applicantName"],
            ["DMF NUMBER:", "dmfNumber"],
            ["DMF HOLDER:", "dmfHolder"],
            ["DRUG NAME (subject):", "dmfName"],
            ["SUBMIT DATE:", "submitDate"],
            ["RECEIVED DATE:", "receivedDate"],
            ["Electronic or paper submission:", "submissionType"],
          ].map(([label, key]) => (
            <div key={key}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <strong style={{ flex: "0 0 250px" }}>{label}</strong>
                <input
                  value={key === "dmfName" ? dmfName : dmfMeta[key]}
                  onChange={(e) => {
                    if (key === "dmfName") {
                      setDmfName(e.target.value.toUpperCase());
                      persistScreening({ dmfName: e.target.value.toUpperCase() });
                    } else handleMetaChange(key, e.target.value);
                  }}
                  style={{
                    flex: 1,
                    border: "none",
                    borderBottom: "1px solid #000",
                    outline: "none",
                    font: "inherit",
                    background: "transparent",
                  }}
                />
                {key === "dmfHolder" && pdfUrl && (
                  <button
                    onClick={() => setShowHolderPdf((v) => !v)}
                    style={{
                      padding: "0.2rem 0.6rem",
                      fontSize: "11px",
                      background: showHolderPdf ? "#2c3e50" : "#193441",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {showHolderPdf ? "Close PDF" : "View PDF"}
                  </button>
                )}
              </div>
              {key === "dmfHolder" && showHolderPdf && pdfUrl && (
                <div style={{ marginBottom: "8px", border: "1px solid #193441" }}>
                  <EnhancedPDFViewer fileUrl={pdfUrl} height="55vh" />
                </div>
              )}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <strong>EXPEDITED SCREENING REQUEST by:</strong>
            <input
              value={dmfMeta.expeditedRequest}
              onChange={(e) =>
                handleMetaChange("expeditedRequest", e.target.value)
              }
              placeholder="(requestor name here) if applicable"
              style={{
                flex: 1,
                border: "none",
                borderBottom: "1px solid #000",
                outline: "none",
                font: "inherit",
                background: "transparent",
              }}
            />
          </div>
        </div>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              fontSize: "15px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            NAFDAC API DMF/ASMF SCREENING FOR COMPLETENESS FORM
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "1rem",
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "4px 0", width: "120px" }}>
                <strong>Primary reviewer:</strong>
              </td>
              <td colSpan={2} style={{ padding: "4px 0" }}>
                <input
                  value={reviewerName}
                  onChange={(e) => {
                    setReviewerName(e.target.value);
                    persistScreening({ reviewerName: e.target.value });
                  }}
                  style={{
                    border: "none",
                    borderBottom: "1px solid #000",
                    outline: "none",
                    font: "inherit",
                    width: "100%",
                  }}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0" }}>
                <strong>Date :</strong>
              </td>
              <td style={{ padding: "4px 0", width: "170px" }}>
                <input
                  value={screeningDate}
                  onChange={(e) => {
                    setScreeningDate(e.target.value);
                    persistScreening({ screeningDate: e.target.value });
                  }}
                  style={{
                    border: "none",
                    borderBottom: "1px solid #000",
                    outline: "none",
                    font: "inherit",
                    width: "150px",
                  }}
                />
              </td>
              <td style={{ padding: "4px 0" }}>
                <span
                  onClick={() => handleScreeningStatus("complete")}
                  style={{ cursor: "pointer", marginRight: "18px" }}
                >
                  <span style={{ fontSize: "15px" }}>
                    {screeningStatus === "complete" ? "☒" : "☐"}
                  </span>{" "}
                  <strong>COMPLETE</strong>
                </span>
                <span
                  onClick={() => handleScreeningStatus("incomplete")}
                  style={{ cursor: "pointer" }}
                >
                  <span style={{ fontSize: "15px" }}>
                    {screeningStatus === "incomplete" ? "☒" : "☐"}
                  </span>{" "}
                  <strong>INCOMPLETE</strong>
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Gateway questions */}
        {DMF_GATEWAY_QUESTIONS.map((gq, idx) => {
          const r = gatewayResponses.get(gq.id);
          return (
            <table
              key={gq.id}
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "0.5rem",
              }}
            >
              <tbody>
                <tr>
                  <td style={td({ width: "4%", fontWeight: "700" })}>
                    {idx + 1}.
                  </td>
                  <td style={td({ width: "52%" })}>{gq.question}</td>
                  <td style={td({ width: "20%" })}>
                    <span
                      onClick={() => handleGatewayResponse(gq.id, "yes")}
                      style={{ cursor: "pointer", marginRight: "12px" }}
                    >
                      <span style={{ fontSize: "16px" }}>
                        {r === "yes" ? "☒" : "☐"}
                      </span>{" "}
                      YES
                    </span>
                    <span
                      onClick={() => handleGatewayResponse(gq.id, "no")}
                      style={{ cursor: "pointer" }}
                    >
                      <span style={{ fontSize: "16px" }}>
                        {r === "no" ? "☒" : "☐"}
                      </span>{" "}
                      NO
                    </span>
                  </td>
                  <td
                    style={td({
                      width: "24%",
                      fontSize: "11px",
                      color: "#555",
                    })}
                  >
                    {gq.guide}
                  </td>
                </tr>
              </tbody>
            </table>
          );
        })}

        {/* Block message */}
        {isBlocked && (
          <div
            style={{
              padding: "0.75rem 1rem",
              margin: "1rem 0",
              background: g1 === "no" ? "#fff5f5" : "#f0fff4",
              border: `2px solid ${g1 === "no" ? "#dc3545" : "#28a745"}`,
              fontSize: "13px",
              fontWeight: "600",
              color: g1 === "no" ? "#dc3545" : "#28a745",
            }}
          >
            {g1 === "no"
              ? "❌ DMF is INCOMPLETE per policy. Issue Incomplete Letter to DMF holder."
              : "✅ DMF is COMPLETE per policy. No further checklist review required."}
          </div>
        )}

        <div style={{ margin: "15px 0 25px 0" }}>
          <div
            style={{
              fontWeight: "700",
              textDecoration: "underline",
              marginBottom: "5px",
            }}
          >
            ADDITIONAL COMMENTS REGARDING THE DMF:
          </div>
          <textarea
            value={additionalComments}
            onChange={(e) => {
              setAdditionalComments(e.target.value);
              persistScreening({ additionalComments: e.target.value });
            }}
            style={{
              width: "100%",
              minHeight: "34px",
              border: "none",
              borderBottom: "1px solid #000",
              outline: "none",
              resize: "vertical",
              font: "inherit",
              background: "transparent",
            }}
          />
        </div>

        {/* Checklist */}
        {!isBlocked && (
          <>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                margin: "1.5rem 0 0.5rem 0",
                borderBottom: "2px solid #000",
                paddingBottom: "0.25rem",
              }}
            >
              Checklist Review
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f2f2f2" }}>
                  <th style={td({ width: "12%" })}>Section</th>
                  <th style={td({ width: "45%" })}>Requirement / Item</th>
                  <th style={td({ width: "18%" })}>Status</th>
                  <th style={td({ width: "25%" })}>NOTE(S)</th>
                </tr>
              </thead>
              <tbody>
                {checklistGroups.map((group, groupIndex) => {
                  if (group.moduleBreak) {
                    return (
                      <tr
                        key={`module-${groupIndex}`}
                        style={{
                          backgroundColor: "#f9f9f9",
                          fontWeight: "bold",
                        }}
                      >
                        <td colSpan={4} style={td()}>
                          MODULE 3: QUALITY <br /> 3.2 Body of Data <br /> 3.2.S
                          API [name, manufacturer]
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <React.Fragment
                      key={`${group.section}-${group.heading}-${groupIndex}`}
                    >
                      <tr>
                        <td
                          style={groupCell({ fontWeight: "700" })}
                          rowSpan={group.items.length + 1}
                        >
                          {group.section}
                        </td>
                        <td style={groupCell()} colSpan={2}>
                          <strong>{group.heading}</strong>
                          {group.intro && (
                            <>
                              <br />
                              {group.intro}
                            </>
                          )}
                        </td>
                        <td style={groupCell()}></td>
                      </tr>
                      {group.items.map((item, itemIndex) => {
                        const isLast = itemIndex === group.items.length - 1;
                        const isOpen = activePreview?.itemId === item.id;
                        return (
                          <React.Fragment key={item.id}>
                            <tr
                              id={`item-${item.id}`}
                              style={{
                                background: isOpen ? "#f0f4f8" : "white",
                              }}
                            >
                              <td style={groupItemCell(isLast)}>
                                {item.id}. {item.text}
                                {(pdfUrl || pdfFiles.length > 0) && (
                                  <button
                                    onClick={() =>
                                      openPreview(
                                        DMF_CHECKLIST.find(
                                          (i) => i.id === item.id
                                        )
                                      )
                                    }
                                    style={{
                                      marginLeft: "0.5rem",
                                      padding: "0.2rem 0.45rem",
                                      fontSize: "11px",
                                      background: isOpen
                                        ? "#2c3e50"
                                        : "#193441",
                                      color: "white",
                                      border: "none",
                                      cursor: "pointer",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {isOpen ? "Close" : "View"}
                                  </button>
                                )}
                              </td>
                              <td style={groupItemCell(isLast)}>
                                {renderStatus(item)}
                              </td>
                              <td
                                style={groupItemCell(isLast, {
                                  fontSize: "8.5pt",
                                  color: "#333",
                                  background: "#fafafa",
                                })}
                              >
                                {checklistNotes[item.id] || ""}
                              </td>
                            </tr>
                            {isOpen && activePreview.fileUrl && (
                              <tr>
                                <td
                                  colSpan={4}
                                  style={{
                                    padding: 0,
                                    border: "1px solid #193441",
                                  }}
                                >
                                  <div
                                    style={{
                                      padding: "0.5rem",
                                      background: "#f8fafc",
                                      borderBottom: "1px solid #d7dde3",
                                      fontSize: "12px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "1rem",
                                        marginBottom:
                                          activePreview.matches?.length > 1
                                            ? "0.5rem"
                                            : 0,
                                      }}
                                    >
                                      <strong>
                                        Viewing: {activePreview.sourceName}
                                      </strong>
                                      <span style={{ color: "#53616d" }}>
                                        Search:{" "}
                                        {activePreview.searchTerms.join(", ")}
                                      </span>
                                    </div>
                                    {activePreview.matches?.length > 1 && (
                                      <div
                                        style={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: "0.35rem",
                                        }}
                                      >
                                        {activePreview.matches.map((file) => (
                                          <button
                                            key={file.path}
                                            onClick={() =>
                                              selectPreviewFile(file)
                                            }
                                            style={{
                                              padding: "0.25rem 0.5rem",
                                              fontSize: "11px",
                                              border:
                                                activePreview.selectedFilePath ===
                                                file.path
                                                  ? "1px solid #193441"
                                                  : "1px solid #cbd5df",
                                              background:
                                                activePreview.selectedFilePath ===
                                                file.path
                                                  ? "#193441"
                                                  : "white",
                                              color:
                                                activePreview.selectedFilePath ===
                                                file.path
                                                  ? "white"
                                                  : "#193441",
                                              cursor: "pointer",
                                            }}
                                            title={file.path}
                                          >
                                            {file.name}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <EnhancedPDFViewer
                                    fileUrl={activePreview.fileUrl}
                                    height="60vh"
                                    searchOnLoad={activePreview.searchTerms}
                                  />
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default DMFScreening;
