import { MENU_ITEM_OVERRIDES, type MenuItemOverride } from "./menu-config.ts";

export type SquareVariation = {
  id: string;
  name: string | null;
  priceCents: number | null;
  soldOut?: boolean | null;
};

export type SquareItem = {
  id: string;
  name: string;
  description: string | null;
  categories: SquareItemCategory[];
  variations: SquareVariation[];
};

export type SquareItemCategory = {
  id: string;
  ordinal: number | null;
};

export type SquareMenuCategory = {
  id: string;
  name: string;
  ordinal: number | null;
  isTopLevel: boolean;
  parentCategoryId: string | null;
  rootCategoryId: string | null;
};

export type MenuVariation = {
  id: string;
  name: string;
  priceLabel: string | null;
};

export type MenuItem = {
  id: string;
  name: string;
  subtitle: string | null;
  variationSummary: string | null;
  priceLabel: string | null;
  variations: MenuVariation[];
};

export type MenuSection = {
  id: string;
  title: string;
  subtitle: string | null;
  items: MenuItem[];
};

export type SiteMenu = {
  status: "live" | "cached" | "fallback";
  generatedAt: string;
  message: string | null;
  sections: MenuSection[];
};

export function buildSiteMenu(
  items: SquareItem[],
  menuCategories: SquareMenuCategory[],
  overrides: Record<string, MenuItemOverride> = MENU_ITEM_OVERRIDES,
): MenuSection[] {
  const rootCategoryIds = new Set(
    menuCategories
      .filter((category) => category.isTopLevel)
      .map((category) => category.id),
  );
  const directSectionCategories = menuCategories.filter((category) =>
    isDirectMenuSection(category, rootCategoryIds),
  );
  const sectionCategories =
    directSectionCategories.length > 0
      ? directSectionCategories
      : menuCategories.filter((category) => !category.isTopLevel);
  const childrenByParentId = buildChildrenByParentId(menuCategories);

  return sectionCategories
    .sort(compareMenuCategories)
    .map((sectionCategory) => {
      const sectionCategoryIds = getCategoryWithDescendantIds(
        sectionCategory.id,
        childrenByParentId,
      );

      return {
        id: sectionCategory.id,
        title: sectionCategory.name,
        subtitle: null,
        items: items
          .filter((item) => hasCategory(item, sectionCategoryIds))
          .sort((left, right) =>
            compareItemsInCategory(left, right, sectionCategoryIds),
          )
          .map((item) => normalizeMenuItem(item, overrides[item.id])),
      };
    })
    .filter((section) => section.items.length > 0);
}

export function normalizeMenuItem(
  item: SquareItem,
  override?: MenuItemOverride,
): MenuItem {
  const subtitle = cleanText(override?.description ?? item.description);
  const label = cleanText(override?.label) ?? item.name;
  const hiddenVariationIds = new Set(override?.hiddenVariationIds ?? []);
  const hiddenVariationNames = new Set(
    (override?.hiddenVariationNames ?? []).map((name) =>
      name.trim().toLowerCase(),
    ),
  );
  const visibleVariations = dedupeVariations(
    item.variations.filter((variation) => {
      if (hiddenVariationIds.has(variation.id)) {
        return false;
      }

      const normalizedName = normalizeVariationName(variation.name).toLowerCase();
      return !hiddenVariationNames.has(normalizedName);
    }),
  );

  if (visibleVariations.length === 0) {
    return {
      id: item.id,
      name: label,
      subtitle,
      variationSummary: null,
      priceLabel: formatMoney(item.variations[0]?.priceCents ?? null),
      variations: [],
    };
  }

  if (visibleVariations.length === 1) {
    return {
      id: item.id,
      name: label,
      subtitle,
      variationSummary: null,
      priceLabel: formatMoney(visibleVariations[0]?.priceCents ?? null),
      variations: [],
    };
  }

  const formattedPrices = visibleVariations.map((variation) =>
    formatMoney(variation.priceCents),
  );
  const firstPriceLabel = formattedPrices[0] ?? null;
  const allPricesMatch = formattedPrices.every(
    (priceLabel) => priceLabel === firstPriceLabel,
  );

  if (allPricesMatch) {
    return {
      id: item.id,
      name: label,
      subtitle,
      variationSummary: summarizeVariationNames(visibleVariations),
      priceLabel: firstPriceLabel,
      variations: [],
    };
  }

  return {
    id: item.id,
    name: label,
    subtitle,
    variationSummary: null,
    priceLabel: null,
    variations: visibleVariations.map((variation) => ({
      id: variation.id,
      name: normalizeVariationName(variation.name),
      priceLabel: formatMoney(variation.priceCents),
    })),
  };
}

