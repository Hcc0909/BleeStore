-- ============================================================
-- BleeStore — Supabase SQL Schema
-- Ejecutar en: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. TABLA PRODUCTS
CREATE TABLE products (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('perfume', 'ropa', 'articulos_varios')),
  image_url   TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Auto-actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. TABLA PRODUCT_VARIANTS
CREATE TABLE product_variants (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,   -- ej: "10ml", "Grande", "Unitalla"
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

-- 3. TABLA SITE_CONFIG (clave-valor)
CREATE TABLE site_config (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Valores por defecto
INSERT INTO site_config (key, value) VALUES
  ('whatsapp_number',   '6879990490'),
  ('instagram_url',     'https://instagram.com/bleestore'),
  ('google_maps_embed', ''),
  ('address',           ''),
  ('store_hours',       'Lunes a Sábado 10:00 - 20:00'),
  ('alert_message',     '¡Bienvenido a BleeStore! Aprovecha nuestras promociones exclusivas.'),
  ('alert_enabled',     'true');

-- 4. ROW LEVEL SECURITY

-- Products: lectura pública, escritura solo autenticados
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Product variants: igual
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Admin insert variants" ON product_variants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update variants" ON product_variants FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete variants" ON product_variants FOR DELETE USING (auth.role() = 'authenticated');

-- Site config: lectura pública, escritura solo autenticados
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Admin update config" ON site_config FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin insert config" ON site_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. STORAGE BUCKET (ejecutar en SQL Editor)
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
