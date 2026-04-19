import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StockSocial",
  description: "Track, collaborate, and grow your portfolio with others.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var a=localStorage.getItem('accent');if(a)document.documentElement.setAttribute('data-accent',a);})();` }} />
      </head>
      <body className={`${inter.className} min-h-full bg-gray-950 text-gray-100`}>
        <SessionWrapper>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8 w-full">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
