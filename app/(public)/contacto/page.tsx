import { createClient } from "@/lib/supabase/server";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { MapWrapper } from "@/components/contact/MapWrapper";
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

export default async function ContactoPage() {
  const config = await getConfig();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10 sm:mb-12 text-center">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
          Contáctanos
        </p>
        <h1 className="text-2xl sm:text-4xl font-bold text-black mb-3">Estamos para ti</h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          Escríbenos por WhatsApp o encuéntranos en nuestras redes. Respondemos
          rápidamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div className="flex flex-col gap-5">
          <ContactInfo config={config} />
        </div>

        <div className="flex flex-col gap-4">
          <MapWrapper
            coords={config.google_maps_embed ?? ""}
            address={config.address ?? ""}
          />
          {config.address && (
            <p className="text-sm text-gray-600 text-center px-2">{config.address}</p>
          )}
        </div>
      </div>
    </div>
  );
}
