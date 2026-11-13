import { useEffect, useState } from "react";
import { ClipboardList, ChevronLeft, ChevronRight } from "lucide-react";
import { auditApi } from "../api/audit";
import { useDebounce } from "../shared/hooks/useDebounce";
import type { AuditEvent } from "../types";

const EVENT_TYPE_GROUPS: Record<string, string[]> = {
  Authentication: [
    "user_registered",
    "user_login",
    "user_logout",
    "user_login_failed",
    "token_refreshed",
  ],
  Logs: [
    "log_created",
    "log_updated",
    "log_published",
    "log_archived",
    "column_added",
    "column_updated",
    "column_removed",
    "columns_reordered",
  ],
  Records: [
    "record_created",
    "record_updated",
    "record_corrected",
    "record_voided",
    "record_archived",
  ],
  Signatures: ["record_signed"],
  Files: ["file_uploaded", "file_deleted"],
  Relationships: [
    "relationship_created",
    "relationship_updated",
    "relationship_deleted",
  ],
  Users: ["user_created", "user_updated", "user_deactivated"],
  Personnel: [
    "personnel_created",
    "personnel_updated",
    "personnel_deactivated",
  ],
  Export: ["log_exported"],
};

export function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [eventType, setEventType] = useState("");
  const [userId, setUserId] = useState("");

  const debouncedUserId = useDebounce(userId, 400);

  useEffect(() => {
    setPage(1);
  }, [eventType, debouncedUserId]);

  useEffect(() => {
    setLoading(true);
    auditApi
      .list({
        page,
        limit: 30,
        eventType: eventType || undefined,
        userId: debouncedUserId || undefined,
      })
      .then((r) => {
        setEvents(r.items);
        setTotal(r.total);
      })
      .finally(() => setLoading(false));
  }, [page, eventType, debouncedUserId]);

  const totalPages = Math.ceil(total / 30);

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Trail</h1>
          <p className="page-subtitle">
            {total} event{total !== 1 ? "s" : ""} — append-only log
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "0.65rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="inp"
          style={{ width: "auto", minWidth: 210 }}
        >
          <option value="">All event types</option>
          {Object.entries(EVENT_TYPE_GROUPS).map(([group, types]) => (
            <optgroup key={group} label={group}>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Filter by user ID…"
          className="inp"
          style={{ maxWidth: 240 }}
        />
        {(eventType || userId) && (
          <button
            onClick={() => {
              setEventType("");
              setUserId("");
            }}
            className="btn btn-secondary btn-sm"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : events.length === 0 ? (
          <div className="empty">
            <ClipboardList size={36} className="empty-icon" />
            <p className="empty-title">No audit events found</p>
            <p style={{ fontSize: "0.8rem" }}>
              {eventType || userId
                ? "Try clearing your filters."
                : "Events are recorded automatically as users interact with the system."}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th style={{ width: 140 }}>Timestamp</th>
                  <th style={{ width: 180 }}>Event Type</th>
                  <th>Summary</th>
                  <th style={{ width: 120 }}>User</th>
                  <th style={{ width: 140 }}>Entity</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                        color: "var(--muted)",
                      }}
                    >
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span
                        className="flag-chip"
                        style={{
                          background: "var(--brand-light)",
                          color: "var(--brand)",
                          fontFamily: "monospace",
                          textTransform: "none",
                          letterSpacing: 0,
                          fontSize: 11,
                        }}
                      >
                        {e.eventType}
                      </span>
                    </td>
                    <td
                      style={{
                        color: "var(--text)",
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.summary}
                    </td>
                    <td style={{ fontSize: 11, color: "var(--muted)" }}>
                      {e.user?.name ?? "—"}
                    </td>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        color: "var(--muted)",
                      }}
                    >
                      {e.entityId
                        ? `${e.entityType} ${e.entityId.slice(0, 8)}…`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <span>
              Page {page} of {totalPages} · {total} events
            </span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="pag-btn"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="pag-btn"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
