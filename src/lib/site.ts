export const SITE = {
  businessName: "70 & Sunny Coffee Co.",
  businessUrl: "https://70andsunnycoffee.co",
  instagramUrl: "https://www.instagram.com/70andsunnycoffeeco/",
  googleMapsUrl: "https://www.google.com/maps?cid=17417265034152294788",
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
    hours: [
      { day: "Monday", hours: "7 AM-6 PM" },
      { day: "Tuesday", hours: "7 AM-6 PM" },
      { day: "Wednesday", hours: "7 AM-6 PM" },
      { day: "Thursday", hours: "7 AM-6 PM" },
      { day: "Friday", hours: "7 AM-6 PM" },
      { day: "Saturday", hours: "6:30 AM-6 PM" },
      { day: "Sunday", hours: "7 AM-5 PM" },
    ],
    openingHours: [
      "Mo 07:00-18:00",
      "Tu 07:00-18:00",
      "We 07:00-18:00",
      "Th 07:00-18:00",
      "Fr 07:00-18:00",
      "Sa 06:30-18:00",
      "Su 07:00-17:00",
    ],
    servesCuisine: "Coffee, Tea, Pastries",
    priceRange: "$",
  },
} as const;
