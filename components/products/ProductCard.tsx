"use client";

import { Product } from "@/lib/types/database";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  priority?: boolean;
}

export function ProductCard({ product, onClick, priority = false }: ProductCardProps) {
  const variants = product.variants ?? [];
  const sorted = [...variants].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
    >
      {/* Square image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
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
      <div className="p-3 sm:p-4 flex flex-col gap-1.5">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        {sorted.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {sorted.map((v) => (
              <span
                key={v.id}
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
              >
                {v.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
