import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createProduct, deleteProduct, getProducts, updateProduct } from "@/lib/catalog";
import type { ProductInput } from "@/lib/catalog";
import { adminCookieName, verifyAdminSessionToken } from "@/lib/admin-session";

async function isAllowed() {
  return Boolean(await verifyAdminSessionToken((await cookies()).get(adminCookieName)?.value));
}

export async function GET() {
  if (!(await isAllowed())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  return NextResponse.json({ products: await getProducts() });
}

export async function POST(request: Request) {
  if (!(await isAllowed())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const input = (await request.json()) as ProductInput;
  return NextResponse.json({ product: await createProduct(input) }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAllowed())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as ProductInput & { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "ID em falta." }, { status: 400 });
  }

  const product = await updateProduct(body.id, body);
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function DELETE(request: Request) {
  if (!(await isAllowed())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "ID em falta." }, { status: 400 });
  }

  return NextResponse.json({ ok: await deleteProduct(body.id) });
}
