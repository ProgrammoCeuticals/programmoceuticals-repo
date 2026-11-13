import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface Props {
  onFile: (file: File) => void;
  loading: boolean;
}

export default function UploadCard({ onFile, loading }: Props) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm'] },
    multiple: false,
    disabled: loading,
  });

  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">FDRC Schedule Sorter</h2>
      <p className="text-slate-500 mb-8">Automatically classify FDRC applications into NF, RNW and Variations.</p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-16 cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {isDragActive
            ? <Upload className="w-14 h-14 text-blue-500 animate-bounce" />
            : <FileSpreadsheet className="w-14 h-14 text-slate-400" />}
          <div>
            <p className="text-lg font-semibold text-slate-700">
              {isDragActive ? 'Drop your file here' : 'Drag & Drop your Excel file'}
            </p>
            <p className="text-slate-400 mt-1">or <span className="text-blue-600 font-medium">browse to upload</span></p>
          </div>
          <p className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Accepts .xlsx and .xlsm files</p>
        </div>
      </div>
    </div>
  );
}
