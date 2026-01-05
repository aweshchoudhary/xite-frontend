import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XITE Platform - Learning Management System",
  description:
    "XITE Platform - Comprehensive learning management system for managing programs, cohorts, faculty, and academic partnerships",
  openGraph: {
    title: "XITE Platform - Learning Management System",
    description:
      "XITE Platform - Comprehensive learning management system for managing programs, cohorts, faculty, and academic partnerships",
    siteName: "XITE Platform",
    images: [
      {
        url: "/xite-logo.png",
        width: 1200,
        height: 630,
        alt: "XITE Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "XITE Platform - Learning Management System",
    description:
      "XITE Platform - Comprehensive learning management system for managing programs, cohorts, faculty, and academic partnerships",
    images: ["/xite-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
