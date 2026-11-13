import { useState } from "react";
import {
  mockProducts,
  mockSales,
  mockSaleItems,
  mockStockMovements,
} from "../lib/mock";
import { usePosStore } from "../store/posStore";
import { useAuthStore } from "../store/authStore";
import ProductSearch from "../components/pos/ProductSearch";
import Cart from "../components/pos/Cart";
import Receipt from "../components/pos/Receipt";
import Modal from "../components/ui/Modal";

// Module-level receipt counter (starts after existing mock sales)
let receiptCounter = mockSales.length;

function todayStr() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

export default function POS() {
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [lastItems, setLastItems] = useState([]);
  const clearCart = usePosStore((s) => s.clearCart);
  const { items } = usePosStore();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  const handleCompleteSale = (saleData) => {
    receiptCounter++;
    const receiptId = `RCPT-${todayStr()}-${String(receiptCounter).padStart(4, "0")}`;
    const now = new Date();

    // Build sale items from cart
    const saleItems = items.map((i) => {
      const price =
        i.overridePrice !== null ? i.overridePrice : i.product.selling_price;
      return {
        product_name: i.product.name,
        sku: i.product.sku,
        quantity: i.qty,
        unit_price: price,
        subtotal: price * i.qty,
        product_id: i.product.id,
      };
    });

    // Build sale record first so we can reference its id in stock movements
    const saleId = `sale-${Date.now()}`;
    const newSale = {
      id: saleId,
      receipt_id: receiptId,
      customer_name: saleData.customer || "Walk-In Customer",
      payment_method: saleData.paymentMethod,
      total: saleData.total,
      discount: saleData.discount,
      subtotal: saleData.subtotal,
      amount_tendered: saleData.amountTendered,
      user_id: user?.id || "demo-admin",
      cashier_name: profile?.full_name || "Demo Admin",
      status: "completed",
      created_at: now.toISOString(),
    };

    // Deduct quantities from mockProducts in-place
    items.forEach((i) => {
      const prod = mockProducts.find((p) => p.id === i.product.id);
      if (prod) prod.quantity = Math.max(0, prod.quantity - i.qty);
    });

    // Record stock movements for audit trail
    items.forEach((i) => {
      mockStockMovements.push({
        id: `sm-${Date.now()}-${i.product.id}`,
        product_id: i.product.id,
        type: "sale",
        quantity_change: -i.qty,
        reason: "Sale",
        reference_id: saleId,
        created_by: user?.id || "demo-admin",
        created_at: now.toISOString(),
      });
    });

    // Push sale to mockSales
    mockSales.push(newSale);

    // Push sale items to mockSaleItems so Sales/Reports pages can read them
    saleItems.forEach((item) => {
      mockSaleItems.push({
        id: `si-${Date.now()}-${item.product_id}`,
        sale_id: saleId,
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      });
    });

    setLastSale({ ...newSale, receiptId });
    setLastItems(saleItems);
    setShowReceipt(true);
  };

  const handleClose = () => {
    setShowReceipt(false);
    setLastSale(null);
    setLastItems([]);
    clearCart();
  };

  return (
    <>
      <div className="pos-layout">
        <div className="pos-products">
          <ProductSearch />
        </div>
        <div className="pos-cart">
          <Cart onSaleComplete={handleCompleteSale} />
        </div>
      </div>

      <Modal open={showReceipt} onClose={handleClose} title="Receipt" size="sm">
        <Receipt sale={lastSale} items={lastItems} onClose={handleClose} />
      </Modal>
    </>
  );
}
