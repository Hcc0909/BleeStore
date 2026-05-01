import { createClient } from "@/lib/supabase/server";
import { SiteConfigForm } from "@/components/admin/SiteConfigForm";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { BannerManager } from "@/components/admin/BannerManager";
import { SiteConfigMap, BannerImage } from "@/lib/types/database";

async function getData() {
  const supabase = await createClient();
  const [{ data: configRows }, { data: categories }, { data: banners }] = await Promise.all([
    supabase.from("site_config").select("*"),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("banner_images").select("*").order("sort_order"),
  ]);

  const config: Partial<SiteConfigMap> = {};
  configRows?.forEach((row) => {
    (config as Record<string, string>)[row.key] = row.value;
  });

  return { config, categories: categories ?? [], banners: (banners ?? []) as BannerImage[] };
}

export default async function ConfiguracionPage() {
  const { config, categories, banners } = await getData();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">
          Administra banners, categorías, contacto y mensajes del sitio
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-2xl">
        {/* Banners */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <BannerManager initialBanners={banners} />
        </section>

        {/* Categorías */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <CategoryManager categories={categories} />
        </section>

        {/* Contacto y alertas */}
        <SiteConfigForm config={config} />
      </div>
    </div>
  );
}
