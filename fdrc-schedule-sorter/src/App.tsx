import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import UploadCard from './components/UploadCard';
import WorkbookSummary from './components/WorkbookSummary';
import WorksheetSelector from './components/WorksheetSelector';
import PreviewTables from './components/PreviewTables';
import ConfirmationDialog from './components/ConfirmationDialog';
import ProgressModal from './components/ProgressModal';
import StatusBanner from './components/StatusBanner';
import { useWorkbook } from './hooks/useWorkbook';
import { useProcessor } from './hooks/useProcessor';
import { RotateCcw, Download, CheckCircle } from 'lucide-react';

type Step = 'upload' | 'select' | 'preview' | 'done';

const SESSION_KEY_IMP = 'fdrc_last_imported';
const SESSION_KEY_NIG = 'fdrc_last_nigerian';

export default function App() {
  const wb = useWorkbook();
  const proc = useProcessor();

  const [step, setStep] = useState<Step>('upload');
  const [importedSheet, setImportedSheet] = useState(() => sessionStorage.getItem(SESSION_KEY_IMP) ?? '');
  const [nigerianSheet, setNigerianSheet] = useState(() => sessionStorage.getItem(SESSION_KEY_NIG) ?? '');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { sessionStorage.setItem(SESSION_KEY_IMP, importedSheet); }, [importedSheet]);
  useEffect(() => { sessionStorage.setItem(SESSION_KEY_NIG, nigerianSheet); }, [nigerianSheet]);

  const handleFile = async (file: File) => {
    await wb.load(file);
    setStep('select');
  };

  const handleContinue = async () => {
    if (!wb.workbook) return;
    await proc.analyse(wb.workbook, importedSheet, nigerianSheet);
    setStep('preview');
  };

  const handleGenerate = () => setShowConfirm(true);

  const handleConfirmedGenerate = async () => {
    setShowConfirm(false);
    if (!wb.workbook || !wb.meta) return;
    await proc.generate(wb.workbook, wb.meta.fileName);
    setStep('done');
  };

  const handleReset = () => {
    wb.reset();
    proc.reset();
    setStep('upload');
    setImportedSheet('');
    setNigerianSheet('');
    sessionStorage.removeItem(SESSION_KEY_IMP);
    sessionStorage.removeItem(SESSION_KEY_NIG);
  };

  const isLoading = wb.loading || !!proc.progress;
  const progressMsg = wb.loading ? 'Reading Workbook...' : proc.progress ?? '';
  const hasPreview = proc.importedResult || proc.nigerianResult;

  return (
    <Layout>
      {step !== 'upload' && (
        <div className="flex justify-end mb-4">
          <button onClick={handleReset} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-50 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      )}

      {wb.error && <StatusBanner variant="error" message={wb.error} />}
      {proc.error && <StatusBanner variant="error" message={proc.error} />}

      {step === 'upload' && <UploadCard onFile={handleFile} loading={wb.loading} />}

      {step === 'select' && wb.meta && (
        <>
          <WorkbookSummary fileName={wb.meta.fileName} worksheets={wb.meta.worksheets} />
          <WorksheetSelector
            worksheets={wb.meta.worksheets}
            importedSheet={importedSheet}
            nigerianSheet={nigerianSheet}
            onImportedChange={setImportedSheet}
            onNigerianChange={setNigerianSheet}
            onContinue={handleContinue}
          />
        </>
      )}

      {step === 'preview' && hasPreview && (
        <PreviewTables
          importedResult={proc.importedResult}
          nigerianResult={proc.nigerianResult}
          importedAnalysed={proc.importedAnalysed}
          nigerianAnalysed={proc.nigerianAnalysed}
          onBack={() => setStep('select')}
          onGenerate={handleGenerate}
        />
      )}

      {step === 'done' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Workbook Generated Successfully</h3>
          <p className="text-slate-500 mb-6">Your processed workbook has been downloaded.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleReset} className="flex items-center gap-2 border border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors">
              <RotateCcw className="w-4 h-4" /> Process Another File
            </button>
            <button
              onClick={() => wb.workbook && wb.meta && proc.generate(wb.workbook, wb.meta.fileName)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" /> Download Again
            </button>
          </div>
        </div>
      )}

      {isLoading && progressMsg && <ProgressModal message={progressMsg} />}

      {showConfirm && (
        <ConfirmationDialog
          importedResult={proc.importedResult}
          nigerianResult={proc.nigerianResult}
          onConfirm={handleConfirmedGenerate}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </Layout>
  );
}
