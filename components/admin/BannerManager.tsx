"use client";

import { BannerImage } from "@/lib/types/database";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const MAX_BANNERS = 5;

export function BannerManager({ initialBanners }: { initialBanners: BannerImage[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (banners.length >= MAX_BANNERS) {
      toast.error(`Máximo ${MAX_BANNERS} banners`);
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      const { url, error: uploadErr } = await uploadRes.json();
      if (!url) throw new Error(uploadErr ?? "Sin URL");

      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, sort_order: banners.length }),
      });
      const newBanner = await res.json();
      setBanners((prev) => [...prev, newBanner]);
      toast.success("Banner agregado");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al subir imagen");
    }
    setUploading(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success("Banner eliminado");
    } else {
      toast.error("Error al eliminar");
    }
  }

  async function handleToggle(banner: BannerImage) {
    const next = !banner.is_active;
    const res = await fetch(`/api/banners/${banner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: next }),
    });
    if (res.ok) {
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, is_active: next } : b))
      );
    } else {
      toast.error("Error al actualizar");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-gray-900">Banners del inicio</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {banners.length}/{MAX_BANNERS} imágenes · Recomendado 16:5 horizontal
          </p>
        </div>
        {banners.length < MAX_BANNERS && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-2 bg-black text-white text-xs font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Plus size={14} />
            {uploading ? "Subiendo…" : "Agregar"}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      {banners.length === 0 ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl py-12 flex flex-col items-center gap-3 cursor-pointer hover:border-gray-400 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Plus size={22} className="text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Subir primera imagen</p>
            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG o WebP · Máx. 10 MB</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              className="relative group rounded-2xl overflow-hidden border border-gray-100 aspect-video bg-gray-100"
            >
              <Image
                src={banner.url}
                alt={`Banner ${i + 1}`}
                fill
                className={`object-cover transition-opacity ${banner.is_active ? "opacity-100" : "opacity-40"}`}
                sizes="(max-width: 640px) 50vw, 33vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleToggle(banner)}
                  title={banner.is_active ? "Ocultar" : "Mostrar"}
                  className="p-2.5 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors"
                >
                  {banner.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2.5 rounded-full bg-white/90 text-red-500 hover:bg-white transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {!banner.is_active && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-gray-900/80 text-white text-xs rounded-full">
                  Oculto
                </span>
              )}
            </div>
          ))}

          {/* Add slot */}
          {banners.length < MAX_BANNERS && (
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-400 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <Plus size={20} />
              <span className="text-xs font-medium">Agregar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
