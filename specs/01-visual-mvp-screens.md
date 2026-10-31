# SPEC 01 — Visual MVP of the Arcade Vault screens

> **Status:** Approved
> **Depends on:** —
> **Date:** 2026-10-30
> **Objective:** Port the five screens in `references/templates/` (library, game detail, player, sign-in, hall of fame) to Next.js App Router routes with mock data, without implementing any real game.

## Why this spec exists

The global theme (`app/globals.css`, fonts and backdrop in `app/layout.tsx`) is already merged. The templates are a single-page React prototype loaded through Babel in the browser. They use hash-based routing, `window` globals and inline mock data. This spec turns them into idiomatic Next.js 16 routes and components that later specs can build real games and a real backend on. It does not change the look.

## Scope

**In:**

- App name stays **Arcade Vault**, as in the templates and theme.
- One App Router route per screen, with English URL paths:
  - `/` → library (Biblioteca)
  - `/games/[id]` → game detail (Detalle)
  - `/games/[id]/play` → player (Reproductor)
  - `/hall-of-fame` → hall of fame (Salón de la Fama)
  - `/sign-in` → sign-in / create account (Auth)
- Shared shell in `app/layout.tsx`: nav bar, mobile menu panel, `<main className="av-main">`, footer.
- UI copy in Spanish, copied verbatim from the templates.
- Visual fidelity: same markup structure and class names as the templates, so `app/globals.css` applies unchanged. The templates' inline `style` props are ported as-is.
- Library: client-side search by title, category chips (`TODOS`, `ARCADE`, `PUZZLE`, `SHOOTER`, `VERSUS`), empty state ("NO HAY RESULTADOS"), and the card's 3D tilt that follows the mouse.
- Game detail: cover, tags, description, stat strip, "JUGAR AHORA" and "VOLVER AL VAULT" actions, and a seeded fake leaderboard of 10 rows.
- Player: full **simulated** mock, exactly as the template:
  - CSS-animated CRT scene.
  - Score that ticks up on its own.
  - Level that increases with the score.
  - PAUSA/REANUDAR with the "EN PAUSA" overlay.
  - FIN opens the game-over modal.
  - Initials input and "GUARDAR PUNTUACIÓN" with the typewriter "PUNTUACIÓN GUARDADA" toast.
  - "JUGAR DE NUEVO", "VOLVER AL VAULT" and "SALIR".
- Hall of fame: one tab per game, podium (top 3), table of 12 seeded rows, a "TU MEJOR MARCA" row when a mock user is signed in, and the "VOLVER A LA BIBLIOTECA" button.
- Mock session in `localStorage`, same keys as the template:
  - Sign-in, create-account and guest buttons set or clear a fake user.
  - The nav shows the user's name; clicking it signs out.
  - Saved scores are appended to `av_scores`.
- Themed `app/not-found.tsx` for unknown game ids and unknown URLs.
- Typed mock data module `lib/games.ts`.
- ESLint ignores `references/**`.
- Delete the starter `app/page.tsx` content and the five unused starter SVGs in `public/`.

**Out of scope (for future specs):**

