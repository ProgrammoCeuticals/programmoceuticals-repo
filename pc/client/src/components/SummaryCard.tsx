import type { ExtractedSection } from "../types/report.types";
import { Card, ExtractedTextBlock } from "./ui";

const remarks = ["Satisfactory", "Unsatisfactory"];

const remarkStyles: Record<string, string> = {
  Satisfactory: "border-green-300 bg-green-100 text-green-800",
  Unsatisfactory: "border-red-300 bg-red-100 text-red-800"
};

export function SummaryCard({
  section,
  finalRemark,
  onFinalRemarkChange
}: {
  section: ExtractedSection;
  finalRemark: string;
  onFinalRemarkChange: (value: string) => void;
}) {
  return (
    <Card title="Summary and Conclusions">
      {section.html ? (
        <div
          className="document-section-html max-h-[520px] overflow-auto rounded-lg border border-slate-200 bg-white p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: section.html }}
        />
      ) : (
        <ExtractedTextBlock text={section.text} />
      )}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Final Remark</p>
        <div className="flex gap-2">
          {remarks.map((remark) => (
            <button
              key={remark}
              type="button"
              onClick={() => onFinalRemarkChange(remark)}
              className={`rounded-lg border px-6 py-2.5 text-sm font-semibold transition ${
                finalRemark === remark
                  ? remarkStyles[remark]
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {remark}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
