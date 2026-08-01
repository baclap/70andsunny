import { SITE } from "./site.ts";

export const QR_DESTINATIONS = {
  map: SITE.googleMapsUrl,
  menu: new URL("/#menu", SITE.businessUrl).toString(),
  instagram: SITE.instagramUrl,
} as const;

export type QrScanProperties = {
  slug: string;
  destination: string;
};

export type TrackQrScan = (
  eventName: "qr_scan",
  properties: QrScanProperties,
) => Promise<void>;

export function resolveQrDestination(destination: string): string {
  if (Object.hasOwn(QR_DESTINATIONS, destination)) {
    return QR_DESTINATIONS[destination as keyof typeof QR_DESTINATIONS];
  }

  return SITE.businessUrl;
}

export function createQrRedirectResponse(destination: string): Response {
  return new Response(null, {
    status: 307,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      Location: resolveQrDestination(destination),
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

export async function createTrackedQrRedirectResponse(
  slug: string,
  destination: string,
  trackQrScan: TrackQrScan,
): Promise<Response> {
  try {
    await trackQrScan("qr_scan", { slug, destination });
  } catch {
    // QR redirects should continue working if analytics is unavailable.
  }

  return createQrRedirectResponse(destination);
}
