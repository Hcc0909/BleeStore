import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SiteConfigMap } from "@/lib/types/database";

async function getData() {
  const supabase = await createClient();
  const [productsRes, configRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .eq("category", "articulos_varios")
      .order("created_at", { ascending: false }),
    supabase.from("site_config").select("key, value").eq("key", "whatsapp_number"),
  ]);

  const config: Partial<SiteConfigMap> = {};
  configRes.data?.forEach((row) => {
    (config as Record<string, string>)[row.key] = row.value;
  });

  return { products: productsRes.data ?? [], config };
}

export default async function ArticulosPage() {
  const { products, config } = await getData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
          Colección
        </p>
        <h1 className="text-4xl font-bold text-black">Artículos Varios</h1>
        <p className="text-gray-500 mt-2">
          {products.length} artículo{products.length !== 1 ? "s" : ""} disponible
          {products.length !== 1 ? "s" : ""}
        </p>
      </div>
      <ProductGrid
        products={products}
        whatsappNumber={config.whatsapp_number ?? "6879990490"}
      />
    </div>
  );
}
