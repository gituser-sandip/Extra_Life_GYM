import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import FloatingCheckIn from "@/components/FloatingCheckIn";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ExtraLife GYM | Unleash Your Potential",
  description: "Join ExtraLife GYM and elevate your fitness journey. We offer premium equipment, expert trainers, and dynamic classes.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "ExtraLife GYM | Unleash Your Potential",
    description: "Join ExtraLife GYM and elevate your fitness journey. Premium equipment, expert trainers, and dynamic classes.",
    type: "website",
    url: "https://example.com/",
    siteName: "ExtraLife GYM",
    images: [
      {
        url: "/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "ExtraLife GYM interior"
      }
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExtraLife GYM | Unleash Your Potential",
    description: "Premium equipment, expert trainers, and dynamic classes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <Navbar />
        {children}
        <FloatingCheckIn />
      </body>
    </html>
  );
}
