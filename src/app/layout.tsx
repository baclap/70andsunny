import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE } from "@/lib/site";

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
    "@type": "LocalBusiness",
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
    <html lang="en">
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
      <body>{children}</body>
    </html>
  );
}
