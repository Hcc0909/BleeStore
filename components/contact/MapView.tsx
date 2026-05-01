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

/** Parse DMS "25°33'38.8"N 108°28'16.3"W" or decimal "25.5608,-108.4712" */
function parseCoords(raw: string): [number, number] | null {
  if (!raw?.trim()) return null;

  // Decimal: "25.5608, -108.4712"
  const dec = raw.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (dec) return [parseFloat(dec[1]), parseFloat(dec[2])];

  // DMS: 25°33'38.8"N 108°28'16.3"W  (quotes may be " or ")
  const dms = raw.match(
    /(\d+)[°º](\d+)[''′]([0-9.]+)[""″]?\s*([NS])\s+(\d+)[°º](\d+)[''′]([0-9.]+)[""″]?\s*([EW])/i
  );
  if (dms) {
    const lat = +dms[1] + +dms[2] / 60 + +dms[3] / 3600;
    const lng = +dms[5] + +dms[6] / 60 + +dms[7] / 3600;
    return [
      dms[4].toUpperCase() === "S" ? -lat : lat,
      dms[8].toUpperCase() === "W" ? -lng : lng,
    ];
  }

  return null;
}

interface MapViewProps {
  coords: string; // DMS or "lat,lng"
  address: string;
}

export default function MapView({ coords, address }: MapViewProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // 1. Try to parse coordinates directly
    const direct = parseCoords(coords);
    if (direct) { setPosition(direct); return; }

    // 2. Fallback: geocode address via Nominatim
    if (!address?.trim()) { setFailed(true); return; }
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { "Accept-Language": "es" } }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));
  }, [coords, address]);

  if (failed) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
        Mapa no disponible
      </div>
    );
  }

  if (!position) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center text-gray-400 text-sm">
        Cargando mapa…
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-100">
      <MapContainer center={position} zoom={17} className="w-full h-full" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{address || "BleeStore"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
