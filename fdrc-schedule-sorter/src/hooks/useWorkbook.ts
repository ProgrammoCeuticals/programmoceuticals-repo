import { useState, useCallback } from 'react';
import ExcelJS from 'exceljs';
import type { LoadedWorkbook } from '../types/Workbook';
import { readWorkbook } from '../utils/readWorkbook';

export type WorkbookState = {
  meta: LoadedWorkbook | null;
  workbook: ExcelJS.Workbook | null;
  loading: boolean;
  error: string | null;
  load: (file: File) => Promise<void>;
  reset: () => void;
};

export function useWorkbook(): WorkbookState {
  const [meta, setMeta] = useState<LoadedWorkbook | null>(null);
  const [workbook, setWorkbook] = useState<ExcelJS.Workbook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await readWorkbook(file);
      setWorkbook(result.workbook);
      setMeta(result.meta);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to read workbook.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMeta(null);
    setWorkbook(null);
    setError(null);
  }, []);

  return { meta, workbook, loading, error, load, reset };
}
