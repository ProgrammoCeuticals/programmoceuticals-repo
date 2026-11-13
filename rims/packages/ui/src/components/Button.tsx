import React from "react";
import { cn } from "../lib/utils";
import { Spinner } from "./Spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

// GLSI house style:
// - No border-radius (sharp corners)
// - Brand colours from GLSI CSS vars: --brand #193441, --accent #c17f24, --danger #c53030
// - Ghost = border: 1.5px solid brand, transparent bg
// - Secondary = white + 1px border
const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[#193441] text-white hover:bg-[#122830] active:bg-[#0c1b21] focus-visible:ring-[#193441]",
  secondary:
    "bg-white border border-[#e2e8f0] text-[#193441] hover:bg-[#f7f8fa] hover:border-[#c5d8e3] active:bg-[#e8f0f4] focus-visible:ring-[#193441]",
  ghost:
    "bg-transparent text-[#193441] border border-[#193441] hover:bg-[#e8f0f4] active:bg-[#c5d8e3] focus-visible:ring-[#193441]",
  danger:
    "bg-[#c53030] text-white hover:bg-[#9b1c1c] active:bg-[#7b1212] focus-visible:ring-[#c53030]",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  // No border-radius in any size — matches GLSI .btn
  sm: "px-3 py-1.5 text-xs font-semibold gap-1.5",
  md: "px-4 py-2 text-[13px] font-semibold gap-2",
  lg: "px-5 py-2.5 text-[13px] font-semibold gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-colors duration-150",
        // No border-radius — GLSI has border-radius: 0 on .btn
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-45",
        // Letter spacing to match GLSI .btn letter-spacing: 0.3px
        "tracking-[0.02em]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
