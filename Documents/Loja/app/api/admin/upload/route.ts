import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookieName, verifyAdminSessionToken } from "@/lib/admin-session";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const maxUploadSize = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const allowed = await verifyAdminSessionToken((await cookies()).get(adminCookieName)?.value);
  if (!allowed) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
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
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const uploadPath = path.join(uploadDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, bytes);

  return NextResponse.json({ url: `/uploads/${filename}` });
}

function extensionFromType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/svg+xml") return "svg";
  return "jpg";
}
