# SPEC 04 — English game names

> **Status:** Approved
> **Depends on:** SPEC 03
> **Date:** 2026-11-23
> **Objective:** Rename the eight games, their URLs and their internal cover classes to English, so no Spanish is left anywhere in the running app, while old links, saved scores and the fake leaderboards keep working exactly as before.

## Why this spec exists

SPEC 03 translated all UI copy but kept the game titles and ids as "brand names". In practice they are ordinary Spanish words (*caída* = fall, *glotón* = glutton, *rocas* = rocks), so in an English UI they read as untranslated text, not as brands. This spec reverses that SPEC 03 decision: the whole app, URLs included, becomes English.

## Scope

**In:**

- Game titles, ids (and so URLs) and Spanish-derived cover classes, per this table:

| Old title | New title | Old id / URL | New id / URL | Old cover class | New cover class |
| --- | --- | --- | --- | --- | --- |
| BLOQUE BUSTER | BLOCK BUSTER | `bloque-buster` | `block-buster` | `cover-bricks` | (stays) |
| CAÍDA | DROP | `caida` | `drop` | `cover-tetro` | (stays) |
| SERPENTINA | SERPENTINE | `serpentina` | `serpentine` | `cover-snake` | (stays) |
| GLOTÓN | CHOMPER | `gloton` | `chomper` | `cover-glot` | `cover-chomp` |
| INVASORES | INVADERS | `invasores` | `invaders` | `cover-invaders` | (stays) |
| ROCAS | ROCKS | `rocas` | `rocks` | `cover-rocas` | `cover-rocks` |
| RANARIA | LILY HOP | `ranaria` | `lily-hop` | `cover-rana` | `cover-lily` |
| DUELO PIXEL | PIXEL DUEL | `duelo-pixel` | `pixel-duel` | `cover-duelo` | `cover-duel` |

- Mixed-case uses follow the same names: the home ticker ("Drop", "Chomper", "Invaders", "Rocks", "Block Buster", "Serpentine", "Lily Hop") and the CLASSIC GAMES feature text ("Block Buster, Drop, Serpentine and many more. …").
- Everywhere a title is derived from `game.title` (cards, detail page, player CRT label, hall-of-fame tabs, "YOUR BEST IN <GAME>") updates automatically.
- **Old URLs keep working:** permanent (308) redirects from every old `/games/<old-id>` and `/games/<old-id>/play` to the new URL.
- **Saved scores keep working:** entries in `localStorage` `av_scores` saved under an old id are rewritten to the new id once, on load.
- **Leaderboards stay identical:** today the fake leaderboards are seeded from `id.length`. Renaming ids would change every name and score, so each game gets a fixed `seed` equal to its old id length.
- A final sweep for any other Spanish left in `app/`, `components/`, `lib/` and `next.config.ts` (strings, comments, identifiers).

**Stays as is:**

- Categories, colours, descriptions, `best` and `plays` values.
- Mock player names (NEONFOX, PX_KAI, …).
- `localStorage` keys (`av_user`, `av_scores`) and their shapes.
- Layout, styles and behaviour. The renamed cover classes keep their exact CSS rules.

**Out of scope:**

- Editing SPEC 01–03 or `references/templates/**`. They stay as a historical record and design reference; this spec supersedes SPEC 03's "game titles stay as brand names" decision.
- The `/about` prefetch 404 and the 375px nav overflow (from SPEC 01/02).
- Automated tests.

## Data model

`lib/legacy-game-ids.ts` (new, no imports, so `next.config.ts` can import it):

```ts
/** Spanish ids used before SPEC 04 → current English ids. */
export const LEGACY_GAME_IDS: Record<string, string> = {
  "bloque-buster": "block-buster",
  caida: "drop",
  serpentina: "serpentine",
  gloton: "chomper",
  invasores: "invaders",
  rocas: "rocks",
  ranaria: "lily-hop",
  "duelo-pixel": "pixel-duel",
};
```

`lib/games.ts`:

```ts
export type Game = {
  // …existing fields
  /** Fixed leaderboard seed (the length of the pre-SPEC 04 id), so fake leaderboards don't change. */
  seed: number;
};
```

Seeds: `block-buster` 13, `drop` 5, `serpentine` 10, `chomper` 6, `invaders` 9, `rocks` 5, `lily-hop` 7, `pixel-duel` 11.

Seed call sites change from `id.length` / `tab.length` to `game.seed`:

- `app/games/[id]/page.tsx`: `seededScores(game.seed * 17 + 3, 10)`
- `components/hall-of-fame.tsx`: `seededScores(game.seed * 23 + 7, 12)` and `youRank = Math.floor(8 + (game.seed % 4))`

`lib/mock-session.ts`:

```ts
/** Rewrites av_scores entries saved under a pre-SPEC 04 id. No-op when nothing matches; never throws. */
export function migrateSavedScores(): void;
```

It is called once on mount from `components/session-provider.tsx` (in a `useEffect`, so it never runs during prerender).

`next.config.ts` gains, preserving all existing options:

```ts
async redirects() {
  return Object.entries(LEGACY_GAME_IDS).map(([from, to]) => ({
    source: `/games/${from}/:path*`, // matches /games/caida and /games/caida/play
    destination: `/games/${to}/:path*`,
    permanent: true,
  }));
},
```

## Implementation plan

