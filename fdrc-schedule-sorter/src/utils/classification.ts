import type { Category, ClassifiedRow } from '../types/Classification';

/** Classify a single application number into NF, RNW, or VARIATIONS */
export function classify(appNumber: string): Category {
  const upper = appNumber.trim().toUpperCase();
  if (upper.startsWith('NF-')) return 'NF';
  if (upper.startsWith('RNW-')) return 'RNW';
  return 'VARIATIONS';
}

/** Group classified rows by category */
export function groupByCategory(rows: ClassifiedRow[]) {
  return {
    nf: rows.filter((r) => r.category === 'NF'),
    rnw: rows.filter((r) => r.category === 'RNW'),
    variations: rows.filter((r) => r.category === 'VARIATIONS'),
  };
}
