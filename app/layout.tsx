import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Sour_Gummy } from "next/font/google";
import "./globals.css";
import { Hanalei_Fill } from "next/font/google";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hanalei = Hanalei_Fill({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-hanalei',
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const sourGummy = Sour_Gummy({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sour-gummy',
});

export const metadata: Metadata = {
  title: "Noah's Wild Adventure",
  description: 'Join us for a jungle-themed baby shower celebration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hanalei.variable} ${roboto.variable} ${sourGummy.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
