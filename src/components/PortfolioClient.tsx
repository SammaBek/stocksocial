"use client";

import { useState } from "react";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  value: number;
  gain: number;
  change: string | null;
  changePercent: string | null;
}

export default function PortfolioClient({ items }: { items: PortfolioItem[] }) {
  const [list, setList] = useState(items);
  const [removing, setRemoving] = useState<string | null>(null);

  async function removeStock(symbol: string) {
    setRemoving(symbol);
    const res = await fetch(`/api/portfolio?symbol=${symbol}`, { method: "DELETE" });
    if (res.ok) setList((prev) => prev.filter((i) => i.symbol !== symbol));
    setRemoving(null);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-800">
            <th className="pb-3 font-medium">Symbol</th>
            <th className="pb-3 font-medium">Price</th>
            <th className="pb-3 font-medium">Change</th>
            <th className="pb-3 font-medium">Qty</th>
            <th className="pb-3 font-medium">Avg Cost</th>
            <th className="pb-3 font-medium">Value</th>
            <th className="pb-3 font-medium">Gain/Loss</th>
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => {
            const isPositive = item.gain >= 0;
            const changePos = parseFloat(item.change ?? "0") >= 0;
            return (
              <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-900/50">
                <td className="py-3">
                  <Link href={`/stock/${item.symbol}`} className="font-bold text-white hover:text-emerald-400">
                    {item.symbol}
                  </Link>
                </td>
                <td className="py-3 text-white">${item.currentPrice.toFixed(2)}</td>
                <td className={`py-3 ${changePos ? "text-emerald-400" : "text-red-400"}`}>
                  {changePos ? "+" : ""}{item.changePercent ?? "N/A"}
                </td>
                <td className="py-3 text-gray-300">{item.quantity}</td>
                <td className="py-3 text-gray-300">${item.buyPrice.toFixed(2)}</td>
                <td className="py-3 text-white font-medium">${item.value.toFixed(2)}</td>
                <td className={`py-3 font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {isPositive ? "+" : ""}${item.gain.toFixed(2)}
                </td>
                <td className="py-3">
                  <button
                    onClick={() => removeStock(item.symbol)}
                    disabled={removing === item.symbol}
                    className="text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40"
                  >
                    {removing === item.symbol ? "..." : "Remove"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
