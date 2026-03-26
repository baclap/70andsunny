import Logo from "@/components/logo";
import SocialLinks from "@/components/social-links";
import GoogleMap from "@/components/google-map";
import { SITE } from "@/lib/site";

export default function Home() {
  const home = SITE.home;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-3xl bg-retro-blue/70 backdrop-blur-md p-8 rounded-xl shadow-xl">
        <Logo className="text-retro-yellow" />

        <div className="m-8">
          <p className="text-xl md:text-2xl text-retro-yellow">
            {home.comingSoonMessage}
          </p>

          {home.expectedOpenDate && (
            <p className="mt-4 text-lg text-retro-yellow">
              Expected opening:{" "}
              {new Date(home.expectedOpenDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <SocialLinks />

        <GoogleMap />
      </div>
    </main>
  );
}
