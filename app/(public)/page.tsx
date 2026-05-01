import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SearchBar } from "@/components/ui/SearchBar";
import { SiteConfigMap, CategoryDB } from "@/lib/types/database";

export const revalidate = 60;
import Link from "next/link";

async function getData() {
  const supabase = await createClient();

  const [productsRes, configRes, categoriesRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("site_config").select("*"),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
  ]);

  const config: Partial<SiteConfigMap> = {};
  configRes.data?.forEach((row) => {
    (config as Record<string, string>)[row.key] = row.value;
  });

  return {
    products: productsRes.data ?? [],
    config,
    categories: categoriesRes.data ?? [],
  };
}

export default async function HomePage() {
  const { products, config, categories } = await getData();

  const perfumeCategories = categories.filter((c) => c.section === "perfume");
  const ropaCategories = categories.filter((c) => c.section === "ropa" || c.section === "general");

  const perfumeSlugs = perfumeCategories.map((c) => c.slug);
  const ropaSlugs = ropaCategories.map((c) => c.slug);

  const perfumes = products.filter((p) => perfumeSlugs.includes(p.category) || p.category === "perfume");
  const ropa = products.filter((p) => ropaSlugs.includes(p.category));

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-white px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative text-center max-w-4xl mx-auto w-full">
          <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase mb-5">
            Perfumes · Moda · Estilo
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight text-black mb-5 leading-none">
            BLEE<span className="text-gray-200">STORE</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-sm sm:max-w-md mx-auto mb-10 leading-relaxed">
            Fragancias y moda que cuentan tu historia. Calidad premium, directamente a ti.
          </p>

          {/* Barra de búsqueda prominente */}
          <div className="max-w-lg mx-auto mb-8">
            <SearchBar placeholder="Buscar perfumes, ropa, artículos..." />
          </div>

          {/* Links de categorías rápidas */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.slice(0, 5).map((cat: CategoryDB) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="px-4 py-2 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-black transition-all shadow-sm"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-300">
          <span className="text-xs">Desliza</span>
          <div className="w-0.5 h-6 bg-gray-200 rounded-full" />
        </div>
      </section>

      {/* Perfumes destacados */}
      {perfumes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
                Colección
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-black">Perfumes</h2>
            </div>
            {perfumeCategories[0] && (
              <Link
                href={`/categoria/${perfumeCategories[0].slug}`}
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors shrink-0 ml-4"
              >
                Ver todos →
              </Link>
            )}
          </div>
          <ProductGrid
            products={perfumes}
            whatsappNumber={config.whatsapp_number ?? "6879990490"}
          />
        </section>
      )}

      {/* Ropa destacada */}
      {ropa.length > 0 && (
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">
                  Colección
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-black">Moda</h2>
              </div>
              {ropaCategories[0] && (
                <Link
                  href={`/categoria/${ropaCategories[0].slug}`}
                  className="text-sm font-medium text-gray-500 hover:text-black transition-colors shrink-0 ml-4"
                >
                  Ver todo →
                </Link>
              )}
            </div>
            <ProductGrid
              products={ropa}
              whatsappNumber={config.whatsapp_number ?? "6879990490"}
            />
          </div>
        </section>
      )}

      {/* CTA contacto */}
      <section className="bg-black text-white py-14 sm:py-20">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">¿Tienes alguna duda?</h2>
          <p className="text-gray-400 mb-8 text-sm sm:text-base">
            Contáctanos por WhatsApp y con gusto te ayudamos a elegir el producto perfecto para ti.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Contactar ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
