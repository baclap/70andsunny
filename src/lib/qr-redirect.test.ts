import test from "node:test";
import assert from "node:assert/strict";

import {
  createQrRedirectResponse,
  createTrackedQrRedirectResponse,
  QR_DESTINATIONS,
  resolveQrDestination,
  type QrScanProperties,
} from "./qr-redirect.ts";
import { SITE } from "./site.ts";

test("known QR destinations resolve to their configured URLs", () => {
  assert.equal(resolveQrDestination("map"), SITE.googleMapsUrl);
  assert.equal(
    resolveQrDestination("menu"),
    "https://70andsunnycoffee.co/#menu",
  );
  assert.equal(resolveQrDestination("instagram"), SITE.instagramUrl);
  assert.deepEqual(Object.keys(QR_DESTINATIONS), ["map", "menu", "instagram"]);
});

test("unknown QR destinations fall back to the website", () => {
  assert.equal(resolveQrDestination("unknown"), SITE.businessUrl);
});

test("tracked redirects record the slug and destination", async () => {
  let trackedEvent:
    | { name: string; properties: QrScanProperties }
    | undefined;

  const response = await createTrackedQrRedirectResponse(
    "a-wheel",
    "map",
    async (name, properties) => {
      trackedEvent = { name, properties };
    },
  );

  assert.deepEqual(trackedEvent, {
    name: "qr_scan",
    properties: { slug: "a-wheel", destination: "map" },
  });
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), SITE.googleMapsUrl);
});

test("unknown destinations are recorded before redirecting home", async () => {
  let trackedProperties: QrScanProperties | undefined;

  const response = await createTrackedQrRedirectResponse(
    "sidewalk-sign",
    "unknown",
    async (_name, properties) => {
      trackedProperties = properties;
    },
  );

  assert.deepEqual(trackedProperties, {
    slug: "sidewalk-sign",
    destination: "unknown",
  });
  assert.equal(response.headers.get("location"), SITE.businessUrl);
});

test("analytics failures never prevent a redirect", async () => {
  const response = await createTrackedQrRedirectResponse(
    "a-shop",
    "instagram",
    async () => {
      throw new Error("analytics unavailable");
    },
  );

  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), SITE.instagramUrl);
});

test("redirect responses are private, uncacheable, and not indexable", () => {
  const response = createQrRedirectResponse("menu");

  assert.equal(response.status, 307);
  assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0");
  assert.equal(
    response.headers.get("x-robots-tag"),
    "noindex, nofollow, noarchive",
  );
});
