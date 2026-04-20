import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-warm text-charcoal font-body">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
