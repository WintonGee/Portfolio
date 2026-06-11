import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ServiceWorker from "@/components/ServiceWorker";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Winton Gee - AI/ML Engineer",
  description: "AI/ML Engineer & Software Developer - Portfolio and Resume",
  manifest: "/manifest.json",
  metadataBase: new URL("https://wintongee.com"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/logos/companies/default.png",
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Winton Gee" />
        <meta name="msapplication-TileColor" content="#556B2F" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Winton Gee",
              "jobTitle": "AI/ML Engineer",
              "url": "https://wintongee.com",
              "sameAs": [
                "https://linkedin.com/in/wintongee",
                "https://github.com/wintongee"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "San Francisco",
                "addressRegion": "CA"
              },
              "email": "wintongee@gmail.com",
              "knowsAbout": [
                "Artificial Intelligence",
                "Machine Learning",
                "Python",
                "TypeScript",
                "React",
                "Next.js",
                "RAG Systems",
                "Semantic Search"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Mercor"
              }
            })
          }}
        />
      </head>
      <body className={plusJakartaSans.className}>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
