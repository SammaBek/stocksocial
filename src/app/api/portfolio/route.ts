import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.portfolioItem.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { symbol, quantity, buyPrice } = await req.json();

  if (!symbol || !quantity || !buyPrice) {
    return NextResponse.json({ error: "Symbol, quantity, and buy price are required." }, { status: 400 });
  }

  const item = await prisma.portfolioItem.upsert({
    where: { userId_symbol: { userId: session.user.id, symbol: symbol.toUpperCase() } },
    create: { symbol: symbol.toUpperCase(), quantity, buyPrice, userId: session.user.id },
    update: { quantity, buyPrice },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Symbol is required." }, { status: 400 });

  await prisma.portfolioItem.deleteMany({
    where: { userId: session.user.id, symbol: symbol.toUpperCase() },
  });

  return NextResponse.json({ ok: true });
}
