import { useState, useMemo } from "react";
import {
  mockPurchases,
  mockSuppliers,
  mockProducts,
  mockStockMovements,
} from "../lib/mock";
import { useAuthStore } from "../store/authStore";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import StatCard from "../components/ui/StatCard";
import Pagination from "../components/ui/Pagination";

const fmt = (n) =>
  "₦" +
  Number(n).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB");
const PAGE_SIZE = 20;

function statusVariant(s) {
  return (
    {
      Draft: "info",
      Ordered: "warn",
      Received: "ok",
      received: "ok",
      pending: "warn",
      draft: "info",
      Cancelled: "danger",
    }[s] ?? "info"
  );
}

function todayStr() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

let poCounter = mockPurchases.length;

const BLANK_LINE = {
  product_id: "",
  qty: "",
  cost_price: "",
  batch_number: "",
  expiry_date: "",
};

export default function Purchasing() {
  const role = useAuthStore((s) => s.role);
  if (role !== "admin" && role !== "manager") {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "var(--danger)", fontWeight: 700 }}>
          Access Denied — Admin/Manager only
        </p>
      </div>
    );
  }

  const [purchases, setPurchases] = useState(() => [...mockPurchases]);
  const [page, setPage] = useState(1);

  const [showAdd, setShowAdd] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [lines, setLines] = useState([{ ...BLANK_LINE }]);
  const [notes, setNotes] = useState("");

  const [showView, setShowView] = useState(false);
  const [viewPO, setViewPO] = useState(null);

  const [showReceive, setShowReceive] = useState(false);
  const [receivePO, setReceivePO] = useState(null);
  const [receiveMsg, setReceiveMsg] = useState("");

  // Stats
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const pendingCount = useMemo(
    () =>
      purchases.filter(
        (p) =>
          p.status !== "received" &&
          p.status !== "Received" &&
          p.status !== "Cancelled",
      ).length,
    [purchases],
  );
  const receivedThisMonth = useMemo(
    () =>
      purchases.filter(
        (p) =>
          (p.status === "received" || p.status === "Received") &&
          new Date(p.created_at) >= monthStart,
      ).length,
    [purchases],
  );
  const totalValue = useMemo(
    () => purchases.reduce((a, p) => a + p.total, 0),
    [purchases],
  );

  const totalPages = Math.max(1, Math.ceil(purchases.length / PAGE_SIZE));
  const slice = [...purchases]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Line item helpers ────────────────────────────────────────────────────
  const addLine = () => setLines((l) => [...l, { ...BLANK_LINE }]);
  const removeLine = (i) => setLines((l) => l.filter((_, idx) => idx !== i));
  const updateLine = (i, field, value) =>
    setLines((l) =>
      l.map((line, idx) => {
        if (idx !== i) return line;
        const updated = { ...line, [field]: value };
        if (field === "product_id" && value) {
          const prod = mockProducts.find((p) => p.id === value);
          if (prod) updated.cost_price = prod.cost_price;
        }
        return updated;
      }),
    );

  const lineTotal = (line) => {
    const qty = Number(line.qty) || 0;
    const cost = Number(line.cost_price) || 0;
    return qty * cost;
  };
  const poTotal = lines.reduce((a, l) => a + lineTotal(l), 0);

  const handleSavePO = () => {
    if (!supplierId) return;
    const validLines = lines.filter((l) => l.product_id && l.qty);
    if (validLines.length === 0) return;
    poCounter++;
    const newPO = {
      id: `po-${Date.now()}`,
      po_number: `PO-${todayStr()}-${String(poCounter).padStart(4, "0")}`,
      supplier_id: supplierId,
      status: "Draft",
      total: poTotal,
      notes,
      created_at: new Date().toISOString(),
      _lines: validLines,
    };
    mockPurchases.push(newPO);
    setPurchases((prev) => [...prev, newPO]);
    setShowAdd(false);
    setSupplierId("");
    setLines([{ ...BLANK_LINE }]);
    setNotes("");
  };

  const handleReceive = () => {
    setPurchases((prev) =>
      prev.map((p) =>
        p.id === receivePO.id
          ? { ...p, status: "Received", received_at: new Date().toISOString() }
          : p,
      ),
    );
    const idx = mockPurchases.findIndex((p) => p.id === receivePO.id);
    if (idx !== -1) {
      mockPurchases[idx].status = "Received";
      mockPurchases[idx].received_at = new Date().toISOString();
    }

    // Update product quantities
    const poLines = receivePO._lines || [];
    poLines.forEach((line) => {
      const prod = mockProducts.find((p) => p.id === line.product_id);
      if (prod) prod.quantity += Number(line.qty) || 0;
    });

    // Record stock movements for audit trail
    const now = new Date().toISOString();
    poLines.forEach((line) => {
      if (line.product_id) {
        mockStockMovements.push({
          id: `sm-${Date.now()}-${line.product_id}`,
          product_id: line.product_id,
          type: "purchase",
          quantity_change: Number(line.qty) || 0,
          reason: "Purchase Order received",
          reference_id: receivePO.id,
          created_by: "demo-admin",
          created_at: now,
        });
      }
    });

    setReceiveMsg("PO received — stock updated.");
    setTimeout(() => {
      setReceiveMsg("");
      setShowReceive(false);
      setReceivePO(null);
    }, 1800);
  };

  const handleCancel = (po) => {
    setPurchases((prev) =>
      prev.map((p) => (p.id === po.id ? { ...p, status: "Cancelled" } : p)),
    );
    const idx = mockPurchases.findIndex((p) => p.id === po.id);
    if (idx !== -1) mockPurchases[idx].status = "Cancelled";
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
          Purchasing
        </h2>
        <button className="btn btn-accent" onClick={() => setShowAdd(true)}>
          + New PO
        </button>
      </div>

      <div className="stat-grid">
        <StatCard value={purchases.length} label="Total Orders" />
        <StatCard
          value={pendingCount}
          label="Pending"
          variant={pendingCount > 0 ? "warn" : undefined}
        />
        <StatCard
          value={receivedThisMonth}
          label="Received This Month"
          variant="ok"
        />
        <StatCard value={fmt(totalValue)} label="Total Value" />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="results-table">
            <thead>
              <tr>
                <th>PO#</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Total ₦</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((po) => {
                const supplier = mockSuppliers.find(
                  (s) => s.id === po.supplier_id,
                );
                const isReceived =
                  po.status === "Received" || po.status === "received";
                const isCancelled = po.status === "Cancelled";
                return (
                  <tr key={po.id}>
                    <td style={{ fontWeight: 700, color: "var(--brand)" }}>
                      {po.po_number}
                    </td>
                    <td>{supplier?.name || po.supplier_id}</td>
                    <td>{fmtDate(po.created_at)}</td>
                    <td>{fmt(po.total)}</td>
                    <td>
                      <Badge variant={statusVariant(po.status)}>
                        {po.status}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: "0.2rem 0.5rem", fontSize: "11px" }}
                          onClick={() => {
                            setViewPO(po);
                            setShowView(true);
                          }}
                        >
                          View
                        </button>
                        {!isReceived && !isCancelled && (
                          <button
                            className="btn btn-ok"
                            style={{
                              padding: "0.2rem 0.5rem",
                              fontSize: "11px",
                            }}
                            onClick={() => {
                              setReceivePO(po);
                              setShowReceive(true);
                            }}
                          >
                            Receive
                          </button>
                        )}
                        {role === "admin" && !isReceived && !isCancelled && (
                          <button
                            className="btn btn-danger"
                            style={{
                              padding: "0.2rem 0.5rem",
                              fontSize: "11px",
                            }}
                            onClick={() => handleCancel(po)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Add PO Modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="New Purchase Order"
        size="lg"
      >
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={labelStyle}>Supplier *</label>
          <select
            className="search-input"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">— Select Supplier —</option>
            {mockSuppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <p className="section-title">Line Items</p>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
              gap: "0.4rem",
              marginBottom: "0.4rem",
              alignItems: "end",
            }}
          >
            <select
              className="search-input"
              value={line.product_id}
              onChange={(e) => updateLine(i, "product_id", e.target.value)}
            >
              <option value="">— Product —</option>
              {mockProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              className="search-input"
              type="number"
              min="1"
              placeholder="Qty"
              value={line.qty}
              onChange={(e) => updateLine(i, "qty", e.target.value)}
            />
            <input
              className="search-input"
              type="number"
              min="0"
              placeholder="Cost ₦"
              value={line.cost_price}
              onChange={(e) => updateLine(i, "cost_price", e.target.value)}
            />
            <input
              className="search-input"
              placeholder="Batch"
              value={line.batch_number}
              onChange={(e) => updateLine(i, "batch_number", e.target.value)}
            />
            <input
              className="search-input"
              type="date"
              value={line.expiry_date}
              onChange={(e) => updateLine(i, "expiry_date", e.target.value)}
            />
            <button
              className="btn btn-danger"
              style={{ padding: "0.3rem 0.5rem" }}
              onClick={() => removeLine(i)}
              disabled={lines.length === 1}
            >
              ×
            </button>
          </div>
        ))}
        <button
          className="btn btn-ghost"
          style={{ marginBottom: "0.75rem", fontSize: "11px" }}
          onClick={addLine}
        >
          + Add Item
        </button>

        <div style={{ marginBottom: "0.75rem" }}>
          <label style={labelStyle}>Notes</label>
          <textarea
            className="search-input"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>

        <div
          style={{
            fontWeight: 700,
            color: "var(--brand)",
            marginBottom: "1rem",
          }}
        >
          Total: {fmt(poTotal)}
        </div>

        <div
          style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}
        >
          <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>
            Cancel
          </button>
          <button className="btn btn-accent" onClick={handleSavePO}>
            Save PO
          </button>
        </div>
      </Modal>

      {/* View PO Modal */}
      <Modal
        open={showView}
        onClose={() => setShowView(false)}
        title={`PO — ${viewPO?.po_number}`}
        size="md"
      >
        {viewPO && (
          <>
            <p style={{ fontSize: "13px", marginBottom: "0.75rem" }}>
              <strong>Supplier:</strong>{" "}
              {mockSuppliers.find((s) => s.id === viewPO.supplier_id)?.name ||
                viewPO.supplier_id}
              <br />
              <strong>Date:</strong> {fmtDate(viewPO.created_at)}
              <br />
              <strong>Status:</strong>{" "}
              <Badge variant={statusVariant(viewPO.status)}>
                {viewPO.status}
              </Badge>
            </p>
            {viewPO._lines ? (
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Cost ₦</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {viewPO._lines.map((l, i) => {
                    const prod = mockProducts.find(
                      (p) => p.id === l.product_id,
                    );
                    return (
                      <tr key={i}>
                        <td>{prod?.name || l.product_id}</td>
                        <td>{l.qty}</td>
                        <td>{fmt(l.cost_price)}</td>
                        <td>{fmt(lineTotal(l))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "var(--muted)", fontSize: "12px" }}>
                Line item detail not available for historical orders.
              </p>
            )}
            <div
              style={{
                fontWeight: 700,
                color: "var(--brand)",
                marginTop: "0.75rem",
              }}
            >
              Total: {fmt(viewPO.total)}
            </div>
          </>
        )}
      </Modal>

      {/* Receive PO Modal */}
      <Modal
        open={showReceive}
        onClose={() => setShowReceive(false)}
        title="Receive Purchase Order"
        size="sm"
      >
        {receivePO && (
          <>
            <p style={{ fontSize: "13px", marginBottom: "0.75rem" }}>
              Receiving <strong>{receivePO.po_number}</strong>. Stock quantities
              will be updated.
            </p>
            {receiveMsg ? (
              <p style={{ color: "var(--ok)", fontWeight: 700 }}>
                {receiveMsg}
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowReceive(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-ok" onClick={handleReceive}>
                  Confirm Receive
                </button>
              </div>
            )}
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
