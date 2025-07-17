import type { Metadata } from "next";
import "./globals.css";
import { getSeoData } from "@/lib/sanity";

// Generate metadata dynamically from Sanity
export async function generateMetadata(): Promise<Metadata> {
  // Fetch SEO data from Sanity
  const seoData = await getSeoData();

  // Business information that doesn't change
  const businessName = "70 & Sunny Coffee Co.";
  const businessUrl = "https://70andsunny.com";
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

  // Default values in case Sanity data is missing
  const title = seoData?.title || "70 & Sunny Coffee Co. – Coming Soon";
  const description =
    seoData?.description ||
    "70 & Sunny Coffee Co. is a new coffee shop coming soon to Seattle's historic Pier 70 on the Elliott Bay waterfront, steps from Olympic Sculpture Park.";

  // Construct the JSON-LD structured data
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
    other: {
      "application/ld+json": JSON.stringify(structuredData),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
