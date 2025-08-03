import { createClient } from "@sanity/client";
import groq from "groq";
import {
  SANITY_API_VERSION,
  COMING_SOON_MESSAGE,
  SITE_TITLE,
  SITE_DESCRIPTION,
  BUSINESS_INFO,
} from "./constants";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: SANITY_API_VERSION, // Use the latest API version
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
      comingSoonMessage: COMING_SOON_MESSAGE,
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
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      businessInfo: BUSINESS_INFO,
    };
  }
}
