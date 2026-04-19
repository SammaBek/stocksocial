"use client";

import { useState } from "react";
import Link from "next/link";

interface WatchlistItem {
  id: string;
  symbol: string;
  price: string | null;
  change: string | null;
  changePercent: string | null;
}

export default function WatchlistClient({ items }: { items: WatchlistItem[] }) {
  const [list, setList] = useState(items);
  const [removing, setRemoving] = useState<string | null>(null);

  async function removeStock(symbol: string) {
    setRemoving(symbol);
    const res = await fetch(`/api/watchlist?symbol=${symbol}`, { method: "DELETE" });
    if (res.ok) setList((prev) => prev.filter((i) => i.symbol !== symbol));
    setRemoving(null);
  }

  return (
    <div className="space-y-3">
      {list.map((item) => {
        const isPositive = parseFloat(item.change ?? "0") >= 0;
        return (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-5 py-4"
          >
            <Link href={`/stock/${item.symbol}`} className="flex items-center gap-6 flex-1 hover:opacity-80">
              <span className="font-bold text-white text-lg w-20">{item.symbol}</span>
              {item.price && (
                <>
                  <span className="text-white font-semibold">${parseFloat(item.price).toFixed(2)}</span>
                  {item.change && item.changePercent && (
                    <span className={`text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                      {isPositive ? "+" : ""}{parseFloat(item.change).toFixed(2)} ({item.changePercent})
                    </span>
                  )}
                </>
              )}
            </Link>
            <button
              onClick={() => removeStock(item.symbol)}
              disabled={removing === item.symbol}
              className="text-gray-500 hover:text-red-400 text-sm transition-colors disabled:opacity-40 ml-4"
            >
              {removing === item.symbol ? "Removing..." : "Remove"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
