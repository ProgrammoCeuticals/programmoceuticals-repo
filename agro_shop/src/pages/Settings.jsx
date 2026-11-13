import { useState } from "react";
import { mockSettings } from "../lib/mock";
import { useAuthStore } from "../store/authStore";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";

// Module-level state for settings
const mockSettingsState = { ...mockSettings };

// Mock users list
const initialUsers = [
  {
    id: "mock-1",
    full_name: "Demo Admin",
    email: "admin@agrovet.ng",
    role: "admin",
  },
  {
    id: "mock-2",
    full_name: "Demo Manager",
    email: "manager@agrovet.ng",
    role: "manager",
  },
  {
    id: "mock-3",
    full_name: "Demo Cashier",
    email: "cashier@agrovet.ng",
    role: "cashier",
  },
];

const roleVariant = { admin: "ok", manager: "warn", cashier: "info" };

export default function Settings() {
  const role = useAuthStore((s) => s.role);

  const [tab, setTab] = useState("General");
  const [settings, setSettings] = useState({ ...mockSettingsState });
  const [saved, setSaved] = useState(false);

  const [users, setUsers] = useState(() => [...initialUsers]);
  const [editUser, setEditUser] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // Write back to both the local copy and the exported mockSettings object
    // so that Receipt.jsx (which imports mockSettings directly) sees the changes
    Object.assign(mockSettingsState, settings);
    Object.assign(mockSettings, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const openEditRole = (u) => {
    setEditUser(u);
    setEditRole(u.role);
    setShowEdit(true);
  };

  const handleSaveRole = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === editUser.id ? { ...u, role: editRole } : u)),
    );
    setShowEdit(false);
  };

  return (
    <div>
      <h2 className="section-title">Settings</h2>

      <div className="tab-bar" style={{ marginBottom: "1rem" }}>
        <button
          className={`tab-btn${tab === "General" ? " active" : ""}`}
          onClick={() => setTab("General")}
        >
          General
        </button>
        {role === "admin" && (
          <button
            className={`tab-btn${tab === "Users" ? " active" : ""}`}
            onClick={() => setTab("Users")}
          >
            Users
          </button>
        )}
      </div>

      {/* General Tab */}
      {tab === "General" && (
        <div className="card" style={{ maxWidth: "560px" }}>
          <form onSubmit={handleSaveSettings}>
            {[
              ["shop_name", "Shop Name"],
              ["shop_address", "Address"],
              ["shop_phone", "Phone"],
            ].map(([key, label]) => (
              <div key={key} style={{ marginBottom: "0.85rem" }}>
                <label style={labelStyle}>{label}</label>
                <input
                  className="search-input"
                  value={settings[key] || ""}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, [key]: e.target.value }))
                  }
                />
              </div>
            ))}

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Receipt Footer</label>
              <textarea
                className="search-input"
                rows={3}
                value={settings.receipt_footer || ""}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, receipt_footer: e.target.value }))
                }
                style={{ resize: "vertical" }}
              />
            </div>

            {saved && (
              <p
                style={{
                  color: "var(--ok)",
                  fontSize: "12px",
                  marginBottom: "0.75rem",
                  fontWeight: 700,
                }}
              >
                ✓ Settings saved.
              </p>
            )}

            <button className="btn btn-ok" type="submit">
              Save Settings
            </button>
          </form>
        </div>
      )}

      {/* Users Tab (admin only) */}
      {tab === "Users" && role === "admin" && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ overflowX: "auto" }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700 }}>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>
                      <Badge variant={roleVariant[u.role] || "info"}>
                        {u.role}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: "0.2rem 0.5rem", fontSize: "11px" }}
                        onClick={() => openEditRole(u)}
                      >
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit User Role"
        size="sm"
      >
        {editUser && (
          <>
            <p style={{ fontSize: "13px", marginBottom: "0.75rem" }}>
              <strong>{editUser.full_name}</strong> ({editUser.email})
            </p>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Role</label>
              <select
                className="search-input"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>
              <button className="btn btn-ok" onClick={handleSaveRole}>
                Save
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "#555",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
  marginBottom: "3px",
};
