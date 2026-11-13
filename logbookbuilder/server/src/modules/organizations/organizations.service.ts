import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { organizations } from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import type { AuthContext } from "../../types/index.js";

export const updateOrgSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional().nullable(),
});

export async function getOrganizationService(auth: AuthContext) {
  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, auth.organizationId),
  });
  if (!org) throw new Error("Organization not found");
  return org;
}

export async function updateOrganizationService(
  auth: AuthContext,
  input: z.infer<typeof updateOrgSchema>
) {
  const org = await db.query.organizations.findFirst({
    where: eq(organizations.id, auth.organizationId),
  });
  if (!org) throw new Error("Organization not found");

  const [updated] = await db.update(organizations)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(organizations.id, auth.organizationId))
    .returning();

  auditAsync({
    auth,
    eventType: "org_updated",
    entityType: "organization",
    entityId: org.id,
    summary: `Organization "${org.name}" updated`,
    previousState: org,
    newState: updated,
  });

  return updated;
}
