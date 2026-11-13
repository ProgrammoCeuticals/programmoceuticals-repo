export interface KpiBreakdownItem {
  kpiName: string;
  weight: number;
  targetValue: string | null;
  actualValue: string | null;
  contribution: number;
  status: string;
}

export interface ScoreResult {
  totalWeight: number;
  assessedWeight: number;
  score: number;
  percentage: number;
  breakdown: KpiBreakdownItem[];
}
