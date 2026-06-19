import "server-only";

import {
  buildSiteMenu,
  type SiteMenu,
  type SquareItem,
  type SquareMenuCategory,
} from "./menu-data.ts";
import {
  isActiveCatalogItemAtLocation,
  isPresentAtLocation,
} from "./square-catalog.ts";

const SQUARE_VERSION = "2026-03-18";
const PRODUCTION_API_URL = "https://connect.squareup.com";
const SANDBOX_API_URL = "https://connect.squareupsandbox.com";

let lastSuccessfulMenu: SiteMenu | null = null;

type SquareCatalogListResponse = {
  objects?: SquareCatalogObject[];
  cursor?: string;
};

type SquareCatalogObject =
  | SquareCatalogCategoryObject
  | SquareCatalogItemObject
  | SquareCatalogModifierListObject;

type SquareCatalogCategoryObject = {
  type: "CATEGORY";
  id: string;
  category_data?: {
    name?: string;
    category_type?: string;
    is_top_level?: boolean;
    parent_category?: {
      id?: string;
      ordinal?: number | null;
    } | null;
    root_category?: string | null;
    channels?: string[];
    online_visibility?: boolean;
  };
};

type SquareCatalogItemObject = {
  type: "ITEM";
  id: string;
  present_at_all_locations?: boolean;
  present_at_location_ids?: string[] | null;
  absent_at_location_ids?: string[] | null;
  item_data?: {
    name?: string;
    description?: string | null;
    is_archived?: boolean | null;
    categories?: SquareCatalogItemCategory[];
    variations?: SquareCatalogVariation[];
    modifier_list_info?: SquareCatalogModifierListInfo[];
  };
};

type SquareCatalogItemCategory = {
  id: string;
  ordinal?: number | null;
};

type SquareCatalogModifierListObject = {
  type: "MODIFIER_LIST";
  id: string;
  present_at_all_locations?: boolean;
  present_at_location_ids?: string[] | null;
  absent_at_location_ids?: string[] | null;
  modifier_list_data?: {
    name?: string | null;
    modifiers?: SquareCatalogModifier[];
  };
};

type SquareCatalogModifierListInfo = {
  modifier_list_id: string;
  enabled?: boolean;
  hidden_from_customer?: boolean;
  hidden_from_customer_override?: string;
};

type SquareCatalogModifier = {
  id: string;
  modifier_data?: {
    name?: string | null;
    ordinal?: number | null;
    price_money?: {
      amount?: number | null;
    } | null;
    hidden_online?: boolean;
  };
};

type SquareCatalogVariation = {
  id: string;
  present_at_all_locations?: boolean;
  present_at_location_ids?: string[] | null;
  absent_at_location_ids?: string[] | null;
  item_variation_data?: {
    name?: string | null;
    sold_out?: boolean | null;
    price_money?: {
      amount?: number | null;
    } | null;
  };
};

export async function getSiteMenu(): Promise<SiteMenu> {
  const squareConfig = getSquareConfig();

  if (!squareConfig.accessToken || !squareConfig.locationId) {
    return fallbackMenu("Online menu is temporarily unavailable.");
  }

  const liveSquareConfig = {
    accessToken: squareConfig.accessToken,
    locationId: squareConfig.locationId,
    apiBaseUrl: squareConfig.apiBaseUrl,
  };

  try {
    const squareCatalog = await fetchSquareCatalog(liveSquareConfig);
    const sections = buildSiteMenu(
      squareCatalog.items,
      squareCatalog.menuCategories,
    );

    if (sections.length === 0) {
      if (lastSuccessfulMenu) {
        return {
          ...lastSuccessfulMenu,
          status: "cached",
          message: null,
        };
      }

      return fallbackMenu("Online menu is temporarily unavailable.");
    }

    const liveMenu: SiteMenu = {
      status: "live",
      generatedAt: new Date().toISOString(),
      message: null,
      sections,
    };

    lastSuccessfulMenu = liveMenu;
    return liveMenu;
  } catch {
    if (lastSuccessfulMenu) {
      return {
        ...lastSuccessfulMenu,
        status: "cached",
        message: null,
      };
    }

    return fallbackMenu("Online menu is temporarily unavailable.");
  }
}

function fallbackMenu(message: string): SiteMenu {
  return {
    status: "fallback",
    generatedAt: new Date().toISOString(),
    message,
    sections: [],
  };
}

function getSquareConfig() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN?.trim();
  const locationId = process.env.SQUARE_LOCATION_ID?.trim();
  const environment = process.env.SQUARE_ENVIRONMENT?.trim().toLowerCase();

  return {
    accessToken,
    locationId,
    apiBaseUrl:
      environment === "sandbox" ? SANDBOX_API_URL : PRODUCTION_API_URL,
  };
}

