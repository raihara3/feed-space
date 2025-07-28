import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feed Space",
  description: "すべてのフィードを一箇所に。",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "Feed Space",
    description: "すべてのフィードを一箇所に。",
    url: 'https://feed-space.vercel.app',
    siteName: 'Feed Space',
    images: [
      {
        url: '/ogp.jpg',
        width: 1200,
        height: 630,
        alt: 'Feed Space - すべてのフィードを一箇所に。',
      }
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Feed Space',
    description: 'すべてのフィードを一箇所に。',
    images: ['/ogp.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
