interface NewsArticle {
  title: string;
  url: string;
  source: string;
  summary?: string;
  banner_image?: string;
  time_published?: string;
  overall_sentiment_label?: string;
}

export default function NewsCard({ article, breaking = false }: { article: NewsArticle; breaking?: boolean }) {
  const sentimentColor: Record<string, string> = {
    Bullish: "text-emerald-400",
    Bearish: "text-red-400",
    Neutral: "text-gray-400",
    "Somewhat-Bullish": "text-emerald-300",
    "Somewhat-Bearish": "text-red-300",
  };

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-gray-900 border rounded-xl p-4 hover:border-gray-600 transition-colors ${
        breaking ? "border-emerald-600" : "border-gray-800"
      }`}
    >
      {breaking && (
        <span className="inline-block text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded mb-2">
          BREAKING
        </span>
      )}
      <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">{article.title}</h3>
      {article.summary && (
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{article.summary}</p>
      )}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs text-gray-600">{article.source}</span>
        {article.overall_sentiment_label && (
          <span className={`text-xs font-medium ${sentimentColor[article.overall_sentiment_label] ?? "text-gray-400"}`}>
            {article.overall_sentiment_label}
          </span>
        )}
      </div>
    </a>
  );
}
