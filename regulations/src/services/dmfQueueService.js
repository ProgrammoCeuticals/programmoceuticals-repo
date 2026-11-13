// DMF Queue Service — manages the folder upload, DMF selection queue,
// completed reports, and ZIP generation

const DB_NAME = "dmf-queue-store";
const DB_VERSION = 1;
const STORE_FILES = "files";       // raw uploaded files keyed by path
const STORE_QUEUE = "queue";       // queue metadata
const STORE_REPORTS = "reports";   // completed screening data per DMF

const openDB = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_FILES)) db.createObjectStore(STORE_FILES);
      if (!db.objectStoreNames.contains(STORE_QUEUE)) db.createObjectStore(STORE_QUEUE);
      if (!db.objectStoreNames.contains(STORE_REPORTS)) db.createObjectStore(STORE_REPORTS);
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });

const dbGet = async (store, key) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const req = db.transaction(store, "readonly").objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => resolve(null);
  });
};

const dbPut = async (store, key, value) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(value, key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
};

const dbDelete = async (store, key) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(key);
    tx.oncomplete = resolve;
    tx.onerror = resolve;
  });
};

const dbGetAll = async (store) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const results = [];
    const keys = [];
    const tx = db.transaction(store, "readonly");
    const os = tx.objectStore(store);
    const req = os.openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) { keys.push(cursor.key); results.push(cursor.value); cursor.continue(); }
      else resolve(results.map((v, i) => ({ key: keys[i], value: v })));
    };
    req.onerror = () => resolve([]);
  });
};

const dbClearStore = async (store) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).clear();
    tx.oncomplete = resolve;
    tx.onerror = resolve;
  });
};

// ─── Queue metadata ───────────────────────────────────────────────────────────

export const saveQueueMeta = (meta) => dbPut(STORE_QUEUE, "meta", meta);
export const loadQueueMeta = () => dbGet(STORE_QUEUE, "meta");
export const clearQueue = async () => {
  await dbClearStore(STORE_FILES);
  await dbClearStore(STORE_QUEUE);
  await dbClearStore(STORE_REPORTS);
};

// ─── File storage ─────────────────────────────────────────────────────────────

export const saveFile = (path, file) => dbPut(STORE_FILES, path, file);

export const loadFile = (path) => dbGet(STORE_FILES, path);

export const saveAllFiles = async (files) => {
  for (const f of files) {
    await saveFile(f.path, f.blob);
  }
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const saveReport = (dmfId, reportData) => dbPut(STORE_REPORTS, dmfId, reportData);
export const loadReport = (dmfId) => dbGet(STORE_REPORTS, dmfId);
export const loadAllReports = () => dbGetAll(STORE_REPORTS);

// ─── ZIP generation ───────────────────────────────────────────────────────────

export const generateZip = async (queueMeta, allFiles) => {
  const JSZip = (await import("jszip")).default;
  const { generateDMFWordReport } = await import("./dmfWordExport");
  const { Packer } = await import("docx");
  const zip = new JSZip();

  const { items, folderName } = queueMeta;
  const rootFolder = zip.folder(folderName || "DMF_Screening");

  for (const item of items) {
    if (item.status === "done" && item.reportData) {
      const apiFolder = rootFolder.folder(item.apiName || item.name.replace(/\.pdf$/i, ""));
      const pdfBlob = await loadFile(item.path);
      if (pdfBlob) apiFolder.file(item.name, pdfBlob);
      const wordBlob = await generateWordBlob(item.reportData);
      if (wordBlob) {
        const wordName = `DMF_Screening_${(item.apiName || item.name.replace(/\.pdf$/i, "")).replace(/\s+/g, "_")}.docx`;
        apiFolder.file(wordName, wordBlob);
      }
    }
  }

  return zip.generateAsync({ type: "blob" });
};

// Ensure Map fields are real Maps (survives IndexedDB round-trip)
const hydrateReportData = (reportData) => ({
  ...reportData,
  gatewayResponses: reportData.gatewayResponses instanceof Map
    ? reportData.gatewayResponses
    : new Map(Array.isArray(reportData.gatewayResponses) ? reportData.gatewayResponses : Object.entries(reportData.gatewayResponses || {})),
  responses: reportData.responses instanceof Map
    ? reportData.responses
    : new Map(Array.isArray(reportData.responses) ? reportData.responses : Object.entries(reportData.responses || {})),
  notes: reportData.notes instanceof Map
    ? reportData.notes
    : new Map(Array.isArray(reportData.notes) ? reportData.notes : Object.entries(reportData.notes || {})),
});

// Generate Word doc blob without saving
const generateWordBlob = async (reportData) => {
  try {
    const { buildDMFWordDoc } = await import("./dmfWordExport");
    const { Packer } = await import("docx");
    const doc = await buildDMFWordDoc(hydrateReportData(reportData));
    return await Packer.toBlob(doc);
  } catch (e) {
    console.error("Word generation error:", e);
    return null;
  }
};
