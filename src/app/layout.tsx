import { getServerAuth } from "@/lib/auth";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Cinzel_Decorative, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "PixelMage - Norse Mythology Card Collection",
    template: "%s | PixelMage",
  },
  description: "Collect and trade authentic Norse Mythology themed cards with NFC technology. Explore stories of Odin, Thor, Freya, and more legendary figures.",
  keywords: ["Norse Mythology", "Trading Cards", "NFC Cards", "Collectibles", "Vikings", "Mythology"],
  authors: [{ name: "PixelMage" }],
  creator: "PixelMage",
  publisher: "PixelMage",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "PixelMage",
    title: "PixelMage - Norse Mythology Card Collection",
    description: "Collect and trade authentic Norse Mythology themed cards with NFC technology.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PixelMage - Norse Mythology Cards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelMage - Norse Mythology Card Collection",
    description: "Collect and trade authentic Norse Mythology themed cards with NFC technology.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getServerAuth();

  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${cinzel.variable} antialiased`}
      >
        <div className="starfield" />
        <Providers initialUser={user}>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
