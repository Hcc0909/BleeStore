"use client";

import { Product, ProductVariant } from "@/lib/types/database";
import { buildWhatsAppUrl, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { VariantSelector } from "./VariantSelector";
import { MessageCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
}

export function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const variants = product.variants ?? [];
  const sorted = [...variants].sort((a, b) => a.sort_order - b.sort_order);
  const [selected, setSelected] = useState<ProductVariant | null>(
    sorted[0] ?? null
  );

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      {/* Square image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {variants.length > 0 && (
          <VariantSelector
            variants={sorted}
            selected={selected}
            onSelect={setSelected}
            category={product.category}
          />
        )}

        {selected && (
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="text-base sm:text-lg font-bold text-black shrink-0">
              {formatPrice(selected.price)}
            </span>
            <a
              href={buildWhatsAppUrl(
                whatsappNumber,
                product.name,
                product.category,
                selected
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2.5 bg-[#25D366] text-white text-xs font-semibold rounded-xl hover:bg-[#20ba59] active:bg-[#1da851] transition-colors shadow-sm min-h-[40px]"
            >
              <MessageCircle size={15} />
              <span className="hidden xs:inline">WhatsApp</span>
              <span className="xs:hidden">WA</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
