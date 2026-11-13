import { z } from "zod";

export const listLookupsSchema = z.object({
  query: z.object({
    type: z.string().optional(),
    activeOnly: z.coerce.boolean().optional(),
  }),
});

export const createLookupSchema = z.object({
  body: z.object({
    type: z.string().min(1),
    label: z.string().min(1),
    value: z.string().min(1).optional(),
    description: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

export const updateLookupSchema = z.object({
  params: z.object({
    lookupId: z.string().uuid(),
  }),
  body: z.object({
    label: z.string().min(1).optional(),
    value: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    metadata: z.record(z.unknown()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const importLookupsSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        type: z.string().min(1),
        label: z.string().min(1),
        value: z.string().min(1).optional(),
        description: z.string().optional(),
        metadata: z.record(z.unknown()).optional(),
      }),
    ).min(1),
  }),
});
