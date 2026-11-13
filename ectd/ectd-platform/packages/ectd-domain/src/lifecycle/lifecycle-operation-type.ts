/**
 * Lifecycle operation types — spec §15
 *
 * Lifecycle operations occur at Context of Use level.
 * Do NOT implement lifecycle mutation through generic CRUD PATCH operations.
 * Use explicit domain commands.
 */
export const LifecycleOperationType = {
  SUSPEND: "SUSPEND",
  REPLACE: "REPLACE",
  REUSE_DOCUMENT: "REUSE_DOCUMENT",
  /**
   * REGULATORY_GAP: changeContextGroup — confirm allowed under ICH v4.0 IG v1.7
   * before implementing. Do not invent this behavior.
   */
  CHANGE_CONTEXT_GROUP: "CHANGE_CONTEXT_GROUP",
} as const;

export type LifecycleOperationType =
  (typeof LifecycleOperationType)[keyof typeof LifecycleOperationType];
