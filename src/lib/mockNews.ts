export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  summary?: string;
  overall_sentiment_label?: string;
}

const MOCK_MARKET_NEWS: NewsArticle[] = [
  {
    title: "Fed Holds Rates Steady Amid Mixed Economic Signals",
    url: "#",
    source: "Financial Times",
    summary: "The Federal Reserve kept interest rates unchanged as policymakers weigh persistent inflation against signs of a softening labor market.",
    overall_sentiment_label: "Neutral",
  },
  {
    title: "Tech Sector Rallies on Strong Earnings Outlook",
    url: "#",
    source: "Bloomberg",
    summary: "Major technology companies are poised for a strong earnings season, with analysts raising price targets across the sector.",
    overall_sentiment_label: "Bullish",
  },
  {
    title: "Oil Prices Dip as Demand Concerns Weigh on Markets",
    url: "#",
    source: "Reuters",
    summary: "Crude oil futures slipped on concerns about slowing global demand, particularly in Asia, offsetting supply constraints from OPEC+.",
    overall_sentiment_label: "Bearish",
  },
  {
    title: "S&P 500 Touches New High as Investor Sentiment Improves",
    url: "#",
    source: "Wall Street Journal",
    summary: "Broad market indices climbed to fresh highs as easing inflation data boosted confidence in a soft economic landing.",
    overall_sentiment_label: "Bullish",
  },
  {
    title: "Retail Sales Beat Expectations in Latest Report",
    url: "#",
    source: "CNBC",
    summary: "Consumer spending remained resilient last month, surpassing analyst forecasts and suggesting continued economic momentum heading into Q2.",
    overall_sentiment_label: "Somewhat-Bullish",
  },
  {
    title: "Volatility Spikes as Geopolitical Tensions Resurface",
    url: "#",
    source: "MarketWatch",
    summary: "The VIX index jumped as fresh geopolitical tensions in the Middle East rattled investors, prompting a flight to safe-haven assets.",
    overall_sentiment_label: "Bearish",
  },
  {
    title: "AI Investment Wave Drives Capital Expenditure Surge",
    url: "#",
    source: "The Economist",
    summary: "Cloud and semiconductor companies are dramatically increasing capex plans to meet surging demand for AI infrastructure buildout.",
    overall_sentiment_label: "Bullish",
  },
  {
    title: "Analysts Debate Valuation as Growth Stocks Climb",
    url: "#",
    source: "Barron's",
    summary: "A divergence in analyst opinions has emerged as high-multiple growth stocks extend their rally, with some calling for a near-term correction.",
    overall_sentiment_label: "Neutral",
  },
];

const MOCK_STOCK_NEWS_TEMPLATES = (symbol: string): NewsArticle[] => [
  {
    title: `${symbol} Reports Strong Quarterly Results, Beats Estimates`,
    url: "#",
    source: "Bloomberg",
    summary: `${symbol} delivered better-than-expected earnings and revenue this quarter, driven by robust demand across its core business segments.`,
    overall_sentiment_label: "Bullish",
  },
  {
    title: `Analysts Raise Price Target on ${symbol} Following Product Launch`,
    url: "#",
    source: "Wall Street Journal",
    summary: `Several investment banks revised their price targets upward for ${symbol} after the company unveiled a new product line that exceeded market expectations.`,
    overall_sentiment_label: "Somewhat-Bullish",
  },
  {
    title: `${symbol} Expands Into New Markets With Strategic Partnership`,
    url: "#",
    source: "Reuters",
    summary: `${symbol} announced a major strategic partnership aimed at accelerating growth in emerging markets and diversifying its revenue streams.`,
    overall_sentiment_label: "Bullish",
  },
  {
    title: `Institutional Investors Increase Stakes in ${symbol}`,
    url: "#",
    source: "Financial Times",
    summary: `Latest SEC filings reveal a number of large institutional investors have significantly increased their positions in ${symbol} over the past quarter.`,
    overall_sentiment_label: "Somewhat-Bullish",
  },
  {
    title: `${symbol} Faces Headwinds From Rising Input Costs`,
    url: "#",
    source: "CNBC",
    summary: `Margin pressure is mounting for ${symbol} as supply chain costs remain elevated, though management remains cautiously optimistic about the outlook.`,
    overall_sentiment_label: "Somewhat-Bearish",
  },
  {
    title: `${symbol} CEO Outlines Long-Term Growth Strategy at Investor Day`,
    url: "#",
    source: "MarketWatch",
    summary: `The leadership team at ${symbol} presented a multi-year roadmap at its annual investor day event, emphasizing innovation, margin expansion, and shareholder returns.`,
    overall_sentiment_label: "Bullish",
  },
];

export function getMockNewsForSymbol(symbol: string): NewsArticle[] {
  return MOCK_STOCK_NEWS_TEMPLATES(symbol);
}

export function getMockMarketNews(): NewsArticle[] {
  return MOCK_MARKET_NEWS;
}
