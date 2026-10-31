# SPEC 02 — Home landing page

> **Status:** Implemented
> **Depends on:** SPEC 01
> **Date:** 2026-10-31
> **Objective:** Port the landing page in `references/templates/home-about/home.jsx` to `/`, move the library to `/games`, and add the "Inicio" and "Acerca de" links to the nav, without building the About page.

## Why this spec exists

SPEC 01 put the library at `/`. The new reference set in `references/templates/home-about/` adds a marketing-style home page (hero, features, games preview, stats, live activity, pricing, final CTA) and an About page. This spec makes the home page the app's entry point and moves the library to its own URL. The About page gets a nav link only; it is built in a later spec.

## Scope

**In:**

- `/` renders the home page from `home.jsx`, with the same section order:
  1. Hero: floating pixel silhouettes (8 SVGs), "▸ INSERTA UNA MONEDA_" eyebrow, 3-line title, subtitle, "▶ EXPLORAR JUEGOS" and "✦ CREAR CUENTA" CTAs, "DESLIZA ▼" scroll hint.
  2. `// 01` "¿POR QUÉ ARCADE VAULT?": 4 feature cards with the pixel `FeatureIcon`s (GAMEPAD, FREE, TROPHY, ROCKET).
  3. `// 02` "JUEGOS DISPONIBLES AHORA": mini rail with the first 6 games of `GAMES` and a "VER TODOS LOS JUEGOS →" button.
  4. Stats strip: 3 stat blocks.
  5. `// 03` "ACTIVIDAD EN VIVO": "ÚLTIMAS PUNTUACIONES" ticker (7 rows) and "TOP JUGADORES · HOY" list (5 rows) with a "VER SALÓN →" link.
  6. `// 04` "PRECIOS": price card ("JUGADOR VAULT", $0, 6 bullets, "EMPEZAR GRATIS →", "FREE PLAY" stamp) and 3 FAQ items.
  7. Final CTA: "¿LISTO PARA JUGAR?" and "INSERTAR MONEDA →".
- Scroll reveal: sections with `.reveal` get `.in` when they enter the viewport (`IntersectionObserver`, threshold 0.12, unobserve after first reveal), as in the template's `useReveal`.
- UI copy in Spanish, verbatim from `home.jsx`, **except two strings**:
  - Stats: "12+" → **"8+"** (the catalog has 8 games).
  - "JUEGOS CLÁSICOS" feature description: replace "Arkanoid, Tetris, Snake y muchos más." with **"Bloque Buster, Caída, Serpentina y muchos más."** (our own titles, no trademarked names). The rest of that sentence stays.
- Ticker and top-players rows are static mock data copied from the template (names, games, scores, "hace N min" strings).
- Navigation targets:

  | Element | Target |
  | --- | --- |
  | "EXPLORAR JUEGOS", "VER TODOS LOS JUEGOS →", "INSERTAR MONEDA →" | `/games` |
  | "CREAR CUENTA", "EMPEZAR GRATIS →" | `/sign-in` (opens on INICIAR SESIÓN, unchanged auth form) |
  | Mini card | `/games/<id>` |
  | "VER SALÓN →" | `/hall-of-fame` |

- Library moves from `/` to **`/games`**: new `app/games/page.tsx` renders what `app/page.tsx` renders today (the "ARCADE VAULT" `av-hero` plus `<Library />`), unchanged.
- Links that meant "the library" are retargeted from `/` to `/games`:
  - `app/games/[id]/page.tsx` — "VOLVER AL VAULT".
  - `components/game-player.tsx` — "VOLVER AL VAULT" in the game-over modal.
  - `components/hall-of-fame.tsx` — "VOLVER A LA BIBLIOTECA".
  - `app/not-found.tsx` — "VOLVER A LA BIBLIOTECA".
