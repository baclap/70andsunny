import { ImageResponse } from "next/og";
import { IconGraphic } from "@/components/icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<IconGraphic size={180} />, size);
}
