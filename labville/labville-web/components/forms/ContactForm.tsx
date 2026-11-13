"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone required"),
  subject: z.string().min(3, "Subject required"),
  message: z.string().min(10, "Please write at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const inputClasses =
  "w-full bg-bg-elevated border border-white/[0.12] rounded-lg px-4 py-3 text-white placeholder:text-text-muted focus:border-accent-blue/60 focus:outline-none transition-colors";

const fieldClass = "flex flex-col gap-1.5 mb-6";
const labelClass = "text-sm font-medium text-text-secondary";
const errorClass = "text-red-400 text-sm";

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center py-16 gap-4">
        <CheckCircle
          size={48}
          className="text-accent-cyan"
          aria-hidden="true"
        />
        <h3 className="text-heading-md font-semibold text-white">
          Message sent
        </h3>
        <p className="text-body-md text-text-secondary max-w-sm">
          Thank you for reaching out. A member of our team will be in touch with
          you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={fieldClass}>
        <label htmlFor="name" className={labelClass}>
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your full name"
          className={inputClasses}
          {...register("name")}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className={fieldClass}>
        <label htmlFor="email" className={labelClass}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com"
          className={inputClasses}
          {...register("email")}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div className={fieldClass}>
        <label htmlFor="phone" className={labelClass}>
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="+234 000 0000 000"
          className={inputClasses}
          {...register("phone")}
        />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      <div className={fieldClass}>
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <select id="subject" className={inputClasses} {...register("subject")}>
          <option value="">Select a subject</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Book a Test">Book a Test</option>
          <option value="Corporate Health">Corporate Health</option>
          <option value="Home Collection">Home Collection</option>
          <option value="Careers">Careers</option>
          <option value="Other">Other</option>
        </select>
        {errors.subject && (
          <p className={errorClass}>{errors.subject.message}</p>
        )}
      </div>

      <div className={fieldClass}>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="How can we help you?"
          className={inputClasses}
          {...register("message")}
        />
        {errors.message && (
          <p className={errorClass}>{errors.message.message}</p>
        )}
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm mb-4">
          Something went wrong. Please try again.
        </p>
      )}

      <Button
        type="submit"
        variant="science"
        size="lg"
        fullWidth
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
