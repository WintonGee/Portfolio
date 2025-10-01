import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorker from "@/components/ServiceWorker";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Winton Gee - AI/ML Engineer",
  description: "AI/ML Engineer & Software Developer - Portfolio and Resume",
  manifest: "/manifest.json",
  metadataBase: new URL("https://wintongee.com"),
  icons: {
    icon: "/logos/default.png",
    apple: "/logos/default.png",
  },
  openGraph: {
    title: "Winton Gee - AI/ML Engineer",
    description:
      "Building intelligent systems with Python, TypeScript, and modern AI",
    images: ["/headshot.jpg"],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Winton Gee - AI/ML Engineer",
    description:
      "Building intelligent systems with Python, TypeScript, and modern AI",
    images: ["/headshot.jpg"],
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#556B2F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Winton Gee" />
        <link rel="apple-touch-icon" href="/logos/default.png" />
        <meta name="msapplication-TileColor" content="#556B2F" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        {children}
        <ServiceWorker />
        <PerformanceMonitor />
      </body>
    </html>
  );
}
