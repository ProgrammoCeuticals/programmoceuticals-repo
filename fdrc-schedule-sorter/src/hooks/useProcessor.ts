import { useState, useCallback } from 'react';
import ExcelJS from 'exceljs';
import type { AnalysedWorksheet } from '../types/Worksheet';
import type { ClassificationResult } from '../types/Classification';
import { analyseWorksheet, classifyWorksheet } from '../utils/worksheetAnalyzer';
import { exportWorkbook } from '../utils/exportWorkbook';

export type ProcessorState = {
  progress: string | null;
  importedAnalysed: AnalysedWorksheet | null;
  nigerianAnalysed: AnalysedWorksheet | null;
  importedResult: ClassificationResult | null;
  nigerianResult: ClassificationResult | null;
  error: string | null;
  done: boolean;
  analyse: (wb: ExcelJS.Workbook, importedName: string, nigerianName: string) => Promise<void>;
  generate: (wb: ExcelJS.Workbook, fileName: string) => Promise<void>;
  reset: () => void;
};

export function useProcessor(): ProcessorState {
  const [progress, setProgress] = useState<string | null>(null);
  const [importedAnalysed, setImportedAnalysed] = useState<AnalysedWorksheet | null>(null);
  const [nigerianAnalysed, setNigerianAnalysed] = useState<AnalysedWorksheet | null>(null);
  const [importedResult, setImportedResult] = useState<ClassificationResult | null>(null);
  const [nigerianResult, setNigerianResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const analyse = useCallback(async (wb: ExcelJS.Workbook, importedName: string, nigerianName: string) => {
    setError(null);
    setDone(false);
    try {
      if (importedName) {
        setProgress('Analysing Imported Worksheet...');
        const impWs = wb.getWorksheet(importedName);
        if (!impWs) throw new Error(`Worksheet "${importedName}" not found.`);
        const impAnalysed = analyseWorksheet(impWs);
        setImportedAnalysed(impAnalysed);
        setImportedResult(classifyWorksheet(impAnalysed));
      } else {
        setImportedAnalysed(null);
        setImportedResult(null);
      }

      if (nigerianName) {
        setProgress('Analysing Nigerian Worksheet...');
        const nigWs = wb.getWorksheet(nigerianName);
        if (!nigWs) throw new Error(`Worksheet "${nigerianName}" not found.`);
        const nigAnalysed = analyseWorksheet(nigWs);
        setNigerianAnalysed(nigAnalysed);
        setNigerianResult(classifyWorksheet(nigAnalysed));
      } else {
        setNigerianAnalysed(null);
        setNigerianResult(null);
      }

      setProgress('Preparing Preview...');
      setProgress(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed.');
      setProgress(null);
    }
  }, []);

  const generate = useCallback(async (wb: ExcelJS.Workbook, fileName: string) => {
    if (!importedResult && !nigerianResult) return;
    setError(null);
    try {
      await exportWorkbook({
        workbook: wb,
        originalFileName: fileName,
        importedResult: importedResult ?? null,
        nigerianResult: nigerianResult ?? null,
        importedAnalysed: importedAnalysed ?? null,
        nigerianAnalysed: nigerianAnalysed ?? null,
        onProgress: setProgress,
      });
      setDone(true);
      setProgress(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed.');
      setProgress(null);
    }
  }, [importedResult, nigerianResult, importedAnalysed, nigerianAnalysed]);

  const reset = useCallback(() => {
    setProgress(null);
    setImportedAnalysed(null);
    setNigerianAnalysed(null);
    setImportedResult(null);
    setNigerianResult(null);
    setError(null);
    setDone(false);
  }, []);

  return { progress, importedAnalysed, nigerianAnalysed, importedResult, nigerianResult, error, done, analyse, generate, reset };
}
