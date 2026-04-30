"use client";

import { cn } from "@/lib/utils";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Error al subir imagen");
    } else {
      onChange(data.url);
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        Foto del producto (cuadrada)
      </label>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "relative w-40 h-40 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all",
          value ? "border-gray-200" : "border-gray-300 hover:border-black",
          uploading && "opacity-50 cursor-wait"
        )}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Producto"
              fill
              className="object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <X size={14} className="text-red-500" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            {uploading ? (
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <ImagePlus size={24} />
            )}
            <span className="text-xs text-center">
              {uploading ? "Subiendo..." : "Subir foto"}
            </span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
