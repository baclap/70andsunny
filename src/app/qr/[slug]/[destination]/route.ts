import { track } from "@vercel/analytics/server";

import {
  createQrRedirectResponse,
  createTrackedQrRedirectResponse,
} from "@/lib/qr-redirect";

export const dynamic = "force-dynamic";

type QrRouteContext = {
  params: Promise<{
    slug: string;
    destination: string;
  }>;
};

export async function GET(
  _request: Request,
  context: QrRouteContext,
): Promise<Response> {
  const { slug, destination } = await context.params;

  return createTrackedQrRedirectResponse(slug, destination, track);
}

export async function HEAD(
  _request: Request,
  context: QrRouteContext,
): Promise<Response> {
  const { destination } = await context.params;

  return createQrRedirectResponse(destination);
}
