import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

global.fetch = jest.fn();

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the search input", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search stocks/i)).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search stocks/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Apple" } });
    expect(input.value).toBe("Apple");
  });

  it("calls fetch with the typed query", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [{ "1. symbol": "AAPL", "2. name": "Apple Inc." }],
    });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search stocks/i);
    fireEvent.change(input, { target: { value: "Apple" } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/stocks/search?q=Apple")
      );
    }, { timeout: 1000 });
  });

  it("shows dropdown results after search", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [{ "1. symbol": "AAPL", "2. name": "Apple Inc." }],
    });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search stocks/i);
    fireEvent.change(input, { target: { value: "Apple" } });

    await waitFor(() => {
      expect(screen.getByText("AAPL")).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});
