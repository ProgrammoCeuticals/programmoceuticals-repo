-- AgroVet POS — Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor.
-- Note: auth users must be created manually in Supabase Authentication.
-- See demo credentials comment block at the bottom of this file.

-- ────────────────────────────────────────────────────────────
-- Suppliers
-- ────────────────────────────────────────────────────────────
INSERT INTO suppliers (id, name, contact_person, phone, email, address) VALUES
  ('00000000-0000-0000-0000-000000000001', 'AgroChemicals West Africa Ltd',  'Alhaji Musa Danjuma', '0803 111 2233', 'sales@acwa.ng',      '14 Industrial Layout, Kano'),
  ('00000000-0000-0000-0000-000000000002', 'VetPharma Nigeria Distributors', 'Mrs Ngozi Obi',       '0801 444 5566', 'orders@vetpharma.ng','7 Market Crescent, Lagos'),
  ('00000000-0000-0000-0000-000000000003', 'GreenFields Agro Supply',        'Mr Emeka Nwachukwu',  '0809 777 8899', 'info@greenfields.ng','3 Farm Road, Enugu'),
  ('00000000-0000-0000-0000-000000000004', 'Sahel Animal Health Supplies',   'Usman Bello',         '0806 222 3344', 'contact@sahel-ahs.ng','22 Bypass Road, Maiduguri');

-- ────────────────────────────────────────────────────────────
-- Customers
-- ────────────────────────────────────────────────────────────
INSERT INTO customers (id, full_name, phone, email, address, credit_limit, outstanding_debt) VALUES
  ('00000000-0000-0000-0001-000000000001', 'Garba Farms Ltd',            '0802 100 2001', 'garba@garbafarms.ng',   'No. 5 Poultry Road, Kano',   100000, 15000),
  ('00000000-0000-0000-0001-000000000002', 'Fatima Livestock Services',  '0705 300 4002', 'fatima@livestock.ng',   '12 Cattle Lane, Sokoto',      50000,  0),
  ('00000000-0000-0000-0001-000000000003', 'Adamu Crop Consultancy',     '0814 500 6003', 'adamu@cropconsult.ng',  '8 Market Square, Ibadan',     75000,  32000),
  ('00000000-0000-0000-0001-000000000004', 'Blessing Agro Cooperative',  '0703 700 8004', 'blessing@agrocoop.ng',  '3 Coop Avenue, Enugu',        200000, 0),
  ('00000000-0000-0000-0001-000000000005', 'Walk-In Customer',           '',              '',                      '',                            0,      0);

