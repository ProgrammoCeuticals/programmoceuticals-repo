import React from "react";
import { cn } from "../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, id, className, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-bold text-[#193441] uppercase tracking-[0.06em]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            // GLSI .search-input: sharp, 1px border, clean white/off-white bg
            "block w-full border px-3 py-2 text-[13px] text-[#193441]",
            "bg-white placeholder:text-[#a0aec0]",
            // No border-radius — sharp corners
            "outline-none transition-colors duration-150",
            // Focus: left accent bar via box-shadow trick + border colour shift (GLSI pattern)
            error
              ? "border-[#c53030] focus:border-[#c53030] focus:shadow-[inset_3px_0_0_#c53030]"
              : "border-[#e2e8f0] focus:border-[#193441] focus:shadow-[inset_3px_0_0_#193441]",
            "disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#718096]",
            className,
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helpText
                ? `${inputId}-help`
                : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[11px] text-[#c53030] font-medium"
          >
            {error}
          </p>
        )}
        {!error && helpText && (
          <p id={`${inputId}-help`} className="text-[11px] text-[#718096]">
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
