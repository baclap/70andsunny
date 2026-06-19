import GoogleMap from "@/components/google-map";
import Logo from "@/components/logo";
import SiteMenu from "@/components/site-menu";
import SunnyLogo from "@/components/sunny-logo";
import { SITE } from "@/lib/site";
import { getSiteMenu } from "@/lib/square-menu";
import { FaInstagram } from "react-icons/fa";

export const revalidate = 900;

export default async function Home() {
  const menu = await getSiteMenu();
  const address = SITE.address;
  const mapsUrl = SITE.googleMapsUrl;
  const copyrightYear = new Date().getFullYear();

  return (
    <main className="brand-page min-h-screen text-[var(--ink)]">
      <div className="mx-auto w-full max-w-[118rem] px-[clamp(1.25rem,4vw,4rem)] py-[clamp(1rem,3vw,3rem)]">
        <header className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5 pb-[clamp(1rem,2.5vw,2rem)] sm:gap-8">
          <div className="flex min-w-0 items-center gap-[clamp(1rem,3vw,2.25rem)]">
            <SunnyLogo
              className="h-auto w-[min(56vw,16rem)] min-w-[8.75rem] max-w-[16rem] drop-shadow-[0.7rem_0.7rem_0_rgba(248,207,52,0.34)] sm:w-[min(34vw,21rem)] sm:max-w-[21rem]"
              aria-label={SITE.businessName}
            />
            <p className="hidden max-w-[12rem] rotate-[-2deg] border-l-4 border-[var(--pink)] bg-white/70 py-2 pl-4 text-[0.7rem] font-black uppercase leading-[1.45] tracking-[0.24em] text-[var(--blue)] md:block">
              Pier 70
              <br />
              Seattle Waterfront
            </p>
          </div>

          <nav aria-label="Section navigation" className="shrink-0">
            <ul className="space-y-1.5 text-right font-display text-[clamp(0.92rem,2.4vw,1.18rem)] leading-none tracking-[-0.01em] text-[var(--ink)]">
              <li>
                <a
                  className="text-[var(--blue)] decoration-[var(--sun)] decoration-4 underline-offset-4 transition-colors hover:text-[var(--pink)] hover:underline"
                  href="#hours"
                >
                  Hours
                </a>
              </li>
              <li>
                <a
                  className="text-[var(--pink)] decoration-[var(--pink)] decoration-4 underline-offset-4 transition-colors hover:text-[var(--orange)] hover:underline"
                  href="#location"
                >
                  Location
                </a>
              </li>
              <li>
                <a
                  className="text-[var(--teal)] decoration-[var(--teal)] decoration-4 underline-offset-4 transition-colors hover:text-[var(--blue)] hover:underline"
                  href="#menu"
                >
                  Menu
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center justify-end gap-1.5 text-[var(--orange)] decoration-[var(--orange)] decoration-4 underline-offset-4 transition-colors hover:text-[var(--pink)] hover:underline"
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                  <FaInstagram aria-hidden="true" className="size-[0.95em]" />
                </a>
              </li>
            </ul>
          </nav>
          <div className="brand-stripe absolute inset-x-0 bottom-0 h-[0.45rem]" />
        </header>

        <section
          id="hours"
          className="grid gap-8 py-[clamp(2.5rem,7vw,6rem)] lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-[clamp(3rem,7vw,7rem)]"
        >
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.26em] text-[var(--blue)]">
              First Thing
            </p>
            <h2 className="brand-heading brand-heading-blue font-display mt-3 text-[clamp(3rem,7vw,6.25rem)]">
              Hours
            </h2>
          </div>

          <div className="max-w-md">
            <div className="brand-dots border-l-[0.7rem] border-[var(--pink)] bg-white/75 py-4 pl-5 sm:pl-7">
              <p className="mb-3 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[var(--blue)]">
                Open Daily
              </p>

              <dl className="space-y-1 border-y-4 border-[var(--sun)] py-4 text-sm font-black leading-6">
                {SITE.businessInfo.hours.map((entry) => (
                  <div
                    key={entry.day}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-4"
                  >
                    <dt className="text-[var(--blue)]">{entry.day}</dt>
                    <dd className="text-right text-[var(--ink)]">
                      {entry.hours}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section
          id="location"
          className="grid gap-8 border-t-4 border-[var(--blue)] py-[clamp(2.5rem,7vw,6rem)] lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-[clamp(3rem,7vw,7rem)]"
        >
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.26em] text-[var(--pink)]">
              Find Us
            </p>
            <h2 className="brand-heading brand-heading-pink font-display mt-3 text-[clamp(3rem,7vw,6.25rem)]">
              Location
            </h2>

            <div className="mt-8 space-y-6 text-base leading-7 text-[var(--muted)]">
              <p className="font-bold text-[var(--ink)]">
                {SITE.businessName}
                <br />
                {address.streetAddress}
                <br />
                {address.addressLocality}, {address.addressRegion}{" "}
                {address.postalCode}
              </p>

              <p>
                Waterfront coffee and food at Pier 70, just steps from Olympic
                Sculpture Park.
              </p>

              <p>
                <a
                  className="inline-flex border-b-4 border-[var(--sun)] pb-1 text-sm font-black uppercase tracking-[0.2em] text-[var(--ink)] transition-colors hover:text-[var(--blue)]"
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get directions
                </a>
              </p>
            </div>
          </div>

          <div className="map-frame border-y-[0.7rem] border-[var(--sun)] bg-[var(--soft)] py-3 shadow-[0.9rem_0.9rem_0_var(--blue)]">
            <GoogleMap />
          </div>
        </section>

        <section
          id="menu"
          className="grid gap-8 border-t-4 border-[var(--pink)] py-[clamp(2.5rem,7vw,6rem)] lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-[clamp(3rem,7vw,7rem)]"
        >
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.26em] text-[var(--teal)]">
              At The Counter
            </p>
            <h2 className="brand-heading brand-heading-teal font-display mt-3 text-[clamp(3rem,7vw,6.25rem)]">
              Menu
            </h2>
            {menu.message && (
              <p className="mt-8 max-w-[16rem] border-l-4 border-[var(--orange)] bg-white/70 pl-4 text-sm font-bold leading-7 text-[var(--muted)]">
                {menu.message}
              </p>
            )}
          </div>

          <div>
            <SiteMenu menu={menu} />
          </div>
        </section>

        <footer className="border-t-4 border-[var(--teal)] py-8 text-[var(--ink)]">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Logo
              className="h-auto w-[min(58vw,12rem)] text-[var(--teal)]"
              aria-hidden="true"
            />

            <div className="space-y-3 text-center text-sm font-bold leading-6 text-[var(--muted)] sm:text-right">
              <p className="text-[var(--ink)]">
                Pier 70 | {address.addressLocality}, {address.addressRegion}
              </p>
              <p>
                <a
                  className="inline-flex items-center gap-1.5 text-[var(--orange)] decoration-[var(--orange)] decoration-4 underline-offset-4 transition-colors hover:text-[var(--pink)] hover:underline"
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                  <FaInstagram aria-hidden="true" className="size-[0.95em]" />
                </a>
              </p>
              <p className="text-xs uppercase tracking-[0.18em]">
                &copy; {copyrightYear} {SITE.businessName}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
