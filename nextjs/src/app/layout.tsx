import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getSeoData } from "@/lib/sanity";
import {
  BUSINESS_NAME,
  BUSINESS_URL,
  BUSINESS_ADDRESS,
  BUSINESS_INFO,
  SITE_TITLE,
  SITE_DESCRIPTION,
  INSTAGRAM_URL,
} from "@/lib/constants";

// TODO: add hard coded image
// const socialImageUrl = "/images/...";
// const socialImageWidth = 1200;
// const socialImageHeight = 630;

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoData();

  const title = seoData?.title || SITE_TITLE;
  const description = seoData?.description || SITE_DESCRIPTION;

  return {
    title: title,
    description: description,
    metadataBase: new URL(BUSINESS_URL),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: BUSINESS_NAME,
      title: title,
      description: description,
      // TODO: add hard coded image
      // images: [
      //   {
      //     url: socialImageUrl,
      //     width: socialImageWidth,
      //     height: socialImageHeight,
      //     alt: BUSINESS_NAME,
      //   },
      // ],
    },
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: "/icon.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seoData = await getSeoData();

  const description = seoData?.description || SITE_DESCRIPTION;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS_NAME,
    description: description,
    url: BUSINESS_URL,
    sameAs: [INSTAGRAM_URL],
    address: {
      "@type": "PostalAddress",
      ...BUSINESS_ADDRESS,
    },
    openingHours:
      seoData?.businessInfo?.openingHours || BUSINESS_INFO.openingHours,
    servesCuisine:
      seoData?.businessInfo?.servesCuisine || BUSINESS_INFO.servesCuisine,
    priceRange: seoData?.businessInfo?.priceRange || BUSINESS_INFO.priceRange,
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
