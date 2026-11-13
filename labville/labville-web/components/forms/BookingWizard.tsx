"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, ChevronLeft, ChevronRight, Edit2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { services } from "@/data/services";
import type { BookingState, ServiceId, ContactInfo } from "@/types";
import { cn } from "@/lib/utils";

// ─── Contact Info Schema ─────────────────────────────────────────────────────
const contactInfoSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone required"),
  notes: z.string().optional(),
});

type ContactInfoForm = z.infer<typeof contactInfoSchema>;

// ─── Constants ───────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  "8:00 AM",
  "10:00 AM",
  "12:00 PM",
  "2:00 PM",
  "4:00 PM",
  "6:00 PM",
];

const STEP_LABELS = [
  "Service",
  "Collection",
  "Date",
  "Time",
  "Contact",
  "Review",
];

// ─── Step progress indicator ─────────────────────────────────────────────────
function StepProgress({ current }: { current: number }) {
  return (
    <nav
      aria-label="Booking progress"
      className="flex items-center gap-3 mb-10"
    >
      {STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isCompleted = step < current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <span
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  isActive && "bg-accent-blue text-white",
                  isCompleted && "bg-accent-cyan/30 text-accent-cyan",
                  !isActive && !isCompleted && "bg-white/10 text-text-muted",
                )}
              >
                {step}
              </span>
              <span className="text-[10px] text-text-muted hidden sm:block">
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                aria-hidden="true"
                className={cn(
                  "flex-1 h-px w-4 sm:w-8 transition-colors",
                  isCompleted ? "bg-accent-cyan/40" : "bg-white/10",
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ─── Step 1: Service Category ─────────────────────────────────────────────────
function StepServiceCategory({
  value,
  onChange,
}: {
  value: ServiceId | null;
  onChange: (id: ServiceId) => void;
}) {
  return (
    <div>
      <h2 className="text-heading-md font-semibold text-white mb-6">
        Select a diagnostic service
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => onChange(service.id)}
            className={cn(
              "bg-bg-elevated border rounded-xl p-5 text-left transition-all duration-200 hover:border-accent-blue/50",
              value === service.id
                ? "border-accent-blue bg-accent-blue/10"
                : "border-white/[0.08]",
            )}
          >
            <Badge variant="science" className="mb-3 text-[10px]">
              {service.shortName}
            </Badge>
            <p className="text-sm font-semibold text-white leading-snug">
              {service.name}
            </p>
            <p className="text-xs text-text-muted mt-1">{service.tagline}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Collection Method ─────────────────────────────────────────────────
function StepCollectionMethod({
  value,
  onChange,
}: {
  value: "centre" | "home" | null;
  onChange: (m: "centre" | "home") => void;
}) {
  const options: {
    id: "centre" | "home";
    title: string;
    description: string;
  }[] = [
    {
      id: "centre",
      title: "Visit Centre",
      description:
        "Come to our diagnostic centre in Ikorodu, Lagos for your sample collection.",
    },
    {
      id: "home",
      title: "Home Collection",
      description:
        "A trained Labville professional visits your location to collect your sample.",
    },
  ];
  return (
    <div>
      <h2 className="text-heading-md font-semibold text-white mb-6">
        How would you like your sample collected?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "bg-bg-elevated border rounded-xl p-8 text-left transition-all duration-200 hover:border-accent-blue/50",
              value === opt.id
                ? "border-accent-blue bg-accent-blue/10"
                : "border-white/[0.08]",
            )}
          >
            <h3 className="text-heading-md font-semibold text-white mb-2">
              {opt.title}
            </h3>
            <p className="text-body-sm text-text-secondary">
              {opt.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Preferred Date ─────────────────────────────────────────────────
function StepPreferredDate({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (d: string) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div>
      <h2 className="text-heading-md font-semibold text-white mb-6">
        Choose a preferred date
      </h2>
      <label htmlFor="preferred-date" className="sr-only">
        Preferred date
      </label>
      <input
        id="preferred-date"
        type="date"
        min={today}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-bg-elevated border border-white/[0.12] rounded-lg px-4 py-3 text-white focus:border-accent-blue/60 focus:outline-none transition-colors w-full max-w-xs"
      />
    </div>
  );
}

// ─── Step 4: Preferred Time ─────────────────────────────────────────────────
function StepPreferredTime({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (t: string) => void;
}) {
  return (
    <div>
      <h2 className="text-heading-md font-semibold text-white mb-6">
        Choose a preferred time
      </h2>
      <div className="flex flex-wrap gap-3">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => onChange(slot)}
            className={cn(
              "px-5 py-3 rounded-lg border text-sm font-medium transition-all duration-200",
              value === slot
                ? "border-accent-blue bg-accent-blue/10 text-white"
                : "border-white/[0.12] bg-bg-elevated text-text-secondary hover:border-accent-blue/40",
            )}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 5: Contact Info ─────────────────────────────────────────────────────
function StepContactInfo({
  defaultValues,
  onValid,
}: {
  defaultValues?: ContactInfo | null;
  onValid: (data: ContactInfo) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactInfoForm>({
    resolver: zodResolver(contactInfoSchema),
    mode: "onChange",
    defaultValues: defaultValues ?? {},
  });

  const inputClasses =
    "w-full bg-bg-elevated border border-white/[0.12] rounded-lg px-4 py-3 text-white placeholder:text-text-muted focus:border-accent-blue/60 focus:outline-none transition-colors";

  return (
    <form
      id="contact-info-form"
      onSubmit={handleSubmit((d) => onValid(d))}
      noValidate
    >
      <h2 className="text-heading-md font-semibold text-white mb-6">
        Your contact details
      </h2>

      <div className="flex flex-col gap-1.5 mb-6">
        <label
          htmlFor="wizard-name"
          className="text-sm font-medium text-text-secondary"
        >
          Full Name
        </label>
        <input
          id="wizard-name"
          type="text"
          placeholder="Your full name"
          className={inputClasses}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-400 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label
          htmlFor="wizard-email"
          className="text-sm font-medium text-text-secondary"
        >
          Email Address
        </label>
        <input
          id="wizard-email"
          type="email"
          placeholder="your@email.com"
          className={inputClasses}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label
          htmlFor="wizard-phone"
          className="text-sm font-medium text-text-secondary"
        >
          Phone Number
        </label>
        <input
          id="wizard-phone"
          type="tel"
          placeholder="+234 000 0000 000"
          className={inputClasses}
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-red-400 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label
          htmlFor="wizard-notes"
          className="text-sm font-medium text-text-secondary"
        >
          Additional Notes (optional)
        </label>
        <textarea
          id="wizard-notes"
          rows={3}
          placeholder="Any relevant notes…"
          className={inputClasses}
          {...register("notes")}
        />
      </div>

      {/* Hidden submit — triggered by parent Next button */}
      <button
        type="submit"
        id="submit-contact-info"
        className="hidden"
        aria-hidden="true"
      />

      {!isValid && (
        <p className="text-text-muted text-sm mt-2">
          Please complete all required fields to continue.
        </p>
      )}
    </form>
  );
}

// ─── Step 6: Review ───────────────────────────────────────────────────────────
function StepReview({
  state,
  onEdit,
  onConfirm,
}: {
  state: BookingState;
  onEdit: (step: number) => void;
  onConfirm: () => void;
}) {
  const service = services.find((s) => s.id === state.serviceCategory);
  const isSubmitting = state.status === "submitting";

  const rows = [
    { label: "Service", value: service?.name ?? "—", step: 1 },
    {
      label: "Collection",
      value:
        state.collectionMethod === "centre"
          ? "Visit Centre"
          : "Home Collection",
      step: 2,
    },
    { label: "Date", value: state.preferredDate ?? "—", step: 3 },
    { label: "Time", value: state.preferredTime ?? "—", step: 4 },
    { label: "Name", value: state.contactInfo?.name ?? "—", step: 5 },
    { label: "Email", value: state.contactInfo?.email ?? "—", step: 5 },
    { label: "Phone", value: state.contactInfo?.phone ?? "—", step: 5 },
  ];

  return (
    <div>
      <h2 className="text-heading-md font-semibold text-white mb-6">
        Review your booking
      </h2>
      <div className="bg-bg-elevated border border-white/[0.08] rounded-xl overflow-hidden mb-8">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center justify-between px-6 py-4",
              i < rows.length - 1 && "border-b border-white/[0.06]",
            )}
          >
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest">
                {row.label}
              </p>
              <p className="text-white text-body-md mt-0.5">{row.value}</p>
            </div>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              className="text-accent-cyan hover:text-white transition-colors"
              aria-label={`Edit ${row.label}`}
            >
              <Edit2 size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <Button
        variant="science"
        size="lg"
        fullWidth
        disabled={isSubmitting}
        onClick={onConfirm}
      >
        {isSubmitting ? "Confirming…" : "Confirm Booking"}
      </Button>
    </div>
  );
}

// ─── Step 7: Confirmation ─────────────────────────────────────────────────────
function StepConfirmation({ reference }: { reference: string }) {
  return (
    <div className="flex flex-col items-center text-center py-10 gap-6">
      <CheckCircle size={56} className="text-accent-cyan" aria-hidden="true" />
      <div>
        <h2 className="text-heading-md font-semibold text-white mb-2">
          Booking confirmed
        </h2>
        <p className="text-text-secondary text-body-md">
          Your reference number:
        </p>
        <p className="text-2xl font-bold text-accent-cyan mt-2 tracking-widest">
          {reference}
        </p>
      </div>

      <ul className="text-left space-y-3 text-body-sm text-text-secondary max-w-sm w-full">
        <li className="flex items-start gap-2">
          <span className="text-accent-cyan mt-0.5">✓</span>
          We will contact you to confirm your appointment details.
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent-cyan mt-0.5">✓</span>
          Preparation instructions will be sent to your email.
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent-cyan mt-0.5">✓</span>
          Please arrive 10 minutes before your scheduled time.
        </li>
        <li className="flex items-start gap-2">
          <span className="text-accent-cyan mt-0.5">✓</span>
          For queries, call us on 07034888629.
        </li>
      </ul>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────
export default function BookingWizard() {
  const [state, setState] = useState<
    BookingState & { bookingReference: string }
  >({
    step: 1,
    serviceCategory: null,
    specificTest: null,
    collectionMethod: null,
    preferredDate: null,
    preferredTime: null,
    contactInfo: null,
    status: "idle",
    bookingReference: "",
  });

  const update = (patch: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const goTo = (step: BookingState["step"]) => update({ step });
  const next = () =>
    update({ step: Math.min(state.step + 1, 7) as BookingState["step"] });
  const back = () =>
    update({ step: Math.max(state.step - 1, 1) as BookingState["step"] });

  // Determine whether the Next button is enabled for current step
  const canAdvance = () => {
    switch (state.step) {
      case 1:
        return !!state.serviceCategory;
      case 2:
        return !!state.collectionMethod;
      case 3:
        return !!state.preferredDate;
      case 4:
        return !!state.preferredTime;
      default:
        return true;
    }
  };

  const handleContactInfoValid = (data: ContactInfo) => {
    update({ contactInfo: data });
    next();
  };

  const handleConfirm = async () => {
    update({ status: "submitting" });
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceCategory: state.serviceCategory,
          collectionMethod: state.collectionMethod,
          preferredDate: state.preferredDate,
          preferredTime: state.preferredTime,
          contactInfo: state.contactInfo,
        }),
      });
      const json = (await res.json()) as { ok: boolean; reference?: string };
      if (json.ok && json.reference) {
        update({
          status: "success",
          bookingReference: json.reference,
          step: 7,
        });
      } else {
        update({ status: "error" });
      }
    } catch {
      update({ status: "error" });
    }
  };

  // Only show progress bar for steps 1-6
  const showProgress = state.step <= 6;

  return (
    <div className="max-w-2xl">
      {showProgress && <StepProgress current={state.step} />}

      {/* Step content */}
      {state.step === 1 && (
        <StepServiceCategory
          value={state.serviceCategory}
          onChange={(id) => update({ serviceCategory: id })}
        />
      )}
      {state.step === 2 && (
        <StepCollectionMethod
          value={state.collectionMethod}
          onChange={(m) => update({ collectionMethod: m })}
        />
      )}
      {state.step === 3 && (
        <StepPreferredDate
          value={state.preferredDate}
          onChange={(d) => update({ preferredDate: d })}
        />
      )}
      {state.step === 4 && (
        <StepPreferredTime
          value={state.preferredTime}
          onChange={(t) => update({ preferredTime: t })}
        />
      )}
      {state.step === 5 && (
        <StepContactInfo
          defaultValues={state.contactInfo}
          onValid={handleContactInfoValid}
        />
      )}
      {state.step === 6 && (
        <StepReview
          state={state}
          onEdit={(s) => goTo(s as BookingState["step"])}
          onConfirm={handleConfirm}
        />
      )}
      {state.step === 7 && (
        <StepConfirmation reference={state.bookingReference} />
      )}

      {/* Navigation */}
      {state.step <= 5 && (
        <div className="flex items-center gap-4 mt-10">
          {state.step > 1 && (
            <Button variant="outline" size="md" onClick={back}>
              <ChevronLeft size={16} aria-hidden="true" />
              Back
            </Button>
          )}

          {state.step < 5 && (
            <Button
              variant="science"
              size="md"
              onClick={next}
              disabled={!canAdvance()}
            >
              Next
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          )}

          {state.step === 5 && (
            <Button
              variant="science"
              size="md"
              type="submit"
              form="contact-info-form"
              onClick={() => {
                // Trigger the hidden submit button to validate & advance
                document.getElementById("submit-contact-info")?.click();
              }}
            >
              Next
              <ChevronRight size={16} aria-hidden="true" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
