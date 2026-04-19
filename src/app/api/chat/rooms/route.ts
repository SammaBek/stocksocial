import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, symbol } = await req.json();
  if (!name) return NextResponse.json({ error: "Room name is required." }, { status: 400 });

  const room = await prisma.chatRoom.create({
    data: {
      name,
      symbol: symbol ?? null,
      members: { create: { userId: session.user.id } },
    },
  });

  return NextResponse.json(room, { status: 201 });
}
