"use client";

import { Product } from "@/lib/types/database";
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";

interface ProductGridProps {
  products: Product[];
  whatsappNumber: string;
}

export function ProductGrid({ products, whatsappNumber }: ProductGridProps) {
  const [selected, setSelected] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-base">No hay productos disponibles</p>
        <p className="text-sm mt-1">Vuelve pronto</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelected(product)}
          />
        ))}
      </div>

      {selected && (
        <ProductModal
          product={selected}
          whatsappNumber={whatsappNumber}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
