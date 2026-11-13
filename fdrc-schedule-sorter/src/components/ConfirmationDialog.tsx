import { X } from 'lucide-react';
import type { ClassificationResult } from '../types/Classification';
import { fmt } from '../utils/helpers';

interface Props {
  importedResult: ClassificationResult | null;
  nigerianResult: ClassificationResult | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({ importedResult, nigerianResult, onConfirm, onCancel }: Props) {
  const totalRecords = (importedResult?.total ?? 0) + (nigerianResult?.total ?? 0);
  const sheetCount = [importedResult, nigerianResult].filter(Boolean).length * 3;

  const rows = [
    ...(importedResult ? [
      { name: 'Imported NF', count: importedResult.nf.length },
      { name: 'Imported RNW', count: importedResult.rnw.length },
      { name: 'Imported Variations', count: importedResult.variations.length },
    ] : []),
    ...(nigerianResult ? [
      { name: 'Nigerian NF', count: nigerianResult.nf.length },
      { name: 'Nigerian RNW', count: nigerianResult.rnw.length },
      { name: 'Nigerian Variations', count: nigerianResult.variations.length },
    ] : []),
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Confirm Workbook Generation</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          This will generate <strong>{sheetCount} new worksheets</strong> and <strong>{fmt(totalRecords)} total classified records</strong>.
        </p>

        <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-2 mb-5">
          {rows.map((s) => (
            <div key={s.name} className="flex justify-between">
              <span className="text-slate-600">{s.name}</span>
              <span className="font-semibold text-slate-800">{fmt(s.count)} records</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
