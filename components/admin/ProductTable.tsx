"use client";

import { CATEGORY_LABELS, Product } from "@/lib/types/database";
import { formatPrice } from "@/lib/utils";
import { Edit2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    setDeleting(id);

    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Producto eliminado");
      router.refresh();
    } else {
      toast.error("Error al eliminar");
    }
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} productos</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button>
            <Plus size={16} />
            Nuevo producto
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 mb-4">No hay productos aún</p>
          <Link href="/admin/productos/nuevo">
            <Button variant="secondary">
              <Plus size={16} />
              Agregar primer producto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">
                  Categoría
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">
                  Variantes
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {CATEGORY_LABELS[product.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {product.variants && product.variants.length > 0 ? (
                      <span>
                        {product.variants.length} variante
                        {product.variants.length !== 1 ? "s" : ""}
                        {" · "}
                        {formatPrice(
                          Math.min(...product.variants.map((v) => v.price))
                        )}
                        {product.category === "perfume" &&
                          product.variants.length > 1 && (
                            <> – {formatPrice(Math.max(...product.variants.map((v) => v.price)))}</>
                          )}
                      </span>
                    ) : (
                      <span className="text-gray-300">Sin variantes</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/productos/${product.id}`}>
                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-black transition-colors">
                          <Edit2 size={15} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleting === product.id}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
