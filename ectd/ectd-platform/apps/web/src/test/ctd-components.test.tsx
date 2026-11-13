import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { CtdIndicatorBadge } from "@/components/domain/ctd/CtdIndicator";

describe("CtdIndicatorBadge", () => {
  it.each([
    ["complete", "Complete", "✓"],
    ["empty",    "Not populated", "○"],
    ["warning",  "Warning", "⚠"],
    ["error",    "Error", "✕"],
    ["gap",      "Regulatory gap", "ⓘ"],
  ] as const)("renders %s indicator with symbol and aria-label", (indicator, label, symbol) => {
    render(<CtdIndicatorBadge indicator={indicator} />);
    const el = screen.getByLabelText(label);
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent(symbol);
  });

  it("never uses color as the only signal — symbol is always present", () => {
    render(<CtdIndicatorBadge indicator="error" />);
    // Symbol ✕ must be visible text, not just a color class
    expect(screen.getByText("✕")).toBeInTheDocument();
  });
});

describe("CtdIndicatorBadge — gap state", () => {
  it("renders REGULATORY GAP indicator", () => {
    render(<CtdIndicatorBadge indicator="gap" />);
    expect(screen.getByLabelText("Regulatory gap")).toBeInTheDocument();
  });
});
