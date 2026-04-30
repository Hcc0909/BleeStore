import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SearchBar } from "@/components/ui/SearchBar";
import { SiteConfigMap } from "@/lib/types/database";
import { Search } from "lucide-react";

async function getData(query: string) {
  const supabase = await createClient();

  const [productsRes, configRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false }),
    supabase.from("site_config").select("key, value").eq("key", "whatsapp_number"),
  ]);

  const config: Partial<SiteConfigMap> = {};
  configRes.data?.forEach((row) => {
    (config as Record<string, string>)[row.key] = row.value;
  });

  return { products: productsRes.data ?? [], config };
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-xl mx-auto mb-10">
          <SearchBar initialValue="" />
        </div>
        <div className="text-center py-20 text-gray-400">
          <Search size={40} className="mx-auto mb-4 opacity-30" />
          <p>Escribe algo para buscar productos</p>
        </div>
      </div>
    );
  }

  const { products, config } = await getData(query);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-xl mx-auto mb-10">
        <SearchBar initialValue={query} />
      </div>

      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
          Resultados
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          &ldquo;{query}&rdquo;
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {products.length} resultado{products.length !== 1 ? "s" : ""} encontrado
          {products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Search size={40} className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-500 font-medium">No encontramos productos para &ldquo;{query}&rdquo;</p>
          <p className="text-gray-400 text-sm mt-1">Intenta con otro término</p>
        </div>
      ) : (
        <ProductGrid
          products={products}
          whatsappNumber={config.whatsapp_number ?? "6879990490"}
        />
      )}
    </div>
  );
}
