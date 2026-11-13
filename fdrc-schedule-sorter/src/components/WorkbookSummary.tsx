import { CheckCircle, FileText } from 'lucide-react';
import type { WorksheetInfo } from '../types/Workbook';
import { fmt } from '../utils/helpers';

interface Props {
  fileName: string;
  worksheets: WorksheetInfo[];
}

export default function WorkbookSummary({ fileName, worksheets }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <div>
          <h3 className="font-semibold text-slate-800">Workbook Loaded Successfully</h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
            <FileText className="w-3.5 h-3.5" /> {fileName}
          </p>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600 mb-3">Worksheets Found</p>
      <div className="flex flex-wrap gap-2">
        {worksheets.map((ws) => (
          <span key={ws.name} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-200 font-medium">
            {ws.name}
            <span className="text-blue-400 font-normal ml-1">({fmt(ws.rowCount)} rows)</span>
          </span>
        ))}
      </div>
    </div>
  );
}
