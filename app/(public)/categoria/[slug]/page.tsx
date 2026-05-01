import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SiteConfigMap } from "@/lib/types/database";
import { notFound } from "next/navigation";

export const revalidate = 60;

async function getData(slug: string) {
  const supabase = await createClient();

  const [catRes, productsRes, configRes] = await Promise.all([
    supabase.from("categories").select("*").eq("slug", slug).single(),
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .eq("category", slug)
      .order("created_at", { ascending: false }),
    supabase.from("site_config").select("key, value").eq("key", "whatsapp_number"),
  ]);

  const config: Partial<SiteConfigMap> = {};
  configRes.data?.forEach((row) => {
    (config as Record<string, string>)[row.key] = row.value;
  });

  return { category: catRes.data, products: productsRes.data ?? [], config };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { category, products, config } = await getData(slug);

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
          Colección
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-black">{category.name}</h1>
        <p className="text-gray-500 mt-2 text-sm">
          {products.length} producto{products.length !== 1 ? "s" : ""} disponible
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
