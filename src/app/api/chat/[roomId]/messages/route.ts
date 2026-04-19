import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;

  const messages = await prisma.message.findMany({
    where: { chatRoomId: roomId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request, { params }: { params: Promise<{ roomId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roomId } = await params;
  const { content, imageUrl, linkUrl } = await req.json();

  if (!content?.trim()) return NextResponse.json({ error: "Message content is required." }, { status: 400 });

  const message = await prisma.message.create({
    data: { content, imageUrl, linkUrl, chatRoomId: roomId, userId: session.user.id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(message, { status: 201 });
}
