import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { mockSales, mockProducts, mockPurchases } from "../lib/mock";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";

const fmt = (n) =>
  "₦" +
  Number(n).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const fmtDate = (d) => new Date(d).toLocaleDateString("en-GB");

function toDateKey(isoStr) {
  return isoStr.slice(0, 10);
}

export default function Dashboard() {
  const today = toDateKey(new Date().toISOString());

  // Stat 1: Today's sales
  const todaySalesTotal = useMemo(
    () =>
      mockSales
        .filter((s) => toDateKey(s.created_at) === today)
        .reduce((a, s) => a + s.total, 0),
    [today],
  );

  // Stat 3: Low stock
  const lowStockItems = useMemo(
    () => mockProducts.filter((p) => p.quantity <= p.reorder_level),
    [],
  );

  // Stat 4: Expiring soon (≤30 days)
  const expiringSoon = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 30);
    return mockProducts.filter(
      (p) => p.expiry_date && new Date(p.expiry_date) <= cutoff,
    );
  }, []);

  // Stat 5: Pending purchases
  const pendingPurchases = useMemo(
    () => mockPurchases.filter((p) => p.status !== "received"),
    [],
  );

  // Stat 6: Stock value
  const stockValue = useMemo(
    () => mockProducts.reduce((a, p) => a + p.cost_price * p.quantity, 0),
    [],
  );

  // Chart 1: Sales last 7 days
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(toDateKey(d.toISOString()));
    }
    return days.map((dateKey) => ({
      date: new Date(dateKey).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      }),
      total: mockSales
        .filter((s) => toDateKey(s.created_at) === dateKey)
        .reduce((a, s) => a + s.total, 0),
    }));
  }, []);

  // Chart 2: Revenue by payment method
  const byMethod = useMemo(() => {
    const acc = { Cash: 0, Transfer: 0, Credit: 0, POS: 0 };
    mockSales.forEach((s) => {
      if (acc[s.payment_method] !== undefined) acc[s.payment_method] += s.total;
      else acc[s.payment_method] = s.total;
    });
    return Object.entries(acc)
      .filter(([, v]) => v > 0)
      .map(([method, total]) => ({ method, total }));
  }, []);

  // Recent sales: last 10 sorted desc
  const recentSales = useMemo(
    () =>
      [...mockSales]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10),
    [],
  );

  return (
    <div>
      <h2 className="section-title">Dashboard</h2>

      {/* Stat grid */}
      <div className="stat-grid">
        <StatCard
          value={fmt(todaySalesTotal)}
          label="Today's Sales"
          variant={todaySalesTotal > 0 ? "ok" : undefined}
        />
        <StatCard value={mockProducts.length} label="Total Products" />
        <StatCard
          value={lowStockItems.length}
          label="Low Stock Items"
          variant={
            lowStockItems.length > 3
              ? "danger"
              : lowStockItems.length > 0
                ? "warn"
                : undefined
          }
        />
        <StatCard
          value={expiringSoon.length}
          label="Expiring ≤30 Days"
          variant={expiringSoon.length > 0 ? "warn" : undefined}
        />
        <StatCard value={pendingPurchases.length} label="Pending Purchases" />
        <StatCard value={fmt(stockValue)} label="Stock Value" variant="ok" />
      </div>

      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div className="card" style={{ marginBottom: 0 }}>
          <p className="section-title">Sales Last 7 Days</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={last7Days}
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

        <div className="card" style={{ marginBottom: 0 }}>
          <p className="section-title">Revenue by Payment Method</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={byMethod}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="method" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => "₦" + (v / 1000).toFixed(0) + "k"}
              />
              <Tooltip formatter={(v) => fmt(v)} />
              <Bar dataKey="total" fill="#c17f24" name="Total (₦)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="card" style={{ padding: 0, marginBottom: "1.25rem" }}>
        <div style={{ padding: "0.85rem 1rem 0" }}>
          <p className="section-title">Recent Sales</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="results-table">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700, color: "var(--brand)" }}>
                    {s.receipt_id}
                  </td>
                  <td>{s.customer_name}</td>
                  <td>{fmt(s.total)}</td>
                  <td>{s.payment_method}</td>
                  <td>{fmtDate(s.created_at)}</td>
                  <td>
                    <Badge variant={s.status === "voided" ? "danger" : "ok"}>
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "0.85rem 1rem 0" }}>
            <p className="section-title">Low Stock Alert</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="results-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((p) => (
                  <tr key={p.id}>
                    <td>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.quantity}</td>
                    <td>{p.reorder_level}</td>
                    <td>
                      {p.quantity === 0 ? (
                        <Badge variant="danger">OUT</Badge>
                      ) : (
                        <Badge variant="warn">LOW</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
