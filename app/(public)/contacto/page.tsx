import { createClient } from "@/lib/supabase/server";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { GoogleMapEmbed } from "@/components/contact/GoogleMapEmbed";
import { SiteConfigMap } from "@/lib/types/database";
import { buildWhatsAppContactUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
          Contáctanos
        </p>
        <h1 className="text-4xl font-bold text-black mb-3">Estamos para ti</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Escríbenos por WhatsApp o encuéntranos en nuestras redes. Respondemos
          rápidamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6">
          <ContactInfo config={config} />

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {config.whatsapp_number && (
              <a
                href={buildWhatsAppContactUrl(config.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:bg-[#20ba59] transition-colors shadow-sm"
              >
                <MessageCircle size={18} />
                Escribir por WhatsApp
              </a>
            )}
            {config.instagram_url && (
              <a
                href={config.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                <InstagramIcon size={18} />
                Ver Instagram
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <GoogleMapEmbed embedUrl={config.google_maps_embed ?? ""} />
          {config.address && (
            <p className="text-sm text-gray-600 text-center">{config.address}</p>
          )}
        </div>
      </div>
    </div>
  );
}
