export type Category = "perfume" | "ropa" | "articulos_varios";

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
  category: Category;
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

export const CATEGORY_LABELS: Record<Category, string> = {
  perfume: "Perfume",
  ropa: "Ropa",
  articulos_varios: "Artículos Varios",
};
