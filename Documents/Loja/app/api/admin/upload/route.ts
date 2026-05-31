import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const maxUploadSize = 4 * 1024 * 1024;
const bucket = "product-images";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  }

  const supabase = createSupabaseAdminClient();
  const { url } = getSupabaseConfig();

  if (!supabase || !url) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY não está configurada." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || !allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Imagem inválida." }, { status: 400 });
  }

  if (file.size > maxUploadSize) {
    return NextResponse.json({ error: "Imagem demasiado grande. Máximo 4MB." }, { status: 413 });
  }

  const filename = `${randomUUID()}.${extensionFromType(file.type)}`;
  const path = `products/${filename}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}

function extensionFromType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/svg+xml") return "svg";
  return "jpg";
}
