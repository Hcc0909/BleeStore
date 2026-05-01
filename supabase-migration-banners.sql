-- Banner images table
CREATE TABLE IF NOT EXISTS banner_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text NOT NULL,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banner_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read banners"
  ON banner_images FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage banners"
  ON banner_images FOR ALL USING (auth.role() = 'authenticated');
