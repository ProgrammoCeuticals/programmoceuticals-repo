import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { mockProducts, mockSuppliers, mockStockMovements } from "../lib/mock";
import { useAuthStore } from "../store/authStore";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";

const fmt = (n) =>
  "₦" +
  Number(n).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "—");
const PAGE_SIZE = 20;
const TABS = ["All", "Low Stock", "Expiring Soon"];
const CATEGORIES = [
  "All",
  "Veterinary Drugs",
  "Agro Chemicals",
  "Equipment",
  "Consumables",
];
const UNITS = [
  "Tablet",
  "Capsule",
  "Sachet",
  "Bottle",
  "Vial",
  "Kg",
  "Litre",
  "Piece",
  "Pack",
  "Box",
  "Bag",
  "Unit",
];

const skuPrefix = {
  "Veterinary Drugs": "VD",
  "Agro Chemicals": "AC",
  Equipment: "EQ",
  Consumables: "CO",
};

function generateSku(category, products) {
  const prefix = skuPrefix[category] || "XX";
  const existing = products
    .filter((p) => p.sku.startsWith(prefix + "-"))
    .map((p) => parseInt(p.sku.split("-")[1]) || 0);
  const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

function isExpiringSoon(dateStr, days = 30) {
  if (!dateStr) return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);
  return new Date(dateStr) <= cutoff;
}

const BLANK_FORM = {
  name: "",
  category: "Veterinary Drugs",
  sub_category: "",
  sku: "",
  unit: "Bottle",
  pack_size: "",
  quantity: "",
  reorder_level: "",
  cost_price: "",
  selling_price: "",
  supplier_id: "",
  batch_number: "",
  expiry_date: "",
  notes: "",
};

