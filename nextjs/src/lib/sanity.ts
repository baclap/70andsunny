import { createClient } from "@sanity/client";
import groq from "groq";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-05-03", // Use the latest API version
  useCdn: true, // Use the Content Delivery Network for faster responses
});

// GROQ query to fetch site settings
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;

// GROQ query to fetch SEO data
export const seoQuery = groq`*[_type == "seo"][0]`;

// Function to fetch site settings
export async function getSiteSettings() {
  try {
    return await client.fetch(siteSettingsQuery);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    // Return fallback data if fetch fails
    return {
      comingSoonMessage: "70 & Sunny Coffee Co. is brewing something special!",
      expectedOpenDate: null,
    };
  }
}

// Function to fetch SEO data
export async function getSeoData() {
  try {
    return await client.fetch(seoQuery);
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    // Return fallback data if fetch fails
    return {
      title: "70 & Sunny Coffee Co. – Coming Soon",
      description: "70 & Sunny Coffee Co. is a new coffee shop coming soon to Seattle's historic Pier 70 on the Elliott Bay waterfront, steps from Olympic Sculpture Park.",
      businessInfo: {
        openingHours: "Coming Soon",
        servesCuisine: "Coffee, Tea, Pastries",
        priceRange: "$"
      }
    };
  }
}
