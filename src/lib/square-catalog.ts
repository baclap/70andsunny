export type SquareLocationPresence = {
  present_at_all_locations?: boolean;
  present_at_location_ids?: string[] | null;
  absent_at_location_ids?: string[] | null;
};

export type SquareCatalogItemArchiveState = SquareLocationPresence & {
  item_data?: {
    is_archived?: boolean | null;
  } | null;
};

export function isActiveCatalogItemAtLocation(
  object: SquareCatalogItemArchiveState,
  locationId: string,
): boolean {
  return (
    object.item_data?.is_archived !== true &&
    isPresentAtLocation(object, locationId)
  );
}

export function isPresentAtLocation(
  object: SquareLocationPresence,
  locationId: string,
): boolean {
  if (object.absent_at_location_ids?.includes(locationId)) {
    return false;
  }

  if (object.present_at_all_locations) {
    return true;
  }

  return object.present_at_location_ids?.includes(locationId) ?? false;
}