-- ────────────────────────────────────────────────────────────
-- Products (25)
-- ────────────────────────────────────────────────────────────
INSERT INTO products (id, name, category, sub_category, sku, unit, pack_size, quantity, reorder_level, cost_price, selling_price, supplier_id, batch_number, expiry_date, notes) VALUES
  -- Veterinary Drugs (10)
  ('00000000-0000-0000-0002-000000000001','Oxytetracycline 20% Injection', 'Veterinary Drugs','Antibiotics',          'VD-001','Bottle','100ml', 85, 20, 1200.00,1800.00,'00000000-0000-0000-0000-000000000002','BAT-2024-001','2026-06-30','Broad-spectrum antibiotic for cattle and poultry.'),
  ('00000000-0000-0000-0002-000000000002','Ivermectin 1% Injection',       'Veterinary Drugs','Antiparasitics',       'VD-002','Bottle','50ml',  60, 15,  900.00,1350.00,'00000000-0000-0000-0000-000000000002','BAT-2024-002','2026-09-30','For internal and external parasites.'),
  ('00000000-0000-0000-0002-000000000003','Ampicillin 250mg Capsules',     'Veterinary Drugs','Antibiotics',          'VD-003','Pack',  '100 caps',120,25,800.00,1200.00,'00000000-0000-0000-0000-000000000002','BAT-2024-003','2025-12-31','Oral antibiotic for poultry.'),
  ('00000000-0000-0000-0002-000000000004','Vitamin B-Complex Injection',   'Veterinary Drugs','Vitamins & Supplements','VD-004','Bottle','100ml',95, 20,  600.00, 950.00,'00000000-0000-0000-0000-000000000002','BAT-2024-004','2026-03-31','Supportive therapy for stressed animals.'),
  ('00000000-0000-0000-0002-000000000005','Albendazole Oral Suspension',   'Veterinary Drugs','Antiparasitics',       'VD-005','Bottle','1L',    40, 10, 1500.00,2200.00,'00000000-0000-0000-0000-000000000004','BAT-2024-005','2026-11-30','Broad-spectrum anthelmintic.'),
  ('00000000-0000-0000-0002-000000000006','Gentamicin 10% Injection',      'Veterinary Drugs','Antibiotics',          'VD-006','Bottle','100ml', 55, 15, 1100.00,1650.00,'00000000-0000-0000-0000-000000000002','BAT-2024-006','2026-05-31','Aminoglycoside antibiotic, injectable.'),
  ('00000000-0000-0000-0002-000000000007','Enrofloxacin 10% Oral Solution','Veterinary Drugs','Antibiotics',          'VD-007','Bottle','100ml', 70, 20, 1400.00,2100.00,'00000000-0000-0000-0000-000000000002','BAT-2024-007','2026-08-31','Fluoroquinolone for respiratory infections.'),
  ('00000000-0000-0000-0002-000000000008','Newcastle Disease Vaccine',     'Veterinary Drugs','Vaccines',             'VD-008','Vial',  '1000 doses',30,10,2200.00,3000.00,'00000000-0000-0000-0000-000000000004','BAT-2024-008','2025-06-30','Store at 2-8°C. Poultry vaccine.'),
  ('00000000-0000-0000-0002-000000000009','Multivitamin Poultry Supplement','Veterinary Drugs','Vitamins & Supplements','VD-009','Pack','1kg', 150,30, 700.00,1100.00,'00000000-0000-0000-0000-000000000002','BAT-2024-009','2026-10-31','Water-soluble vitamin supplement for broilers.'),
  ('00000000-0000-0000-0002-000000000010','Penicillin G Procaine Injection','Veterinary Drugs','Antibiotics',         'VD-010','Vial',  '100ml', 75, 20,  950.00,1450.00,'00000000-0000-0000-0000-000000000002','BAT-2024-010','2026-04-30','Long-acting penicillin for cattle.'),
  -- Agro Chemicals (8)
  ('00000000-0000-0000-0002-000000000011','Glyphosate 360g/L Herbicide',   'Agro Chemicals','Herbicides',   'AC-001','Litre','1L', 200,30,1100.00,1600.00,'00000000-0000-0000-0000-000000000001','BAT-2024-011','2027-01-31','Systemic non-selective herbicide.'),
  ('00000000-0000-0000-0002-000000000012','Cypermethrin 10EC Insecticide', 'Agro Chemicals','Insecticides',  'AC-002','Litre','1L', 130,25, 950.00,1400.00,'00000000-0000-0000-0000-000000000001','BAT-2024-012','2027-03-31','Contact and stomach insecticide for crops.'),
  ('00000000-0000-0000-0002-000000000013','Emamectin Benzoate 5% WG',      'Agro Chemicals','Insecticides',  'AC-003','Pack', '100g',90,20,1800.00,2600.00,'00000000-0000-0000-0000-000000000001','BAT-2024-013','2026-12-31','Highly effective for caterpillar control.'),
  ('00000000-0000-0000-0002-000000000014','Carbendazim 50WP Fungicide',    'Agro Chemicals','Fungicides',    'AC-004','Pack', '500g',75,15,1300.00,1900.00,'00000000-0000-0000-0000-000000000003','BAT-2024-014','2027-06-30','Systemic fungicide for cereals and vegetables.'),
  ('00000000-0000-0000-0002-000000000015','Lambda-cyhalothrin 2.5EC',      'Agro Chemicals','Insecticides',  'AC-005','Litre','1L', 110,20,1050.00,1550.00,'00000000-0000-0000-0000-000000000001','BAT-2024-015','2027-02-28','Pyrethroid insecticide, wide-spectrum.'),
  ('00000000-0000-0000-0002-000000000016','NPK 15-15-15 Fertilizer',       'Agro Chemicals','Fertilizers',   'AC-006','Bag',  '50kg',180,30,25000.00,32000.00,'00000000-0000-0000-0000-000000000003','BAT-2024-016','2026-06-30','Balanced NPK for general crop use.'),
  ('00000000-0000-0000-0002-000000000017','Urea 46% Fertilizer',           'Agro Chemicals','Fertilizers',   'AC-007','Bag',  '50kg',160,30,22000.00,28000.00,'00000000-0000-0000-0000-000000000003','BAT-2024-017','2026-04-30','High-nitrogen fertilizer for leafy crops.'),
  ('00000000-0000-0000-0002-000000000018','Calcium Ammonium Nitrate',      'Agro Chemicals','Fertilizers',   'AC-008','Bag',  '50kg',100,20,24000.00,30000.00,'00000000-0000-0000-0000-000000000003','BAT-2024-018','2026-08-31','Calcium and nitrogen soil amendment.'),
  -- Equipment (4)
  ('00000000-0000-0000-0002-000000000019','Motorized Knapsack Sprayer',    'Equipment','Sprayers',        'EQ-001','Unit','1', 15,3,45000.00,62000.00,'00000000-0000-0000-0000-000000000001','BAT-2024-019','2027-12-31','20L tank, petrol engine, 2-year warranty.'),
  ('00000000-0000-0000-0002-000000000020','Hand Pump Sprayer 16L',         'Equipment','Sprayers',        'EQ-002','Unit','1', 35,10,8500.00,12500.00,'00000000-0000-0000-0000-000000000001','BAT-2024-020','2027-12-31','16L capacity manual knapsack sprayer.'),
  ('00000000-0000-0000-0002-000000000021','Digital Weighing Scale 50kg',   'Equipment','Scales',          'EQ-003','Unit','1', 10,2,18000.00,26000.00,'00000000-0000-0000-0000-000000000003','BAT-2024-021','2027-12-31','Stainless steel platform, AC/battery.'),
  ('00000000-0000-0000-0002-000000000022','Animal Ear Tag Applicator',     'Equipment','Livestock Tools', 'EQ-004','Unit','1', 25,5,3500.00,5500.00,'00000000-0000-0000-0000-000000000004','BAT-2024-022','2027-12-31','Compatible with standard ear tags.'),
  -- Consumables (3)
  ('00000000-0000-0000-0002-000000000023','Disposable Syringes 5ml',       'Consumables','Injection Supplies','CO-001','Box','100 units',200,30,1200.00,1800.00,'00000000-0000-0000-0000-000000000004','BAT-2024-023','2026-12-31','Sterile, single-use, with needle.'),
  ('00000000-0000-0000-0002-000000000024','Examination Gloves Medium',     'Consumables','PPE',             'CO-002','Box','100 units',150,25,2500.00,3500.00,'00000000-0000-0000-0000-000000000004','BAT-2024-024','2027-06-30','Powder-free nitrile examination gloves.'),
  ('00000000-0000-0000-0002-000000000025','Cattle Ear Tags Pack',          'Consumables','Livestock Supplies','CO-003','Pack','25 tags',80,15,1800.00,2700.00,'00000000-0000-0000-0000-000000000004','BAT-2024-025','2027-12-31','Yellow numbered plastic tags for cattle ID.');