async function fetchSquareCatalog(config: {
  accessToken: string;
  locationId: string;
  apiBaseUrl: string;
}): Promise<{
  items: SquareItem[];
  menuCategories: SquareMenuCategory[];
}> {
  const objects: SquareCatalogObject[] = [];
  let cursor: string | undefined;

  do {
    const cursorParam = cursor ? `&cursor=${encodeURIComponent(cursor)}` : "";
    const payload = await getSquareJson<SquareCatalogListResponse>(
      `${config.apiBaseUrl}/v2/catalog/list?types=ITEM,CATEGORY,MODIFIER_LIST${cursorParam}`,
      config.accessToken,
    );

    objects.push(...(payload.objects ?? []));
    cursor = payload.cursor || undefined;
  } while (cursor);

  return {
    items: normalizeSquareItems(objects, config.locationId),
    menuCategories: objects
      .filter(
        (object): object is SquareCatalogCategoryObject =>
          object.type === "CATEGORY" &&
          object.category_data?.category_type === "MENU_CATEGORY" &&
          object.category_data.online_visibility !== false,
      )
      .map(normalizeMenuCategory)
      .filter((category): category is SquareMenuCategory => Boolean(category)),
  };
}

function normalizeSquareItems(
  objects: SquareCatalogObject[],
  locationId: string,
): SquareItem[] {
  const modifierLists = new Map(
    objects
      .filter(
        (object): object is SquareCatalogModifierListObject =>
          object.type === "MODIFIER_LIST",
      )
      .map((modifierList) => [modifierList.id, modifierList]),
  );

  return objects
    .filter(
      (object): object is SquareCatalogItemObject =>
        object.type === "ITEM" &&
        isActiveCatalogItemAtLocation(object, locationId),
    )
    .map((object) => normalizeSquareItem(object, locationId, modifierLists))
    .filter((item): item is SquareItem => Boolean(item))
    .sort((left, right) => left.name.localeCompare(right.name));
}

async function getSquareJson<TResponse>(
  url: string,
  accessToken: string,
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Square-Version": SQUARE_VERSION,
    },
  });

  if (!response.ok) {
    throw new Error(`Square catalog request failed with ${response.status}`);
  }

  return (await response.json()) as TResponse;
}

function normalizeSquareItem(
  object: SquareCatalogItemObject,
  locationId: string,
  modifierLists: Map<string, SquareCatalogModifierListObject>,
): SquareItem | null {
  const itemData = object.item_data;
  const itemName = itemData?.name?.trim();

  if (!itemName) {
    return null;
  }

  const baseVariations =
    itemData?.variations
      ?.filter((variation) => isPresentAtLocation(variation, locationId))
      .map((variation) => ({
        id: variation.id,
        name: variation.item_variation_data?.name?.trim() || null,
        priceCents: variation.item_variation_data?.price_money?.amount ?? null,
        soldOut: variation.item_variation_data?.sold_out ?? null,
      })) ?? [];

  const sizeVariations = buildSizeVariations(
    baseVariations,
    itemData?.modifier_list_info ?? [],
    modifierLists,
  );

  const variations =
    baseVariations.length <= 1 && sizeVariations.length > 1
      ? sizeVariations
      : baseVariations;

  return {
    id: object.id,
    name: itemName,
    description: itemData?.description?.trim() || null,
    categories:
      itemData?.categories?.map((category) => ({
        id: category.id,
        ordinal: category.ordinal ?? null,
      })) ?? [],
    variations,
  };
}

function normalizeMenuCategory(
  object: SquareCatalogCategoryObject,
): SquareMenuCategory | null {
  const categoryData = object.category_data;
  const categoryName = categoryData?.name?.trim();

  if (!categoryName) {
    return null;
  }

  return {
    id: object.id,
    name: categoryName,
    ordinal: categoryData?.parent_category?.ordinal ?? null,
    isTopLevel: categoryData?.is_top_level ?? false,
    parentCategoryId: categoryData?.parent_category?.id ?? null,
    rootCategoryId: categoryData?.root_category ?? null,
  };
}

function buildSizeVariations(
  baseVariations: SquareItem["variations"],
  modifierListInfo: SquareCatalogModifierListInfo[],
  modifierLists: Map<string, SquareCatalogModifierListObject>,
): SquareItem["variations"] {
  const basePrice = baseVariations[0]?.priceCents ?? null;

  if (basePrice === null) {
    return [];
  }

  const visibleSizeListInfo = modifierListInfo.find((info) => {
    if (!info.enabled) {
      return false;
    }

    if (info.hidden_from_customer) {
      return false;
    }

    const modifierList = modifierLists.get(info.modifier_list_id);
    const name = modifierList?.modifier_list_data?.name?.trim().toLowerCase();
    return name === "size";
  });

  if (!visibleSizeListInfo) {
    return [];
  }

  const modifierList = modifierLists.get(visibleSizeListInfo.modifier_list_id);
  const modifiers = modifierList?.modifier_list_data?.modifiers ?? [];

  return modifiers
    .filter((modifier) => !modifier.modifier_data?.hidden_online)
    .sort(
      (left, right) =>
        (left.modifier_data?.ordinal ?? 0) - (right.modifier_data?.ordinal ?? 0),
    )
    .map((modifier) => ({
      id: modifier.id,
      name: modifier.modifier_data?.name?.trim() || null,
      priceCents: basePrice + (modifier.modifier_data?.price_money?.amount ?? 0),
      soldOut: false,
    }))
    .filter((variation) => Boolean(variation.name));
}
