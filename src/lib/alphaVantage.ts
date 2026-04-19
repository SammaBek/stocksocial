const BASE_URL = "https://www.alphavantage.co/query";
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

export async function getQuote(symbol: string) {
  const res = await fetch(
    `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
  );
  const data = await res.json();
  return data["Global Quote"];
}

export async function searchSymbol(keywords: string) {
  const res = await fetch(
    `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`
  );
  const data = await res.json();
  return data["bestMatches"] ?? [];
}

export async function getDailyTimeSeries(symbol: string) {
  const res = await fetch(
    `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`
  );
  const data = await res.json();
  return data["Time Series (Daily)"] ?? {};
}

export async function getNews(symbol: string) {
  const res = await fetch(
    `${BASE_URL}?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${API_KEY}`
  );
  const data = await res.json();
  return data["feed"] ?? [];
}
