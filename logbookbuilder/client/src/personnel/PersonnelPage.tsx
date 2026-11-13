import { useEffect, useState } from "react";
import { UserCheck, Plus, X, Search, Link2 } from "lucide-react";
import { personnelApi, usersApi } from "../api/people";
import { useDebounce } from "../shared/hooks/useDebounce";
import { useToast } from "../shared/components/Toast";
import type { Personnel, User } from "../types";

export function PersonnelPage() {
  const toast = useToast();
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [linkTarget, setLinkTarget] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 350);

  function reload() {
    setLoading(true);
    personnelApi
      .list({ search: debouncedSearch || undefined, limit: 50 })
      .then((r) => {
        setPersonnel(r.items);
        setTotal(r.total);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
  }, [debouncedSearch]);

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Personnel</h1>
          <p className="page-subtitle">
            {total} personnel record{total !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={13} /> Add Personnel
        </button>
      </div>

      {showForm && (
        <div className="form-panel">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <p className="section-title" style={{ margin: 0 }}>
              Add Personnel
            </p>
            <button
              onClick={() => setShowForm(false)}
              className="btn btn-ghost btn-sm"
              style={{ padding: "0.2rem" }}
            >
              <X size={14} />
            </button>
          </div>
          <PersonnelForm
            onSuccess={() => {
              setShowForm(false);
              reload();
              toast.success("Personnel record created");
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {linkTarget && (
        <div
          className="form-panel"
          style={{ borderTopColor: "var(--brand-mid)" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <p className="section-title" style={{ margin: 0 }}>
              Link User Account —{" "}
              <span
                style={{
                  textTransform: "none",
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                {linkTarget.name}
              </span>
            </p>
            <button
              onClick={() => setLinkTarget(null)}
              className="btn btn-ghost btn-sm"
              style={{ padding: "0.2rem" }}
            >
              <X size={14} />
            </button>
          </div>
          <LinkUserForm
            personnel={linkTarget}
            onSuccess={() => {
              setLinkTarget(null);
              reload();
              toast.success("Personnel linked to user account");
            }}
            onCancel={() => setLinkTarget(null)}
          />
        </div>
      )}

      <div className="search-wrap">
        <Search size={13} className="search-icon" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search personnel…"
          className="inp"
        />
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : personnel.length === 0 ? (
          <div className="empty">
            <UserCheck size={36} className="empty-icon" />
            <p className="empty-title">No personnel records yet</p>
            <p style={{ fontSize: "0.8rem" }}>
              Personnel can be referenced in log fields without needing system
              login credentials.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID / Identifier</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th style={{ width: 70 }}>Status</th>
                  <th style={{ width: 70 }}>Linked</th>
                  <th style={{ width: 42 }}></th>
                </tr>
              </thead>
              <tbody>
                {personnel.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: "var(--text)" }}>
                      {p.name}
                    </td>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: "var(--muted)",
                      }}
                    >
                      {p.identifier ?? "—"}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {p.role ?? "—"}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {p.department ?? "—"}
                    </td>
                    <td>
                      <span
                        className={`flag-chip ${p.isActive ? "flag-active" : "flag-archived"}`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {p.linkedUserId ? (
                        <span className="flag-chip flag-corrected">Linked</span>
                      ) : (
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>
                          —
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          setLinkTarget(linkTarget?.id === p.id ? null : p)
                        }
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.25rem 0.4rem" }}
                        title="Link to user account"
                      >
                        <Link2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function LinkUserForm({
  personnel,
  onSuccess,
  onCancel,
}: {
  personnel: Personnel;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(
    personnel.linkedUserId ?? "",
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    usersApi
      .list({ limit: 100 })
      .then((r) => setUsers(r.items))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await personnelApi.update(personnel.id, {
        linkedUserId: selectedUserId || null,
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
      {error && <div className="pc-alert pc-alert-error">{error}</div>}
      <div>
        <label className="field-label">System user account</label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="inp"
        >
          <option value="">— No linked user —</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        <p
          style={{ margin: "0.3rem 0 0", fontSize: 11, color: "var(--muted)" }}
        >
          Linking allows this personnel record to be associated with a login
          account for signature fields.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
          paddingTop: "0.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

function PersonnelForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    identifier: "",
    role: "",
    department: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await personnelApi.create(form);
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Failed to create personnel record");
    } finally {
      setSaving(false);
    }
  }

  const FIELDS: Array<{
    label: string;
    field: keyof typeof form;
    required?: boolean;
  }> = [
    { label: "Full Name", field: "name", required: true },
    { label: "Identifier (staff ID)", field: "identifier" },
    { label: "Role / Job Title", field: "role" },
    { label: "Department", field: "department" },
    { label: "Email", field: "email" },
    { label: "Phone", field: "phone" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
      }}
    >
      {error && (
        <div
          className="pc-alert pc-alert-error"
          style={{ gridColumn: "1 / -1" }}
        >
          {error}
        </div>
      )}
      {FIELDS.map(({ label, field, required }) => (
        <div key={field}>
          <label className="field-label">
            {label}
            {required && <span style={{ color: "var(--danger)" }}> *</span>}
          </label>
          <input
            value={form[field]}
            onChange={set(field)}
            required={required}
            className="inp"
          />
        </div>
      ))}
      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
          paddingTop: "0.5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? "Saving…" : "Add Personnel"}
        </button>
      </div>
    </form>
  );
}
