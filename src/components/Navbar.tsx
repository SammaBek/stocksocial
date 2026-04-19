"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import AccentPicker from "@/components/AccentPicker";

const links = [
  { href: "/", label: "Home" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/chat", label: "Chat" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-xl">StockSocial</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-emerald-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <AccentPicker />
          {session ? (
            <>
              <span className="text-sm text-gray-400">{session.user?.name ?? session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="text-sm bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-md transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
