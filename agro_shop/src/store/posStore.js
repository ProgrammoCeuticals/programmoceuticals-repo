import { create } from "zustand";

export const usePosStore = create((set, get) => ({
  items: [],
  customer: "",
  paymentMethod: "Cash",
  discount: 0,
  discountType: "percent",

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        // Cap at available stock
        const newQty = Math.min(existing.qty + 1, product.quantity);
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, qty: newQty } : i,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { id: product.id, product, qty: 1, overridePrice: null },
        ],
      };
    });
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },

  updateQty: (id, qty) => {
    if (qty < 1) {
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    } else {
      set((state) => {
        const item = state.items.find((i) => i.id === id);
        // Cap at available stock
        const cappedQty = item ? Math.min(qty, item.product.quantity) : qty;
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: cappedQty } : i,
          ),
        };
      });
    }
  },

  setOverridePrice: (id, price) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, overridePrice: price } : i,
      ),
    }));
  },

  setDiscount: (value, type) => set({ discount: value, discountType: type }),
  setCustomer: (name) => set({ customer: name }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  clearCart: () =>
    set({
      items: [],
      customer: "",
      paymentMethod: "Cash",
      discount: 0,
      discountType: "percent",
    }),

  getSubtotal: () => {
    return get().items.reduce((sum, i) => {
      const price =
        i.overridePrice !== null ? i.overridePrice : i.product.selling_price;
      return sum + price * i.qty;
    }, 0);
  },

  getDiscountAmount: () => {
    const { discount, discountType } = get();
    const subtotal = get().getSubtotal();
    return discountType === "percent" ? (subtotal * discount) / 100 : discount;
  },

  getTotal: () => get().getSubtotal() - get().getDiscountAmount(),
}));