export default function Inventory() {
  const role = useAuthStore((s) => s.role);
  const canEdit = role === "admin" || role === "manager";

  // Local reactive copy of products
  const [products, setProducts] = useState(() => [...mockProducts]);

  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [formErrors, setFormErrors] = useState({});

  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustAmt, setAdjustAmt] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  // Filtering
  const filtered = useMemo(() => {
    const now = new Date();
    const cutoff30 = new Date();
    cutoff30.setDate(now.getDate() + 30);

    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      let matchTab = true;
      if (tab === "Low Stock") matchTab = p.quantity <= p.reorder_level;
      if (tab === "Expiring Soon")
        matchTab = p.expiry_date && new Date(p.expiry_date) <= cutoff30;
      return matchSearch && matchCat && matchTab;
    });
  }, [products, search, category, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const updateFilter = (fn) => {
    fn();
    setPage(1);
  };
  const supplierName = (id) =>
    mockSuppliers.find((s) => s.id === id)?.name || "—";

  // ── Form handlers ──────────────────────────────────────────────────────
  const openAdd = () => {
    setEditId(null);
    setForm(BLANK_FORM);
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      sub_category: p.sub_category || "",
      sku: p.sku,
      unit: p.unit,
      pack_size: p.pack_size || "",
      quantity: p.quantity,
      reorder_level: p.reorder_level,
      cost_price: p.cost_price,
      selling_price: p.selling_price,
      supplier_id: p.supplier_id || "",
      batch_number: p.batch_number || "",
      expiry_date: p.expiry_date || "",
      notes: p.notes || "",
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.sku.trim()) errs.sku = "SKU is required";
    if (editId === null && form.quantity === "")
      errs.quantity = "Quantity is required";
    if (form.cost_price === "") errs.cost_price = "Cost price is required";
    if (form.selling_price === "")
      errs.selling_price = "Selling price is required";
    return errs;
  };

  const handleSave = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    if (editId) {
      // Update in-place in mockProducts AND local state
      const idx = mockProducts.findIndex((p) => p.id === editId);
      if (idx !== -1) {
        Object.assign(mockProducts[idx], {
          name: form.name,
          category: form.category,
          sub_category: form.sub_category,
          sku: form.sku,
          unit: form.unit,
          pack_size: form.pack_size,
          reorder_level: Number(form.reorder_level),
          cost_price: Number(form.cost_price),
          selling_price: Number(form.selling_price),
          supplier_id: form.supplier_id,
          batch_number: form.batch_number,
          expiry_date: form.expiry_date,
          notes: form.notes,
        });
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...mockProducts[idx] } : p)),
      );
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        name: form.name,
        category: form.category,
        sub_category: form.sub_category,
        sku: form.sku,
        unit: form.unit,
        pack_size: form.pack_size,
        quantity: Number(form.quantity),
        reorder_level: Number(form.reorder_level) || 5,
        cost_price: Number(form.cost_price),
        selling_price: Number(form.selling_price),
        supplier_id: form.supplier_id,
        batch_number: form.batch_number,
        expiry_date: form.expiry_date,
        notes: form.notes,
      };
      mockProducts.push(newProd);
      setProducts((prev) => [...prev, newProd]);
    }
    setShowForm(false);
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDeleteConfirm = () => {
    const idx = mockProducts.findIndex((p) => p.id === deleteTarget);
    if (idx !== -1) mockProducts.splice(idx, 1);
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget));
    setShowDelete(false);
    setDeleteTarget(null);
  };

  // ── Stock Adjust ────────────────────────────────────────────────────────
  const openAdjust = (p) => {
    setAdjustTarget(p);
    setAdjustAmt("");
    setAdjustReason("");
    setShowAdjust(true);
  };

  const handleAdjustConfirm = () => {
    const delta = parseInt(adjustAmt, 10);
    if (isNaN(delta)) return;
    const idx = mockProducts.findIndex((p) => p.id === adjustTarget.id);
    if (idx !== -1) {
      mockProducts[idx].quantity = Math.max(
        0,
        mockProducts[idx].quantity + delta,
      );
    }
    // Record stock movement for audit trail
    mockStockMovements.push({
      id: `sm-${Date.now()}-${adjustTarget.id}`,
      product_id: adjustTarget.id,
      type: "adjustment",
      quantity_change: delta,
      reason: adjustReason || "Manual adjustment",
      reference_id: null,
      created_by: "demo-admin",
      created_at: new Date().toISOString(),
    });
    setProducts((prev) =>
      prev.map((p) =>
        p.id === adjustTarget.id
          ? { ...p, quantity: Math.max(0, p.quantity + delta) }
          : p,
      ),
    );
    setShowAdjust(false);
  };

  // ── Export ──────────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = filtered.map((p) => ({
      SKU: p.sku,
      Name: p.name,
      Category: p.category,
      Unit: p.unit,
      Quantity: p.quantity,
      "Reorder Level": p.reorder_level,
      "Cost (₦)": p.cost_price,
      "Price (₦)": p.selling_price,
      Expiry: p.expiry_date || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "Inventory.xlsx");
  };

  const expiryBadge = (d) => {
    if (!d) return null;
    const cutoff30 = new Date();
    cutoff30.setDate(cutoff30.getDate() + 30);
    const cutoff90 = new Date();
    cutoff90.setDate(cutoff90.getDate() + 90);
    const dt = new Date(d);
    if (dt <= cutoff30) return <Badge variant="danger">{fmtDate(d)}</Badge>;
    if (dt <= cutoff90) return <Badge variant="warn">{fmtDate(d)}</Badge>;
    return <span>{fmtDate(d)}</span>;
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
          Inventory
        </h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-ghost" onClick={handleExport}>
            Export Excel
          </button>
          {canEdit && (
            <button className="btn btn-accent" onClick={openAdd}>
              + Add Product
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="tab-bar" style={{ marginBottom: "0.75rem" }}>
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab-btn${tab === t ? " active" : ""}`}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          className="search-input"
          style={{ flex: "1 1 220px" }}
          placeholder="Search by name or SKU…"
          value={search}
          onChange={(e) => updateFilter(() => setSearch(e.target.value))}
        />
        <select
          className="search-input"
          style={{ flex: "0 0 200px" }}
          value={category}
          onChange={(e) => updateFilter(() => setCategory(e.target.value))}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        {slice.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try a different search, tab, or category."
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Qty</th>
                  <th>Cost ₦</th>
                  <th>Price ₦</th>
                  <th>Expiry</th>
                  {canEdit && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {slice.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: "var(--brand)" }}>
                      {p.sku}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.unit}</td>
                    <td>
                      {p.quantity === 0 ? (
                        <Badge variant="danger">{p.quantity}</Badge>
                      ) : p.quantity <= p.reorder_level ? (
                        <Badge variant="warn">{p.quantity}</Badge>
                      ) : (
                        p.quantity
                      )}
                    </td>
                    <td>{fmt(p.cost_price)}</td>
                    <td>{fmt(p.selling_price)}</td>
                    <td>{expiryBadge(p.expiry_date)}</td>
                    {canEdit && (
                      <td>
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <button
                            className="btn"
                            style={{
                              padding: "0.2rem 0.5rem",
                              fontSize: "11px",
                            }}
                            onClick={() => openEdit(p)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-ghost"
                            style={{
                              padding: "0.2rem 0.5rem",
                              fontSize: "11px",
                            }}
                            onClick={() => openAdjust(p)}
                          >
                            Adjust
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{
                              padding: "0.2rem 0.5rem",
                              fontSize: "11px",
                            }}
                            onClick={() => {
                              setDeleteTarget(p.id);
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
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Add/Edit Modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editId ? "Edit Product" : "Add Product"}
        size="lg"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          {/* Name */}
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Name *</label>
            <input
              className="search-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            {formErrors.name && <span style={errStyle}>{formErrors.name}</span>}
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              className="search-input"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              {[
                "Veterinary Drugs",
                "Agro Chemicals",
                "Equipment",
                "Consumables",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sub-category */}
          <div>
            <label style={labelStyle}>Sub-Category</label>
            <input
              className="search-input"
              value={form.sub_category}
              onChange={(e) =>
                setForm((f) => ({ ...f, sub_category: e.target.value }))
              }
            />
          </div>

          {/* SKU */}
          <div>
            <label style={labelStyle}>SKU *</label>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <input
                className="search-input"
                value={form.sku}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sku: e.target.value }))
                }
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-ghost"
                style={{
                  fontSize: "11px",
                  padding: "0.3rem 0.6rem",
                  whiteSpace: "nowrap",
                }}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    sku: generateSku(f.category, products),
                  }))
                }
              >
                Auto
              </button>
            </div>
            {formErrors.sku && <span style={errStyle}>{formErrors.sku}</span>}
          </div>

          {/* Unit */}
          <div>
            <label style={labelStyle}>Unit</label>
            <select
              className="search-input"
              value={form.unit}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
            >
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Pack size */}
          <div>
            <label style={labelStyle}>Pack Size</label>
            <input
              className="search-input"
              value={form.pack_size}
              onChange={(e) =>
                setForm((f) => ({ ...f, pack_size: e.target.value }))
              }
            />
          </div>

          {/* Quantity — disabled on edit */}
          {!editId && (
            <div>
              <label style={labelStyle}>Quantity *</label>
              <input
                className="search-input"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quantity: e.target.value }))
                }
              />
              {formErrors.quantity && (
                <span style={errStyle}>{formErrors.quantity}</span>
              )}
            </div>
          )}

          {/* Reorder level */}
          <div>
            <label style={labelStyle}>Reorder Level</label>
            <input
              className="search-input"
              type="number"
              min="0"
              value={form.reorder_level}
              onChange={(e) =>
                setForm((f) => ({ ...f, reorder_level: e.target.value }))
              }
            />
          </div>

          {/* Cost price */}
          <div>
            <label style={labelStyle}>Cost Price (₦) *</label>
            <input
              className="search-input"
              type="number"
              min="0"
              value={form.cost_price}
              onChange={(e) =>
                setForm((f) => ({ ...f, cost_price: e.target.value }))
              }
            />
            {formErrors.cost_price && (
              <span style={errStyle}>{formErrors.cost_price}</span>
            )}
          </div>

          {/* Selling price */}
          <div>
            <label style={labelStyle}>Selling Price (₦) *</label>
            <input
              className="search-input"
              type="number"
              min="0"
              value={form.selling_price}
              onChange={(e) =>
                setForm((f) => ({ ...f, selling_price: e.target.value }))
              }
            />
            {formErrors.selling_price && (
              <span style={errStyle}>{formErrors.selling_price}</span>
            )}
          </div>

          {/* Supplier */}
          <div>
            <label style={labelStyle}>Supplier</label>
            <select
              className="search-input"
              value={form.supplier_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, supplier_id: e.target.value }))
              }
            >
              <option value="">— Select Supplier —</option>
              {mockSuppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Batch number */}
          <div>
            <label style={labelStyle}>Batch Number</label>
            <input
              className="search-input"
              value={form.batch_number}
              onChange={(e) =>
                setForm((f) => ({ ...f, batch_number: e.target.value }))
              }
            />
          </div>

          {/* Expiry date */}
          <div>
            <label style={labelStyle}>Expiry Date</label>
            <input
              className="search-input"
              type="date"
              value={form.expiry_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, expiry_date: e.target.value }))
              }
            />
          </div>

          {/* Notes */}
          <div style={{ gridColumn: "1/-1" }}>
            <label style={labelStyle}>Notes</label>
            <textarea
              className="search-input"
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
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
          Are you sure you want to delete this product? This cannot be undone.
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

      {/* Stock Adjust */}
      <Modal
        open={showAdjust}
        onClose={() => setShowAdjust(false)}
        title="Adjust Stock"
        size="sm"
      >
        {adjustTarget && (
          <>
            <p style={{ fontSize: "13px", marginBottom: "0.5rem" }}>
              <strong>{adjustTarget.name}</strong>
              <br />
              Current qty: <strong>{adjustTarget.quantity}</strong>
            </p>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={labelStyle}>Adjustment (+/-)</label>
              <input
                className="search-input"
                type="number"
                placeholder="e.g. +10 or -5"
                value={adjustAmt}
                onChange={(e) => setAdjustAmt(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Reason</label>
              <input
                className="search-input"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="Optional reason"
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
                onClick={() => setShowAdjust(false)}
              >
                Cancel
              </button>
              <button className="btn btn-ok" onClick={handleAdjustConfirm}>
                Confirm
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