- Any playable game, game loop, canvas or keyboard input.
- Real authentication, including working Google/GitHub buttons. They render and do nothing.
- A backend, API routes, database or real leaderboards.
- Showing the scores saved in `av_scores` anywhere (the template doesn't either).
- A real credits system. The "CRÉDITOS · 03" counter is static text.
- A real account page. The mobile menu's "Cuenta" link goes to `/sign-in`, as in the template.
- Automated tests (Playwright, Vitest, …).
- Visual redesign of any screen.
- Per-route `metadata` titles.
- i18n / English UI copy.

## Data model

`lib/games.ts` — static catalog plus a deterministic fake-leaderboard generator, ported from `references/templates/data.jsx`:

```ts
export type GameCategory = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type NeonColor = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string;            // URL slug, e.g. "bloque-buster"
  title: string;         // "BLOQUE BUSTER"
  short: string;         // card description
  long: string;          // detail description
  category: GameCategory; // template field `cat`
  cover: `cover-${string}`; // CSS class from globals.css, e.g. "cover-bricks"
  color: NeonColor;      // picks the JUGAR button variant
  best: number;          // 28450
  plays: string;         // "12.4K"
};

export type ScoreRow = { rank: number; name: string; score: number; date: string }; // date "DD/MM/2026"

export const GAMES: Game[];                          // the 8 games, same order and values as data.jsx
export const CATEGORIES: ("TODOS" | GameCategory)[]; // ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]
export function getGame(id: string): Game | undefined;
export function seededScores(seed: number, count?: number): ScoreRow[]; // same algorithm as data.jsx
```

`lib/mock-session.ts` — `localStorage` helpers. Every read and write is wrapped in `try/catch`, so they return `null` or do nothing when storage is unavailable:

```ts
export const USER_KEY = "av_user";    // MockUser | null, JSON
export const SCORES_KEY = "av_scores"; // SavedScore[], JSON

export type MockUser = { name: string };   // uppercased, max 10 chars
export type SavedScore = { game: string; score: number; name: string; at: number }; // at = Date.now()
```

`components/session-provider.tsx` — client context exposing `{ user, signIn(user), signOut(), saveScore(entry) }` through a `useSession()` hook.

Conventions:

- Numbers are displayed with `toLocaleString("es-ES")`, as in the templates.
- Leaderboard seeds match the templates: detail uses `seededScores(id.length * 17 + 3, 10)`, and the hall of fame uses `seededScores(id.length * 23 + 7, 12)`.

## Implementation plan

1. Add `"references/**"` to `globalIgnores` in `eslint.config.mjs`. Check: `npm run lint` passes.
2. Create `lib/games.ts` with the types, `GAMES`, `CATEGORIES`, `getGame` and `seededScores` from the data model. No UI change. Check: `npm run build` passes.
3. Create `lib/mock-session.ts` and `components/session-provider.tsx`, and wrap `#root`'s content in `app/layout.tsx` with `<SessionProvider>`. Check: the app builds and renders as before.
4. Create `components/nav.tsx` (client) and `components/footer.tsx`, and render them in `app/layout.tsx` around `<main className="av-main">{children}</main>`.
   - The nav covers the desktop bar, the hamburger, the mobile backdrop and panel, the active link from `usePathname()` (`/games/*` counts as the library), the static credits counter, and sign-in/sign-out.
   - Manual test: the nav and footer show on `/`, and the mobile panel opens and closes below 840px.
5. Create `components/game-cover.tsx` and `components/game-card.tsx` (client, with the mouse-tilt effect).
6. Create `components/library.tsx` (client: search, category chips, grid, empty state). Replace `app/page.tsx` with the hero plus `<Library />`, and delete `public/{next,vercel,globe,window,file}.svg`. Manual test: filtering by "PUZZLE" shows only CAÍDA.
7. Create `app/not-found.tsx` in the arcade style, with a "VOLVER A LA BIBLIOTECA" link to `/`. Manual test: `/nope` shows it.
8. Create `components/leaderboard.tsx` and `app/games/[id]/page.tsx`.
   - The page uses `generateStaticParams` over `GAMES`, awaits `params`, and calls `notFound()` for unknown ids.
   - It renders the detail layout; "JUGAR AHORA" goes to `/games/[id]/play`.
   - Manual test: clicking a card opens its detail.
9. Create `components/game-player.tsx` (client) and `app/games/[id]/play/page.tsx` (same `generateStaticParams` / `notFound()` as the detail).
   - This step covers the HUD, the CRT scene, the auto-ticking score, levels, the pause overlay and SALIR.
   - Manual test: the score increases and PAUSA freezes it.
10. Add the game-over modal to `components/game-player.tsx`: FIN, the initials input (uppercased, max 10, defaulting to the user's name or `INVITADO`), save to `av_scores` with the typewriter toast, JUGAR DE NUEVO and VOLVER AL VAULT.
11. Create `components/auth-form.tsx` (client) and `app/sign-in/page.tsx`.
    - Tabs: INICIAR SESIÓN / CREAR CUENTA, with the email field only on CREAR CUENTA.
    - Submit signs in as `(username || "PLAYER1")` uppercased, max 10 characters.
    - "JUGAR COMO INVITADO" clears the user.
    - All three redirect to `/`.
    - The social buttons are inert.
12. Create `components/hall-of-fame.tsx` (client: game tabs, podium, table with staggered row animation, the "TU MEJOR MARCA" row when signed in) and `app/hall-of-fame/page.tsx`.

## Acceptance criteria

- [ ] `npm run build` completes without errors.
- [ ] `npm run lint` completes without errors.
- [ ] The browser console shows no errors or hydration warnings while visiting all five routes.
- [ ] `/` shows the "ARCADE VAULT" hero, the search box, 5 category chips and 8 game cards.
- [ ] Typing "ser" in the search box leaves only SERPENTINA.
- [ ] Selecting the "VERSUS" chip leaves only DUELO PIXEL.
- [ ] A search with no matches shows "NO HAY RESULTADOS".
- [ ] Hovering a card tilts it following the mouse and resets on mouse leave.
- [ ] Clicking a card or its JUGAR button navigates to `/games/<id>`.
- [ ] `/games/caida` shows the CAÍDA cover, description, stat strip and a 10-row leaderboard with gold/silver/bronze styling on the top 3.
- [ ] `/games/does-not-exist` and `/games/does-not-exist/play` show the themed 404 page.
- [ ] "JUGAR AHORA" navigates to `/games/<id>/play`.
- [ ] On the player, the score increases on its own and PAUSA stops it and shows "EN PAUSA".
- [ ] REANUDAR resumes the score.
- [ ] FIN opens the "FIN DEL JUEGO" modal showing the final score.
- [ ] "GUARDAR PUNTUACIÓN" appends `{ game, score, name, at }` to `localStorage["av_scores"]` and shows "PUNTUACIÓN GUARDADA".
- [ ] "JUGAR DE NUEVO" resets score to 0, lives to 3 and level to 01.
- [ ] SALIR returns to `/games/<id>`.
- [ ] On `/sign-in`, switching to CREAR CUENTA shows the email field.
- [ ] Submitting with username `px_kai` stores `{"name":"PX_KAI"}` in `localStorage["av_user"]`, redirects to `/`, and the nav shows "PX_KAI ▾".
- [ ] Clicking "PX_KAI ▾" removes `av_user` and the nav shows "Iniciar Sesión" again.
- [ ] Reloading the page keeps the signed-in user.
- [ ] `/hall-of-fame` shows one tab per game, a 3-slot podium and a 12-row table.
- [ ] Switching tabs changes the rows.
- [ ] When signed in, the hall of fame shows the "▸ TU MEJOR MARCA EN <GAME>" row; when signed out, it does not.
- [ ] The active nav link is highlighted on `/`, `/games/*` (Biblioteca) and `/hall-of-fame` (Salón de la Fama).
- [ ] Below 840px wide, the desktop links are hidden and the ≡ button opens the mobile panel.
- [ ] Clicking the backdrop or a link closes the mobile panel.
- [ ] Side-by-side with `references/templates/Arcade Vault.html`, each screen matches the template's layout, colours, fonts and copy.
- [ ] `public/` contains none of `next.svg`, `vercel.svg`, `globe.svg`, `window.svg`, `file.svg`.

## Decisions

- **Yes:** keep the name Arcade Vault. "Arcade Bot" in the request was a slip; templates, theme and repo all say Vault.
- **Yes:** real App Router routes. Deep links, the back button and partial prefetching work natively.
- **No:** a single page that swaps screens in client state, like the template. It fights the framework and has no shareable URLs.
- **Yes:** English URL paths with Spanish UI copy. Paths follow the codebase language, and the copy follows the templates.
- **Yes:** a fully simulated player (auto score, pause, game-over modal, save). It shows every UI state without a real game.
- **No:** a static player shell. It would leave the pause overlay and the game-over modal unbuilt.
- **Yes:** a mock session in `localStorage` with the template's keys `av_user` / `av_scores`. It exercises the signed-in and signed-out UI states.
- **No:** purely visual auth forms. The nav and hall-of-fame signed-in states would never render.
- **Yes:** typed mock data in `lib/games.ts`. It gives literal types and is easy to replace with an API later.
- **No:** a JSON data file. It loses the literal types for no gain at this stage.
- **Yes:** `notFound()` plus a themed `app/not-found.tsx`. Broken links stay visible instead of being silently redirected.
- **Yes:** `generateStaticParams` over the 8 games. All game pages prerender, which also suits `cacheComponents`.
- **Yes:** components in `components/` at the project root, imported as `@/components/*`.
- **No:** `app/_components/`.
- **Yes:** ignore `references/**` in ESLint. The templates are design reference, not app code.
- **No:** narrowing the `lint` script.
- **Yes:** delete the unused starter SVGs in this spec.
- **Yes:** keep the templates' class names and markup structure. `globals.css` is a verbatim port, so the visual match depends on it. `/frontend-design` was consulted per `CLAUDE.md`, but the reference design wins and no redesign is made.
- **Yes:** a client `SessionProvider` reading `localStorage` after mount. Server-rendered HTML always shows the signed-out state, which avoids hydration mismatches.
- **Yes:** hall-of-fame tab, library search and category are client state. This matches the template.
- **No:** reflecting them in the URL. That can come in a later spec.
- **Yes:** verification by build + lint + the manual checklist above.
- **No:** Playwright in this spec. Test tooling deserves its own spec.

## Risks

| Risk | Mitigation |
| --- | --- |
| Signed-in UI flashes the signed-out state on first paint (session is read after hydration) | Accepted for a mock session. The server snapshot is `null` on purpose to avoid hydration errors. |
| `localStorage` unavailable (private mode, blocked storage) | All helpers in `lib/mock-session.ts` use `try/catch` and fall back to `null` / no-op. The UI still renders signed out. |
| `cacheComponents` rejects uncached dynamic access (`params`) outside `<Suspense>` | Both `[id]` routes export `generateStaticParams`. Check `node_modules/next/dist/docs/` for `params` / `notFound` behaviour before writing them. |
| Hydration mismatch from number formatting (`toLocaleString("es-ES")`) | Seeded data is deterministic, and Node ships full ICU. Verified by the "no hydration warnings" criterion. |
| `Math.random()` / `Date.now()` in the player trip Cache Components prerender checks | They only run inside client effects and event handlers, never during server render. |

## What is **not** in this spec

- Real games, game loops or keyboard controls.
- Real authentication or working social login.
- Backend, database or real leaderboards.
- Displaying saved scores.
- A credits system or an account page.
- Automated tests.
- Visual redesign or English UI copy.

Each one of those, if it lands, goes in its own spec.
