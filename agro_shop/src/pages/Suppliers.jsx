import { useState } from "react";
import { mockSuppliers } from "../lib/mock";
import { useAuthStore } from "../store/authStore";
import Modal from "../components/ui/Modal";

const BLANK = {
  name: "",
  contact_person: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
};

export default function Suppliers() {
  const role = useAuthStore((s) => s.role);
  const canEdit = role === "admin" || role === "manager";

  const [suppliers, setSuppliers] = useState(() => [...mockSuppliers]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [formErrors, setFormErrors] = useState({});

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone || "").includes(search) ||
      (s.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditId(null);
    setForm(BLANK);
    setFormErrors({});
    setShowForm(true);
  };
  const openEdit = (s) => {
    setEditId(s.id);
    setForm({
      name: s.name,
      contact_person: s.contact_name || s.contact_person || "",
      phone: s.phone || "",
      email: s.email || "",
      address: s.address || "",
      notes: s.notes || "",
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    if (editId) {
      const idx = mockSuppliers.findIndex((s) => s.id === editId);
      if (idx !== -1)
        Object.assign(mockSuppliers[idx], {
          name: form.name,
          contact_name: form.contact_person,
          phone: form.phone,
          email: form.email,
          address: form.address,
          notes: form.notes,
        });
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editId
            ? {
                ...s,
                name: form.name,
                contact_name: form.contact_person,
                phone: form.phone,
                email: form.email,
                address: form.address,
                notes: form.notes,
              }
            : s,
        ),
      );
    } else {
      const newS = {
        id: `sup-${Date.now()}`,
        name: form.name,
        contact_name: form.contact_person,
        phone: form.phone,
        email: form.email,
        address: form.address,
        notes: form.notes,
      };
      mockSuppliers.push(newS);
      setSuppliers((prev) => [...prev, newS]);
    }
    setShowForm(false);
  };

  const handleDeleteConfirm = () => {
    const idx = mockSuppliers.findIndex((s) => s.id === deleteId);
    if (idx !== -1) mockSuppliers.splice(idx, 1);
    setSuppliers((prev) => prev.filter((s) => s.id !== deleteId));
    setShowDelete(false);
    setDeleteId(null);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <h2 className="section-title" style={{ margin: 0 }}>
          Suppliers
        </h2>
        {canEdit && (
          <button className="btn btn-accent" onClick={openAdd}>
            + Add Supplier
          </button>
        )}
      </div>

      <input
        className="search-input"
        style={{ maxWidth: "360px", marginBottom: "1rem" }}
        placeholder="Search by name, phone or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="results-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700 }}>{s.name}</td>
                  <td>{s.contact_name || s.contact_person || "—"}</td>
                  <td>{s.phone || "—"}</td>
                  <td>{s.email || "—"}</td>
                  <td>{s.address || "—"}</td>
                  {canEdit && (
                    <td>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <button
                          className="btn"
                          style={{ padding: "0.2rem 0.5rem", fontSize: "11px" }}
                          onClick={() => openEdit(s)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: "0.2rem 0.5rem", fontSize: "11px" }}
                          onClick={() => {
                            setDeleteId(s.id);
                            setShowDelete(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={canEdit ? 6 : 5}
                    style={{
                      textAlign: "center",
                      color: "var(--muted)",
                      padding: "1.5rem",
                    }}
                  >
                    No suppliers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editId ? "Edit Supplier" : "Add Supplier"}
        size="md"
      >
        {["name", "contact_person", "phone", "email", "address"].map(
          (field) => (
            <div key={field} style={{ marginBottom: "0.75rem" }}>
              <label style={labelStyle}>
                {field.replace("_", " ")}
                {field === "name" || field === "phone" ? " *" : ""}
              </label>
              <input
                className="search-input"
                value={form[field]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field]: e.target.value }))
                }
              />
              {formErrors[field] && (
                <span style={errStyle}>{formErrors[field]}</span>
              )}
            </div>
          ),
        )}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Notes</label>
          <textarea
            className="search-input"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            style={{ resize: "vertical" }}
          />
        </div>
        <div
          style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}
        >
          <button className="btn btn-ghost" onClick={() => setShowForm(false)}>
            Cancel
          </button>
          <button className="btn btn-accent" onClick={handleSave}>
            Save
          </button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Confirm Delete"
        size="sm"
      >
        <p style={{ fontSize: "13px", marginBottom: "1rem" }}>
          Are you sure you want to delete this supplier?
        </p>
        <div
          style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}
        >
          <button
            className="btn btn-ghost"
            onClick={() => setShowDelete(false)}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDeleteConfirm}>
            Delete
          </button>
        </div>
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
const errStyle = {
  color: "var(--danger)",
  fontSize: "11px",
  display: "block",
  marginTop: "2px",
};
