import { NextResponse } from "next/server";
import { createProduct, deleteProduct, getProducts, updateProduct } from "@/lib/catalog";
import type { ProductInput } from "@/lib/catalog";
import { isAdminAuthenticated } from "@/lib/admin-auth";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Apenas administradores." }, { status: 403 });
  }

  return null;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  return NextResponse.json({ products: await getProducts() });
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const input = (await request.json()) as ProductInput;
    return NextResponse.json({ product: await createProduct(input) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao criar produto." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await request.json()) as ProductInput & { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "ID em falta." }, { status: 400 });
    }

    const product = await updateProduct(body.id, body);
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao atualizar produto." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "ID em falta." }, { status: 400 });
    }

    return NextResponse.json({ ok: await deleteProduct(body.id) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erro ao remover produto." }, { status: 400 });
  }
}
