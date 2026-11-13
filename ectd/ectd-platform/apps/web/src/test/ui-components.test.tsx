import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LifecycleBadge } from "@/components/ui/LifecycleBadge";
import { ValidationBadge } from "@/components/ui/ValidationBadge";
import { RegulatoryGapBanner } from "@/components/ui/RegulatoryGapBanner";

describe("StatusBadge", () => {
  it("renders the status label", () => {
    render(<StatusBadge status="DRAFT" />);
    expect(screen.getByText("DRAFT")).toBeInTheDocument();
  });

  it("has an accessible aria-label", () => {
    render(<StatusBadge status="ACTIVE" />);
    expect(screen.getByLabelText("Status: ACTIVE")).toBeInTheDocument();
  });

  it("renders unknown statuses without crashing", () => {
    render(<StatusBadge status="UNKNOWN_STATE" />);
    expect(screen.getByText("UNKNOWN_STATE")).toBeInTheDocument();
  });
});

describe("LifecycleBadge", () => {
  it.each(["NEW", "REPLACE", "REUSE", "SUSPEND"])("renders %s operation", (op) => {
    render(<LifecycleBadge operation={op} />);
    expect(screen.getByText(op)).toBeInTheDocument();
  });

  it("has an accessible aria-label", () => {
    render(<LifecycleBadge operation="REPLACE" />);
    expect(screen.getByLabelText("Lifecycle operation: REPLACE")).toBeInTheDocument();
  });
});

describe("ValidationBadge", () => {
  it("renders PASSED state", () => {
    render(<ValidationBadge state="PASSED" />);
    expect(screen.getByText("PASSED")).toBeInTheDocument();
  });

  it("renders FAILED state", () => {
    render(<ValidationBadge state="FAILED" />);
    expect(screen.getByText("FAILED")).toBeInTheDocument();
  });

  it("replaces underscores with spaces for readability", () => {
    render(<ValidationBadge state="PASSED_WITH_WARNINGS" />);
    expect(screen.getByText("PASSED WITH WARNINGS")).toBeInTheDocument();
  });

  it("has an accessible aria-label", () => {
    render(<ValidationBadge state="NOT_RUN" />);
    expect(screen.getByLabelText("Validation state: NOT_RUN")).toBeInTheDocument();
  });
});

describe("RegulatoryGapBanner", () => {
  it("renders the REGULATORY GAP title", () => {
    render(
      <RegulatoryGapBanner
        title="Regional Validation Criteria"
        reason="Required regional validation criteria unavailable."
      />,
    );
    expect(
      screen.getByText(/REGULATORY GAP — Regional Validation Criteria/),
    ).toBeInTheDocument();
  });

  it("renders the reason", () => {
    render(
      <RegulatoryGapBanner
        title="Test"
        reason="Required package is missing."
      />,
    );
    expect(screen.getByText("Required package is missing.")).toBeInTheDocument();
  });

  it("renders the impact when provided", () => {
    render(
      <RegulatoryGapBanner
        title="Test"
        reason="Missing."
        impact="Regional validation not completed."
      />,
    );
    expect(screen.getByText(/Regional validation not completed/)).toBeInTheDocument();
  });

  it("has role=alert for screen readers", () => {
    render(<RegulatoryGapBanner title="Test" reason="Missing." />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("does not render impact section when impact is omitted", () => {
    render(<RegulatoryGapBanner title="Test" reason="Missing." />);
    expect(screen.queryByText(/Impact:/)).not.toBeInTheDocument();
  });
});
