import { normalize, expandName } from './normalization.js';
import ceilingList from '../data/regulatory/ceiling-list.json';
import fivePlusFive from '../data/regulatory/five-plus-five.json';
import importProhibition from '../data/regulatory/import-prohibition.json';
import ntiReference from '../data/regulatory/nti-reference.json';

// Build a flat local index: normalizedName → { display, lists }
function buildIndex() {
  const index = new Map();

  const add = (listId, names) => {
    for (const name of names) {
      if (!name) continue;
      const parts = name.split(/[/+&,]/).map((p) => p.trim()).filter(Boolean);
      for (const part of parts) {
        const key = normalize(part);
        if (!key || key.length < 3) continue;
        if (!index.has(key)) index.set(key, { display: part, lists: new Set() });
        index.get(key).lists.add(listId);
      }
    }
  };

  add('ceiling', ceilingList.map((e) => e.subjectName));
  add('prohibition', importProhibition.map((e) => e.subjectName));
  add('fiveplusfive', fivePlusFive.map((e) => e.subjectName));
  add('nti', ntiReference.map((e) => e.subjectName));

  return index;
}

export const LOCAL_INDEX = buildIndex();

async function fetchRxNorm(term) {
  try {
    const res = await fetch(
      `https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${encodeURIComponent(term)}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.suggestionGroup?.suggestionList?.suggestion || [];
  } catch {
    return [];
  }
}

export async function getSuggestions(segment) {
  if (!segment || segment.length < 3) return [];

  const segNorm = normalize(segment);
  const segExpanded = new Set(expandName(segment));

  const localMatches = [];
  for (const [key, meta] of LOCAL_INDEX.entries()) {
    const allTerms = new Set(expandName(key));
    const hit =
      [...segExpanded].some((s) => key.startsWith(s) || key.includes(s) || s.startsWith(key)) ||
      [...allTerms].some((t) => t.startsWith(segNorm) || t.includes(segNorm));
    if (hit) {
      localMatches.push({ display: meta.display, lists: Array.from(meta.lists), source: 'local' });
    }
  }

  localMatches.sort((a, b) => {
    const aN = normalize(a.display);
    const bN = normalize(b.display);
    return (bN.startsWith(segNorm) ? 1 : 0) - (aN.startsWith(segNorm) ? 1 : 0);
  });

  const localSlice = localMatches.slice(0, 5);
  const localSet = new Set(localSlice.map((s) => normalize(s.display)));

  const rxRaw = await fetchRxNorm(segment);
  const rxSlice = rxRaw
    .filter((n) => !localSet.has(normalize(n)))
    .slice(0, 8 - localSlice.length)
    .map((n) => ({ display: n, lists: [], source: 'rxnorm' }));

  return [...localSlice, ...rxSlice];
}
