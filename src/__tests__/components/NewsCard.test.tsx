import { render, screen } from "@testing-library/react";
import NewsCard from "@/components/NewsCard";

const baseArticle = {
  title: "Apple hits record high amid AI announcement",
  url: "https://example.com/news/1",
  source: "Reuters",
  summary: "Apple announced new AI features driving stocks higher.",
  overall_sentiment_label: "Bullish",
};

describe("NewsCard", () => {
  it("renders the article title", () => {
    render(<NewsCard article={baseArticle} />);
    expect(screen.getByText(baseArticle.title)).toBeInTheDocument();
  });

  it("renders the source name", () => {
    render(<NewsCard article={baseArticle} />);
    expect(screen.getByText("Reuters")).toBeInTheDocument();
  });

  it("renders summary when provided", () => {
    render(<NewsCard article={baseArticle} />);
    expect(screen.getByText(baseArticle.summary!)).toBeInTheDocument();
  });

  it("shows BREAKING badge when breaking prop is true", () => {
    render(<NewsCard article={baseArticle} breaking />);
    expect(screen.getByText("BREAKING")).toBeInTheDocument();
  });

  it("does not show BREAKING badge by default", () => {
    render(<NewsCard article={baseArticle} />);
    expect(screen.queryByText("BREAKING")).not.toBeInTheDocument();
  });

  it("links to the article URL", () => {
    render(<NewsCard article={baseArticle} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", baseArticle.url);
  });

  it("shows the sentiment label with correct color class", () => {
    render(<NewsCard article={baseArticle} />);
    const sentiment = screen.getByText("Bullish");
    expect(sentiment).toHaveClass("text-emerald-400");
  });
});
