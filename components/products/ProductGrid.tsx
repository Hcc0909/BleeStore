import { Product } from "@/lib/types/database";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  whatsappNumber: string;
}

export function ProductGrid({ products, whatsappNumber }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No hay productos disponibles</p>
        <p className="text-sm mt-1">Vuelve pronto</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          whatsappNumber={whatsappNumber}
        />
      ))}
    </div>
  );
}
