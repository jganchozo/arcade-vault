import type { NextConfig } from "next";
import { LEGACY_GAME_IDS } from "./lib/legacy-game-ids";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    agentUpgrade: "security",
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Old Spanish game URLs (before SPEC 04) → English ones, e.g. /games/<old-id>/play → /games/<new-id>/play.
  async redirects() {
    return Object.entries(LEGACY_GAME_IDS).map(([from, to]) => ({
      source: `/games/${from}/:path*`,
      destination: `/games/${to}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
