import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getSeoData } from "@/lib/sanity";

const businessName = "70 & Sunny Coffee Co.";
const businessUrl = "https://70andsunnycoffee.co";
const businessAddress = {
  streetAddress: "2821 Alaskan Way",
  addressLocality: "Seattle",
  addressRegion: "WA",
  postalCode: "98121",
  addressCountry: "US",
};
// TODO: add hard coded image
// const socialImageUrl = "/images/...";
// const socialImageWidth = 1200;
// const socialImageHeight = 630;

const titleFallback = "70 & Sunny Coffee Co. – Coming Soon";
const descriptionFallback =
  "70 & Sunny Coffee Co. is a new coffee shop coming soon to Seattle's historic Pier 70 on the Elliott Bay waterfront, steps from Olympic Sculpture Park.";

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoData();

  const title = seoData?.title || titleFallback;
  const description = seoData?.description || descriptionFallback;

  return {
    title: title,
    description: description,
    metadataBase: new URL(businessUrl),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: businessName,
      title: title,
      description: description,
      // TODO: add hard coded image
      // images: [
      //   {
      //     url: socialImageUrl,
      //     width: socialImageWidth,
      //     height: socialImageHeight,
      //     alt: businessName,
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
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seoData = await getSeoData();

  const description = seoData?.description || descriptionFallback;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    description: description,
    url: businessUrl,
    address: {
      "@type": "PostalAddress",
      ...businessAddress,
    },
    openingHours: seoData?.businessInfo?.openingHours || "Coming Soon",
    servesCuisine:
      seoData?.businessInfo?.servesCuisine || "Coffee, Tea, Pastries",
    priceRange: seoData?.businessInfo?.priceRange || "$",
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
