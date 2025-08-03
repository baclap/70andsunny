// =============================================================================
// CRITICAL CONSTANTS - Used directly throughout the app
// These are essential for core functionality and should not be changed lightly
// =============================================================================

/**
 * Core business identity - used for branding, SEO, and accessibility
 * Used in: layout.tsx (OpenGraph, structured data), logo.tsx (aria-label), social-links.tsx
 */
export const BUSINESS_NAME = "70 & Sunny Coffee Co.";

/**
 * Primary business URL - critical for SEO metadata and canonical URLs
 * Used in: layout.tsx (metadataBase, structured data)
 */
export const BUSINESS_URL = "https://70andsunnycoffee.co";

/**
 * Social media integration - used for direct linking and structured data
 * Used in: layout.tsx (structured data sameAs), social-links.tsx (href)
 */
export const INSTAGRAM_URL = "https://www.instagram.com/70andsunnycoffeeco/";

/**
 * Physical business location - essential for local SEO and structured data
 * Used in: layout.tsx (structured data address)
 */
export const BUSINESS_ADDRESS = {
  streetAddress: "2821 Alaskan Way",
  addressLocality: "Seattle",
  addressRegion: "WA",
  postalCode: "98121",
  addressCountry: "US",
};

/**
 * Sanity CMS API version - required for content management system integration
 * Used in: sanity.ts (client configuration)
 */
export const SANITY_API_VERSION = "2023-05-03";

// =============================================================================
// FALLBACK CONSTANTS - Used only when Sanity CMS content is unavailable
// These serve as safety nets and can be updated as needed for better defaults
// =============================================================================

/**
 * Fallback page title when Sanity SEO data is unavailable
 * Used in: layout.tsx (title fallback), sanity.ts (error fallback)
 */
export const SITE_TITLE = "70 & Sunny Coffee Co. – Coming Soon";

/**
 * Fallback meta description when Sanity SEO data is unavailable
 * Used in: layout.tsx (description fallback), sanity.ts (error fallback)
 */
export const SITE_DESCRIPTION = "70 & Sunny Coffee Co. is a new coffee shop coming soon to Seattle's historic Pier 70 on the Elliott Bay waterfront, steps from Olympic Sculpture Park.";

/**
 * Fallback coming soon message when Sanity site settings are unavailable
 * Used in: sanity.ts (error fallback only)
 */
export const COMING_SOON_MESSAGE = "70 & Sunny Coffee Co. is brewing something special!";

/**
 * Fallback business details for structured data when Sanity business info is unavailable
 * Used in: layout.tsx (structured data fallbacks), sanity.ts (error fallback)
 */
export const BUSINESS_INFO = {
  openingHours: "Coming Soon",
  servesCuisine: "Coffee, Tea, Pastries",
  priceRange: "$"
};
