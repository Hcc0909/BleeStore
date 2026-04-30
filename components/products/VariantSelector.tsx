"use client";

import { cn } from "@/lib/utils";
import { ProductVariant } from "@/lib/types/database";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
  category: string;
}

export function VariantSelector({
  variants,
  selected,
  onSelect,
  category,
}: VariantSelectorProps) {
  if (variants.length === 0) return null;

  const sorted = [...variants].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
            selected?.id === v.id
              ? "bg-black text-white border-black"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
          )}
        >
          {category === "perfume" ? v.label : v.label}
        </button>
      ))}
    </div>
  );
}
