import { render, screen } from "@testing-library/react";
import StockCard from "@/components/StockCard";

jest.mock("next/link", () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe("StockCard", () => {
  it("renders the stock symbol", () => {
    render(<StockCard symbol="AAPL" />);
    expect(screen.getByText("AAPL")).toBeInTheDocument();
  });

  it("renders price when provided", () => {
    render(<StockCard symbol="AAPL" price="182.50" change="1.20" changePercent="0.66%" />);
    expect(screen.getByText("$182.50")).toBeInTheDocument();
  });

  it("shows green text for positive change", () => {
    render(<StockCard symbol="AAPL" price="182.50" change="1.20" changePercent="0.66%" />);
    const changeEl = screen.getByText("+1.20 (0.66%)");
    expect(changeEl).toHaveClass("text-emerald-400");
  });

  it("shows red text for negative change", () => {
    render(<StockCard symbol="AAPL" price="182.50" change="-2.30" changePercent="-1.25%" />);
    const changeEl = screen.getByText("-2.30 (-1.25%)");
    expect(changeEl).toHaveClass("text-red-400");
  });

  it("links to the stock detail page", () => {
    render(<StockCard symbol="TSLA" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/stock/TSLA");
  });

  it("renders company name when provided", () => {
    render(<StockCard symbol="MSFT" name="Microsoft Corporation" />);
    expect(screen.getByText("Microsoft Corporation")).toBeInTheDocument();
  });
});