- Links that stay on `/` (home): the nav logo, and the redirect after sign-in / create account / guest in `components/auth-form.tsx`.
- Nav (`components/nav.tsx`), desktop and mobile panel, in the template's order: **Inicio** (`/`), **Biblioteca** (`/games`), **Salón de la Fama** (`/hall-of-fame`), **Acerca de** (`/about`), then (mobile only) Iniciar Sesión / Cuenta.
  - Active state: Inicio only on exactly `/`; Biblioteca on `/games` and `/games/*`; Salón on `/hall-of-fame`; Acerca de on `/about`.
  - "Acerca de" is a real `<Link href="/about">`. Until the About spec lands, `/about` shows the themed 404 page.
- CSS: append to `app/globals.css`, verbatim from `references/templates/home-about/styles.css`, only the sections the home page uses:
  - `/* ===== HOME PAGE ===== */` (lines 930–1070, includes `.reveal`).
  - `/* ===== ACTIVITY (leaderboard + ticker) ===== */` (lines 1621–1671).
  - `/* ===== PRICING ===== */` (lines 1672–1730).
  - Any `@keyframes` those rules reference that `globals.css` does not already define.
- Visual fidelity: same markup structure and class names as `home.jsx`; inline `style` props (`transitionDelay`, `animationDelay`, bar widths, CTA wrapper) are ported as-is.

**Out of scope (for future specs):**

- The About page (`about.jsx`), its CSS (`ABOUT PAGE`, `GAMEPAD`, theme variants, score floaters) and the contact form.
- Opening `/sign-in` on the CREAR CUENTA tab from the home CTAs.
- Real activity data: the ticker and top-players lists do not read `av_scores` or `seededScores` and do not update.
- Any change to the library, detail, player, sign-in or hall-of-fame screens beyond retargeting the links listed above.
- A redirect from old URLs (nothing links to "library at `/`" from outside the app).
- Per-route `metadata` titles.
- Automated tests.
- Visual redesign of the home page.

## Data model

No new shared data structures. `lib/games.ts` and `lib/mock-session.ts` are unchanged.

The home page's static content lives as local constants next to the component that renders it (same shape as the template's inline arrays):

```ts
type Feature = { icon: "GAMEPAD" | "FREE" | "TROPHY" | "ROCKET"; title: string; desc: string; color: NeonColor };
type Stat = { n: string; u: string; s: string };                              // { n: "8+", u: "JUEGOS", s: "Y CONTANDO" }
type TickerRow = { player: string; game: string; score: number; ago: string; color: NeonColor };
type TopPlayer = { rank: number; player: string; score: number };
type Faq = { q: string; a: string };
```

Conventions (same as SPEC 01):

