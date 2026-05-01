"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center text-gray-400 text-sm">
      Cargando mapa…
    </div>
  ),
});

interface MapWrapperProps {
  coords: string;   // DMS or "lat,lng" — from google_maps_embed config field
  address: string;  // fallback for geocoding + popup label
}

export function MapWrapper({ coords, address }: MapWrapperProps) {
  return <MapView coords={coords} address={address} />;
}
