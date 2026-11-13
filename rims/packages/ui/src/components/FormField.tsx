import React from "react";

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  helpText,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      {/* Label — GLSI style: uppercase, tracked, small, bold */}
      <label
        htmlFor={htmlFor}
        className="block text-[11px] font-bold text-[#193441] uppercase tracking-[0.06em]"
      >
        {label}
        {required && <span className="text-[#c53030] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-[#c53030] font-medium">{error}</p>
      )}
      {!error && helpText && (
        <p className="text-[11px] text-[#718096]">{helpText}</p>
      )}
    </div>
  );
}