- Numbers are displayed with `toLocaleString("es-ES")`.
- The mini card reads `game.category` (the template's `game.cat`) and `game.cover`.

## Implementation plan

1. Append the HOME PAGE, ACTIVITY and PRICING CSS sections (plus any missing `@keyframes`) to `app/globals.css`. No UI change. Check: `npm run build` passes and existing screens look the same.
2. Create `app/games/page.tsx` with the current contents of `app/page.tsx` (hero + `<Library />`). Leave `app/page.tsx` untouched for now. Manual test: `/games` shows the library; `/games/caida` still opens the detail.
3. Retarget the "library" links to `/games` in `app/games/[id]/page.tsx`, `components/game-player.tsx`, `components/hall-of-fame.tsx` and `app/not-found.tsx`. Manual test: each "VOLVER …" button lands on `/games`.
4. Update `components/nav.tsx`: add Inicio and Acerca de (desktop + mobile), point Biblioteca to `/games`, and split the active-state logic (Inicio = exactly `/`, Biblioteca = `/games` or `/games/*`, Acerca de = `/about`). Logo stays on `/`. Manual test: the right link is highlighted on `/`, `/games`, `/games/caida`, `/hall-of-fame`; `/about` shows the 404.
5. Create the home building blocks in `components/home/`:
   - `floating-silhouettes.tsx` — the 8 decorative SVGs (`aria-hidden`).
   - `feature-icon.tsx` — the 4 pixel icons.
   - `mini-card.tsx` — a `<Link href="/games/<id>" className="mini-card">` with cover and meta.
   - `reveal-observer.tsx` (client) — renders nothing; on mount adds `.in` to every `.reveal` element as it intersects, and disconnects on unmount.
6. Replace `app/page.tsx` with the home page: hero, features, games preview, stats, activity, pricing and final CTA, in that order, using `NavButton` for the template's `<button>` navigations and `<RevealObserver />` once. Apply the two copy changes from the scope. Manual test: `/` matches the template side by side, and sections fade in on scroll.
7. Run `npm run lint`, `npm run build`, and walk the acceptance criteria in the browser.

## Acceptance criteria

- [ ] `npm run build` completes without errors.
- [ ] `npm run lint` completes without errors.
- [ ] The browser console shows no errors or hydration warnings on `/`, `/games`, `/games/caida`, `/hall-of-fame`, `/sign-in` and `/about`.
- [ ] `/` shows the hero with title "EL ARCADE / CLÁSICO ESTÁ / DE VUELTA", the "EXPLORAR JUEGOS" and "CREAR CUENTA" buttons, and the floating silhouettes.
- [ ] `/` shows, in order, the sections `// 01` ¿POR QUÉ ARCADE VAULT?, `// 02` JUEGOS DISPONIBLES AHORA, the stats strip, `// 03` ACTIVIDAD EN VIVO, `// 04` PRECIOS and ¿LISTO PARA JUGAR?.
- [ ] The features section shows 4 cards, each with its pixel icon; the first card's text mentions "Bloque Buster, Caída, Serpentina" and the page contains no "Arkanoid", "Tetris" or "Snake".
- [ ] The games preview shows exactly 6 mini cards (BLOQUE BUSTER … ROCAS); clicking one navigates to `/games/<id>`.
- [ ] The stats strip shows "8+ JUEGOS"; the page contains no "12+".
- [ ] The ticker shows 7 rows and the top-players list shows 5 rows with #01–#03 styled as top1/top2/top3.
- [ ] Sections below the hero are hidden before scrolling and fade in when they enter the viewport.
- [ ] "EXPLORAR JUEGOS", "VER TODOS LOS JUEGOS →" and "INSERTAR MONEDA →" navigate to `/games`.
- [ ] "CREAR CUENTA" and "EMPEZAR GRATIS →" navigate to `/sign-in`.
- [ ] "VER SALÓN →" navigates to `/hall-of-fame`.
- [ ] `/games` shows the "ARCADE VAULT" hero, search box, 5 category chips and 8 game cards, exactly as `/` did before this spec.
- [ ] "VOLVER AL VAULT" on `/games/caida`, "VOLVER AL VAULT" in the player's game-over modal, "VOLVER A LA BIBLIOTECA" on `/hall-of-fame` and on the 404 page all navigate to `/games`.
- [ ] Clicking the nav logo navigates to `/`.
- [ ] Signing in on `/sign-in` still redirects to `/` (now the home page).
- [ ] The desktop nav and the mobile panel both list Inicio, Biblioteca, Salón de la Fama and Acerca de, in that order.
- [ ] Inicio is active only on `/`; Biblioteca is active on `/games` and `/games/caida` (and not on `/`); Salón de la Fama is active on `/hall-of-fame`.
- [ ] Clicking "Acerca de" navigates to `/about`, which shows the themed 404 page.
- [ ] At 375px wide, the home page has no horizontal scroll and the feature grid, mini rail, stats, activity and pricing grids collapse per the template's media queries.
- [ ] Side-by-side with `references/templates/home-about/arcade-vault-standalone.html`, the home page matches the template's layout, colours, fonts and copy (except the two documented copy changes).

## Decisions

- **Yes:** home at `/`, library at `/games`. The library fits the existing `/games/[id]` and `/games/[id]/play` nesting.
- **No:** `/library`. It would split the library from its detail pages' URL prefix.
- **Yes:** "Acerca de" as a real link to `/about` that 404s until the About spec. The nav matches the template now, and the About spec only needs to add the route.
- **No:** an inert "PRONTO" link, or hiding the link.
- **Yes:** copy verbatim except "12+" → "8+" and our own game titles instead of "Arkanoid, Tetris, Snake". The page should not overstate the catalog or name trademarked games.
- **No:** fully verbatim copy.
- **Yes:** "CREAR CUENTA" / "EMPEZAR GRATIS" go to plain `/sign-in`. Matches the template and keeps `auth-form.tsx` untouched.
- **No:** `/sign-in?mode=signup` in this spec.
- **Yes:** "VOLVER AL VAULT" / "VOLVER A LA BIBLIOTECA" buttons go to `/games`; the logo and the post-sign-in redirect go to `/`. The labels name the library, while the logo and sign-in mean "home", as in the template's `navigate({ name: "home" })`.
- **Yes:** `app/page.tsx` stays a server component; only the scroll reveal runs on the client, in a tiny `RevealObserver` that renders nothing. Keeps the page mostly static under `cacheComponents`.
- **No:** a client `useReveal()` hook that makes the whole page a client component.
- **Yes:** mini cards are `<Link>`s instead of the template's clickable `<div>`. Same class names and visuals, plus keyboard access and prefetching.
- **Yes:** template `<button>` navigations use the existing `NavButton`, as SPEC 01 did, to keep the button markup and metrics.
- **Yes:** home components in `components/home/`. They are only used by the home page.
- **Yes:** append only the HOME PAGE, ACTIVITY and PRICING CSS sections. The ABOUT and GAMEPAD sections belong to the About spec.
- **Yes:** static mock data for the ticker and top players, copied from the template.
- **No:** wiring them to `av_scores` or `seededScores`. That is real-data work for a later spec.
- **Yes:** `/frontend-design` is consulted per `CLAUDE.md`, but the reference design wins and no redesign is made (same as SPEC 01).
- **Yes:** verification by build + lint + the manual checklist above. No Playwright in this spec.

## Risks

| Risk | Mitigation |
| --- | --- |
| `.reveal` starts at `opacity: 0`, so content stays invisible if JS fails or the observer never fires (also affects screenshots and very tall viewports) | Same behaviour as the template, accepted. `RevealObserver` observes every `.reveal` on mount, so elements already in the viewport reveal immediately. |
| Missed `/` → `/games` link leaves a "back to library" button landing on the home page | Step 3 lists every current `href="/"` / `push("/")`; the acceptance criteria check each one. |
| Hydration mismatch from `toLocaleString("es-ES")` in the ticker and top list | Data is static and Node ships full ICU, as in SPEC 01. Covered by the "no hydration warnings" criterion. |
| Ported CSS references a `@keyframes` not present in `globals.css`, so an animation silently does nothing | Step 1 explicitly checks for and copies missing keyframes; the side-by-side criterion catches leftovers. |
| Ported CSS overrides existing rules | The three sections only use new selectors (`.home*`, `.feature-*`, `.mini-*`, `.stat*`, `.activity-*`, `.tick*`, `.top-*`, `.price*`, `.pc-*`, `.faq-*`, `.final-*`, `.reveal`); the CSS diff against the SPEC 01 stylesheet shows additions only. |

## Implementation notes

- Known gap, accepted: the nav prefetches `/about`, which 404s by design until the About spec, so every page logs one failed `/about?_rsc=…` request. There are no hydration warnings.
- Known gap, from before this spec: at 375px the SPEC 01 nav overflows by 20px (the ≡ button ends at 395px). The reference template has the same overflow. To fix in a later spec.
- `NavButton` gained an optional `style` prop for the full-width pricing button.

## What is **not** in this spec

- The About page and its CSS.
- Sign-up deep link from the home CTAs.
- Real activity / leaderboard data on the home page.
- Changes to the other screens beyond link retargeting.
- Automated tests.
- Visual redesign.

Each one of those, if it lands, goes in its own spec.
