-- AgroVet POS — Supabase Schema
-- Run in Supabase SQL Editor on a fresh project

-- ────────────────────────────────────────────────────────────
-- 1. profiles
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text,
  full_name   text,
  role        text CHECK (role IN ('admin', 'manager', 'cashier')) DEFAULT 'cashier',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ────────────────────────────────────────────────────────────
-- 2. suppliers
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppliers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  contact_person  text,
  phone           text,
  email           text,
  address         text,
  notes           text,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suppliers_select_auth" ON suppliers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "suppliers_insert_admin_manager" ON suppliers
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "suppliers_update_admin_manager" ON suppliers
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "suppliers_delete_admin_manager" ON suppliers
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- ────────────────────────────────────────────────────────────
-- 3. products
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  category        text CHECK (category IN ('Veterinary Drugs', 'Agro Chemicals', 'Equipment', 'Consumables')),
  sub_category    text,
  sku             text UNIQUE NOT NULL,
  unit            text,
  pack_size       text,
  quantity        int DEFAULT 0,
  reorder_level   int DEFAULT 5,
  cost_price      numeric(12, 2),
  selling_price   numeric(12, 2),
  supplier_id     uuid REFERENCES suppliers(id),
  batch_number    text,
  expiry_date     date,
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_auth" ON products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "products_insert_admin_manager" ON products
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "products_update_admin_manager" ON products
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Cashiers can update product quantity only (needed for stock deduction at sale time)
CREATE POLICY "products_update_cashier_qty" ON products
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'cashier'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'cashier'
  );

CREATE POLICY "products_delete_admin_manager" ON products
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- ────────────────────────────────────────────────────────────
-- 4. stock_movements
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stock_movements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid REFERENCES products(id),
  type            text CHECK (type IN ('sale', 'purchase', 'adjustment')),
  quantity_change int,
  reason          text,
  reference_id    uuid,
  created_by      uuid REFERENCES profiles(id),
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stock_movements_select_auth" ON stock_movements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "stock_movements_insert_auth" ON stock_movements
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "stock_movements_update_admin_manager" ON stock_movements
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "stock_movements_delete_admin_manager" ON stock_movements
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- ────────────────────────────────────────────────────────────
-- 5. customers
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       text NOT NULL,
  phone           text,
  email           text,
  address         text,
  credit_limit    numeric(12, 2) DEFAULT 0,
  outstanding_debt numeric(12, 2) DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers_select_auth" ON customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "customers_insert_admin_manager" ON customers
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "customers_update_admin_manager" ON customers
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "customers_delete_admin_manager" ON customers
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- ────────────────────────────────────────────────────────────
-- 6. sales
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id       text UNIQUE NOT NULL,
  customer_id      uuid REFERENCES customers(id),
  customer_name    text,
  cashier_id       uuid REFERENCES profiles(id),
  cashier_name     text,
  subtotal         numeric(12, 2),
  discount_amount  numeric(12, 2) DEFAULT 0,
  total            numeric(12, 2),
  payment_method   text CHECK (payment_method IN ('Cash', 'Transfer', 'Credit', 'POS')),
  amount_tendered  numeric(12, 2),
  change_amount    numeric(12, 2) DEFAULT 0,
  status           text DEFAULT 'completed' CHECK (status IN ('completed', 'voided')),
  void_reason      text,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales_select_auth" ON sales
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "sales_insert_auth" ON sales
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "sales_update_admin_manager" ON sales
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "sales_delete_admin_manager" ON sales
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- ────────────────────────────────────────────────────────────
-- 7. sale_items
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sale_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id       uuid REFERENCES sales(id) ON DELETE CASCADE,
  product_id    uuid REFERENCES products(id),
  product_name  text,
  sku           text,
  quantity      int,
  unit_price    numeric(12, 2),
  subtotal      numeric(12, 2)
);

ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sale_items_select_auth" ON sale_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "sale_items_insert_auth" ON sale_items
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "sale_items_update_admin_manager" ON sale_items
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "sale_items_delete_admin_manager" ON sale_items
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- ────────────────────────────────────────────────────────────
-- 8. purchases
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchases (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number    text UNIQUE NOT NULL,
  supplier_id  uuid REFERENCES suppliers(id),
  status       text DEFAULT 'Draft' CHECK (status IN ('Draft', 'Ordered', 'Received', 'Cancelled')),
  total        numeric(12, 2),
  notes        text,
  created_by   uuid REFERENCES profiles(id),
  created_at   timestamptz DEFAULT now(),
  received_at  timestamptz
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchases_select_auth" ON purchases
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "purchases_insert_admin_manager" ON purchases
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "purchases_update_admin_manager" ON purchases
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "purchases_delete_admin_manager" ON purchases
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- ────────────────────────────────────────────────────────────
-- 9. purchase_items
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id   uuid REFERENCES purchases(id) ON DELETE CASCADE,
  product_id    uuid REFERENCES products(id),
  product_name  text,
  quantity      int,
  cost_price    numeric(12, 2),
  batch_number  text,
  expiry_date   date,
  subtotal      numeric(12, 2)
);

ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchase_items_select_auth" ON purchase_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "purchase_items_insert_admin_manager" ON purchase_items
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "purchase_items_update_admin_manager" ON purchase_items
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "purchase_items_delete_admin_manager" ON purchase_items
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- ────────────────────────────────────────────────────────────
-- 10. customer_payments
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customer_payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid REFERENCES customers(id),
  amount        numeric(12, 2),
  payment_date  date,
  recorded_by   uuid REFERENCES profiles(id),
  notes         text,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE customer_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customer_payments_select_auth" ON customer_payments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "customer_payments_insert_admin_manager" ON customer_payments
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "customer_payments_update_admin_manager" ON customer_payments
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "customer_payments_delete_admin_manager" ON customer_payments
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- ────────────────────────────────────────────────────────────
-- 11. expenses
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category      text CHECK (category IN ('Rent', 'Salaries', 'Utilities', 'Repairs', 'Other', 'Electricity', 'Water', 'Stationery', 'Transport', 'Maintenance', 'Advertising')),
  description   text,
  amount        numeric(12, 2),
  expense_date  date,
  recorded_by   uuid REFERENCES profiles(id),
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "expenses_select_auth" ON expenses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "expenses_insert_admin_manager" ON expenses
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "expenses_update_admin_manager" ON expenses
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "expenses_delete_admin_manager" ON expenses
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- ────────────────────────────────────────────────────────────
-- 12. settings
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text UNIQUE NOT NULL,
  value       text,
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select_auth" ON settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "settings_insert_admin" ON settings
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "settings_update_admin" ON settings
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "settings_delete_admin" ON settings
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
