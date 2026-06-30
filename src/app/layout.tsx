import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE } from "@/lib/site";

const bodyTypeface = localFont({
  src: [
    {
      path: "./fonts/body-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/body-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--type-body",
  display: "swap",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
  adjustFontFallback: "Arial",
});

const displayTypeface = localFont({
  src: "./fonts/display.woff2",
  variable: "--type-display",
  display: "swap",
  fallback: [
    "ui-rounded",
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: SITE.seo.title,
  description: SITE.seo.description,
  metadataBase: new URL(SITE.businessUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE.businessName,
    title: SITE.seo.title,
    description: SITE.seo.description,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: SITE.businessName,
    description: SITE.seo.description,
    url: SITE.businessUrl,
    sameAs: [SITE.instagramUrl],
    address: {
      "@type": "PostalAddress",
      ...SITE.address,
    },
    openingHours: SITE.businessInfo.openingHours,
    servesCuisine: SITE.businessInfo.servesCuisine,
    priceRange: SITE.businessInfo.priceRange,
  };

  return (
    <html
      lang="en"
      className={`${bodyTypeface.variable} ${displayTypeface.variable}`}
    >
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
