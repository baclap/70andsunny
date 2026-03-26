export const SITE = {
  businessName: "70 & Sunny Coffee Co.",
  businessUrl: "https://70andsunnycoffee.co",
  instagramUrl: "https://www.instagram.com/70andsunnycoffeeco/",
  address: {
    streetAddress: "2821 Alaskan Way",
    addressLocality: "Seattle",
    addressRegion: "WA",
    postalCode: "98121",
    addressCountry: "US",
  },
  seo: {
    title: "70 & Sunny Coffee Co. – Now Open",
    description:
      "70 & Sunny Coffee Co. is a new coffee shop located in Seattle’s historic Pier 70 Building on the Elliott Bay waterfront, steps from Olympic Sculpture Park.",
  },
  home: {
    comingSoonMessage: "Open for business in Seattle's historic Pier 70 Building",
    expectedOpenDate: null as string | null,
  },
  businessInfo: {
    openingHours: "Daily 7AM - 3PM",
    servesCuisine: "Coffee, Tea, Pastries",
    priceRange: "$",
  },
} as const;
