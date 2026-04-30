import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json();
  const { name, category, image_url, description, variants } = body;

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({ name, category, image_url, description })
    .select()
    .single();

  if (productError)
    return NextResponse.json({ error: productError.message }, { status: 500 });

  if (variants && variants.length > 0) {
    const variantRows = variants.map(
      (v: { label: string; price: number }, i: number) => ({
        product_id: product.id,
        label: v.label,
        price: v.price,
        sort_order: i,
      })
    );

    const { error: variantsError } = await supabase
      .from("product_variants")
      .insert(variantRows);

    if (variantsError)
      return NextResponse.json({ error: variantsError.message }, { status: 500 });
  }

  return NextResponse.json(product, { status: 201 });
}
