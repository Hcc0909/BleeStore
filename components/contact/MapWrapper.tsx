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

export function MapWrapper({ address }: { address: string }) {
  return <MapView address={address} />;
}
