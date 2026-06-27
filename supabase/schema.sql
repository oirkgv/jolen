-- ============================================================
-- JOLEN جولين — Supabase SQL Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Users (admin only via Supabase Auth)
-- Supabase Auth handles users automatically

-- Product Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  emoji TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  is_limited BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Variants (e.g. فانيلا, شوكولاتة for same product)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price_override NUMERIC(10,2), -- NULL means use product price
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- Addons
CREATE TABLE IF NOT EXISTS addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price NUMERIC(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product <-> Addon mapping
CREATE TABLE IF NOT EXISTS product_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  addon_id UUID REFERENCES addons(id) ON DELETE CASCADE,
  UNIQUE(product_id, addon_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
  delivery_address TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'ready', 'delivered')),
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name_ar TEXT NOT NULL,
  product_name_en TEXT NOT NULL,
  variant_name_ar TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Item Addons
CREATE TABLE IF NOT EXISTS order_item_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  addon_id UUID REFERENCES addons(id) ON DELETE SET NULL,
  addon_name_ar TEXT NOT NULL,
  addon_name_en TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_addons_product ON product_addons(product_id);
CREATE INDEX IF NOT EXISTS idx_product_addons_addon ON product_addons(addon_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_item_addons_item ON order_item_addons(order_item_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_addons ENABLE ROW LEVEL SECURITY;

-- Public read access for store items
CREATE POLICY "public_read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_products" ON products FOR SELECT TO anon, authenticated USING (is_available = true);
CREATE POLICY "public_read_variants" ON product_variants FOR SELECT TO anon, authenticated USING (is_available = true);
CREATE POLICY "public_read_addons" ON addons FOR SELECT TO anon, authenticated USING (is_available = true);
CREATE POLICY "public_read_product_addons" ON product_addons FOR SELECT TO anon, authenticated USING (true);

-- Anyone can create an order (customers)
CREATE POLICY "public_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_insert_order_item_addons" ON order_item_addons FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Customers can read their own order (by order number - app logic handles this)
CREATE POLICY "public_read_orders" ON orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_order_items" ON order_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_order_item_addons" ON order_item_addons FOR SELECT TO anon, authenticated USING (true);

-- Admin full access (authenticated users = admins in this app)
CREATE POLICY "admin_all_categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_variants" ON product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_addons" ON addons FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_product_addons" ON product_addons FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE TO authenticated USING (true);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM orders;
  new_number := 'JLN-' || LPAD(counter::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_addons_updated_at BEFORE UPDATE ON addons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED DATA
-- ============================================================

-- Categories
INSERT INTO categories (id, name_ar, name_en, emoji, sort_order) VALUES
  ('11111111-0000-0000-0000-000000000001', 'آيس كريم على الصاج', 'Ice Cream on Saj', '🍦', 1),
  ('11111111-0000-0000-0000-000000000002', 'فراولة بالشوكولاتة', 'Strawberry with Chocolate', '🍓', 2),
  ('11111111-0000-0000-0000-000000000003', 'ورق العنب والملفوف', 'Grape Leaves & Cabbage', '🌿', 3),
  ('11111111-0000-0000-0000-000000000004', 'موهيتو', 'Mojito', '🥤', 4);

-- Products
INSERT INTO products (id, category_id, name_ar, name_en, description_ar, price, is_available, is_limited, sort_order) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'فانيلا', 'Vanilla Ice Cream', 'آيس كريم فانيلا كريمي على الصاج — سادة أو مع أوريو', 3.00, true, false, 1),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'شوكولاتة', 'Chocolate Ice Cream', 'آيس كريم شوكولاتة غني ولذيذ على الصاج', 3.00, true, false, 2),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'شوكولاتة بلجيكية بالبندق', 'Belgian Chocolate Hazelnut', 'آيس كريم بالشوكولاتة البلجيكية والبندق — كمية محدودة يومياً', 5.00, true, true, 3),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', 'مانجا', 'Mango Ice Cream', 'آيس كريم مانجا استوائي منعش على الصاج', 2.00, true, false, 4),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', 'فراولة بالشوكولاتة البلجيكية', 'Strawberry with Belgian Chocolate', 'فراولة طازجة مغموسة بالشوكولاتة البلجيكية الفاخرة', 2.00, true, false, 1),
  ('22222222-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000003', 'ورق عنب', 'Grape Leaves', 'ورق عنب محشو بالأرز والخضار — الحبة بريال', 1.00, true, false, 1),
  ('22222222-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000003', 'ملفوف', 'Cabbage Rolls', 'ملفوف محشو بالأرز والخضار — الحبة بريال', 1.00, true, false, 2),
  ('22222222-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000004', 'موهيتو ريد', 'Red Mojito', 'موهيتو أحمر منعش', 2.00, true, false, 1),
  ('22222222-0000-0000-0000-000000000009', '11111111-0000-0000-0000-000000000004', 'موهيتو بلو', 'Blue Mojito', 'موهيتو أزرق منعش', 2.00, true, false, 2),
  ('22222222-0000-0000-0000-000000000010', '11111111-0000-0000-0000-000000000004', 'موهيتو بربل', 'Purple Mojito', 'موهيتو بنفسجي منعش', 2.00, true, false, 3);

