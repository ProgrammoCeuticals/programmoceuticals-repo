import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { mockSales, mockSaleItems } from "../lib/mock";
import { useAuthStore } from "../store/authStore";
import Badge from "../components/ui/Badge";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import StatCard from "../components/ui/StatCard";

const fmt = (n) =>
  "₦" +
  Number(n).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB");
const PAGE_SIZE = 20;

function getDateRange(filter) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (filter === "Today") return [today, new Date(today.getTime() + 86400000)];
  if (filter === "This Week") {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return [start, new Date(now.getTime() + 86400000)];
  }
  if (filter === "This Month") {
    return [
      new Date(now.getFullYear(), now.getMonth(), 1),
      new Date(now.getTime() + 86400000),
    ];
  }
  return [null, null];
}

export default function Sales() {
  const role = useAuthStore((s) => s.role);
  const canVoid = role === "admin" || role === "manager";

  // Reactive local copy for void updates
  const [sales, setSales] = useState(() => [...mockSales]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [payFilter, setPayFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [voidTarget, setVoidTarget] = useState(null);
  const [voidReason, setVoidReason] = useState("");

  // Stats
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayTotal = useMemo(
    () =>
      sales
        .filter((s) => new Date(s.created_at) >= todayStart)
        .reduce((a, s) => a + s.total, 0),
    [sales],
  );
  const todayCount = useMemo(
    () => sales.filter((s) => new Date(s.created_at) >= todayStart).length,
    [sales],
  );
  const monthTotal = useMemo(
    () =>
      sales
        .filter((s) => new Date(s.created_at) >= monthStart)
        .reduce((a, s) => a + s.total, 0),
    [sales],
  );
  const allTotal = useMemo(
    () => sales.reduce((a, s) => a + s.total, 0),
    [sales],
  );

  const filtered = useMemo(() => {
    const [start, end] = getDateRange(dateFilter);
    return sales
      .filter((s) => {
        const dt = new Date(s.created_at);
        const matchDate = !start || (dt >= start && dt < end);
        const matchPay = payFilter === "All" || s.payment_method === payFilter;
        const matchSearch =
          s.receipt_id.toLowerCase().includes(search.toLowerCase()) ||
          (s.customer_name || "").toLowerCase().includes(search.toLowerCase());
        return matchDate && matchPay && matchSearch;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [sales, search, dateFilter, payFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleVoid = () => {
    const reason = voidReason.trim() || "Voided by manager";
    setSales((prev) =>
      prev.map((s) =>
        s.id === voidTarget.id
          ? { ...s, status: "voided", void_reason: reason }
          : s,
      ),
    );
    const idx = mockSales.findIndex((s) => s.id === voidTarget.id);
    if (idx !== -1) {
      mockSales[idx].status = "voided";
      mockSales[idx].void_reason = reason;
    }
    setVoidTarget(null);
    setVoidReason("");
  };

  const handleExport = () => {
    const rows = filtered.map((s) => ({
      "Receipt ID": s.receipt_id,
      Date: fmtDate(s.created_at),
      Customer: s.customer_name,
      Payment: s.payment_method,
      "Total (₦)": s.total,
      Status: s.status,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, "Sales.xlsx");
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
          Sales History
        </h2>
        <button className="btn btn-ghost" onClick={handleExport}>
          Export Excel
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard value={fmt(todayTotal)} label="Today's Sales" variant="ok" />
        <StatCard value={todayCount} label="Today's Count" />
        <StatCard value={fmt(monthTotal)} label="This Month" variant="ok" />
        <StatCard value={fmt(allTotal)} label="All Time" variant="ok" />
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
          placeholder="Search receipt ID or customer…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="search-input"
          style={{ flex: "0 0 160px" }}
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
        >
          {["All", "Today", "This Week", "This Month"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select
          className="search-input"
          style={{ flex: "0 0 140px" }}
          value={payFilter}
          onChange={(e) => {
            setPayFilter(e.target.value);
            setPage(1);
          }}
        >
          {["All", "Cash", "Transfer", "Credit", "POS"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table className="results-table">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Date/Time</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total ₦</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((s) => {
                const items = mockSaleItems.filter((i) => i.sale_id === s.id);
                const isExpanded = expandedId === s.id;
                return (
                  <>
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700, color: "var(--brand)" }}>
                        {s.receipt_id}
                      </td>
                      <td>{fmtDate(s.created_at)}</td>
                      <td>{s.customer_name}</td>
                      <td>{items.length}</td>
                      <td>{fmt(s.total)}</td>
                      <td>{s.payment_method}</td>
                      <td>
                        <Badge
                          variant={s.status === "voided" ? "danger" : "ok"}
                        >
                          {s.status}
                        </Badge>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <button
                            className="btn btn-ghost"
                            style={{
                              padding: "0.2rem 0.5rem",
                              fontSize: "11px",
                            }}
                            onClick={() =>
                              setExpandedId(isExpanded ? null : s.id)
                            }
                          >
                            {isExpanded ? "Hide" : "View"}
                          </button>
                          {canVoid && s.status !== "voided" && (
                            <button
                              className="btn btn-danger"
                              style={{
                                padding: "0.2rem 0.5rem",
                                fontSize: "11px",
                              }}
                              onClick={() => {
                                setVoidTarget(s);
                                setVoidReason("");
                              }}
                            >
                              Void
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${s.id}-detail`}>
                        <td
                          colSpan={8}
                          style={{
                            background: "#f7f8fa",
                            padding: "0.75rem 1rem",
                          }}
                        >
                          <table
                            className="results-table"
                            style={{ margin: 0 }}
                          >
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((i) => (
                                <tr key={i.id}>
                                  <td>{i.product_name}</td>
                                  <td>{i.sku || "—"}</td>
                                  <td>{i.quantity}</td>
                                  <td>{fmt(i.unit_price)}</td>
                                  <td>{fmt(i.subtotal)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
              {slice.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      color: "var(--muted)",
                      padding: "2rem",
                    }}
                  >
                    No sales found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Void modal */}
      <Modal
        open={!!voidTarget}
        onClose={() => setVoidTarget(null)}
        title="Void Sale"
        size="sm"
      >
        {voidTarget && (
          <>
            <p style={{ fontSize: "13px", marginBottom: "0.75rem" }}>
              Voiding <strong>{voidTarget.receipt_id}</strong>. This action
              cannot be undone.
            </p>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Reason</label>
              <textarea
                className="search-input"
                rows={3}
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                placeholder="Optional void reason"
                style={{ resize: "vertical" }}
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
                onClick={() => setVoidTarget(null)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleVoid}>
                Void Sale
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
