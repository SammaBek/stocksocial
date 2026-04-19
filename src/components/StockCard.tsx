import Link from "next/link";

interface StockCardProps {
  symbol: string;
  name?: string;
  price?: string;
  change?: string;
  changePercent?: string;
}

export default function StockCard({ symbol, name, price, change, changePercent }: StockCardProps) {
  const isPositive = parseFloat(change ?? "0") >= 0;

  return (
    <Link
      href={`/stock/${symbol}`}
      className="block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-emerald-700 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-white text-lg">{symbol}</p>
          {name && <p className="text-gray-500 text-xs mt-0.5 truncate max-w-[140px]">{name}</p>}
        </div>
        {price && (
          <div className="text-right">
            <p className="font-semibold text-white">${parseFloat(price).toFixed(2)}</p>
            {change && changePercent && (
              <p className={`text-xs font-medium mt-0.5 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {isPositive ? "+" : ""}{parseFloat(change).toFixed(2)} ({changePercent})
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
