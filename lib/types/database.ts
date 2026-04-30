export type VariantType = "ml" | "size";
export type SectionType = "perfume" | "ropa" | "general";

export interface CategoryDB {
  id: string;
  name: string;
  slug: string;
  variant_type: VariantType;
  section: SectionType;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type SizeLabel =
  | "ExtraChica"
  | "Chica"
  | "Mediana"
  | "Grande"
  | "XL"
  | "XXL"
  | "XXXL"
  | "Unitalla";

export interface Product {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  label: string;
  price: number;
  sort_order: number;
  created_at: string;
}

export interface SiteConfig {
  key: string;
  value: string;
  updated_at: string;
}

export interface SiteConfigMap {
  whatsapp_number: string;
  instagram_url: string;
  google_maps_embed: string;
  address: string;
  store_hours: string;
  alert_message: string;
  alert_enabled: string;
}

export const SIZES: SizeLabel[] = [
  "ExtraChica",
  "Chica",
  "Mediana",
  "Grande",
  "XL",
  "XXL",
  "XXXL",
  "Unitalla",
];
