"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useReplaceContextOfUse, useContextOfUse } from "@/lib/api/queries";
import { toast } from "@/components/ui/Toast";
import { ApiClientError } from "@/lib/api/client";
import { Info } from "lucide-react";

const schema = z.object({
  replacingContextOfUseId: z
    .string()
    .uuid("Must be a valid Context of Use UUID"),
  reason: z.string().min(10, "Provide a reason (minimum 10 characters)"),
});

type FormValues = z.infer<typeof schema>;

interface ReplaceCouDialogProps {
  couId: string;
  open: boolean;
  onClose: () => void;
}

export function ReplaceCouDialog({ couId, open, onClose }: ReplaceCouDialogProps) {
  const [step, setStep] = useState<"form" | "review">("form");
  const { data: cou } = useContextOfUse(couId);
  const { mutateAsync, isPending } = useReplaceContextOfUse();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const values = watch();

  const handleClose = () => {
    reset();
    setStep("form");
    onClose();
  };

  const couWithExtras = cou as typeof cou & {
    contextDefinition?: { code: string; name: string };
    document?: { title: string };
  };

  const onSubmit = async (data: FormValues) => {
    if (step === "form") {
      setStep("review");
      return;
    }
    try {
      await mutateAsync({
        id: couId,
        replacingContextOfUseId: data.replacingContextOfUseId,
        reason: data.reason,
      });
      toast.success("Replacement relationship recorded.");
      handleClose();
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Replace failed.";
      toast.error(msg);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Replace Context of Use" size="md">
      {/* Info note */}
      <div className="mb-4 flex gap-2 rounded-md border border-blue-200 bg-blue-50 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
        <p className="text-sm text-blue-800">
          Replace records that another Context of Use supersedes this one.
          The replacing CoU must already exist in this submission unit.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {step === "form" && (
          <div className="space-y-4">
            {couWithExtras?.contextDefinition && (
              <div className="rounded-md bg-gray-50 px-3 py-2 text-sm">
                <p className="text-xs text-gray-400">Being replaced</p>
                <p className="font-medium text-gray-900">
                  {couWithExtras.contextDefinition.name}
                </p>
                {couWithExtras.document && (
                  <p className="text-gray-600">{couWithExtras.document.title}</p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="replacing-cou-id"
                className="block text-xs font-medium text-gray-700"
              >
                Replacing Context of Use ID <span aria-hidden="true">*</span>
              </label>
              <input
                id="replacing-cou-id"
                type="text"
                {...register("replacingContextOfUseId")}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {errors.replacingContextOfUseId && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.replacingContextOfUseId.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="replace-reason"
                className="block text-xs font-medium text-gray-700"
              >
                Reason <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="replace-reason"
                rows={3}
                {...register("reason")}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Describe why this Context of Use is being replaced…"
              />
              {errors.reason && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {errors.reason.message}
                </p>
              )}
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Review before confirming</p>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 space-y-2 text-sm">
              <ReviewRow label="Operation" value="REPLACE" />
              {couWithExtras?.contextDefinition && (
                <ReviewRow label="Target CoU" value={couWithExtras.contextDefinition.name} />
              )}
              <ReviewRow
                label="Replacing CoU ID"
                value={values.replacingContextOfUseId}
                mono
              />
              <ReviewRow label="Reason" value={values.reason} />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={step === "form" ? handleClose : () => setStep("form")}
            disabled={isPending}
          >
            {step === "form" ? "Cancel" : "Back"}
          </Button>
          <Button type="submit" loading={isPending}>
            {step === "form" ? "Review" : "Confirm Replace"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function ReviewRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className={`text-right font-medium text-gray-900 ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}
