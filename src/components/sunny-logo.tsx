import type { ComponentPropsWithoutRef } from "react";

import { SITE } from "@/lib/site";
import {
  SUNNY_LOGO_FALLBACK_SRC,
  SUNNY_LOGO_HEIGHT,
  SUNNY_LOGO_SIZES,
  SUNNY_LOGO_SRC_SET,
  SUNNY_LOGO_WIDTH,
} from "@/lib/logo-assets";

type SunnyLogoProps = Omit<
  ComponentPropsWithoutRef<"img">,
  "src" | "srcSet" | "alt" | "sizes"
> & {
  title?: string;
  alt?: string;
  priority?: boolean;
};

export default function SunnyLogo({
  title = SITE.businessName,
  alt,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  decoding = "async",
  fetchPriority,
  loading,
  priority,
  ...props
}: SunnyLogoProps) {
  const isHidden = ariaHidden === true || ariaHidden === "true";
  const label = alt ?? (typeof ariaLabel === "string" ? ariaLabel : title);

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={SUNNY_LOGO_SRC_SET}
        sizes={SUNNY_LOGO_SIZES}
      />
      <img
        {...props}
        src={SUNNY_LOGO_FALLBACK_SRC}
        srcSet={SUNNY_LOGO_SRC_SET}
        sizes={SUNNY_LOGO_SIZES}
        width={SUNNY_LOGO_WIDTH}
        height={SUNNY_LOGO_HEIGHT}
        alt={isHidden ? "" : label}
        aria-hidden={ariaHidden}
        decoding={decoding}
        fetchPriority={fetchPriority ?? (priority ? "high" : undefined)}
        loading={loading ?? (priority ? "eager" : undefined)}
      />
    </picture>
  );
}
