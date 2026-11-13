import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

/**
 * AuditService — append-only audit trail.
 *
 * Spec §44:
 * - Audit events are append-only.
 * - No API should update/delete an audit event.
 * - All significant regulatory operations must produce audit events.
 * - Spec §41: Super Admin actions must be attributable to a specific user.
 */

export type AuditEventType =
  | "CREATE_APPLICATION"
  | "UPDATE_APPLICATION"
  | "CREATE_SUBMISSION"
  | "CREATE_SUBMISSION_UNIT"
  | "FREEZE_SUBMISSION_UNIT"
  | "UPLOAD_DOCUMENT"
  | "CREATE_DOCUMENT_VERSION"
  | "REUSE_DOCUMENT"
  | "SUSPEND_CONTEXT"
  | "REPLACE_CONTEXT"
  | "RUN_VALIDATION"
  | "GENERATE_XML"
  | "PUBLISH_SUBMISSION_UNIT"
  | "INVALIDATE_PACKAGE"
  | "IMPORT_REGULATORY_PACKAGE"
  | "ACTIVATE_REGULATORY_PACKAGE"
  | "LOGIN"
  | "LOGOUT"
  | "CREATE_ORGANIZATION"
  | "UPDATE_ORGANIZATION"
  | "CREATE_USER"
  | "UPDATE_USER_ROLE";

export interface RecordAuditEventInput {
  organizationId: string;
  userId?: string | undefined;
  eventType: AuditEventType;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, unknown> | undefined;
  newValue?: Record<string, unknown> | undefined;
  metadata?: Record<string, unknown> | undefined;
  correlationId?: string | undefined;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Record an audit event. This is append-only — never updates or deletes.
   */
  async record(input: RecordAuditEventInput): Promise<void> {
    try {
      await this.prisma.auditEvent.create({
        data: {
          organizationId: input.organizationId,
          userId: input.userId ?? null,
          eventType: input.eventType,
          entityType: input.entityType,
          entityId: input.entityId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          oldValue: (input.oldValue ?? undefined) as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          newValue: (input.newValue ?? undefined) as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          metadata: (input.metadata ?? undefined) as any,
          correlationId: input.correlationId ?? null,
          timestamp: new Date(),
        },
      });
    } catch (err) {
      // Audit failures must be logged but must NOT silently suppress the
      // original operation. Log the failure and continue.
      this.logger.error({
        event: "AUDIT_WRITE_FAILED",
        entityType: input.entityType,
        entityId: input.entityId,
        eventType: input.eventType,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
