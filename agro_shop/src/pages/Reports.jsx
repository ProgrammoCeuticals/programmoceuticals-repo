import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  mockSales,
  mockSaleItems,
  mockProducts,
  mockExpenses,
} from "../lib/mock";
import { useAuthStore } from "../store/authStore";
import StatCard from "../components/ui/StatCard";

const fmt = (n) =>
  "₦" +
  Number(n).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB");
const TABS = ["Sales Summary", "Inventory", "Profit & Loss"];

function toDateKey(isoStr) {
  return isoStr.slice(0, 10);
}

function thisMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .slice(0, 10);
  return [start, end];
}

export default function Reports() {
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

  const [tab, setTab] = useState("Sales Summary");

  // Sales Summary state
  const [defaultStart, defaultEnd] = thisMonthRange();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  // P&L month
  const now = new Date();
  const [plMonth, setPlMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );

  // ── Sales Summary ────────────────────────────────────────────────────────
  const filteredSales = useMemo(() => {
    const s = new Date(startDate);
    s.setHours(0, 0, 0, 0);
    const e = new Date(endDate);
    e.setHours(23, 59, 59, 999);
    return mockSales.filter((sale) => {
      const d = new Date(sale.created_at);
      return d >= s && d <= e;
    });
  }, [startDate, endDate]);

  const totalRevenue = useMemo(
    () => filteredSales.reduce((a, s) => a + s.total, 0),
    [filteredSales],
  );
  const avgSale =
    filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  const topPayMethod = useMemo(() => {
    const acc = {};
    filteredSales.forEach((s) => {
      acc[s.payment_method] = (acc[s.payment_method] || 0) + s.total;
    });
    return Object.entries(acc).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  }, [filteredSales]);

  // Top 5 products
  const top5Products = useMemo(() => {
    const filteredIds = new Set(filteredSales.map((s) => s.id));
    const items = mockSaleItems.filter((i) => filteredIds.has(i.sale_id));
    const acc = {};
    items.forEach((i) => {
      if (!acc[i.product_id])
        acc[i.product_id] = { name: i.product_name, qty: 0, revenue: 0 };
      acc[i.product_id].qty += Number(i.quantity);
      acc[i.product_id].revenue += Number(i.subtotal);
    });
    return Object.values(acc)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredSales]);

  // Daily chart data within range
  const dailyData = useMemo(() => {
    const acc = {};
    filteredSales.forEach((s) => {
      const d = toDateKey(s.created_at);
      acc[d] = (acc[d] || 0) + s.total;
    });
    return Object.entries(acc)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({
        date: new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        }),
        total,
      }));
  }, [filteredSales]);

  const exportSalesSummary = () => {
    const rows = filteredSales.map((s) => ({
      "Receipt ID": s.receipt_id,
      Date: fmtDate(s.created_at),
      Customer: s.customer_name,
      Payment: s.payment_method,
      "Total (₦)": s.total,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Summary");
    XLSX.writeFile(wb, "Sales-Summary.xlsx");
  };

  // ── Inventory Report ──────────────────────────────────────────────────────
  const inventoryRows = useMemo(
    () =>
      [...mockProducts]
        .map((p) => ({ ...p, totalValue: p.cost_price * p.quantity }))
        .sort((a, b) => b.totalValue - a.totalValue),
    [],
  );
  const inventoryGrandTotal = inventoryRows.reduce(
    (a, p) => a + p.totalValue,
    0,
  );

  const exportInventory = () => {
    const rows = inventoryRows.map((p) => ({
      SKU: p.sku,
      Name: p.name,
      Category: p.category,
      "Unit Cost (₦)": p.cost_price,
      Qty: p.quantity,
      "Total Value (₦)": p.totalValue,
    }));
    rows.push({
      SKU: "",
      Name: "GRAND TOTAL",
      Category: "",
      "Unit Cost (₦)": "",
      Qty: "",
      "Total Value (₦)": inventoryGrandTotal,
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory Report");
    XLSX.writeFile(wb, "Inventory-Report.xlsx");
  };

  // ── P&L ───────────────────────────────────────────────────────────────────
  const [plYear, plMonthNum] = plMonth.split("-").map(Number);
  const plStart = new Date(plYear, plMonthNum - 1, 1);
  const plEnd = new Date(plYear, plMonthNum, 0, 23, 59, 59);

  const plSales = useMemo(
    () =>
      mockSales.filter((s) => {
        const d = new Date(s.created_at);
        return d >= plStart && d <= plEnd;
      }),
    [plMonth],
  );
  const plRevenue = useMemo(
    () => plSales.reduce((a, s) => a + s.total, 0),
    [plSales],
  );

  const plCOGS = useMemo(() => {
    const ids = new Set(plSales.map((s) => s.id));
    const items = mockSaleItems.filter((i) => ids.has(i.sale_id));
    return items.reduce((a, i) => {
      const prod = mockProducts.find((p) => p.id === i.product_id);
      return a + (prod ? prod.cost_price * Number(i.quantity) : 0);
    }, 0);
  }, [plSales]);

  const plGrossProfit = plRevenue - plCOGS;
  const plExpenses = useMemo(
    () =>
      mockExpenses
        .filter((e) => {
          const d = new Date(e.date);
          return d >= plStart && d <= plEnd;
        })
        .reduce((a, e) => a + e.amount, 0),
    [plMonth],
  );
  const plNet = plGrossProfit - plExpenses;

  const exportPL = () => {
    const rows = [
      { Line: "Revenue", "Amount (₦)": plRevenue },
      { Line: "COGS", "Amount (₦)": plCOGS },
      { Line: "Gross Profit", "Amount (₦)": plGrossProfit },
      { Line: "Total Expenses", "Amount (₦)": plExpenses },
      { Line: "Net Profit", "Amount (₦)": plNet },
    ];
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "P&L");
    XLSX.writeFile(wb, "PL-Report.xlsx");
  };

  return (
    <div>
      <h2 className="section-title">Reports</h2>

      <div className="tab-bar" style={{ marginBottom: "1rem" }}>
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab-btn${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Sales Summary ── */}
      {tab === "Sales Summary" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <label style={labelStyle}>From</label>
              <input
                className="search-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: "160px" }}
              />
            </div>
            <div>
              <label style={labelStyle}>To</label>
              <input
                className="search-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: "160px" }}
              />
            </div>
            <button
              className="btn btn-ghost"
              style={{ marginTop: "16px" }}
              onClick={exportSalesSummary}
            >
              Export Excel
            </button>
          </div>

          <div className="stat-grid">
            <StatCard
              value={fmt(totalRevenue)}
              label="Total Revenue"
              variant="ok"
            />
            <StatCard value={filteredSales.length} label="Transactions" />
            <StatCard value={fmt(avgSale)} label="Avg Sale" />
            <StatCard value={topPayMethod} label="Top Payment" />
          </div>

          <div className="card" style={{ padding: 0, marginBottom: "1.25rem" }}>
            <div style={{ padding: "0.85rem 1rem 0" }}>
              <p className="section-title">Top 5 Products</p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Units Sold</th>
                    <th>Revenue ₦</th>
                  </tr>
                </thead>
                <tbody>
                  {top5Products.map((p, i) => (
                    <tr key={i}>
                      <td>{p.name}</td>
                      <td>{p.qty}</td>
                      <td>{fmt(p.revenue)}</td>
                    </tr>
                  ))}
                  {top5Products.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          textAlign: "center",
                          color: "var(--muted)",
                          padding: "1rem",
                        }}
                      >
                        No sales in range
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {dailyData.length > 0 && (
            <div className="card">
              <p className="section-title">Daily Sales in Range</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={dailyData}
                  margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => "₦" + (v / 1000).toFixed(0) + "k"}
                  />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Bar dataKey="total" fill="#193441" name="Total (₦)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ── Inventory ── */}
      {tab === "Inventory" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "0.75rem",
            }}
          >
            <button className="btn btn-ghost" onClick={exportInventory}>
              Export Excel
            </button>
          </div>
          <div className="card" style={{ padding: 0 }}>
            <div style={{ overflowX: "auto" }}>
              <table className="results-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Unit Cost ₦</th>
                    <th>Qty</th>
                    <th>Total Value ₦</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryRows.map((p) => (
                    <tr key={p.id}>
                      <td>{p.sku}</td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>{fmt(p.cost_price)}</td>
                      <td>{p.quantity}</td>
                      <td style={{ fontWeight: 700 }}>{fmt(p.totalValue)}</td>
                    </tr>
                  ))}
                  <tr
                    style={{
                      background: "var(--brand-light)",
                      fontWeight: 800,
                    }}
                  >
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "right",
                        paddingRight: "1rem",
                        color: "var(--brand)",
                      }}
                    >
                      GRAND TOTAL
                    </td>
                    <td style={{ color: "var(--brand)" }}>
                      {fmt(inventoryGrandTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── P&L ── */}
      {tab === "Profit & Loss" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <label style={labelStyle}>Month</label>
              <input
                className="search-input"
                type="month"
                value={plMonth}
                onChange={(e) => setPlMonth(e.target.value)}
                style={{ width: "160px" }}
              />
            </div>
            <button
              className="btn btn-ghost"
              style={{ marginTop: "16px" }}
              onClick={exportPL}
            >
              Export Excel
            </button>
          </div>

          <div className="card" style={{ maxWidth: "560px" }}>
            <p className="section-title">
              Profit & Loss —{" "}
              {new Date(plYear, plMonthNum - 1).toLocaleString("en-NG", {
                month: "long",
                year: "numeric",
              })}
            </p>
            {[
              { label: "Revenue", value: plRevenue, variant: "ok" },
              {
                label: "Cost of Goods Sold (COGS)",
                value: plCOGS,
                variant: "danger",
              },
              {
                label: "Gross Profit",
                value: plGrossProfit,
                variant: plGrossProfit >= 0 ? "ok" : "danger",
              },
              { label: "Total Expenses", value: plExpenses, variant: "danger" },
              {
                label: "Net Profit",
                value: plNet,
                variant: plNet >= 0 ? "ok" : "danger",
              },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.6rem 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight:
                      row.label.startsWith("Net") ||
                      row.label.startsWith("Gross")
                        ? 800
                        : 400,
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color:
                      row.variant === "ok"
                        ? "var(--ok)"
                        : row.variant === "danger"
                          ? "var(--danger)"
                          : "var(--brand)",
                  }}
                >
                  {fmt(row.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
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
