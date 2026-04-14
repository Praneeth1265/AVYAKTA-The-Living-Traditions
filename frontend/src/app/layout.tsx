import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const heading = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const accent = Playfair_Display({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: "Avyakta",
  description: "Where culture comes alive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${bodyFont.variable} ${accent.variable}`}
    >
      <body className="min-h-screen bg-warm text-charcoal font-body">
        {children}
      </body>
    </html>
  );
}
