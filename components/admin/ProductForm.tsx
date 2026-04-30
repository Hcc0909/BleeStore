"use client";

import { Category, CATEGORY_LABELS, Product } from "@/lib/types/database";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { VariantFormSection, VariantRow } from "./VariantFormSection";
import toast from "react-hot-toast";

interface ProductFormProps {
  product?: Product;
}

const CATEGORY_OPTIONS = (Object.entries(CATEGORY_LABELS) as [Category, string][]).map(
  ([value, label]) => ({ value, label })
);

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState<Category>(product?.category ?? "perfume");
  const [description, setDescription] = useState(product?.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image_url ?? null);
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants?.map((v) => ({ label: v.label, price: String(v.price) })) ?? []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("El nombre es requerido");
    if (variants.length === 0) return toast.error("Agrega al menos una variante");
    if (variants.some((v) => !v.label || !v.price))
      return toast.error("Completa todas las variantes");

    setLoading(true);

    const body = {
      name: name.trim(),
      category,
      image_url: imageUrl,
      description: description.trim() || null,
      variants: variants.map((v) => ({
        label: v.label,
        price: parseFloat(v.price),
      })),
    };

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Error al guardar");
    } else {
      toast.success(product ? "Producto actualizado" : "Producto creado");
      router.push("/admin/productos");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ej: Valentino Uomo"
          required
        />
        <Select
          label="Categoría"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as Category);
            setVariants([]);
          }}
          options={CATEGORY_OPTIONS}
        />
      </div>

      <Textarea
        label="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción del producto..."
        rows={3}
      />

      <ImageUpload value={imageUrl} onChange={setImageUrl} />

      <VariantFormSection
        category={category}
        variants={variants}
        onChange={setVariants}
      />

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
          {product ? "Actualizar producto" : "Crear producto"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
