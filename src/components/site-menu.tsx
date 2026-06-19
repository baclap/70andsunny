import type { CSSProperties } from "react";
import type { MenuItem, SiteMenu as SiteMenuData } from "@/lib/menu-data";

const MENU_COLORS = [
  "var(--blue)",
  "var(--pink)",
  "var(--teal)",
  "var(--orange)",
  "var(--gold)",
  "var(--magenta)",
];

export default function SiteMenu({ menu }: { menu: SiteMenuData }) {
  if (menu.sections.length === 0) {
    return (
      <div className="py-6 text-left text-[var(--ink)]">
        <p className="text-base font-bold">
          Live menu coming soon.
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Stop by the shop for the full paper menu and the latest specials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 text-left text-[var(--ink)]">
      <nav
        aria-label="Menu categories"
        className="brand-dots border-y-4 border-[var(--ink)] bg-white/80 py-4"
      >
        <ul className="flex flex-col gap-y-2 text-[0.7rem] font-black uppercase leading-5 tracking-[0.2em] text-[var(--ink)] md:flex-row md:flex-wrap md:gap-x-5">
          {menu.sections.map((section, index) => (
            <li key={section.id}>
              <a
                className="inline-flex gap-2 transition-colors hover:opacity-80"
                href={`#${getSectionAnchor(index)}`}
                style={getMenuColorStyle(index)}
              >
                <span className="text-[var(--section-color)]">
                  {formatSectionNumber(index)}
                </span>
                <span className="text-[var(--section-color)]">
                  {section.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-16">
        {menu.sections.map((section, index) => (
          <section
            id={getSectionAnchor(index)}
            key={section.id}
            className="scroll-mt-8 border-t-4 border-[var(--section-color)] pt-8 md:grid md:grid-cols-[minmax(8rem,13rem)_minmax(0,1fr)] md:gap-10 2xl:grid-cols-[minmax(8rem,17rem)_minmax(0,1fr)]"
            style={getMenuColorStyle(index)}
          >
            <div className="mb-7 md:mb-0">
              <p className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.72] tracking-[-0.08em] text-[var(--section-color)] [text-shadow:0.055em_0.055em_0_var(--sun)]">
                {formatSectionNumber(index)}
              </p>
              <h3 className="font-display mt-3 max-w-[12rem] text-[clamp(2rem,3vw,3rem)] leading-[0.95] tracking-[-0.04em] text-[var(--section-color)] [text-shadow:0.045em_0.045em_0_var(--sun)] 2xl:max-w-[16rem]">
                {section.title}
              </h3>
              {section.subtitle && (
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {section.subtitle}
                </p>
              )}
            </div>

            <div className="grid gap-x-10 gap-y-1 xl:grid-cols-2">
              {section.items.map((item) => (
                <MenuRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function getSectionAnchor(index: number): string {
  return `menu-category-${index + 1}`;
}

function formatSectionNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function MenuRow({ item }: { item: MenuItem }) {
  if (item.variations.length === 0) {
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 border-t border-[rgba(18,18,18,0.08)] py-3 first:border-t-0">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <p className="shrink text-base font-extrabold leading-6 tracking-[-0.01em] text-[var(--ink)]">
              {item.name}
            </p>
            <span className="mb-1 hidden h-px flex-1 bg-[linear-gradient(to_right,rgba(23,15,10,0.22)_35%,transparent_0)] bg-[length:6px_1px] sm:block" />
          </div>
          {item.subtitle && (
            <p className="mt-0.5 max-w-[34rem] text-sm leading-6 text-[var(--muted)]">
              {item.subtitle}
            </p>
          )}
          {item.variationSummary && (
            <p className="mt-0.5 text-sm font-bold leading-6 text-[var(--muted)]">
              {item.variationSummary}
            </p>
          )}
        </div>
        <p className="shrink-0 text-base font-black tracking-[-0.01em] text-[var(--section-color)]">
          {item.priceLabel ?? "Market"}
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-[rgba(18,18,18,0.08)] py-3 first:border-t-0">
      <p className="text-base font-extrabold leading-6 tracking-[-0.01em] text-[var(--ink)]">
        {item.name}
      </p>
      {item.subtitle && (
        <p className="mt-0.5 max-w-[34rem] text-sm leading-6 text-[var(--muted)]">
          {item.subtitle}
        </p>
      )}
      {item.variationSummary && (
        <p className="mt-0.5 text-sm font-bold leading-6 text-[var(--muted)]">
          {item.variationSummary}
        </p>
      )}

      <div className="mt-2 space-y-1.5 pl-4">
        {item.variations.map((variation) => (
          <div
            key={variation.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 text-sm"
          >
            <span className="flex items-baseline gap-3 font-bold text-[var(--muted)]">
              {variation.name}
              <span className="mb-1 hidden h-px flex-1 bg-[linear-gradient(to_right,rgba(23,15,10,0.18)_35%,transparent_0)] bg-[length:6px_1px] sm:block" />
            </span>
            <span className="font-black tracking-[-0.01em] text-[var(--section-color)]">
              {variation.priceLabel ?? "Market"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getMenuColorStyle(index: number): CSSProperties {
  return {
    "--section-color": MENU_COLORS[index % MENU_COLORS.length],
  } as CSSProperties;
}
