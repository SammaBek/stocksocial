"use client";

import { useState, useTransition } from "react";

interface Props {
  symbol: string;
  userId: string;
}

export default function StockActions({ symbol, userId }: Props) {
  const [qty, setQty] = useState("1");
  const [buyPrice, setBuyPrice] = useState("");
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  async function addToWatchlist() {
    startTransition(async () => {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
      setStatus(res.ok ? "Added to watchlist!" : "Already in watchlist.");
      setTimeout(() => setStatus(""), 3000);
    });
  }

  async function addToPortfolio() {
    if (!buyPrice) return;
    startTransition(async () => {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, quantity: parseFloat(qty), buyPrice: parseFloat(buyPrice) }),
      });
      setStatus(res.ok ? "Added to portfolio!" : "Could not add to portfolio.");
      setTimeout(() => setStatus(""), 3000);
    });
  }

  return (
    <div className="space-y-3 min-w-[220px]">
      <button
        onClick={addToWatchlist}
        disabled={isPending}
        className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        Add to Watchlist
      </button>

      <div className="flex gap-2">
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="Qty"
          min="0.0001"
          step="any"
          className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
        />
        <input
          type="number"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          placeholder="Buy price"
          min="0"
          step="any"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={addToPortfolio}
          disabled={isPending || !buyPrice}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>

      {status && <p className="text-xs text-emerald-400">{status}</p>}
    </div>
  );
}