-- Addons
INSERT INTO addons (id, name_ar, name_en, price, sort_order) VALUES
  ('33333333-0000-0000-0000-000000000001', 'أوريو', 'Oreo', 0.00, 1),
  ('33333333-0000-0000-0000-000000000002', 'فراولة', 'Strawberry', 0.50, 2),
  ('33333333-0000-0000-0000-000000000003', 'سبرنكلز', 'Sprinkles', 0.00, 3),
  ('33333333-0000-0000-0000-000000000004', 'أعواد بسكويت', 'Cookie Sticks', 0.50, 4),
  ('33333333-0000-0000-0000-000000000005', 'صوص شوكولاتة', 'Chocolate Sauce', 0.00, 5),
  ('33333333-0000-0000-0000-000000000006', 'مالتيزرز', 'Maltesers', 0.50, 6),
  ('33333333-0000-0000-0000-000000000007', 'M&Ms', 'M&Ms', 0.50, 7),
  ('33333333-0000-0000-0000-000000000008', 'رمان', 'Pomegranate', 0.00, 8),
  ('33333333-0000-0000-0000-000000000009', 'ليمون', 'Lemon', 0.00, 9),
  ('33333333-0000-0000-0000-000000000010', 'شطة مجروشة', 'Chili Flakes', 0.00, 10),
  ('33333333-0000-0000-0000-000000000011', 'نعناع', 'Mint', 0.00, 11);

-- Product Addons mapping — Ice Cream addons
INSERT INTO product_addons (product_id, addon_id) VALUES
  ('22222222-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000005'),
  ('22222222-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000006'),
  ('22222222-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000007'),
  ('22222222-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000005'),
  ('22222222-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000006'),
  ('22222222-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000007'),
  ('22222222-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000005'),
  ('22222222-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000006'),
  ('22222222-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000007'),
  ('22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000005'),
  ('22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000006'),
  ('22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000007');

-- Grape leaves & Cabbage addons
INSERT INTO product_addons (product_id, addon_id) VALUES
  ('22222222-0000-0000-0000-000000000006', '33333333-0000-0000-0000-000000000008'),
  ('22222222-0000-0000-0000-000000000006', '33333333-0000-0000-0000-000000000009'),
  ('22222222-0000-0000-0000-000000000006', '33333333-0000-0000-0000-000000000010'),
  ('22222222-0000-0000-0000-000000000007', '33333333-0000-0000-0000-000000000008'),
  ('22222222-0000-0000-0000-000000000007', '33333333-0000-0000-0000-000000000009'),
  ('22222222-0000-0000-0000-000000000007', '33333333-0000-0000-0000-000000000010');

-- Mojito addons
INSERT INTO product_addons (product_id, addon_id) VALUES
  ('22222222-0000-0000-0000-000000000008', '33333333-0000-0000-0000-000000000011'),
  ('22222222-0000-0000-0000-000000000008', '33333333-0000-0000-0000-000000000009'),
  ('22222222-0000-0000-0000-000000000009', '33333333-0000-0000-0000-000000000011'),
  ('22222222-0000-0000-0000-000000000009', '33333333-0000-0000-0000-000000000009'),
  ('22222222-0000-0000-0000-000000000010', '33333333-0000-0000-0000-000000000011'),
  ('22222222-0000-0000-0000-000000000010', '33333333-0000-0000-0000-000000000009');
