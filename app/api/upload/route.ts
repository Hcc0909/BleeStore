import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No se envió archivo" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
