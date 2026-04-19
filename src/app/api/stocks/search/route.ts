import { NextResponse } from "next/server";
import { searchSymbol } from "@/lib/alphaVantage";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) return NextResponse.json([]);

  const results = await searchSymbol(q);
  return NextResponse.json(results);
}
