"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useSuspendContextOfUse, useContextOfUse } from "@/lib/api/queries";
import { toast } from "@/components/ui/Toast";
import { ApiClientError } from "@/lib/api/client";
import { AlertTriangle } from "lucide-react";

const schema = z.object({
  reason: z.string().min(10, "Please provide a reason (minimum 10 characters)"),
});

type FormValues = z.infer<typeof schema>;

interface SuspendCouDialogProps {
  couId: string;
  open: boolean;
  onClose: () => void;
}

export function SuspendCouDialog({ couId, open, onClose }: SuspendCouDialogProps) {
  const [step, setStep] = useState<"reason" | "review">("reason");
  const { data: cou } = useContextOfUse(couId);
  const { mutateAsync, isPending } = useSuspendContextOfUse();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const reason = watch("reason");

  const handleClose = () => {
    reset();
    setStep("reason");
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    if (step === "reason") {
      setStep("review");
      return;
    }
    try {
      await mutateAsync({ id: couId, reason: values.reason });
      toast.success("Context of Use suspended.");
      handleClose();
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : "Suspension failed.";
      toast.error(msg);
    }
  };

  const couWithExtras = cou as typeof cou & {
    contextDefinition?: { code: string; name: string };
    document?: { title: string };
  };

  return (
    <Modal open={open} onClose={handleClose} title="Suspend Context of Use" size="md">
      {/* Irreversibility warning — always visible */}
      <div className="mb-4 flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-sm text-amber-800">
          Suspension is <strong>irreversible</strong> under the ICH lifecycle model.
          The document is not deleted — only this Context of Use is deactivated.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {step === "reason" && (
          <div className="space-y-4">
            {couWithExtras?.contextDefinition && (
              <div className="rounded-md bg-gray-50 px-3 py-2 text-sm">
                <p className="text-gray-500">Context of Use</p>
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
                htmlFor="suspend-reason"
                className="block text-sm font-medium text-gray-700"
              >
                Reason for suspension
              </label>
              <textarea
                id="suspend-reason"
                rows={3}
                {...register("reason")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Describe why this Context of Use is being suspended…"
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
              <ReviewRow label="Operation" value="SUSPEND" />
              {couWithExtras?.contextDefinition && (
                <ReviewRow
                  label="Context of Use"
                  value={couWithExtras.contextDefinition.name}
                />
              )}
              {couWithExtras?.document && (
                <ReviewRow label="Document" value={couWithExtras.document.title} />
              )}
              <ReviewRow label="Reason" value={reason} />
              <ReviewRow label="Reversible" value="No — irreversible under ICH lifecycle model" />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={step === "reason" ? handleClose : () => setStep("reason")}
            disabled={isPending}
          >
            {step === "reason" ? "Cancel" : "Back"}
          </Button>
          <Button
            type="submit"
            variant={step === "review" ? "danger" : "primary"}
            loading={isPending}
          >
            {step === "reason" ? "Review" : "Confirm Suspension"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}
