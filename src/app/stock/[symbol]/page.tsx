import { auth } from "@/lib/auth";
import { getQuote, getDailyTimeSeries, getNews } from "@/lib/alphaVantage";
import { prisma } from "@/lib/prisma";
import NewsCard from "@/components/NewsCard";
import StockActions from "@/components/StockActions";
import ChatRoom from "@/components/ChatRoom";
import { getMockNewsForSymbol } from "@/lib/mockNews";

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const session = await auth();

  const [quote, timeSeries, news] = await Promise.allSettled([
    getQuote(upperSymbol),
    getDailyTimeSeries(upperSymbol),
    getNews(upperSymbol),
  ]);

  const q = quote.status === "fulfilled" ? quote.value : null;
  const history = timeSeries.status === "fulfilled" ? timeSeries.value : {};
  const rawArticles = news.status === "fulfilled" ? news.value.slice(0, 6) : [];
  const articles = rawArticles.length > 0 ? rawArticles : getMockNewsForSymbol(upperSymbol);

  const price = q?.["05. price"];
  const change = q?.["09. change"];
  const changePercent = q?.["10. change percent"];
  const isPositive = parseFloat(change ?? "0") >= 0;

  let chatRoom = await prisma.chatRoom.findFirst({ where: { symbol: upperSymbol } });
  if (!chatRoom) {
    chatRoom = await prisma.chatRoom.create({
      data: { name: `${upperSymbol} Discussion`, symbol: upperSymbol },
    });
  }

  const messages = await prisma.message.findMany({
    where: { chatRoomId: chatRoom.id },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  const historyEntries = Object.entries(history).slice(0, 30).reverse();

  return (
    <div className="space-y-8">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{upperSymbol}</h1>
            {price && (
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-4xl font-semibold">${parseFloat(price).toFixed(2)}</span>
                <span className={`text-lg font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {isPositive ? "+" : ""}{parseFloat(change ?? "0").toFixed(2)} ({changePercent})
                </span>
              </div>
            )}
          </div>
          {session && (
            <StockActions symbol={upperSymbol} userId={session.user.id} />
          )}
        </div>
      </div>

      {historyEntries.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold mb-4">Historical Performance (30 days)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-400">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Open</th>
                  <th className="pb-2 font-medium">Close</th>
                  <th className="pb-2 font-medium">High</th>
                  <th className="pb-2 font-medium">Low</th>
                  <th className="pb-2 font-medium">Volume</th>
                </tr>
              </thead>
              <tbody>
                {historyEntries.map(([date, data]) => {
                  const d = data as Record<string, string>;
                  return (
                    <tr key={date} className="border-b border-gray-800/50">
                      <td className="py-1.5">{date}</td>
                      <td>${parseFloat(d["1. open"]).toFixed(2)}</td>
                      <td>${parseFloat(d["4. close"]).toFixed(2)}</td>
                      <td>${parseFloat(d["2. high"]).toFixed(2)}</td>
                      <td>${parseFloat(d["3. low"]).toFixed(2)}</td>
                      <td>{parseInt(d["5. volume"]).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-base font-semibold mb-4">Related News</h2>
          <div className="space-y-3">
            {articles.map((article: Record<string, string>, i: number) => (
              <NewsCard
                key={`${article.url}-${i}`}
                article={{
                  title: article.title,
                  url: article.url,
                  source: article.source,
                  summary: article.summary,
                  overall_sentiment_label: article.overall_sentiment_label,
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold mb-4">Discuss {upperSymbol}</h2>
          <ChatRoom roomId={chatRoom.id} initialMessages={JSON.parse(JSON.stringify(messages))} />
        </div>
      </div>
    </div>
  );
}
