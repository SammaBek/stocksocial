import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateRoomButton from "@/components/CreateRoomButton";

export default async function ChatPage() {
  const session = await auth();

  const rooms = await prisma.chatRoom.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chat Rooms</h1>
        {session && <CreateRoomButton />}
      </div>

      {rooms.length === 0 ? (
        <p className="text-gray-500">No rooms yet. Create one to start discussing.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/chat/${room.id}`}
              className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-emerald-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{room.name}</h3>
                  {room.symbol && (
                    <span className="text-xs text-emerald-400 mt-0.5 block">{room.symbol}</span>
                  )}
                </div>
                <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                  {room._count.messages} msgs
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                Created {new Date(room.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
