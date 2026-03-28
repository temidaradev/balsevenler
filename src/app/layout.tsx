import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Balsevenler | Geliştirmede Mükemmeliyet",
  description: "Balsevenler ekibinin resmi portalı. Yenilikçi projeler, geliştirme günlükleri ve tutkulu ekip üyeleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${outfit.variable} ${inter.variable}`}>
      <body style={{ fontFamily: "var(--font-inter)" }}>
        {children}
      </body>
    </html>
  );
}
