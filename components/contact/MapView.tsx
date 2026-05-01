"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix broken marker icons in Next.js/webpack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapViewProps {
  address: string;
}

export default function MapView({ address }: MapViewProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!address) { setFailed(true); return; }
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { "Accept-Language": "es" } }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));
  }, [address]);

  if (failed) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
        Mapa no disponible
      </div>
    );
  }

  if (!coords) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center text-gray-400 text-sm">
        Cargando mapa…
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-100">
      <MapContainer
        center={coords}
        zoom={16}
        className="w-full h-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
