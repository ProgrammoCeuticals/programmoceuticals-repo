import { Card, Field, TextArea } from "./ui";
import type { ExtractedSection } from "../types/report.types";

export function InspectedSiteCard({
  section,
  facilityName,
  address,
  inspectionDate,
  onFacilityNameChange,
  onAddressChange,
  onInspectionDateChange
}: {
  section: ExtractedSection;
  facilityName: string;
  address: string;
  inspectionDate: string;
  onFacilityNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onInspectionDateChange: (value: string) => void;
}) {
  const combined = [facilityName, address].filter(Boolean).join("\n");

  function handleChange(value: string) {
    const [first = "", ...rest] = value.split("\n");
    onFacilityNameChange(first);
    onAddressChange(rest.join("\n"));
  }

  return (
    <Card title="Inspected Site">
      {section.html && (
        <div
          className="document-section-html mb-4 max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: section.html }}
        />
      )}
      <TextArea
        label="Facility Name &amp; Address"
        value={combined}
        onChange={handleChange}
        placeholder="Facility name and address"
        rows={3}
      />
      <div className="mt-4">
        <Field
          label="Date of Inspection"
          value={inspectionDate}
          onChange={onInspectionDateChange}
          placeholder="Month, Year"
        />
      </div>
    </Card>
  );
}
