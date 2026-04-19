"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  "1. symbol": string;
  "2. name": string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  async function search(keywords: string) {
    if (!keywords.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(keywords)}`);
      const data = await res.json();
      setResults(data.slice(0, 6));
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => search(val), 350);
  }

  function handleSelect(symbol: string) {
    setOpen(false);
    setQuery("");
    router.push(`/stock/${symbol}`);
  }

  return (
    <div ref={ref} className="relative w-full max-w-lg">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search stocks by name or symbol..."
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {open && results.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-xl z-50">
          {results.map((r) => (
            <li key={r["1. symbol"]}>
              <button
                onClick={() => handleSelect(r["1. symbol"])}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-700 transition-colors"
              >
                <span className="font-semibold text-emerald-400 text-sm">{r["1. symbol"]}</span>
                <span className="text-gray-400 text-sm ml-2">{r["2. name"]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
