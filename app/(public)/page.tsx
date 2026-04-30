import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SiteConfigMap } from "@/lib/types/database";
import Link from "next/link";

async function getData() {
  const supabase = await createClient();

  const [productsRes, configRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("site_config").select("*"),
  ]);

  const config: Partial<SiteConfigMap> = {};
  configRes.data?.forEach((row) => {
    (config as Record<string, string>)[row.key] = row.value;
  });

  return { products: productsRes.data ?? [], config };
}

export default async function HomePage() {
  const { products, config } = await getData();

  const perfumes = products.filter((p) => p.category === "perfume");
  const ropa = products.filter((p) => p.category === "ropa" || p.category === "articulos_varios");

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative text-center px-6 max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase mb-5">
            Perfumes · Moda · Estilo
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black mb-5 leading-none">
            BLEE
            <span className="text-gray-300">STORE</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-sm sm:max-w-xl mx-auto mb-8 leading-relaxed">
            Fragancias y moda que cuentan tu historia. Calidad premium, directamente a ti.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/perfumes"
              className="w-full sm:w-auto px-8 py-4 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm text-center"
            >
              Ver perfumes
            </Link>
            <Link
              href="/ropa"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-center"
            >
              Ver ropa
            </Link>
          </div>
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
            <Link
              href="/perfumes"
              className="text-sm font-medium text-gray-500 hover:text-black transition-colors shrink-0 ml-4"
            >
              Ver todos →
            </Link>
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
              <Link
                href="/ropa"
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors shrink-0 ml-4"
              >
                Ver todo →
              </Link>
            </div>
            <ProductGrid
              products={ropa}
              whatsappNumber={config.whatsapp_number ?? "6879990490"}
            />
          </div>
        </section>
      )}

      {/* CTA Contacto */}
      <section className="bg-black text-white py-14 sm:py-20">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">¿Tienes alguna duda?</h2>
          <p className="text-gray-400 mb-8 text-sm sm:text-base">
            Contáctanos por WhatsApp y con gusto te ayudamos a elegir el producto
            perfecto para ti.
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
