import { useState } from "react";
import { usePosStore } from "../../store/posStore";
import { useAuthStore } from "../../store/authStore";
import EmptyState from "../ui/EmptyState";

const PAYMENT_METHODS = ["Cash", "Transfer", "Credit", "POS"];

export default function Cart({ onSaleComplete }) {
  const {
    items,
    customer,
    paymentMethod,
    discount,
    discountType,
    removeItem,
    updateQty,
    setOverridePrice,
    setCustomer,
    setPaymentMethod,
    setDiscount,
    getSubtotal,
    getDiscountAmount,
    getTotal,
  } = usePosStore();

  const role = useAuthStore((s) => s.role);
  const [amountTendered, setAmountTendered] = useState("");

  const subtotal = getSubtotal();
  const discountAmt = getDiscountAmount();
  const total = getTotal();
  const fmt = (n) =>
    "₦" +
    Number(n).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const canOverride = role === "admin" || role === "manager";

  const handleComplete = () => {
    if (items.length === 0) return;
    onSaleComplete({
      customer,
      paymentMethod,
      discount: discountAmt,
      subtotal,
      total,
      amountTendered:
        paymentMethod === "Cash" && amountTendered
          ? Number(amountTendered)
          : null,
    });
    setAmountTendered("");
  };

  return (
    <>
      {/* Header */}
      <div className="pos-cart-header">
        CART ({items.length} item{items.length !== 1 ? "s" : ""})
      </div>

      {/* Body */}
      <div className="pos-cart-body">
        {items.length === 0 && (
          <EmptyState
            icon="🛒"
            title="Cart is empty"
            description="Click a product to add it here"
          />
        )}

        {items.map((item) => {
          const basePrice =
            item.overridePrice !== null
              ? item.overridePrice
              : item.product.selling_price;
          return (
            <div
              key={item.id}
              className="cart-item"
              style={{ flexWrap: "wrap" }}
            >
              {/* Name + SKU */}
              <div className="cart-item-name" style={{ width: "100%" }}>
                {item.product.name}
                <span
                  style={{
                    display: "block",
                    fontSize: "10px",
                    color: "var(--muted)",
                  }}
                >
                  {item.product.sku}
                </span>
              </div>

              {/* Qty controls */}
              <button
                className="cart-qty-btn"
                onClick={() => updateQty(item.id, item.qty - 1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span
                style={{
                  minWidth: "24px",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                {item.qty}
              </span>
              <button
                className="cart-qty-btn"
                onClick={() => updateQty(item.id, item.qty + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>

              {/* Line total */}
              <span
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontWeight: 700,
                  color: "var(--brand)",
                  fontSize: "12px",
                }}
              >
                {fmt(basePrice * item.qty)}
              </span>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--danger)",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "0 2px",
                }}
                aria-label={`Remove ${item.product.name}`}
              >
                ×
              </button>

              {/* Override price — admin/manager only */}
              {canOverride && (
                <div style={{ width: "100%", marginTop: "4px" }}>
                  <input
                    type="number"
                    min="0"
                    placeholder="Override price"
                    value={
                      item.overridePrice !== null ? item.overridePrice : ""
                    }
                    onChange={(e) =>
                      setOverridePrice(
                        item.id,
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                    style={{
                      fontSize: "11px",
                      padding: "2px 6px",
                      border: "1px solid var(--border)",
                      width: "120px",
                      outline: "none",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pos-cart-footer">
        {/* Customer */}
        <div style={{ marginBottom: "0.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              marginBottom: "3px",
            }}
          >
            Customer (optional)
          </label>
          <input
            className="search-input"
            placeholder="Customer name"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </div>

        {/* Payment method — three buttons */}
        <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.5rem" }}>
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              style={{
                flex: 1,
                padding: "0.4rem",
                fontSize: "11px",
                fontWeight: 700,
                border: "1px solid var(--border)",
                cursor: "pointer",
                background: paymentMethod === method ? "var(--brand)" : "white",
                color: paymentMethod === method ? "white" : "var(--text)",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
              }}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Discount */}
        <div
          style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem" }}
        >
          <button
            type="button"
            onClick={() =>
              setDiscount(
                discount,
                discountType === "percent" ? "fixed" : "percent",
              )
            }
            style={{
              padding: "0 0.5rem",
              fontSize: "11px",
              fontWeight: 700,
              border: "1px solid var(--border)",
              cursor: "pointer",
              background: "var(--brand-light)",
              color: "var(--brand)",
              minWidth: "36px",
            }}
          >
            {discountType === "percent" ? "%" : "₦"}
          </button>
          <input
            className="search-input"
            type="number"
            min="0"
            placeholder="Discount"
            value={discount || ""}
            onChange={(e) =>
              setDiscount(Number(e.target.value) || 0, discountType)
            }
            style={{ flex: 1 }}
          />
        </div>

        {/* Totals */}
        <div className="cart-totals">
          <div className="cart-total-row">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          {discountAmt > 0 && (
            <div className="cart-total-row">
              <span>Discount</span>
              <span>−{fmt(discountAmt)}</span>
            </div>
          )}
          <div className="cart-total-row grand">
            <span>TOTAL</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        {/* Amount tendered (Cash only) */}
        {paymentMethod === "Cash" && (
          <div style={{ marginTop: "0.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                marginBottom: "3px",
              }}
            >
              Amount Tendered
            </label>
            <input
              className="search-input"
              type="number"
              min={total}
              placeholder={fmt(total)}
              value={amountTendered}
              onChange={(e) => setAmountTendered(e.target.value)}
              style={{ marginBottom: "0.25rem" }}
            />
            {amountTendered && Number(amountTendered) >= total && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--ok)",
                }}
              >
                <span>Change</span>
                <span>{fmt(Number(amountTendered) - total)}</span>
              </div>
            )}
          </div>
        )}

        {/* Complete Sale */}
        <button
          className={`btn${items.length > 0 ? " btn-accent" : ""}`}
          style={{ width: "100%", marginTop: "0.75rem" }}
          disabled={items.length === 0}
          onClick={handleComplete}
        >
          Complete Sale
        </button>
      </div>
    </>
  );
}
