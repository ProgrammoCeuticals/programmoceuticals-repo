"use client";

import { use, useState } from "react";
import { useApplicationAudit, useApplication } from "@/lib/api/queries";
import { AuditEventRow } from "@/components/domain/audit/AuditEventRow";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

// All known event types — matches AuditService on the backend
const EVENT_TYPE_OPTIONS = [
  "CREATE_APPLICATION",
  "UPDATE_APPLICATION",
  "CREATE_SUBMISSION",
  "CREATE_SUBMISSION_UNIT",
  "FREEZE_SUBMISSION_UNIT",
  "UPLOAD_DOCUMENT",
  "CREATE_DOCUMENT_VERSION",
  "REUSE_DOCUMENT",
  "SUSPEND_CONTEXT",
  "REPLACE_CONTEXT",
  "RUN_VALIDATION",
  "GENERATE_XML",
  "PUBLISH_SUBMISSION_UNIT",
  "INVALIDATE_PACKAGE",
  "IMPORT_REGULATORY_PACKAGE",
  "ACTIVATE_REGULATORY_PACKAGE",
  "LOGIN",
  "LOGOUT",
  "CREATE_ORGANIZATION",
  "UPDATE_ORGANIZATION",
  "CREATE_USER",
  "UPDATE_USER_ROLE",
] as const;

const PAGE_SIZE = 25;

export default function AuditPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = use(params);
  const { data: app } = useApplication(applicationId);

  const [page, setPage] = useState(1);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("");

  const { data, isLoading, isError, refetch } = useApplicationAudit(
    applicationId,
    page,
    PAGE_SIZE,
  );

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  // Client-side filter on top of paginated results
  const filtered = eventTypeFilter
    ? (data?.data ?? []).filter((e) => e.eventType === eventTypeFilter)
    : (data?.data ?? []);

  return (
    <>
      <Breadcrumbs
        segments={[
          { label: "Applications", href: "/applications" },
          {
            label: app?.applicationNumber ?? applicationId,
            href: `/applications/${applicationId}`,
          },
          { label: "Audit" },
        ]}
        className="mb-4"
      />

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Audit Trail</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <ShieldCheck className="h-4 w-4 text-green-500" aria-hidden="true" />
            Append-only — no events can be edited or deleted.
          </p>
        </div>
        {data && (
          <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {data.total.toLocaleString()} total events
          </span>
        )}
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div>
          <label htmlFor="event-type-filter" className="sr-only">
            Filter by event type
          </label>
          <select
            id="event-type-filter"
            value={eventTypeFilter}
            onChange={(e) => {
              setEventTypeFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All event types</option>
            {EVENT_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        {eventTypeFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEventTypeFilter("")}
          >
            Clear filter
          </Button>
        )}
      </div>

      {isLoading && <LoadingSkeleton rows={6} />}
      {isError && (
        <ErrorState
          message="Could not load audit events."
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          title="No audit events"
          description={
            eventTypeFilter
              ? `No events of type "${eventTypeFilter}" on this page.`
              : "No audit events recorded yet."
          }
        />
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm" aria-label="Audit trail">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="w-8 px-2 py-3" aria-label="Expand" />
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date / Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Event
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Entity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actor
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <AuditEventRow key={event.id} event={event} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
