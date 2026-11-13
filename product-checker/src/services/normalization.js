import { expandSynonyms } from '../utils/synonyms.js';

export const normalize = (value = '') =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const STOP_WORDS = new Set([
  'all', 'and', 'for', 'forms', 'list', 'only', 'dose', 'fixed',
  'containing', 'pharmaceutical', 'products', 'local', 'manufacturing',
]);

const DOSAGE_FORM_WORDS = new Set([
  'tablets', 'tablet', 'capsules', 'capsule', 'syrup', 'syrups',
  'suspension', 'suspensions', 'injection', 'injections', 'ointment',
  'ointments', 'cream', 'creams', 'drops', 'solution', 'solutions',
  'powder', 'powders', 'gel', 'gels', 'emulsion', 'emulsions',
  'bottled', 'retail', 'packs', 'pack', 'formulations', 'formulation',
  'preparations', 'preparation',
]);

export const tokenize = (value, stripDosageForms = false) =>
  normalize(value)
    .split(/\s+/)
    .filter((t) => {
      if (t.length <= 2) return false;
      if (STOP_WORDS.has(t)) return false;
      if (stripDosageForms && DOSAGE_FORM_WORDS.has(t)) return false;
      return true;
    });

export const expandName = (name) => expandSynonyms(normalize(name));

export const splitCompound = (text) =>
  text.split(/[/+&,]/).map((p) => p.trim()).filter(Boolean);

export const isCombinationText = (text) =>
  /(\+|\/|&|\bcombination\b|\bcontaining\b|\bfixed dose\b|\bwith\b)/i.test(text);

export const isCombinationInput = (text) =>
  /(\+|\/|&|\bwith\b|\bplus\b)/i.test(text);
