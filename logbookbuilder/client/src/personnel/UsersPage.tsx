import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  X,
  Search,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usersApi } from "../api/people";
import { useDebounce } from "../shared/hooks/useDebounce";
import { useToast } from "../shared/components/Toast";
import type { User } from "../types";

export function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [changePwUser, setChangePwUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 350);

  function reload() {
    setLoading(true);
    usersApi
      .list({ search: debouncedSearch || undefined, limit: 50 })
      .then((r) => {
        setUsers(r.items);
        setTotal(r.total);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
  }, [debouncedSearch]);

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">
            {total} system user{total !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={13} /> Add User
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
              Add User
            </p>
            <button
              onClick={() => setShowForm(false)}
              className="btn btn-ghost btn-sm"
              style={{ padding: "0.2rem" }}
            >
              <X size={14} />
            </button>
          </div>
          <UserForm
            onSuccess={() => {
              setShowForm(false);
              reload();
              toast.success("User created");
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {changePwUser && (
        <div className="form-panel" style={{ borderTopColor: "var(--warn)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <p className="section-title" style={{ margin: 0 }}>
              Change Password —{" "}
              <span
                style={{
                  textTransform: "none",
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                {changePwUser.name}
              </span>
            </p>
            <button
              onClick={() => setChangePwUser(null)}
              className="btn btn-ghost btn-sm"
              style={{ padding: "0.2rem" }}
            >
              <X size={14} />
            </button>
          </div>
          <ChangePasswordForm
            onSuccess={() => {
              setChangePwUser(null);
              toast.success("Password changed");
            }}
            onCancel={() => setChangePwUser(null)}
          />
        </div>
      )}

      <div className="search-wrap">
        <Search size={13} className="search-icon" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users…"
          className="inp"
        />
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : users.length === 0 ? (
          <div className="empty">
            <Users size={36} className="empty-icon" />
            <p className="empty-title">No users found</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th style={{ width: 80 }}>Status</th>
                  <th style={{ width: 140 }}>Last Login</th>
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, color: "var(--text)" }}>
                      {u.name}
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{u.email}</td>
                    <td>
                      <StatusChip status={u.status} />
                    </td>
                    <td style={{ fontSize: 11, color: "var(--muted)" }}>
                      {u.lastLoginAt
                        ? new Date(u.lastLoginAt).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          setChangePwUser(changePwUser?.id === u.id ? null : u)
                        }
                        className="btn btn-secondary btn-sm"
                        title="Change password"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <KeyRound size={11} />
                        {changePwUser?.id === u.id ? (
                          <ChevronUp size={10} />
                        ) : (
                          <ChevronDown size={10} />
                        )}
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

function UserForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await usersApi.create(form);
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Failed to create user");
    } finally {
      setSaving(false);
    }
  }

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
      {[
        { label: "Full Name", field: "name" as const, type: "text" },
        { label: "Email", field: "email" as const, type: "email" },
        { label: "Password", field: "password" as const, type: "password" },
      ].map(({ label, field, type }) => (
        <div key={field}>
          <label className="field-label">
            {label} <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            type={type}
            value={form[field]}
            onChange={(e) =>
              setForm((f) => ({ ...f, [field]: e.target.value }))
            }
            required
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
          {saving ? "Creating…" : "Create User"}
        </button>
      </div>
    </form>
  );
}

function ChangePasswordForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      setError("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await usersApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
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
      {[
        { label: "Current Password", field: "currentPassword" as const },
        { label: "New Password", field: "newPassword" as const },
        { label: "Confirm New", field: "confirm" as const },
      ].map(({ label, field }) => (
        <div key={field}>
          <label className="field-label">
            {label} <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            type="password"
            value={form[field]}
            onChange={(e) =>
              setForm((f) => ({ ...f, [field]: e.target.value }))
            }
            required
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
          {saving ? "Saving…" : "Change Password"}
        </button>
      </div>
    </form>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "flag-active",
    inactive: "flag-archived",
    suspended: "flag-voided",
  };
  return (
    <span className={`flag-chip ${map[status] ?? "flag-archived"}`}>
      {status}
    </span>
  );
}
