import { ImageResponse } from "next/og";
import { IconGraphic } from "@/components/icon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon512() {
  return new ImageResponse(<IconGraphic size={512} />, size);
}
