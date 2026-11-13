import { useState } from "react";
import { mockProducts } from "../../lib/mock";
import Badge from "../ui/Badge";
import { usePosStore } from "../../store/posStore";

const CATEGORIES = [
  "All",
  "Veterinary Drugs",
  "Agro Chemicals",
  "Equipment",
  "Consumables",
];

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const addItem = usePosStore((s) => s.addItem);

  const filtered = mockProducts.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (product) => {
    if (product.quantity === 0) return;
    addItem(product);
  };

  return (
    <div>
      {/* Category tabs */}
      <div
        className="tab-bar"
        style={{ marginBottom: "0.75rem", flexWrap: "wrap" }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tab-btn${activeCategory === cat ? " active" : ""}`}
            onClick={() => setActiveCategory(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        className="search-input"
        placeholder="Search by name or SKU..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "0.75rem" }}
      />

      {/* Product grid */}
      <div className="product-grid">
        {filtered.map((p) => {
          const outOfStock = p.quantity === 0;
          const lowStock = !outOfStock && p.quantity <= p.reorder_level;

          return (
            <div
              key={p.id}
              className="product-card"
              onClick={() => handleCardClick(p)}
              title={outOfStock ? "Out of stock" : `Add ${p.name} to cart`}
              style={
                outOfStock ? { opacity: 0.5, cursor: "not-allowed" } : undefined
              }
            >
              {/* Stock badge — top right */}
              {outOfStock && (
                <span className="product-card-stock">
                  <Badge variant="danger">OUT</Badge>
                </span>
              )}
              {lowStock && !outOfStock && (
                <span className="product-card-stock">
                  <Badge variant="warn">LOW</Badge>
                </span>
              )}

              <div className="product-card-name">{p.name}</div>
              <div className="product-card-sku">{p.sku}</div>
              <div className="product-card-price">
                ₦{p.selling_price.toLocaleString()}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: "13px",
              padding: "2rem 0",
            }}
          >
            No products found
          </p>
        )}
      </div>
    </div>
  );
}
