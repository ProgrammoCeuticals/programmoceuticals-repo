import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { mockExpenses } from "../lib/mock";
import { useAuthStore } from "../store/authStore";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import StatCard from "../components/ui/StatCard";

const fmt = (n) =>
  "₦" +
  Number(n).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "—");
const CATEGORIES = [
  "All",
  "Rent",
  "Salaries",
  "Utilities",
  "Electricity",
  "Water",
  "Repairs",
  "Maintenance",
  "Stationery",
  "Transport",
  "Advertising",
  "Other",
];
const today = new Date().toISOString().slice(0, 10);

const BLANK = { date: today, category: "Rent", description: "", amount: "" };

function categoryBadgeVariant(cat) {
  const map = {
    Rent: "info",
    Salaries: "warn",
    Utilities: "info",
    Electricity: "info",
    Water: "info",
    Repairs: "warn",
    Maintenance: "warn",
    Stationery: "info",
    Transport: "info",
    Advertising: "info",
    Other: "info",
  };
  return map[cat] || "info";
}

export default function Expenses() {
  const role = useAuthStore((s) => s.role);
  const profile = useAuthStore((s) => s.profile);
  const canEdit = role === "admin" || role === "manager";

  const [expenses, setExpenses] = useState(() => [...mockExpenses]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [formErrors, setFormErrors] = useState({});

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Stats for current month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthExpenses = useMemo(
    () => expenses.filter((e) => new Date(e.date) >= monthStart),
    [expenses],
  );
  const monthTotal = useMemo(
    () => monthExpenses.reduce((a, e) => a + e.amount, 0),
    [monthExpenses],
  );
  const rentTotal = useMemo(
    () =>
      monthExpenses
        .filter((e) => e.category === "Rent")
        .reduce((a, e) => a + e.amount, 0),
    [monthExpenses],
  );
  const salariesTotal = useMemo(
    () =>
      monthExpenses
        .filter((e) => e.category === "Salaries")
        .reduce((a, e) => a + e.amount, 0),
    [monthExpenses],
  );
  const utilitiesTotal = useMemo(
    () =>
      monthExpenses
        .filter((e) => e.category === "Utilities")
        .reduce((a, e) => a + e.amount, 0),
    [monthExpenses],
  );
  const otherTotal = useMemo(
    () =>
      monthExpenses
        .filter((e) => !["Rent", "Salaries", "Utilities"].includes(e.category))
        .reduce((a, e) => a + e.amount, 0),
    [monthExpenses],
  );

  const filtered = useMemo(
    () =>
      expenses
        .filter((e) => {
          const matchTab = tab === "All" || e.category === tab;
          const matchSearch = (e.description || "")
            .toLowerCase()
            .includes(search.toLowerCase());
          return matchTab && matchSearch;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [expenses, tab, search],
  );

  const openAdd = () => {
    setEditId(null);
    setForm({ ...BLANK, date: today });
    setFormErrors({});
    setShowForm(true);
  };
  const openEdit = (e) => {
    setEditId(e.id);
    setForm({
      date: e.date,
      category: e.category,
      description: e.description || "",
      amount: e.amount,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = "Date is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.amount || Number(form.amount) <= 0)
      errs.amount = "Amount is required";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    if (editId) {
      const idx = mockExpenses.findIndex((e) => e.id === editId);
      if (idx !== -1)
        Object.assign(mockExpenses[idx], {
          date: form.date,
          category: form.category,
          description: form.description,
          amount: Number(form.amount),
        });
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editId
            ? {
                ...e,
                date: form.date,
                category: form.category,
                description: form.description,
                amount: Number(form.amount),
              }
            : e,
        ),
      );
    } else {
      const newE = {
        id: `exp-${Date.now()}`,
        date: form.date,
        category: form.category,
        description: form.description,
        amount: Number(form.amount),
        recorded_by: profile?.full_name || "Demo Admin",
      };
      mockExpenses.push(newE);
      setExpenses((prev) => [...prev, newE]);
    }
    setShowForm(false);
  };

  const handleDeleteConfirm = () => {
    const idx = mockExpenses.findIndex((e) => e.id === deleteId);
    if (idx !== -1) mockExpenses.splice(idx, 1);
    setExpenses((prev) => prev.filter((e) => e.id !== deleteId));
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleExport = () => {
    const rows = filtered.map((e) => ({
      Date: fmtDate(e.date),
      Category: e.category,
      Description: e.description,
      "Amount (₦)": e.amount,
      "Recorded By": e.recorded_by,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "Expenses.xlsx");
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
          Expenses
        </h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-ghost" onClick={handleExport}>
            Export Excel
          </button>
          {canEdit && (
            <button className="btn btn-accent" onClick={openAdd}>
              + Add Expense
            </button>
          )}
        </div>
      </div>

      {/* Stats (current month) */}
      <div className="stat-grid">
        <StatCard
          value={fmt(monthTotal)}
          label="Total This Month"
          variant="danger"
        />
        <StatCard value={fmt(rentTotal)} label="Rent" />
        <StatCard value={fmt(salariesTotal)} label="Salaries" />
        <StatCard value={fmt(utilitiesTotal)} label="Utilities" />
        <StatCard value={fmt(otherTotal)} label="Other" />
      </div>

      {/* Tab bar */}
      <div className="tab-bar" style={{ marginBottom: "0.75rem" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`tab-btn${tab === c ? " active" : ""}`}
            onClick={() => setTab(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        className="search-input"
        style={{ maxWidth: "360px", marginBottom: "1rem" }}
        placeholder="Search by description…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="results-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount ₦</th>
                <th>Recorded By</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td>{fmtDate(e.date)}</td>
                  <td>
                    <Badge variant={categoryBadgeVariant(e.category)}>
                      {e.category}
                    </Badge>
                  </td>
                  <td>{e.description}</td>
                  <td>{fmt(e.amount)}</td>
                  <td>{e.recorded_by}</td>
                  {canEdit && (
                    <td>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <button
                          className="btn"
                          style={{ padding: "0.2rem 0.5rem", fontSize: "11px" }}
                          onClick={() => openEdit(e)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: "0.2rem 0.5rem", fontSize: "11px" }}
                          onClick={() => {
                            setDeleteId(e.id);
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
                    No expenses found
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
        title={editId ? "Edit Expense" : "Add Expense"}
        size="sm"
      >
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={labelStyle}>Date *</label>
          <input
            className="search-input"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
          {formErrors.date && <span style={errStyle}>{formErrors.date}</span>}
        </div>
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={labelStyle}>Category *</label>
          <select
            className="search-input"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          >
            {[
              "Rent",
              "Salaries",
              "Utilities",
              "Electricity",
              "Water",
              "Repairs",
              "Maintenance",
              "Stationery",
              "Transport",
              "Advertising",
              "Other",
            ].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {formErrors.category && (
            <span style={errStyle}>{formErrors.category}</span>
          )}
        </div>
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={labelStyle}>Description</label>
          <input
            className="search-input"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Amount (₦) *</label>
          <input
            className="search-input"
            type="number"
            min="0"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          />
          {formErrors.amount && (
            <span style={errStyle}>{formErrors.amount}</span>
          )}
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
          Delete this expense record?
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