-- ────────────────────────────────────────────────────────────
-- Expenses
-- ────────────────────────────────────────────────────────────
INSERT INTO expenses (category, description, amount, expense_date) VALUES
  ('Rent',        'Monthly shop rent - January',       45000.00, '2024-01-31'),
  ('Salaries',    'Staff salaries - January',          120000.00,'2024-01-31'),
  ('Electricity', 'EEDC electricity bill - January',   8500.00,  '2024-01-28'),
  ('Water',       'Water bill - January',              2000.00,  '2024-01-28'),
  ('Rent',        'Monthly shop rent - February',      45000.00, '2024-02-29'),
  ('Salaries',    'Staff salaries - February',         120000.00,'2024-02-29'),
  ('Stationery',  'Office supplies and receipt books', 3500.00,  '2024-02-10'),
  ('Transport',   'Delivery fuel and logistics',       12000.00, '2024-02-20'),
  ('Maintenance', 'Generator servicing and repairs',   15000.00, '2024-03-05'),
  ('Advertising', 'Facebook ads and flyers printing',  7500.00,  '2024-03-12');

-- ────────────────────────────────────────────────────────────
-- Settings
-- ────────────────────────────────────────────────────────────
INSERT INTO settings (key, value) VALUES
  ('shop_name',      'AgroVet POS'),
  ('address',        '12 Agro Plaza, Ibadan'),
  ('phone',          '08012345678'),
  ('receipt_footer', 'Thank you for your business!');

-- ────────────────────────────────────────────────────────────
-- DEMO AUTH USERS
-- Create these manually in: Supabase Dashboard → Authentication → Users → Add User
--
--   Email:    admin@agrovet.ng
--   Password: AgroAdmin2024!
--   Role:     admin
--
--   Email:    cashier@agrovet.ng
--   Password: AgroCash2024!
--   Role:     cashier
--
-- After creating each user, insert into profiles:
--   INSERT INTO profiles (id, email, full_name, role)
--   VALUES ('<user-uuid-from-auth>', 'admin@agrovet.ng', 'Demo Admin', 'admin');
--
--   INSERT INTO profiles (id, email, full_name, role)
--   VALUES ('<user-uuid-from-auth>', 'cashier@agrovet.ng', 'Demo Cashier', 'cashier');
-- ────────────────────────────────────────────────────────────
