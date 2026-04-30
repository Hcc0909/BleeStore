import { createClient } from "@/lib/supabase/server";
import { SiteConfigForm } from "@/components/admin/SiteConfigForm";
import { SiteConfigMap } from "@/lib/types/database";

async function getConfig(): Promise<Partial<SiteConfigMap>> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_config").select("*");
  const config: Partial<SiteConfigMap> = {};
  data?.forEach((row) => {
    (config as Record<string, string>)[row.key] = row.value;
  });
  return config;
}

export default async function ConfiguracionPage() {
  const config = await getConfig();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-1">
          Administra la información de contacto y mensajes del sitio
        </p>
      </div>
      <SiteConfigForm config={config} />
    </div>
  );
}
