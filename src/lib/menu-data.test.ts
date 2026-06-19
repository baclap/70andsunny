import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSiteMenu,
  formatMoney,
  normalizeMenuItem,
  type SquareItem,
  type SquareMenuCategory,
} from "./menu-data.ts";

test("single variation items render as a single line price", () => {
  const item = normalizeMenuItem({
    id: "coffee",
    name: "Drip Coffee",
    description: "",
    categories: [],
    variations: [
      {
        id: "variation",
        name: "",
        priceCents: 350,
      },
    ],
  });

  assert.equal(item.priceLabel, "$3.50");
  assert.equal(item.variations.length, 0);
});

test("multi variation items keep labeled sub-rows", () => {
  const item = normalizeMenuItem({
    id: "shirt",
    name: "Tee",
    description: null,
    categories: [],
    variations: [
      {
        id: "small",
        name: "S",
        priceCents: 3000,
      },
      {
        id: "large",
        name: "L",
        priceCents: 3200,
      },
    ],
  });

  assert.equal(item.priceLabel, null);
  assert.deepEqual(
    item.variations.map((variation) => ({
      name: variation.name,
      priceLabel: variation.priceLabel,
    })),
    [
      { name: "S", priceLabel: "$30.00" },
      { name: "L", priceLabel: "$32.00" },
    ],
  );
});

test("hidden variations are excluded before rendering", () => {
  const item = normalizeMenuItem(
    {
      id: "sticker",
      name: "Sticker",
      description: null,
      categories: [],
      variations: [
        {
          id: "sun",
          name: "Sun",
          priceCents: 250,
        },
        {
          id: "seal",
          name: "Sunny the Seal",
          priceCents: 250,
        },
      ],
    },
    {
      hiddenVariationIds: ["seal"],
    },
  );

  assert.equal(item.priceLabel, "$2.50");
  assert.equal(item.variations.length, 0);
});

test("hidden variation names are excluded before rendering", () => {
  const item = normalizeMenuItem(
    {
      id: "espresso",
      name: "Espresso",
      description: null,
      categories: [],
      variations: [
        {
          id: "8oz",
          name: "8oz",
          priceCents: 450,
        },
        {
          id: "12oz",
          name: "12oz",
          priceCents: 450,
        },
      ],
    },
    {
      hiddenVariationNames: ["8oz", "12oz"],
    },
  );

  assert.equal(item.priceLabel, "$4.50");
  assert.equal(item.variations.length, 0);
  assert.equal(item.variationSummary, null);
});

test("blank descriptions become null", () => {
  const item = normalizeMenuItem({
    id: "tea",
    name: "Hot Tea",
    description: "   ",
    categories: [],
    variations: [
      {
        id: "variation",
        name: "",
        priceCents: 525,
      },
    ],
  });

  assert.equal(item.subtitle, null);
});

test("missing prices are preserved as null labels", () => {
  const item = normalizeMenuItem({
    id: "special",
    name: "Market Special",
    description: null,
    categories: [],
    variations: [
      {
        id: "variation",
        name: "",
        priceCents: null,
      },
    ],
  });

  assert.equal(item.priceLabel, null);
});

test("same-price variations collapse into a summary with one price", () => {
  const item = normalizeMenuItem({
    id: "americano",
    name: "Americano",
    description: null,
    categories: [],
    variations: [
      {
        id: "8oz",
        name: "8oz",
        priceCents: 450,
      },
      {
        id: "12oz",
        name: "12oz",
        priceCents: 450,
      },
      {
        id: "16oz",
        name: "16oz",
        priceCents: 450,
      },
    ],
  });

  assert.equal(item.priceLabel, "$4.50");
  assert.equal(item.variationSummary, "8oz, 12oz, or 16oz");
  assert.equal(item.variations.length, 0);
});

test("Square menu categories control section and item order", () => {
  const items: SquareItem[] = [
    {
      id: "latte",
      name: "Latte",
      description: null,
      categories: [{ id: "coffee", ordinal: 2 }],
      variations: [{ id: "latte-variation", name: "", priceCents: 550 }],
    },
    {
      id: "mocha",
      name: "Mocha",
      description: null,
      categories: [{ id: "coffee", ordinal: 1 }],
      variations: [{ id: "mocha-variation", name: "", priceCents: 600 }],
    },
    {
      id: "sandwich",
      name: "Breakfast Sandwich",
      description: null,
      categories: [{ id: "food", ordinal: 1 }],
      variations: [{ id: "sandwich-variation", name: "", priceCents: 900 }],
    },
  ];

  const menuCategories: SquareMenuCategory[] = [
    {
      id: "root",
      name: "70 & Sunny Menu",
      ordinal: 0,
      isTopLevel: true,
      parentCategoryId: null,
      rootCategoryId: null,
    },
    {
      id: "coffee",
      name: "Coffee",
      ordinal: 1,
      isTopLevel: false,
      parentCategoryId: "root",
      rootCategoryId: "root",
    },
    {
      id: "food",
      name: "Food",
      ordinal: 2,
      isTopLevel: false,
      parentCategoryId: "root",
      rootCategoryId: "root",
    },
  ];

  const sections = buildSiteMenu(items, menuCategories, {
    latte: {
      label: "House Latte",
    },
  });

  assert.deepEqual(
    sections.map((section) => section.title),
    ["Coffee", "Food"],
  );
  assert.deepEqual(
    sections[0].items.map((item) => item.name),
    ["Mocha", "House Latte"],
  );
});

test("direct menu sections include items from nested child categories", () => {
  const items: SquareItem[] = [
    {
      id: "seasonal-latte",
      name: "Seasonal Latte",
      description: null,
      categories: [{ id: "fall-drinks", ordinal: 1 }],
      variations: [{ id: "seasonal-variation", name: "", priceCents: 650 }],
    },
  ];

  const menuCategories: SquareMenuCategory[] = [
    {
      id: "root",
      name: "70 & Sunny Menu",
      ordinal: 0,
      isTopLevel: true,
      parentCategoryId: null,
      rootCategoryId: null,
    },
    {
      id: "drinks",
      name: "Drinks",
      ordinal: 1,
      isTopLevel: false,
      parentCategoryId: "root",
      rootCategoryId: "root",
    },
    {
      id: "fall-drinks",
      name: "Fall Drinks",
      ordinal: 1,
      isTopLevel: false,
      parentCategoryId: "drinks",
      rootCategoryId: "root",
    },
  ];

  const sections = buildSiteMenu(items, menuCategories, {});

  assert.equal(sections.length, 1);
  assert.equal(sections[0].title, "Drinks");
  assert.equal(sections[0].items[0].name, "Seasonal Latte");
});

test("money formatting uses USD strings", () => {
  assert.equal(formatMoney(950), "$9.50");
  assert.equal(formatMoney(null), null);
});
