import { eq, inArray } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import { applications, auditLogs, lookupItems, productClassifications } from "../db/schema.js";
import { HttpError, asyncHandler } from "../utils/http.js";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const rankMatch = (query: string, candidate: string) => {
  const q = normalize(query);
  const c = normalize(candidate);
  if (!q || !c) return 0;
  if (c === q) return 100;
  if (c.startsWith(q)) return 80;
  if (c.includes(q)) return 60;
  if (q.includes(c)) return 50;
  return 0;
};

export const getClassification = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const [classification] = await db
    .select()
    .from(productClassifications)
    .where(eq(productClassifications.applicationId, applicationId))
    .limit(1);

  res.json({ classification: classification ?? null });
});

export const upsertClassification = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!application) throw new HttpError(404, "Application not found");

  const classifiableStatuses = [
    "under_admin_screening",
    "resubmitted_after_compliance_directive",
    "submitted",
    "classified",
  ];
  if (!classifiableStatuses.includes(application.currentStatus)) {
    throw new HttpError(409, "Application cannot be classified at its current status");
  }

  const existing = await db
    .select({ id: productClassifications.id })
    .from(productClassifications)
    .where(eq(productClassifications.applicationId, applicationId))
    .limit(1);

  let classification;

  if (existing.length > 0) {
    [classification] = await db
      .update(productClassifications)
      .set({
        ...req.body,
        classifiedByUserId: req.user!.id,
        classifiedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(productClassifications.applicationId, applicationId))
      .returning();
  } else {
    [classification] = await db
      .insert(productClassifications)
      .values({
        applicationId,
        ...req.body,
        classifiedByUserId: req.user!.id,
        classifiedAt: new Date(),
      })
      .returning();
  }

  await db
    .update(applications)
    .set({ currentStatus: "classified", updatedAt: new Date() })
    .where(eq(applications.id, applicationId));

  await db.insert(auditLogs).values({
    applicationId,
    actorUserId: req.user!.id,
    action: "product_classified",
    entityType: "product_classification",
    entityId: classification.id,
    metadata: {},
  });

  res.json({ classification });
});

export const getClassificationSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const productName = String(req.query.productName);

  const references = await db
    .select()
    .from(lookupItems)
    .where(inArray(lookupItems.type, ["nti_drug", "product_classification_reference"]));

  const ntiMatches = references
    .filter((item) => item.type === "nti_drug")
    .map((item) => ({ item, score: rankMatch(productName, item.label) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
    .slice(0, 10);

  const bcsMatches = references
    .filter((item) => item.type === "product_classification_reference")
    .map((item) => ({ item, score: rankMatch(productName, item.label) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
    .slice(0, 10);

  const bestNti = ntiMatches[0];
  const bestBcs = bcsMatches[0];
  const bcsMetadata = (bestBcs?.item.metadata ?? {}) as { bcsClass?: string; rawBcsClass?: string };

  res.json({
    productName,
    therapeuticIndexClass: bestNti ? "NTI" : "Non-NTI",
    bcsClass: bcsMetadata.bcsClass ?? "Unknown",
    rawBcsClass: bcsMetadata.rawBcsClass ?? null,
    matchedNtiProduct: bestNti?.item.label ?? null,
    matchedBcsProduct: bestBcs?.item.label ?? null,
    matches: {
      nti: ntiMatches.map((match) => ({
        productName: match.item.label,
        score: match.score,
      })),
      bcs: bcsMatches.map((match) => ({
        productName: match.item.label,
        bcsClass: ((match.item.metadata ?? {}) as { bcsClass?: string }).bcsClass ?? "Unknown",
        rawBcsClass: ((match.item.metadata ?? {}) as { rawBcsClass?: string }).rawBcsClass ?? null,
        score: match.score,
      })),
    },
  });
});
