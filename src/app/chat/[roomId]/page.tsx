import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChatRoom from "@/components/ChatRoom";
import Link from "next/link";

export default async function ChatRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;

  const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
  if (!room) notFound();

  const messages = await prisma.message.findMany({
    where: { chatRoomId: roomId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/chat" className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Rooms
        </Link>
        <h1 className="text-xl font-bold">{room.name}</h1>
        {room.symbol && (
          <Link href={`/stock/${room.symbol}`} className="text-xs text-emerald-400 hover:underline">
            {room.symbol}
          </Link>
        )}
      </div>
      <ChatRoom roomId={roomId} initialMessages={JSON.parse(JSON.stringify(messages))} />
    </div>
  );
}