export function formatMoney(priceCents: number | null): string | null {
  if (priceCents === null || Number.isNaN(priceCents)) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceCents / 100);
}

function dedupeVariations(variations: SquareVariation[]): SquareVariation[] {
  const seen = new Set<string>();
  const deduped: SquareVariation[] = [];

  for (const variation of variations) {
    if (seen.has(variation.id)) {
      continue;
    }

    seen.add(variation.id);
    deduped.push(variation);
  }

  return deduped;
}

function cleanText(value: string | null | undefined): string | null {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
}

function normalizeVariationName(value: string | null): string {
  const cleaned = cleanText(value);

  if (!cleaned) {
    return "Standard";
  }

  if (["regular", "default"].includes(cleaned.toLowerCase())) {
    return "Standard";
  }

  return cleaned;
}

function summarizeVariationNames(variations: SquareVariation[]): string | null {
  const names = variations
    .map((variation) => normalizeVariationName(variation.name))
    .filter(Boolean);

  if (names.length === 0) {
    return null;
  }

  if (names.length === 1) {
    return names[0];
  }

  if (names.length === 2) {
    return `${names[0]} or ${names[1]}`;
  }

  return `${names.slice(0, -1).join(", ")}, or ${names[names.length - 1]}`;
}

function compareMenuCategories(
  left: SquareMenuCategory,
  right: SquareMenuCategory,
): number {
  return (
    compareNullableNumbers(left.ordinal, right.ordinal) ||
    left.name.localeCompare(right.name)
  );
}

function compareItemsInCategory(
  left: SquareItem,
  right: SquareItem,
  categoryIds: Set<string>,
): number {
  return (
    compareNullableNumbers(
      getCategoryOrdinal(left, categoryIds),
      getCategoryOrdinal(right, categoryIds),
    ) || left.name.localeCompare(right.name)
  );
}

function getCategoryOrdinal(
  item: SquareItem,
  categoryIds: Set<string>,
): number | null {
  return (
    item.categories.find((category) => categoryIds.has(category.id))?.ordinal ??
    null
  );
}

function hasCategory(item: SquareItem, categoryIds: Set<string>): boolean {
  return item.categories.some((category) => categoryIds.has(category.id));
}

function isDirectMenuSection(
  category: SquareMenuCategory,
  rootCategoryIds: Set<string>,
): boolean {
  if (category.isTopLevel) {
    return false;
  }

  if (rootCategoryIds.size === 0) {
    return true;
  }

  return category.parentCategoryId
    ? rootCategoryIds.has(category.parentCategoryId)
    : rootCategoryIds.has(category.rootCategoryId ?? "");
}

function buildChildrenByParentId(
  categories: SquareMenuCategory[],
): Map<string, SquareMenuCategory[]> {
  const childrenByParentId = new Map<string, SquareMenuCategory[]>();

  for (const category of categories) {
    if (!category.parentCategoryId) {
      continue;
    }

    childrenByParentId.set(category.parentCategoryId, [
      ...(childrenByParentId.get(category.parentCategoryId) ?? []),
      category,
    ]);
  }

  return childrenByParentId;
}

function getCategoryWithDescendantIds(
  categoryId: string,
  childrenByParentId: Map<string, SquareMenuCategory[]>,
): Set<string> {
  const categoryIds = new Set<string>([categoryId]);
  const pendingCategoryIds = [categoryId];

  while (pendingCategoryIds.length > 0) {
    const parentId = pendingCategoryIds.pop();

    if (!parentId) {
      continue;
    }

    for (const childCategory of childrenByParentId.get(parentId) ?? []) {
      if (categoryIds.has(childCategory.id)) {
        continue;
      }

      categoryIds.add(childCategory.id);
      pendingCategoryIds.push(childCategory.id);
    }
  }

  return categoryIds;
}

function compareNullableNumbers(
  left: number | null,
  right: number | null,
): number {
  if (left === null && right === null) {
    return 0;
  }

  if (left === null) {
    return 1;
  }

  if (right === null) {
    return -1;
  }

  return left - right;
}
