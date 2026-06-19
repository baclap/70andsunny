export type MenuItemOverride = {
  label?: string;
  description?: string;
  hiddenVariationIds?: string[];
  hiddenVariationNames?: string[];
};

export const MENU_ITEM_OVERRIDES: Record<string, MenuItemOverride> = {};