1. Legacy map and seeds: create `lib/legacy-game-ids.ts`, add `seed` to `Game` and every entry in `lib/games.ts`, and switch both `seededScores` call sites and `youRank` to `game.seed`. Ids and titles do not change yet. Check: `npm run build` passes and leaderboards are unchanged.
2. Rename: update ids and titles in `lib/games.ts`, rename `cover-glot` / `cover-rocas` / `cover-rana` / `cover-duelo` in `lib/games.ts` and `app/globals.css`, and update the ticker and CLASSIC GAMES text in `app/page.tsx`. Check: `/games` shows the new names and covers still render.
3. Redirects: add `redirects()` to `next.config.ts` from `LEGACY_GAME_IDS`. Check: `/games/caida` and `/games/caida/play` redirect to `/games/drop` and `/games/drop/play`.
4. Saved scores: add `migrateSavedScores()` and call it from `SessionProvider`. Check: an `av_scores` entry with `"game":"caida"` becomes `"game":"drop"` after loading any page.
5. Sweep and verify: run the grep checks from the acceptance criteria, then `npm run lint`, `npm run build`, and a browser walk of every route.

## Acceptance criteria

- [ ] `npm run build` completes without errors.
- [ ] `npm run lint` completes without errors.
- [ ] `grep -rnE '[áéíóúñ¿¡ÁÉÍÓÚÑ]' app components lib next.config.ts` returns nothing.
- [ ] `grep -rniE 'bloque|ca[ií]da|serpentina|glot[oó]n|invasores|rocas|ranaria|duelo|cover-glot|cover-rana' app components lib next.config.ts` only matches the keys in `lib/legacy-game-ids.ts`.
- [ ] `/games` shows BLOCK BUSTER, DROP, SERPENTINE, CHOMPER, INVADERS, ROCKS, LILY HOP and PIXEL DUEL, each with its cover art rendering as before.
- [ ] `/games/drop` and `/games/drop/play` work; the player's CRT label reads "DROP · CRT-83 · 60 HZ".
- [ ] `/games/caida` → 308 → `/games/drop`, and `/games/caida/play` → 308 → `/games/drop/play`; same for the other seven old ids.
- [ ] The hall-of-fame tabs show the eight new names, and the signed-in row reads "▸ YOUR BEST IN BLOCK BUSTER".
- [ ] Leaderboards on every `/games/<id>` page and on every hall-of-fame tab show the same player names, scores, dates and "your best" rank as before this spec, compared against a SPEC 03 build.
- [ ] The home ticker and CLASSIC GAMES text use the new names.
- [ ] Saving a score on `/games/drop/play` stores `"game":"drop"`; a pre-existing `"game":"caida"` entry is rewritten to `"game":"drop"` on the next page load, and other entries are untouched.
- [ ] No hydration warnings in the browser console on `/`, `/games`, `/games/drop`, `/games/drop/play`, `/hall-of-fame`, `/sign-in` and an unknown URL.
- [ ] At 1280px and 375px, no title, chip or button wraps or overflows in a way it did not before this spec.

## Decisions

- **Yes:** English titles and English ids/URLs. Nothing visible stays in Spanish, including the address bar.
- **No:** English titles with the old Spanish URLs. It is half-done and leaves Spanish in every shared link.
- **Yes:** names that keep the original meaning or feel (CAÍDA → DROP, DUELO PIXEL → PIXEL DUEL) and avoid real game titles (RANARIA → LILY HOP, not "Frogger").
- **Yes:** permanent 308 redirects for old URLs, generated from one map. Old links and bookmarks keep working, and the map is the single source of truth.
- **Yes:** a fixed `seed` per game equal to the old id length. Leaderboards stay identical without changing `seededScores()`.
- **No:** new seeds from the new ids. Every leaderboard would silently change.
- **Yes:** migrate `av_scores` once on load. Saved scores follow their game.
- **Yes:** rename the Spanish-derived cover classes, keeping their CSS rules byte-for-byte. Already-English classes (`cover-bricks`, `cover-tetro`, `cover-snake`, `cover-invaders`) stay.
- **Yes:** SPEC 01–03 and `references/templates/**` stay untouched, as SPEC 03 did with SPEC 01/02.

## Risks

| Risk | Mitigation |
| --- | --- |
| A missed old id leaves a broken link or card | Ids are only read through `GAMES` / `getGame()`, and the id grep criterion catches leftovers. `generateStaticParams` builds pages from `GAMES`, so the build lists the new routes. |
| A redirect loops or misses `/play` | `:path*` matches zero or more segments, and the source and destination share no prefix. The criterion checks both forms for all eight ids. |
| Renaming a cover class drops its art | The CSS rules are moved by renaming the selectors only; the `/games` criterion checks each cover renders. |
| Leaderboards change because seeds change | Seeds are fixed to the old id lengths in step 1, before any rename, and compared against a SPEC 03 build. |
| Migrating `av_scores` runs on the server or corrupts data | It runs in a client `useEffect`, is wrapped in `try/catch`, and only rewrites the `game` field of entries whose id is in `LEGACY_GAME_IDS`. |
| `next.config.ts` importing app code pulls in React or aliases | `lib/legacy-game-ids.ts` has no imports and is imported with a relative path. |

## What is **not** in this spec

- Changes to categories, descriptions, scores or players.
- Edits to earlier specs or reference templates.
- Fixes for the `/about` prefetch 404 or the 375px nav overflow.
- The Next.js security upgrade (on its own branch, `next-upgrade-16.4.6`).
- Automated tests.
