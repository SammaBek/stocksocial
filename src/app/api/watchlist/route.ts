import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.watchlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { symbol } = await req.json();
  if (!symbol) return NextResponse.json({ error: "Symbol is required." }, { status: 400 });

  try {
    const item = await prisma.watchlistItem.create({
      data: { symbol: symbol.toUpperCase(), userId: session.user.id },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Already in watchlist." }, { status: 409 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "Symbol is required." }, { status: 400 });

  await prisma.watchlistItem.deleteMany({
    where: { userId: session.user.id, symbol: symbol.toUpperCase() },
  });

  return NextResponse.json({ ok: true });
}
