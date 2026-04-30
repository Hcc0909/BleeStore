interface GoogleMapEmbedProps {
  embedUrl: string;
}

export function GoogleMapEmbed({ embedUrl }: GoogleMapEmbedProps) {
  if (!embedUrl) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
        Mapa no configurado
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-100">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación BleeStore"
      />
    </div>
  );
}
