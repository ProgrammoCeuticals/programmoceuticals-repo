import { mockSettings } from "../../lib/mock";

export default function Receipt({ sale, items, onClose }) {
  if (!sale) return null;

  const fmt = (n) =>
    "₦" +
    Number(n).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="receipt-modal">
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          borderBottom: "1px dashed var(--border)",
        }}
      >
        <strong
          style={{ display: "block", fontSize: "14px", color: "var(--brand)" }}
        >
          {mockSettings.shop_name}
        </strong>
        <span style={{ fontSize: "11px", color: "var(--muted)" }}>
          {mockSettings.shop_address}
        </span>
        <br />
        <span style={{ fontSize: "11px", color: "var(--muted)" }}>
          {mockSettings.shop_phone}
        </span>
      </div>

      <div style={{ padding: "0.75rem 1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.3rem",
          }}
        >
          <span style={{ color: "var(--muted)" }}>Receipt #</span>
          <strong>{sale.receipt_id}</strong>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.3rem",
          }}
        >
          <span style={{ color: "var(--muted)" }}>Customer</span>
          <span>{sale.customer_name || "Walk-In"}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.3rem",
          }}
        >
          <span style={{ color: "var(--muted)" }}>Payment</span>
          <span>{sale.payment_method}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--muted)" }}>Date</span>
          <span>{new Date(sale.created_at).toLocaleString("en-GB")}</span>
        </div>
      </div>

      <table className="results-table" style={{ margin: "0 0 0 0" }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.product_name}</td>
              <td>{item.quantity}</td>
              <td>{fmt(item.unit_price)}</td>
              <td>{fmt(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          padding: "0.75rem 1rem",
          borderTop: "1px dashed var(--border)",
        }}
      >
        {sale.discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Discount</span>
            <span>−{fmt(sale.discount)}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 800,
            fontSize: "14px",
            color: "var(--brand)",
          }}
        >
          <span>TOTAL</span>
          <span>{fmt(sale.total)}</span>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "0.75rem",
          borderTop: "1px dashed var(--border)",
          color: "var(--muted)",
          fontSize: "11px",
        }}
      >
        {mockSettings.receipt_footer}
      </div>

      <div style={{ padding: "0.75rem 1rem", display: "flex", gap: "0.5rem" }}>
        <button
          className="btn btn-ghost"
          onClick={() => window.print()}
          style={{ flex: 1 }}
        >
          Print
        </button>
        <button className="btn btn-ok" onClick={onClose} style={{ flex: 1 }}>
          Done
        </button>
      </div>
    </div>
  );
}
