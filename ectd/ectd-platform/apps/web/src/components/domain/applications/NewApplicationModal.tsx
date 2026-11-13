"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useCreateApplication, useEctdStandards, useRegulatoryRegions, useRegionalSpecifications } from "@/lib/api/queries";
import { LoadingSkeleton } from "@/components/ui/States";
import { toast } from "@/components/ui/Toast";
import { ApiClientError } from "@/lib/api/client";
import { cn } from "@/lib/cn";

const STEPS = [
  "Application Identity",
  "Product Information",
  "Regulatory Configuration",
  "Review & Create",
] as const;

const schema = z.object({
  applicationNumber: z.string().min(1, "Application number is required"),
  applicationType: z.string().min(1, "Application type is required"),
  productId: z.string().min(1, "Product is required"),
  authorityId: z.string().min(1, "Regulatory authority is required"),
  regionId: z.string().min(1, "Region is required"),
  ectdStandardId: z.string().min(1, "eCTD standard is required"),
  regionalSpecificationId: z.string().min(1, "Regional specification is required"),
});

type FormValues = z.infer<typeof schema>;

interface NewApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

export function NewApplicationModal({ open, onClose, onCreated }: NewApplicationModalProps) {
  const [step, setStep] = useState(0);
  const { mutateAsync, isPending } = useCreateApplication();
  const { data: standards, isLoading: loadingStandards } = useEctdStandards();
  const { data: regions, isLoading: loadingRegions } = useRegulatoryRegions();
  const { data: specs, isLoading: loadingSpecs } = useRegionalSpecifications();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onChange" });

  const values = watch();

  const handleClose = () => {
    reset();
    setStep(0);
    onClose();
  };

  const nextStep = async () => {
    const fieldsPerStep: (keyof FormValues)[][] = [
      ["applicationNumber", "applicationType"],
      ["productId"],
      ["authorityId", "regionId", "ectdStandardId", "regionalSpecificationId"],
    ];
    const valid = await trigger(fieldsPerStep[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const app = await mutateAsync(data);
      toast.success("Application created.");
      handleClose();
      onCreated(app.id);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Failed to create application.";
      toast.error(msg);
    }
  };

  const isConfigLoading = loadingStandards || loadingRegions || loadingSpecs;

  return (
    <Modal open={open} onClose={handleClose} title="New Regulatory Application" size="lg">
      {/* Stepper */}
      <nav aria-label="Application creation steps" className="mb-6">
        <ol className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                    i < step
                      ? "bg-brand-600 text-white"
                      : i === step
                        ? "border-2 border-brand-600 text-brand-600"
                        : "border-2 border-gray-300 text-gray-400",
                  )}
                  aria-current={i === step ? "step" : undefined}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                <span className={cn("hidden text-xs sm:block", i === step ? "font-medium text-gray-900" : "text-gray-400")}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("mx-1 h-px flex-1", i < step ? "bg-brand-600" : "bg-gray-200")} />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Step 0 — Application Identity */}
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Application Number" error={errors.applicationNumber?.message}>
              <input
                {...register("applicationNumber")}
                className={inputClass}
                placeholder="e.g. NDA-123456"
              />
            </Field>
            <Field label="Application Type" error={errors.applicationType?.message}>
              <input
                {...register("applicationType")}
                className={inputClass}
                placeholder="e.g. NDA, ANDA, BLA"
              />
            </Field>
          </div>
        )}

        {/* Step 1 — Product Information */}
        {step === 1 && (
          <div className="space-y-4">
            <Field label="Product ID" error={errors.productId?.message}>
              <input
                {...register("productId")}
                className={inputClass}
                placeholder="Product UUID from your organization"
              />
            </Field>
          </div>
        )}

        {/* Step 2 — Regulatory Configuration */}
        {step === 2 && (
          <div className="space-y-4">
            {isConfigLoading ? (
              <LoadingSkeleton rows={4} />
            ) : (
              <>
                <Field label="Regulatory Authority ID" error={errors.authorityId?.message}>
                  <input {...register("authorityId")} className={inputClass} placeholder="Authority UUID" />
                </Field>
                <Field label="Region" error={errors.regionId?.message}>
                  <select {...register("regionId")} className={inputClass}>
                    <option value="">Select region…</option>
                    {regions?.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.code})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="eCTD Standard" error={errors.ectdStandardId?.message}>
                  <select {...register("ectdStandardId")} className={inputClass}>
                    <option value="">Select standard…</option>
                    {standards?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} v{s.version}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Regional Specification" error={errors.regionalSpecificationId?.message}>
                  <select {...register("regionalSpecificationId")} className={inputClass}>
                    <option value="">Select specification…</option>
                    {specs?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} v{s.version}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            )}
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm">
            <ReviewRow label="Application Number" value={values.applicationNumber} />
            <ReviewRow label="Application Type" value={values.applicationType} />
            <ReviewRow label="Product ID" value={values.productId} />
            <ReviewRow label="Authority ID" value={values.authorityId} />
            <ReviewRow label="Region ID" value={values.regionId} />
            <ReviewRow label="eCTD Standard ID" value={values.ectdStandardId} />
            <ReviewRow label="Regional Spec ID" value={values.regionalSpecificationId} />
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={step === 0 ? handleClose : () => setStep((s) => s - 1)}
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={() => void nextStep()}>
              Next
            </Button>
          ) : (
            <Button type="submit" loading={isPending}>
              Create Application
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value || "—"}</span>
    </div>
  );
}

const inputClass =
  "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";
