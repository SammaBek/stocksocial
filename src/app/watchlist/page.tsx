import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getQuote } from "@/lib/alphaVantage";
import WatchlistClient from "@/components/WatchlistClient";

export default async function WatchlistPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const items = await prisma.watchlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: "desc" },
  });

  const enriched = await Promise.all(
    items.map(async (item) => {
      const quote = await getQuote(item.symbol);
      return {
        id: item.id,
        symbol: item.symbol,
        price: quote?.["05. price"] ?? null,
        change: quote?.["09. change"] ?? null,
        changePercent: quote?.["10. change percent"] ?? null,
      };
    })
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Watchlist</h1>
      {enriched.length === 0 ? (
        <p className="text-gray-500">You haven&apos;t added any stocks yet. Search for a stock to get started.</p>
      ) : (
        <WatchlistClient items={enriched} />
      )}
    </div>
  );
}
