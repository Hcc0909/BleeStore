import { createClient } from "@/lib/supabase/server";
import { ProductTable } from "@/components/admin/ProductTable";

export default async function ProductosAdminPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .order("created_at", { ascending: false });

  return <ProductTable products={products ?? []} />;
}
