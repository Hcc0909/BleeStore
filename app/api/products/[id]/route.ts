import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json();
  const { name, category, image_url, description, variants } = body;

  const { error: productError } = await supabase
    .from("products")
    .update({ name, category, image_url, description })
    .eq("id", id);

  if (productError)
    return NextResponse.json({ error: productError.message }, { status: 500 });

  // Replace all variants
  await supabase.from("product_variants").delete().eq("product_id", id);

  if (variants && variants.length > 0) {
    const variantRows = variants.map(
      (v: { label: string; price: number }, i: number) => ({
        product_id: id,
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

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
