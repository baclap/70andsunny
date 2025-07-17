import React from "react";
import { getSiteSettings } from "@/lib/sanity";

export default async function Home() {
  // Fetch data from Sanity
  const siteSettings = await getSiteSettings();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-3xl bg-retro-blue/70 backdrop-blur-md p-8 rounded-xl shadow-xl">
        <h1 className="text-5xl md:text-6xl font-bold text-retro-yellow mb-6">
          70 & Sunny Coffee Co.
        </h1>

        <div className="mb-8">
          <p className="text-xl md:text-2xl text-retro-yellow">
            {siteSettings.comingSoonMessage}
          </p>

          {siteSettings.expectedOpenDate && (
            <p className="mt-4 text-lg text-retro-yellow">
              Expected opening:{" "}
              {new Date(siteSettings.expectedOpenDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
