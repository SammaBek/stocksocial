"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getSocket } from "@/lib/socket";

interface Message {
  id: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: string;
  user: { id: string; name?: string | null; email: string };
}

interface Props {
  roomId: string;
  initialMessages: Message[];
}

export default function ChatRoom({ roomId, initialMessages }: Props) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", roomId);

    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leave-room", roomId);
      socket.off("receive-message");
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !session) return;

    const res = await fetch(`/api/chat/${roomId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    });

    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      getSocket().emit("send-message", { roomId, message: msg });
      setInput("");
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isOwn = msg.user.id === session?.user?.id;
          return (
            <div key={msg.id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
              <span className="text-xs text-gray-500 mb-1">
                {isOwn ? "You" : (msg.user.name ?? msg.user.email)}
              </span>
              <div
                className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                  isOwn ? "bg-emerald-700 text-white" : "bg-gray-800 text-gray-100"
                }`}
              >
                <p>{msg.content}</p>
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="shared" className="mt-2 rounded-lg max-w-full" />
                )}
                {msg.linkUrl && (
                  <a href={msg.linkUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline mt-1 block">
                    {msg.linkUrl}
                  </a>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="border-t border-gray-800 p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={session ? "Type a message..." : "Sign in to chat"}
          disabled={!session}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={!session || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
