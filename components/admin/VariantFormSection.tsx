"use client";

import { SIZES, VariantType } from "@/lib/types/database";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";

export interface VariantRow {
  label: string;
  price: string;
}

interface VariantFormSectionProps {
  variantType: VariantType;
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
}

function ensureMlSuffix(val: string): string {
  const trimmed = val.trim();
  if (!trimmed) return trimmed;
  // Si es un número puro, agregar "ml"
  if (/^\d+(\.\d+)?$/.test(trimmed)) return `${trimmed}ml`;
  // Si termina en número sin ml, agregar "ml"
  if (/\d$/.test(trimmed) && !trimmed.toLowerCase().endsWith("ml")) return `${trimmed}ml`;
  return trimmed;
}

export function VariantFormSection({
  variantType,
  variants,
  onChange,
}: VariantFormSectionProps) {
  function add() {
    onChange([...variants, { label: "", price: "" }]);
  }

  function remove(i: number) {
    onChange(variants.filter((_, idx) => idx !== i));
  }

  function update(i: number, field: keyof VariantRow, value: string) {
    const next = variants.map((v, idx) =>
      idx === i ? { ...v, [field]: value } : v
    );
    onChange(next);
  }

  function handleLabelBlur(i: number, value: string) {
    const formatted = ensureMlSuffix(value);
    if (formatted !== value) update(i, "label", formatted);
  }

  if (variantType === "ml") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Presentaciones y precios
          </label>
          <button
            type="button"
            onClick={add}
            className="flex items-center gap-1 text-xs text-black font-medium hover:underline"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                placeholder="ej: 10, 30, 50"
                value={v.label}
                onChange={(e) => update(i, "label", e.target.value)}
                onBlur={(e) => handleLabelBlur(i, e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Se mostrará como: <strong>{ensureMlSuffix(v.label) || "10ml"}</strong>
              </p>
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Precio $"
                value={v.price}
                onChange={(e) => update(i, "price", e.target.value)}
                min="0"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-5"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {variants.length === 0 && (
          <p className="text-xs text-gray-400">Agrega al menos una presentación</p>
        )}
      </div>
    );
  }

  // Tipo size — tallas con precio único
  const selectedSizes = variants.map((v) => v.label);
  const price = variants[0]?.price ?? "";

  function toggleSize(size: string) {
    if (selectedSizes.includes(size)) {
      onChange(variants.filter((v) => v.label !== size));
    } else {
      onChange([...variants, { label: size, price }]);
    }
  }

  function handlePriceChange(val: string) {
    onChange(variants.map((v) => ({ ...v, price: val })));
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Tallas disponibles
        </label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedSizes.includes(size)
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <Input
        label="Precio (mismo para todas las tallas)"
        type="number"
        placeholder="$"
        value={price}
        onChange={(e) => handlePriceChange(e.target.value)}
        min="0"
      />
    </div>
  );
}
