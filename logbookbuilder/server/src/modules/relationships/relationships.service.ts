import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../../db/index.js";
import { logRelationships, relationshipFieldMappings, logDefinitions, logColumns } from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import type { AuthContext } from "../../types/index.js";

export const createRelationshipSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().max(500).optional(),
  sourceLogId: z.string(),
  targetLogId: z.string(),
  referencingColumnId: z.string().optional(),
  relationshipType: z.enum(["one_to_many", "many_to_one", "one_to_one"]).default("many_to_one"),
  fieldMappings: z.array(z.object({
    sourceColumnId: z.string(),
    targetColumnId: z.string(),
  })).optional(),
});

export const updateRelationshipSchema = createRelationshipSchema.partial().omit({ sourceLogId: true, targetLogId: true });

export async function listRelationshipsService(auth: AuthContext) {
  return db.query.logRelationships.findMany({
    where: eq(logRelationships.organizationId, auth.organizationId),
    with: {
      sourceLog: true,
      targetLog: true,
      fieldMappings: { with: { sourceColumn: true, targetColumn: true } },
    },
  });
}

export async function getRelationshipService(auth: AuthContext, relationshipId: string) {
  const rel = await db.query.logRelationships.findFirst({
    where: and(
      eq(logRelationships.id, relationshipId),
      eq(logRelationships.organizationId, auth.organizationId)
    ),
    with: {
      sourceLog: { with: { columns: true } },
      targetLog: { with: { columns: true } },
      fieldMappings: { with: { sourceColumn: true, targetColumn: true } },
    },
  });
  if (!rel) throw new Error("Relationship not found");
  return rel;
}

export async function createRelationshipService(
  auth: AuthContext,
  input: z.infer<typeof createRelationshipSchema>
) {
  // Verify both logs belong to this organization
  const [sourceLog, targetLog] = await Promise.all([
    db.query.logDefinitions.findFirst({
      where: and(eq(logDefinitions.id, input.sourceLogId), eq(logDefinitions.organizationId, auth.organizationId)),
    }),
    db.query.logDefinitions.findFirst({
      where: and(eq(logDefinitions.id, input.targetLogId), eq(logDefinitions.organizationId, auth.organizationId)),
    }),
  ]);
  if (!sourceLog) throw new Error("Source log not found");
  if (!targetLog) throw new Error("Target log not found");
  if (input.sourceLogId === input.targetLogId) throw new Error("A log cannot reference itself");

  const [rel] = await db.insert(logRelationships).values({
    organizationId: auth.organizationId,
    name: input.name,
    description: input.description,
    sourceLogId: input.sourceLogId,
    targetLogId: input.targetLogId,
    referencingColumnId: input.referencingColumnId,
    relationshipType: input.relationshipType,
    createdById: auth.userId,
  }).returning();

  if (input.fieldMappings && input.fieldMappings.length > 0) {
    await db.insert(relationshipFieldMappings).values(
      input.fieldMappings.map((m) => ({
        relationshipId: rel.id,
        organizationId: auth.organizationId,
        sourceColumnId: m.sourceColumnId,
        targetColumnId: m.targetColumnId,
      }))
    );
  }

  auditAsync({
    auth,
    eventType: "relationship_created",
    entityType: "log_relationship",
    entityId: rel.id,
    summary: `Relationship "${rel.name}" created between "${sourceLog.name}" and "${targetLog.name}"`,
    newState: rel,
  });

  return getRelationshipService(auth, rel.id);
}

export async function updateRelationshipService(
  auth: AuthContext,
  relationshipId: string,
  input: z.infer<typeof updateRelationshipSchema>
) {
  const rel = await db.query.logRelationships.findFirst({
    where: and(
      eq(logRelationships.id, relationshipId),
      eq(logRelationships.organizationId, auth.organizationId)
    ),
  });
  if (!rel) throw new Error("Relationship not found");

  const { fieldMappings, ...relFields } = input;

  const [updated] = await db.update(logRelationships)
    .set({ ...relFields, updatedAt: new Date() })
    .where(eq(logRelationships.id, relationshipId))
    .returning();

  if (fieldMappings !== undefined) {
    await db.delete(relationshipFieldMappings)
      .where(eq(relationshipFieldMappings.relationshipId, relationshipId));

    if (fieldMappings.length > 0) {
      await db.insert(relationshipFieldMappings).values(
        fieldMappings.map((m) => ({
          relationshipId,
          organizationId: auth.organizationId,
          sourceColumnId: m.sourceColumnId,
          targetColumnId: m.targetColumnId,
        }))
      );
    }
  }

  auditAsync({
    auth,
    eventType: "relationship_updated",
    entityType: "log_relationship",
    entityId: relationshipId,
    summary: `Relationship "${rel.name}" updated`,
    previousState: rel,
    newState: updated,
  });

  return getRelationshipService(auth, relationshipId);
}

export async function deleteRelationshipService(auth: AuthContext, relationshipId: string) {
  const rel = await db.query.logRelationships.findFirst({
    where: and(
      eq(logRelationships.id, relationshipId),
      eq(logRelationships.organizationId, auth.organizationId)
    ),
  });
  if (!rel) throw new Error("Relationship not found");

  await db.delete(logRelationships).where(eq(logRelationships.id, relationshipId));

  auditAsync({
    auth,
    eventType: "relationship_deleted",
    entityType: "log_relationship",
    entityId: relationshipId,
    summary: `Relationship "${rel.name}" deleted`,
    previousState: rel,
  });
}
