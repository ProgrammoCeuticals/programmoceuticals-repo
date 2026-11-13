import { z } from "zod";

export const registerApplicantSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8),
    companyName: z.string().min(2),
    contactPersonName: z.string().optional(),
    contactPersonTitle: z.string().optional(),
    companyEmail: z.string().email().optional(),
    companyPhone: z.string().optional(),
    companyAddress: z.string().optional(),
    rcNumber: z.string().optional(),
    marketAuthorisationHolder: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});
