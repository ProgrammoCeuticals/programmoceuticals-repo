import { AlertCircle } from 'lucide-react';
import type { WorksheetInfo } from '../types/Workbook';
import { fmt } from '../utils/helpers';

interface Props {
  worksheets: WorksheetInfo[];
  importedSheet: string;
  nigerianSheet: string;
  onImportedChange: (v: string) => void;
  onNigerianChange: (v: string) => void;
  onContinue: () => void;
}

export default function WorksheetSelector({ worksheets, importedSheet, nigerianSheet, onImportedChange, onNigerianChange, onContinue }: Props) {
  const sameSheet = importedSheet && nigerianSheet && importedSheet === nigerianSheet;
  const atLeastOne = importedSheet || nigerianSheet;
  const canContinue = atLeastOne && !sameSheet;

  const importedInfo = worksheets.find((w) => w.name === importedSheet);
  const nigerianInfo = worksheets.find((w) => w.name === nigerianSheet);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      <h3 className="font-semibold text-slate-800 mb-1">Select Worksheets to Process</h3>
      <p className="text-sm text-slate-500 mb-5">Select one or both worksheets. At least one is required.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Imported Drug Worksheet <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <select
            value={importedSheet}
            onChange={(e) => onImportedChange(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">— None —</option>
            {worksheets.map((ws) => (
              <option key={ws.name} value={ws.name}>{ws.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Nigerian Drug Worksheet <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <select
            value={nigerianSheet}
            onChange={(e) => onNigerianChange(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">— None —</option>
            {worksheets.map((ws) => (
              <option key={ws.name} value={ws.name}>{ws.name}</option>
            ))}
          </select>
        </div>
      </div>

      {sameSheet && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Imported and Nigerian worksheets cannot be the same.
        </div>
      )}

      {canContinue && (importedInfo || nigerianInfo) && (
        <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm">
          <p className="font-medium text-slate-700 mb-2">Selected Worksheets</p>
          <div className="grid grid-cols-2 gap-4">
            {importedInfo ? (
              <div>
                <p className="text-slate-500">Imported Worksheet</p>
                <p className="font-semibold text-slate-800">{importedInfo.name}</p>
                <p className="text-slate-400">{fmt(importedInfo.rowCount)} rows · {importedInfo.columnCount} columns</p>
              </div>
            ) : (
              <div>
                <p className="text-slate-500">Imported Worksheet</p>
                <p className="text-slate-400 italic">Not selected</p>
              </div>
            )}
            {nigerianInfo ? (
              <div>
                <p className="text-slate-500">Nigerian Worksheet</p>
                <p className="font-semibold text-slate-800">{nigerianInfo.name}</p>
                <p className="text-slate-400">{fmt(nigerianInfo.rowCount)} rows · {nigerianInfo.columnCount} columns</p>
              </div>
            ) : (
              <div>
                <p className="text-slate-500">Nigerian Worksheet</p>
                <p className="text-slate-400 italic">Not selected</p>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 rounded-xl transition-colors duration-150"
      >
        Continue
      </button>
    </div>
  );
}
