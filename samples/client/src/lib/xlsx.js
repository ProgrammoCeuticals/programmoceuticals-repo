let xlsxPromise = null;

export function loadXlsxLibrary() {
  if (window.XLSX) {
    return Promise.resolve(window.XLSX);
  }

  if (xlsxPromise) {
    return xlsxPromise;
  }

  xlsxPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-xlsx-loader="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.XLSX), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Excel parser failed to load.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "/vendor/xlsx.full.min.js";
    script.async = true;
    script.dataset.xlsxLoader = "true";
    script.onload = () => resolve(window.XLSX);
    script.onerror = () => reject(new Error("Excel parser failed to load."));
    document.head.appendChild(script);
  }).finally(() => {
    if (!window.XLSX) {
      xlsxPromise = null;
    }
  });

  return xlsxPromise;
}
