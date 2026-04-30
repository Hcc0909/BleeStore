import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, variants:product_variants(*)")
      .eq("id", id)
      .single(),
    supabase
      .from("categories")
      .select("*")
      .order("sort_order"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/productos"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Volver a productos
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Editar: {product.name}
      </h1>
      <ProductForm product={product} categories={categories ?? []} />
    </div>
  );
}
