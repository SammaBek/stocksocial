import SearchBar from "@/components/SearchBar";
import StockCard from "@/components/StockCard";
import NewsCard from "@/components/NewsCard";
import { getQuote, getNews } from "@/lib/alphaVantage";
import { getMockMarketNews } from "@/lib/mockNews";

const POPULAR_STOCKS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA"];

async function getPopularStocks() {
  const results = await Promise.allSettled(
    POPULAR_STOCKS.map(async (symbol) => {
      const quote = await getQuote(symbol);
      return { symbol, quote };
    })
  );
  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<{ symbol: string; quote: Record<string, string> }>).value);
}

export default async function HomePage() {
  const [stocks, news] = await Promise.allSettled([getPopularStocks(), getNews("AAPL,MSFT,GOOGL")]);

  const popularStocks = stocks.status === "fulfilled" ? stocks.value : [];
  const rawNews = news.status === "fulfilled" ? news.value.slice(0, 8) : [];
  const newsArticles = rawNews.length > 0 ? rawNews : getMockMarketNews();

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Your social <span className="text-emerald-400">stock</span> hub
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Track stocks, collaborate with other investors, and make smarter decisions together.
        </p>
        <div className="flex justify-center mt-6">
          <SearchBar />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Popular Stocks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularStocks.map(({ symbol, quote }) => (
            <StockCard
              key={symbol}
              symbol={symbol}
              price={quote?.["05. price"]}
              change={quote?.["09. change"]}
              changePercent={quote?.["10. change percent"]}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Market News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {newsArticles.map((article: Record<string, string>, i: number) => (
            <NewsCard
              key={`${article.url}-${i}`}
              breaking={i === 0}
              article={{
                title: article.title,
                url: article.url,
                source: article.source,
                summary: article.summary,
                banner_image: article.banner_image,
                time_published: article.time_published,
                overall_sentiment_label: article.overall_sentiment_label,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
