import Image, { type ImageProps } from "next/image";

import { SITE } from "@/lib/site";

type SunnyLogoProps = Omit<ImageProps, "src" | "alt"> & {
  title?: string;
  alt?: string;
};

export default function SunnyLogo({
  title = SITE.businessName,
  alt,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  ...props
}: SunnyLogoProps) {
  const isHidden = ariaHidden === true || ariaHidden === "true";
  const label = alt ?? (typeof ariaLabel === "string" ? ariaLabel : title);

  return (
    <Image
      {...props}
      src="/sunny-logo.768w.e8192684325c.webp"
      width={768}
      height={869}
      alt={isHidden ? "" : label}
      aria-hidden={ariaHidden}
      unoptimized
    />
  );
}
