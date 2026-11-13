import { useState } from "react";
import { mockCustomers } from "../lib/mock";
import { useAuthStore } from "../store/authStore";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";

const fmt = (n) =>
  "₦" +
  Number(n).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const BLANK = {
  full_name: "",
  phone: "",
  email: "",
  address: "",
  credit_limit: 0,
};

export default function Customers() {
  const role = useAuthStore((s) => s.role);
  const canEdit = role === "admin" || role === "manager";

  const [customers, setCustomers] = useState(() => [...mockCustomers]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [formErrors, setFormErrors] = useState({});

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const [showPayment, setShowPayment] = useState(false);
  const [payTarget, setPayTarget] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));

  const filtered = customers.filter(
    (c) =>
      (c.full_name || c.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) || (c.phone || "").includes(search),
  );

  const openAdd = () => {
    setEditId(null);
    setForm(BLANK);
    setFormErrors({});
    setShowForm(true);
  };
  const openEdit = (c) => {
    setEditId(c.id);
    setForm({
      full_name: c.full_name || c.name || "",
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "",
      credit_limit: c.credit_limit || 0,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = "Name is required";
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
      const idx = mockCustomers.findIndex((c) => c.id === editId);
      if (idx !== -1)
        Object.assign(mockCustomers[idx], {
          full_name: form.full_name,
          name: form.full_name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          credit_limit: Number(form.credit_limit),
        });
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editId
            ? {
                ...c,
                full_name: form.full_name,
                name: form.full_name,
                phone: form.phone,
                email: form.email,
                address: form.address,
                credit_limit: Number(form.credit_limit),
              }
            : c,
        ),
      );
    } else {
      const newC = {
        id: `cus-${Date.now()}`,
        full_name: form.full_name,
        name: form.full_name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        credit_limit: Number(form.credit_limit),
        outstanding_debt: 0,
      };
      mockCustomers.push(newC);
      setCustomers((prev) => [...prev, newC]);
    }
    setShowForm(false);
  };

  const handleDeleteClick = (c) => {
    setDeleteId(c.id);
    setDeleteError(
      c.outstanding_debt > 0
        ? `Cannot delete: customer has outstanding debt of ${fmt(c.outstanding_debt)}`
        : "",
    );
    setShowDelete(true);
  };

  const handleDeleteConfirm = () => {
    const c = customers.find((x) => x.id === deleteId);
    if (c && c.outstanding_debt > 0) return;
    const idx = mockCustomers.findIndex((x) => x.id === deleteId);
    if (idx !== -1) mockCustomers.splice(idx, 1);
    setCustomers((prev) => prev.filter((x) => x.id !== deleteId));
    setShowDelete(false);
    setDeleteId(null);
  };

  const openPayment = (c) => {
    setPayTarget(c);
    setPayAmount("");
    setPayDate(new Date().toISOString().slice(0, 10));
    setShowPayment(true);
  };

  const handlePaymentConfirm = () => {
    const amt = Math.min(Number(payAmount), payTarget.outstanding_debt);
    if (!amt || amt <= 0) return;
    const idx = mockCustomers.findIndex((c) => c.id === payTarget.id);
    if (idx !== -1)
      mockCustomers[idx].outstanding_debt = Math.max(
        0,
        mockCustomers[idx].outstanding_debt - amt,
      );
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === payTarget.id
          ? { ...c, outstanding_debt: Math.max(0, c.outstanding_debt - amt) }
          : c,
      ),
    );
    setShowPayment(false);
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
          Customers
        </h2>
        {canEdit && (
          <button className="btn btn-accent" onClick={openAdd}>
            + Add Customer
          </button>
        )}
      </div>

      <input
        className="search-input"
        style={{ maxWidth: "360px", marginBottom: "1rem" }}
        placeholder="Search by name or phone…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="results-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Credit Limit ₦</th>
                <th>Outstanding ₦</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700 }}>{c.full_name || c.name}</td>
                  <td>{c.phone || "—"}</td>
                  <td>{c.email || "—"}</td>
                  <td>{c.address || "—"}</td>
                  <td>{fmt(c.credit_limit || 0)}</td>
                  <td>
                    {(c.outstanding_debt || 0) > 0 ? (
                      <Badge variant="danger">{fmt(c.outstanding_debt)}</Badge>
                    ) : (
                      fmt(0)
                    )}
                  </td>
                  {canEdit && (
                    <td>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <button
                          className="btn"
                          style={{ padding: "0.2rem 0.5rem", fontSize: "11px" }}
                          onClick={() => openEdit(c)}
                        >
                          Edit
                        </button>
                        {(c.outstanding_debt || 0) > 0 && (
                          <button
                            className="btn btn-ok"
                            style={{
                              padding: "0.2rem 0.5rem",
                              fontSize: "11px",
                            }}
                            onClick={() => openPayment(c)}
                          >
                            Pay
                          </button>
                        )}
                        <button
                          className="btn btn-danger"
                          style={{ padding: "0.2rem 0.5rem", fontSize: "11px" }}
                          onClick={() => handleDeleteClick(c)}
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
                    colSpan={canEdit ? 7 : 6}
                    style={{
                      textAlign: "center",
                      color: "var(--muted)",
                      padding: "1.5rem",
                    }}
                  >
                    No customers found
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
        title={editId ? "Edit Customer" : "Add Customer"}
        size="md"
      >
        {[
          ["full_name", "Full Name", true],
          ["phone", "Phone", true],
          ["email", "Email", false],
          ["address", "Address", false],
        ].map(([field, label, req]) => (
          <div key={field} style={{ marginBottom: "0.75rem" }}>
            <label style={labelStyle}>
              {label}
              {req ? " *" : ""}
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
        ))}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Credit Limit (₦)</label>
          <input
            className="search-input"
            type="number"
            min="0"
            value={form.credit_limit}
            onChange={(e) =>
              setForm((f) => ({ ...f, credit_limit: e.target.value }))
            }
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
        {deleteError ? (
          <p
            style={{
              color: "var(--danger)",
              fontSize: "13px",
              marginBottom: "1rem",
            }}
          >
            {deleteError}
          </p>
        ) : (
          <p style={{ fontSize: "13px", marginBottom: "1rem" }}>
            Are you sure you want to delete this customer?
          </p>
        )}
        <div
          style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}
        >
          <button
            className="btn btn-ghost"
            onClick={() => setShowDelete(false)}
          >
            Close
          </button>
          {!deleteError && (
            <button className="btn btn-danger" onClick={handleDeleteConfirm}>
              Delete
            </button>
          )}
        </div>
      </Modal>

      {/* Record Payment */}
      <Modal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        title="Record Payment"
        size="sm"
      >
        {payTarget && (
          <>
            <p style={{ fontSize: "13px", marginBottom: "0.75rem" }}>
              <strong>{payTarget.full_name || payTarget.name}</strong>
              <br />
              Outstanding:{" "}
              <strong style={{ color: "var(--danger)" }}>
                {fmt(payTarget.outstanding_debt || 0)}
              </strong>
            </p>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={labelStyle}>Amount (₦) *</label>
              <input
                className="search-input"
                type="number"
                min="1"
                max={payTarget.outstanding_debt}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Date</label>
              <input
                className="search-input"
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
              />
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
                onClick={() => setShowPayment(false)}
              >
                Cancel
              </button>
              <button className="btn btn-ok" onClick={handlePaymentConfirm}>
                Record
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
const errStyle = {
  color: "var(--danger)",
  fontSize: "11px",
  display: "block",
  marginTop: "2px",
};
