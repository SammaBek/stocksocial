"use client";

import { useEffect, useState } from "react";

const ACCENTS = [
  { id: "emerald", color: "#34d399" },
  { id: "blue",    color: "#60a5fa" },
  { id: "violet",  color: "#a78bfa" },
  { id: "rose",    color: "#fb7185" },
  { id: "amber",   color: "#fbbf24" },
  { id: "cyan",    color: "#22d3ee" },
];

export default function AccentPicker() {
  const [accent, setAccent] = useState("emerald");

  useEffect(() => {
    const saved = localStorage.getItem("accent") ?? "emerald";
    setAccent(saved);
    document.documentElement.setAttribute("data-accent", saved);
  }, []);

  function pick(id: string) {
    setAccent(id);
    localStorage.setItem("accent", id);
    document.documentElement.setAttribute("data-accent", id);
  }

  return (
    <div className="flex items-center gap-1.5">
      {ACCENTS.map(({ id, color }) => (
        <button
          key={id}
          onClick={() => pick(id)}
          title={id}
          style={{ backgroundColor: color }}
          className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${
            accent === id ? "ring-2 ring-white ring-offset-1 ring-offset-gray-900 scale-110" : ""
          }`}
        />
      ))}
    </div>
  );
}
