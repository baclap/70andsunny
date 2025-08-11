import { ImageResponse } from "next/og";
import { IconGraphic } from "@/components/icon";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
  return new ImageResponse(<IconGraphic size={192} />, size);
}
