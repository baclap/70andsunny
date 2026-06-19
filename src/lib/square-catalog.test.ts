import test from "node:test";
import assert from "node:assert/strict";

import { isActiveCatalogItemAtLocation } from "./square-catalog.ts";

test("archived Square catalog items are excluded from the menu", () => {
  assert.equal(
    isActiveCatalogItemAtLocation(
      {
        present_at_all_locations: true,
        item_data: {
          is_archived: true,
        },
      },
      "shop",
    ),
    false,
  );
});

test("non-archived Square catalog items remain visible at configured location", () => {
  assert.equal(
    isActiveCatalogItemAtLocation(
      {
        present_at_location_ids: ["shop"],
        item_data: {
          is_archived: false,
        },
      },
      "shop",
    ),
    true,
  );
});

test("Square catalog items absent from the configured location are excluded", () => {
  assert.equal(
    isActiveCatalogItemAtLocation(
      {
        present_at_all_locations: true,
        absent_at_location_ids: ["shop"],
        item_data: {
          is_archived: false,
        },
      },
      "shop",
    ),
    false,
  );
});
