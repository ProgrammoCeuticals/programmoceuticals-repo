import type { AxiosInstance } from 'axios';
import type { ApiResponse } from '../types';

export interface AiSummaryResult {
  summary: string | null;
  sourceData: Record<string, unknown>;
  isAiGenerated: boolean;
  generatedAt: string;
  disclaimer: string;
}

export const generateExecutiveSummary = (
  client: AxiosInstance,
  payload: { periodStart: string; periodEnd: string },
) =>
  client
    .post<ApiResponse<AiSummaryResult>>('/ai-reports/executive-summary', payload)
    .then((r) => r.data);
