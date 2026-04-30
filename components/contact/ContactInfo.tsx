import { SiteConfigMap } from "@/lib/types/database";
import { buildWhatsAppContactUrl } from "@/lib/utils";
import { Clock, MapPin, MessageCircle } from "lucide-react";

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

interface ContactInfoProps {
  config: Partial<SiteConfigMap>;
}

export function ContactInfo({ config }: ContactInfoProps) {
  const whatsappUrl = buildWhatsAppContactUrl(config.whatsapp_number || "6879990490");

  return (
    <div className="flex flex-col gap-4">
      {config.whatsapp_number && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#25D366]/40 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 bg-[#25D366]/10 rounded-xl flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
            <MessageCircle size={20} className="text-[#25D366]" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">WhatsApp</p>
            <p className="text-sm font-semibold text-gray-900">
              +52 {config.whatsapp_number}
            </p>
          </div>
        </a>
      )}

      {config.instagram_url && (
        <a
          href={config.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
            <InstagramIcon size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Instagram</p>
            <p className="text-sm font-semibold text-gray-900">
              {config.instagram_url.replace("https://instagram.com/", "@").replace("https://www.instagram.com/", "@")}
            </p>
          </div>
        </a>
      )}

      {config.address && (
        <a
          href={`https://maps.google.com/maps?q=${encodeURIComponent(config.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
            <MapPin size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Dirección</p>
            <p className="text-sm font-semibold text-gray-900">{config.address}</p>
          </div>
        </a>
      )}

      {config.store_hours && (
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Clock size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Horario</p>
            <p className="text-sm font-semibold text-gray-900">
              {config.store_hours}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
