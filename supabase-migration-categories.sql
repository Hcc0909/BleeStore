-- ============================================================
-- BleeStore — Migración: Tabla de Categorías Dinámicas
-- Ejecutar en: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  variant_type TEXT NOT NULL DEFAULT 'size' CHECK (variant_type IN ('ml', 'size')),
  section      TEXT NOT NULL DEFAULT 'general' CHECK (section IN ('perfume', 'ropa', 'general')),
  sort_order   INT DEFAULT 0,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Insertar categorías por defecto
INSERT INTO categories (name, slug, variant_type, section, sort_order) VALUES
  ('Perfumes Hombre', 'perfumes_hombre', 'ml',   'perfume', 1),
  ('Perfumes Mujer',  'perfumes_mujer',  'ml',   'perfume', 2),
  ('Perfume',         'perfume',         'ml',   'perfume', 3),
  ('Ropa',            'ropa',            'size', 'ropa',    4),
  ('Artículos Varios','articulos_varios','size', 'general', 5)
ON CONFLICT (slug) DO NOTHING;

-- 3. Quitar el CHECK constraint de products.category (ya no hace falta)
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- 4. RLS para categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Admin insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update categories"
  ON categories FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete categories"
  ON categories FOR DELETE
  USING (auth.role() = 'authenticated');
