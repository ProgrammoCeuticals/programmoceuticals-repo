import { useEffect, useState } from "react";
import { Plus, Trash2, X, Users } from "lucide-react";
import { divisionsApi } from "../api/divisions";
import { usersApi } from "../api/people";
import type { Division, User } from "../types";

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "var(--text-mid)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: "0.3rem",
};

export function DivisionsPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function reload() {
    Promise.all([
      divisionsApi.list(),
      usersApi.list({ limit: 200 }).then((r) => r.items),
    ]).then(([divs, usrs]) => {
      setDivisions(divs);
      setUsers(usrs);
    });
  }

  useEffect(() => { reload(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setError("");
    try {
      await divisionsApi.create({ name: newName.trim() });
      setNewName("");
      setShowForm(false);
      reload();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Failed to create division");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete division "${name}"? Users in this division will be unassigned.`)) return;
    await divisionsApi.delete(id);
    reload();
  }

  async function handleAssign(userId: string, divisionId: string | null) {
    await divisionsApi.assignUser(userId, divisionId);
    reload();
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Divisions</h1>
          <p className="page-subtitle">Manage divisions and assign users</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <Plus size={14} /> New Division
        </button>
      </div>

      {showForm && (
        <div className="form-panel" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem", color: "var(--text-dark)" }}>New Division</p>
            <button onClick={() => setShowForm(false)} style={{ padding: "0.3rem", border: "none", background: "transparent", cursor: "pointer", color: "var(--text-faint)", display: "flex" }}>
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleCreate} style={{ display: "flex", gap: "0.5rem" }}>
            {error && <div className="alert alert-error" style={{ marginBottom: "0.5rem" }}>{error}</div>}
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Quality Control"
              className="inp"
              style={{ flex: 1 }}
              autoFocus
            />
            <button type="submit" disabled={saving || !newName.trim()} className="btn btn-primary">
              {saving ? "Creating…" : "Create"}
            </button>
          </form>
        </div>
      )}

      {divisions.length === 0 ? (
        <div className="card">
          <div className="empty">
            <Users size={38} className="empty-icon" />
            <p className="empty-title">No divisions yet</p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>Create a division to start organising users and logs.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {divisions.map((div) => {
            const divUsers = users.filter((u) => u.divisionId === div.id);
            const unassigned = users.filter((u) => !u.divisionId && !u.isAdmin);
            return (
              <div key={div.id} className="card" style={{ overflow: "hidden" }}>
                {/* Division header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", background: "var(--bg-header)", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-dark)" }}>{div.name}</span>
                    <span className="badge badge-gray">{divUsers.length} user{divUsers.length !== 1 ? "s" : ""}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(div.id, div.name)}
                    style={{ padding: "0.2rem", border: "none", background: "transparent", cursor: "pointer", color: "var(--text-faint)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#b91c1c")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-faint)")}
                    title="Delete division"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ padding: "0.75rem 1rem" }}>
                  {/* Current users */}
                  {divUsers.length > 0 && (
                    <div style={{ display: "grid", gap: "0.35rem", marginBottom: "0.75rem" }}>
                      {divUsers.map((u) => (
                        <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.35rem 0.65rem", border: "1px solid var(--border)", background: "#fff" }}>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text-dark)" }}>{u.name}</span>
                            <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--text-faint)" }}>{u.email}</span>
                          </div>
                          <button
                            onClick={() => handleAssign(u.id, null)}
                            style={{ padding: "0.2rem", border: "none", background: "transparent", cursor: "pointer", color: "var(--text-faint)", fontSize: "0.72rem" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#b91c1c")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-faint)")}
                            title="Remove from division"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add user selector */}
                  {unassigned.length > 0 && (
                    <div>
                      <label style={lbl}>Add user to this division</label>
                      <select
                        defaultValue=""
                        onChange={(e) => { if (e.target.value) { handleAssign(e.target.value, div.id); e.target.value = ""; } }}
                        className="inp"
                        style={{ maxWidth: 320 }}
                      >
                        <option value="">— select a user —</option>
                        {unassigned.map((u) => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {divUsers.length === 0 && unassigned.length === 0 && (
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-faint)", fontStyle: "italic" }}>All users are assigned to divisions.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Unassigned users summary */}
      {users.filter((u) => !u.divisionId && !u.isAdmin).length > 0 && (
        <div className="alert alert-info" style={{ marginTop: "1.25rem" }}>
          {users.filter((u) => !u.divisionId && !u.isAdmin).length} user(s) not yet assigned to a division.
        </div>
      )}
    </div>
  );
}
