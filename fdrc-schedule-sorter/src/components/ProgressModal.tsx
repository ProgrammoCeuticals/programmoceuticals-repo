import { Loader2 } from 'lucide-react';

interface Props {
  message: string;
}

const STEPS = [
  'Reading Workbook...',
  'Reading Worksheets...',
  'Analysing Imported Worksheet...',
  'Analysing Nigerian Worksheet...',
  'Preparing Preview...',
  'Generating Workbook...',
  'Preparing Download...',
];

export default function ProgressModal({ message }: Props) {
  const currentIndex = STEPS.indexOf(message);
  const progress = currentIndex >= 0 ? Math.round(((currentIndex + 1) / STEPS.length) * 100) : 10;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="font-semibold text-slate-800 mb-1">{message}</p>
        <p className="text-sm text-slate-400 mb-5">Please wait...</p>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{progress}%</p>
      </div>
    </div>
  );
}
