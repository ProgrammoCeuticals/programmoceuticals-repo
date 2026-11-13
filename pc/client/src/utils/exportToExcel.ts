import * as XLSX from "xlsx";
import { GMP_CATEGORIES, type CategoryDeficiency, type DocumentReviewState, type GmpCategory } from "../types/report.types";

export function exportToExcel(reviews: DocumentReviewState[], fileNames: string[]) {
  const wb = XLSX.utils.book_new();

  const categoryHeaders = GMP_CATEGORIES.map((cat) => [cat, "", ""]).flat();
  const row1 = ["", "", "", "", ...categoryHeaders];

  const deficiencySubHeaders = GMP_CATEGORIES.map(() => ["Critical", "Major", "Others"]).flat();
  const row2 = ["S/N", "Name and Address of Inspected Manufacturing Site", "Date of Inspection", "Remarks", ...deficiencySubHeaders];

  const dataRows = reviews.map((review, index) => {
    const deficiencyCols = GMP_CATEGORIES.map((cat: GmpCategory) => {
      const row: CategoryDeficiency = review.categoryDeficiencies[cat];
      return [formatCell(row.critical), formatCell(row.major), formatCell(row.others)];
    }).flat();

    return [
      index + 1,
      [review.facilityName, review.address].filter(Boolean).join("\n"),
      review.inspectionDate,
      review.finalRemark,
      ...deficiencyCols
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([row1, row2, ...dataRows]);

  ws["!merges"] = GMP_CATEGORIES.map((_, i) => ({
    s: { r: 0, c: 4 + i * 3 },
    e: { r: 0, c: 4 + i * 3 + 2 }
  }));

  ws["!cols"] = [
    { wch: 5 },
    { wch: 40 },
    { wch: 18 },
    { wch: 16 },
    ...GMP_CATEGORIES.map(() => [{ wch: 10 }, { wch: 10 }, { wch: 10 }]).flat()
  ];

  XLSX.utils.book_append_sheet(wb, ws, "BE Submissions");
  XLSX.writeFile(wb, "gmp-review-export.xlsx");
}

function formatCell(value: string): string {
  if (!value) return "";
  const num = parseInt(value, 10);
  return !isNaN(num) && num === 0 ? "NIL" : value;
}
