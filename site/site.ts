import type { SiteMeta, Theme } from "@/lib/site";

// Saffron & Smoke: fictional modern Indian fine dining (site/DESIGN.md). Desktop only, 1440×900.

export const meta: SiteMeta = {
  name: "Saffron & Smoke",
  title: "Saffron & Smoke · A menu that cooks as you scroll",
  description: "A fictional modern Indian tasting-menu restaurant: nine courses, one flame. Concept website.",
  loaderText: "Saffron & Smoke",
  // the site has its own I30 loader (site/components/EmberLoader.tsx); the engine loader stays off
  loader: false,
  cursor: true,
  record: { duration: 30 },
};

export const theme: Theme = {
  bg: "#121110",
  surface: "#1B1917",
  text: "#EEE7DA",
  muted: "#9E978C",
  accent: "#F4B41A",
  accentText: "#121110",
  line: "#2C2926",
  fontDisplay: "'DM Serif Display', serif",
  fontBody: "'DM Mono', monospace",
  radius: 0,
};
