import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getQuote } from "@/lib/alphaVantage";
import PortfolioClient from "@/components/PortfolioClient";

export default async function PortfolioPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const items = await prisma.portfolioItem.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: "desc" },
  });

  const enriched = await Promise.all(
    items.map(async (item) => {
      const quote = await getQuote(item.symbol);
      const currentPrice = parseFloat(quote?.["05. price"] ?? "0");
      const value = currentPrice * item.quantity;
      const cost = item.buyPrice * item.quantity;
      const gain = value - cost;

      return {
        id: item.id,
        symbol: item.symbol,
        quantity: item.quantity,
        buyPrice: item.buyPrice,
        currentPrice,
        value,
        gain,
        change: quote?.["09. change"] ?? null,
        changePercent: quote?.["10. change percent"] ?? null,
      };
    })
  );

  const totalValue = enriched.reduce((sum, i) => sum + i.value, 0);
  const totalGain = enriched.reduce((sum, i) => sum + i.gain, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-gray-500">Total Value</p>
            <p className="text-xl font-semibold">${totalValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Gain/Loss</p>
            <p className={`text-xl font-semibold ${totalGain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {totalGain >= 0 ? "+" : ""}${totalGain.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {enriched.length === 0 ? (
        <p className="text-gray-500">Your portfolio is empty. Add stocks from a stock details page.</p>
      ) : (
        <PortfolioClient items={enriched} />
      )}
    </div>
  );
}
