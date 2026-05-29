import { NextResponse } from "next/server";
import { getSetupMessage } from "@/lib/env";

export async function GET() {
  return NextResponse.json(getSetupMessage());
}
