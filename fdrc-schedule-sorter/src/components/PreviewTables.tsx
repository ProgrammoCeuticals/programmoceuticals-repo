import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import type { ClassificationResult } from '../types/Classification';
import type { AnalysedWorksheet } from '../types/Worksheet';
import { fmt } from '../utils/helpers';

interface SummaryCardProps {
  label: string;
  result: ClassificationResult;
  analysed: AnalysedWorksheet;
}

function SummaryCard({ label, result, analysed }: SummaryCardProps) {
  const balanced = result.nf.length + result.rnw.length + result.variations.length === result.total;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h4 className="font-semibold text-slate-700 mb-3">{label}</h4>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label: 'NF', count: result.nf.length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'RNW', count: result.rnw.length, color: 'bg-purple-50 text-purple-700 border-purple-200' },
          { label: 'Variations', count: result.variations.length, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Total', count: result.total, color: 'bg-slate-50 text-slate-700 border-slate-200' },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl border p-3 text-center ${item.color}`}>
            <p className="text-2xl font-bold">{fmt(item.count)}</p>
            <p className="text-xs font-medium mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
      {!balanced && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> Count mismatch detected.
        </p>
      )}
      {analysed.blankAppNumbers.length > 0 && (
        <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
          <AlertTriangle className="w-3.5 h-3.5" /> {analysed.blankAppNumbers.length} row(s) with blank Application Number skipped.
        </p>
      )}
      {analysed.duplicateAppNumbers.length > 0 && (
        <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
          <AlertTriangle className="w-3.5 h-3.5" /> {analysed.duplicateAppNumbers.length} duplicate(s) found — only first occurrence kept.
        </p>
      )}
    </div>
  );
}

interface TableSectionProps {
  title: string;
  rows: ClassificationResult['nf'];
  color: string;
}

function TableSection({ title, rows, color }: TableSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const display = showAll ? rows : rows.slice(0, 10);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <span className="font-medium text-slate-700 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${color}`} />
          {title}
          <span className="text-slate-400 font-normal text-sm">({fmt(rows.length)})</span>
        </span>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {expanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Row', 'Application Number', 'Brand Name', 'Applicant', 'Dosage Form', 'Strength'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {display.map((row) => (
                <tr key={row.rowNumber} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-400">{row.rowNumber}</td>
                  <td className="px-3 py-2 font-mono text-slate-700">{row.applicationNumber}</td>
                  <td className="px-3 py-2 text-slate-600">{row.brandName}</td>
                  <td className="px-3 py-2 text-slate-600">{row.applicant}</td>
                  <td className="px-3 py-2 text-slate-600">{row.dosageForm}</td>
                  <td className="px-3 py-2 text-slate-600">{row.strength}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 10 && (
            <div className="px-4 py-2 border-t border-slate-100">
              <button onClick={() => setShowAll((p) => !p)} className="text-xs text-blue-600 hover:underline">
                {showAll ? 'Show less' : `View all ${fmt(rows.length)} rows`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  importedResult: ClassificationResult | null;
  nigerianResult: ClassificationResult | null;
  importedAnalysed: AnalysedWorksheet | null;
  nigerianAnalysed: AnalysedWorksheet | null;
  onBack: () => void;
  onGenerate: () => void;
}

export default function PreviewTables({ importedResult, nigerianResult, importedAnalysed, nigerianAnalysed, onBack, onGenerate }: Props) {
  const importedSections = importedResult
    ? [
        { title: 'Imported NF', rows: importedResult.nf, color: 'bg-blue-500' },
        { title: 'Imported RNW', rows: importedResult.rnw, color: 'bg-purple-500' },
        { title: 'Imported Variations', rows: importedResult.variations, color: 'bg-amber-500' },
      ]
    : [];

  const nigerianSections = nigerianResult
    ? [
        { title: 'Nigerian NF', rows: nigerianResult.nf, color: 'bg-blue-500' },
        { title: 'Nigerian RNW', rows: nigerianResult.rnw, color: 'bg-purple-500' },
        { title: 'Nigerian Variations', rows: nigerianResult.variations, color: 'bg-amber-500' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 gap-4 ${importedResult && nigerianResult ? 'md:grid-cols-2' : ''}`}>
        {importedResult && importedAnalysed && (
          <SummaryCard label={`Imported: ${importedResult.sheetName}`} result={importedResult} analysed={importedAnalysed} />
        )}
        {nigerianResult && nigerianAnalysed && (
          <SummaryCard label={`Nigerian: ${nigerianResult.sheetName}`} result={nigerianResult} analysed={nigerianAnalysed} />
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <h4 className="font-semibold text-slate-700">Preview Classified Records</h4>
        {[...importedSections, ...nigerianSections].map((s) => (
          <TableSection key={s.title} title={s.title} rows={s.rows} color={s.color} />
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-slate-300 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors">
          ← Back
        </button>
        <button onClick={onGenerate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
          Generate Workbook
        </button>
      </div>
    </div>
  );
}
