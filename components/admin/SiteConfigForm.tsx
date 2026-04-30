"use client";

import { SiteConfigMap } from "@/lib/types/database";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface SiteConfigFormProps {
  config: Partial<SiteConfigMap>;
}

export function SiteConfigForm({ config: initial }: SiteConfigFormProps) {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Partial<SiteConfigMap>>(initial);

  function set(key: keyof SiteConfigMap, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    if (res.ok) {
      toast.success("Configuración guardada");
    } else {
      toast.error("Error al guardar");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      {/* Contacto */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">Información de contacto</h2>
        <Input
          label="Número de WhatsApp (sin código de país)"
          value={config.whatsapp_number ?? ""}
          onChange={(e) => set("whatsapp_number", e.target.value)}
          placeholder="6879990490"
        />
        <Input
          label="URL de Instagram"
          type="url"
          value={config.instagram_url ?? ""}
          onChange={(e) => set("instagram_url", e.target.value)}
          placeholder="https://instagram.com/bleestore"
        />
        <Textarea
          label="Dirección"
          value={config.address ?? ""}
          onChange={(e) => set("address", e.target.value)}
          placeholder="Calle, número, colonia, ciudad"
          rows={2}
        />
        <Input
          label="Horario de atención"
          value={config.store_hours ?? ""}
          onChange={(e) => set("store_hours", e.target.value)}
          placeholder="Lunes a Viernes 10:00 - 20:00"
        />
        <Textarea
          label='Código de embed de Google Maps (iframe src="...")'
          value={config.google_maps_embed ?? ""}
          onChange={(e) => set("google_maps_embed", e.target.value)}
          placeholder="https://www.google.com/maps/embed?..."
          rows={3}
        />
      </section>

      {/* Alerta */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">Mensaje de bienvenida / promoción</h2>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="alert_enabled"
            checked={config.alert_enabled === "true"}
            onChange={(e) => set("alert_enabled", e.target.checked ? "true" : "false")}
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label htmlFor="alert_enabled" className="text-sm font-medium text-gray-700">
            Mostrar mensaje al entrar al sitio
          </label>
        </div>
        <Textarea
          label="Mensaje"
          value={config.alert_message ?? ""}
          onChange={(e) => set("alert_message", e.target.value)}
          placeholder="¡Bienvenido! Aprovecha nuestras promociones..."
          rows={3}
        />
      </section>

      <Button type="submit" loading={loading} size="lg" className="self-start">
        Guardar cambios
      </Button>
    </form>
  );
}
