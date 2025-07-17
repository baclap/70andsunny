import { defineField, defineType } from "sanity";

export default defineType({
  name: "seo",
  title: "SEO & Metadata",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Title for browser tabs, search results, and social media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Description for search engines and social media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessInfo",
      title: "Business Information",
      type: "object",
      description: "Information for search engines about your business",
      fields: [
        defineField({
          name: "openingHours",
          title: "Opening Hours",
          type: "string",
          description: 'E.g., "Coming Soon" or "Mo-Fr 08:00-17:00"',
        }),
        defineField({
          name: "servesCuisine",
          title: "Serves Cuisine",
          type: "string",
          description: 'E.g., "Coffee, Tea, Pastries"',
        }),
        defineField({
          name: "priceRange",
          title: "Price Range",
          type: "string",
          options: {
            list: [
              { title: "$", value: "$" },
              { title: "$$", value: "$$" },
              { title: "$$$", value: "$$$" },
              { title: "$$$$", value: "$$$$" },
            ],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
