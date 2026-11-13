const cache = new Map();

const load = async (name, fn) => {
  if (cache.has(name)) return cache.get(name);
  const lib = await fn();
  cache.set(name, lib);
  return lib;
};

export const loadJSPDFLibrary = () => load('jspdf', () => import('jspdf'));
export const loadAutoTableLibrary = () => load('jspdf-autotable', () => import('jspdf-autotable'));
