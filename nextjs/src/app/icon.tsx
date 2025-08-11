import { ImageResponse } from "next/og";
import { IconGraphic } from "@/components/icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<IconGraphic size={32} />, size);
}
