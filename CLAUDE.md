# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

`arcade-vault` is a freshly scaffolded `create-next-app` project (Next.js 16.4.3, React 19.3, TypeScript, Tailwind CSS v4). Only the default starter page exists in `app/`; `references/` is currently empty. There is no test framework configured and the directory is not yet a git repository.

## Commands

```bash
npm run dev      # next dev on http://localhost:3000 (Turbopack)
npm run build    # production build; also type-checks
npm run start    # serve the production build
npm run lint     # eslint (flat config: next core-web-vitals + typescript)
npx tsc --noEmit # type-check without building
```

## Next.js version caveats

This Next.js version postdates most training data. The bundled docs at `node_modules/next/dist/docs/` (`01-app/` for App Router: getting-started, guides, api-reference) are the source of truth — read the relevant page before using an API. Things that differ from older Next.js and are active in this project (`next.config.ts`):

- **`cacheComponents: true`** — data fetching is dynamic by default; opt into caching with the `"use cache"` directive plus `cacheLife` / `cacheTag`. Next prerenders a static shell and streams dynamic parts, so uncached dynamic data must sit under a `<Suspense>` boundary. The `runtime` route segment export is not supported (Node.js runtime only); older `experimental.dynamicIO` / `useCache` patterns are obsolete.
- **`partialPrefetching: true`** — `<Link>` prefetches one reusable App Shell per route (static parts only); per-link `prefetch={true}` fetches more. Requires `cacheComponents`.
- **`experimental.agentFeedback: true`** — `next dev` writes/restores a managed block in `AGENTS.md`. Don't strip it from diffs.
- Global route-typed helpers such as `LayoutProps<"/">` (used in `app/layout.tsx`) and `PageProps` are available without imports.

## Styling

Tailwind v4 is wired through a Turbopack loader rule for `*.css` in `next.config.ts` (`@tailwindcss/turbopack`), not a PostCSS config. Theme tokens are defined in `app/globals.css` via `@import "tailwindcss"` and an `@theme inline` block mapping CSS variables (`--background`, `--foreground`, Geist font variables from `next/font` in `app/layout.tsx`); dark mode follows `prefers-color-scheme`. There is no `tailwind.config.js`.

## Paths

`@/*` resolves to the project root (e.g. `@/app/...`).

## Skills

Always use `/frontend-design` when designing the user interface.