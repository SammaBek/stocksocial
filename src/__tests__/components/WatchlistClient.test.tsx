import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WatchlistClient from "@/components/WatchlistClient";

jest.mock("next/link", () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

global.fetch = jest.fn();

const mockItems = [
  { id: "1", symbol: "AAPL", price: "182.50", change: "1.20", changePercent: "0.66%" },
  { id: "2", symbol: "TSLA", price: "240.00", change: "-3.00", changePercent: "-1.23%" },
];

describe("WatchlistClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all watchlist items", () => {
    render(<WatchlistClient items={mockItems} />);
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("TSLA")).toBeInTheDocument();
  });

  it("shows prices for each stock", () => {
    render(<WatchlistClient items={mockItems} />);
    expect(screen.getByText("$182.50")).toBeInTheDocument();
    expect(screen.getByText("$240.00")).toBeInTheDocument();
  });

  it("removes a stock from the list after successful delete", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<WatchlistClient items={mockItems} />);
    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("AAPL")).not.toBeInTheDocument();
    });
  });

  it("keeps stock in list if delete request fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<WatchlistClient items={mockItems} />);
    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("AAPL")).toBeInTheDocument();
    });
  });
});
