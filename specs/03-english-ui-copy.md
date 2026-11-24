# SPEC 03 — English UI copy

> **Status:** Implemented
> **Depends on:** SPEC 01, SPEC 02
> **Date:** 2026-10-31
> **Objective:** Replace every piece of Spanish UI copy in the app with natural arcade English and switch number and date formatting to `en-US`, keeping game titles as brand names.

## Why this spec exists

SPEC 01 and SPEC 02 copied the templates' Spanish copy verbatim and listed "i18n / English UI copy" as out of scope. The product is now English-facing. This spec reverses that decision for the running app. It changes no layout, class names, routes or behaviour, only the words and the number/date formats.

## Scope

**In:**

- Every user-visible string in `app/` and `components/` becomes English: text nodes, button labels, headings, placeholders, `aria-label`s, form labels, empty states, toasts, the 404 page, the footer and the root `metadata`.
- Game `short` and `long` descriptions in `lib/games.ts` are translated.
- Category chip "TODOS" becomes **"ALL"** (in `CATEGORIES`, its type and `components/library.tsx`). The other categories (`ARCADE`, `PUZZLE`, `SHOOTER`, `VERSUS`) are already English and stay.
- Mock data strings are translated: ticker times "hace N min" → "N min ago", the guest name "INVITADO" → "GUEST".
- Translation style: **natural arcade English** (meaning over literal wording), uppercase where the Spanish was uppercase, with lengths kept close to the original so buttons and headings still fit their layouts.
- Number formatting: every `toLocaleString("es-ES")` is replaced by a shared `formatNumber()` that uses `en-US` (`184220` → `184,220`).
- Date formatting: seeded leaderboard dates switch from `DD/MM/2026` to **`MM/DD/2026`**. The hard-coded "TU MEJOR MARCA" date `11/05/2026` (11 May) becomes `05/11/2026`.
- `<html lang="es">` → `<html lang="en">`.
- Root metadata: title `"Arcade Vault · Retro Arcade Portal"`; description stays `"Arcade Vault, a retro arcade game portal"`.

**Glossary** (fixed terms; use them everywhere the Spanish term appears, so the same action has the same name in every screen):

| Spanish | English |
| --- | --- |
| Inicio / Biblioteca / Salón de la Fama / Acerca de | Home / Library / Hall of Fame / About |
| Iniciar Sesión / Cuenta / MENÚ | Sign In / Account / MENU |
| CRÉDITOS · 03 | CREDITS · 03 |
| INSERTA UNA MONEDA (PARA JUGAR) / INSERTAR MONEDA | INSERT COIN (TO PLAY) / INSERT COIN |
| JUGAR / JUGAR AHORA / JUGAR DE NUEVO | PLAY / PLAY NOW / PLAY AGAIN |
| VOLVER AL VAULT / VOLVER A LA BIBLIOTECA | BACK TO THE VAULT / BACK TO LIBRARY |
| MEJOR PUNTUACIÓN / MEJORES PUNTUACIONES | HIGH SCORE / HIGH SCORES |
| Jugador / Puntuación / Vidas / Nivel | Player / Score / Lives / Level |
| PAUSA / REANUDAR / EN PAUSA / FIN / SALIR | PAUSE / RESUME / PAUSED / END / EXIT |
| FIN DEL JUEGO | GAME OVER |
| GUARDAR PUNTUACIÓN / PUNTUACIÓN GUARDADA | SAVE SCORE / SCORE SAVED |
| INICIAR SESIÓN / CREAR CUENTA (auth tabs, home CTA) | SIGN IN / CREATE ACCOUNT |
| JUGAR COMO INVITADO / INVITADO | PLAY AS GUEST / GUEST |
| Usuario / Correo electrónico / Contraseña | Username / Email / Password |
| O CONTINÚA CON | OR CONTINUE WITH |
| TODOS / NO HAY RESULTADOS | ALL / NO RESULTS |
| RANGO / JUGADOR / PUNTUACIÓN / FECHA (hall table) | RANK / PLAYER / SCORE / DATE |
| CAMPEÓN / TU MEJOR MARCA EN | CHAMPION / YOUR BEST IN |
| Partidas / Mejor global / Dificultad | Plays / Global best / Difficulty |
| PANTALLA NO ENCONTRADA | SCREEN NOT FOUND |
| EXPLORAR JUEGOS / VER TODOS LOS JUEGOS / VER SALÓN | EXPLORE GAMES / SEE ALL GAMES / VIEW HALL |
| EMPEZAR GRATIS / PRECIOS / PLAN ÚNICO | START FREE / PRICING / ONE PLAN |
| ACTIVIDAD EN VIVO / ÚLTIMAS PUNTUACIONES / TOP JUGADORES · HOY | LIVE ACTIVITY / LATEST SCORES / TOP PLAYERS · TODAY |
| ¿LISTO PARA JUGAR? / DESLIZA | READY TO PLAY? / SCROLL |

Strings not in the glossary are translated in the same style at implementation time. "FREE PLAY", "LADDER BOARDS", "GOOGLE", "GITHUB", "ARCADE VAULT" and the `// 01`–`// 04` kickers are already English and stay.

**Stays as is:**

- Game titles and ids: BLOQUE BUSTER, CAÍDA, SERPENTINA, GLOTÓN, INVASORES, ROCAS, RANARIA, DUELO PIXEL (`/games/caida` etc.). The home ticker's mixed-case game names ("Caída", "Glotón", …) are the same brand names and stay.
- Mock player names (NEONFOX, PX_KAI, …) and `plays` values ("12.4K").
- `localStorage` keys and shapes (`av_user`, `av_scores`). Existing stored users and scores keep working.
- Layout, class names, inline styles, routes and behaviour.

**Out of scope (for future specs):**

- A language switcher, bilingual UI, or an i18n library / translation files.
- Translating game titles or changing game ids / URLs.
- Editing SPEC 01, SPEC 02 or `references/templates/**`. They stay in Spanish as a historical record and design reference.
- The `/about` prefetch 404 and the 375px nav overflow recorded in SPEC 02's implementation notes.
- Per-route `metadata` titles.
- Automated tests.
- Visual changes, apart from text naturally getting shorter or longer.

## Data model

No new data structures. Changes to existing ones:

`lib/format.ts` (new):

```ts
/** Scores and counts, e.g. 184220 → "184,220". */
export function formatNumber(n: number): string; // n.toLocaleString("en-US")
```

`lib/games.ts`:

```ts
export const CATEGORIES: ("ALL" | GameCategory)[]; // ["ALL", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"]
export type ScoreRow = { rank: number; name: string; score: number; date: string }; // date "MM/DD/2026"
```

`seededScores()` keeps the same random sequence. Only the order of `day` and `mon` in the formatted string changes, so names and scores stay identical to today.

## Implementation plan

1. Formatting and document language:
   - Create `lib/format.ts` with `formatNumber`.
   - Replace all 12 `toLocaleString("es-ES")` calls in `app/` and `components/` with `formatNumber`.
   - Swap the seeded date to `MM/DD/2026` in `lib/games.ts` and the hard-coded hall-of-fame date to `05/11/2026`.
   - Set `lang="en"` and the new metadata title in `app/layout.tsx`.

   Check: `npm run build` passes and scores show commas.
2. Data copy in `lib/games.ts`: translate the 8 `short` / `long` descriptions, and rename `"TODOS"` → `"ALL"` in `CATEGORIES`, its type and `components/library.tsx`. Check: the library shows the "ALL" chip and English descriptions.
3. App shell: `components/nav.tsx` (desktop links, mobile panel, credits, sign-in/out, hamburger `aria-label`), `components/footer.tsx` and `app/not-found.tsx`.
4. Library and game detail: `app/games/page.tsx` hero, `components/library.tsx` (search placeholder, empty state), `components/game-card.tsx`, `app/games/[id]/page.tsx` (tags, stat strip, actions) and `components/leaderboard.tsx`.
5. Player: `components/game-player.tsx` (HUD, pause overlay, buttons, game-over modal, initials input, toast, default name "GUEST").
6. Sign-in and hall of fame: `components/auth-form.tsx` (tabs, labels, placeholders, buttons, divider, footnote) and `components/hall-of-fame.tsx` (heading, subtitle, podium, table headers, "YOUR BEST IN" row, back button).
7. Home: `app/page.tsx` (hero, features, stats, ticker times, top players, pricing, FAQ, final CTA).
8. Sweep and verify: run the grep checks from the acceptance criteria, then `npm run lint`, `npm run build`, and a browser walk of every route.

## Acceptance criteria

- [ ] `npm run build` completes without errors.
- [ ] `npm run lint` completes without errors.
- [ ] No hydration warnings in the browser console on `/`, `/games`, `/games/caida`, `/games/caida/play`, `/hall-of-fame`, `/sign-in` and an unknown URL.
- [ ] `grep -rn 'es-ES' app components lib` returns nothing.
- [ ] `grep -rnE '[áéíóúñ¿¡ÁÉÍÓÚÑ]' app components lib --include=*.ts --include=*.tsx` only matches the game titles CAÍDA / GLOTÓN (and their mixed-case forms "Caída" / "Glotón" in the home ticker).
- [ ] `grep -rnwiE 'jugar|volver|puntuaci[oó]n|juegos|hace|invitado|todos|salir|pausa|cuenta' app components lib` returns nothing.
- [ ] The rendered `<html>` element has `lang="en"` and the tab title is "Arcade Vault · Retro Arcade Portal".
- [ ] The nav shows Home, Library, Hall of Fame, About and Sign In (or "<NAME> ▾" when signed in); the mobile panel shows MENU, the same links, Sign In / Account, and CREDITS · 03.
- [ ] `/` shows "INSERT COIN_", the "EXPLORE GAMES" and "CREATE ACCOUNT" buttons, and the section titles WHY ARCADE VAULT?, GAMES AVAILABLE NOW, LIVE ACTIVITY, PRICING and READY TO PLAY?.
- [ ] The home ticker shows times like "2 min ago" and scores like "+184,220".
- [ ] `/games` shows the "ALL" chip first; selecting it shows all 8 games, and a search with no matches shows "NO RESULTS".
- [ ] Game cards show "HIGH SCORE" with comma-grouped numbers (e.g. "28,450") and English short descriptions.
- [ ] `/games/caida` shows the title "CAÍDA", an English long description, the stat labels Plays / Global best / Difficulty, "PLAY NOW", "BACK TO THE VAULT", and a "HIGH SCORES" leaderboard with dates in `MM/DD/2026` form.
- [ ] On the player, the HUD reads Player / Score / Lives / Level; PAUSE shows "PAUSED" and the button becomes RESUME; END opens "GAME OVER"; the initials default to "GUEST" when signed out; SAVE SCORE shows "SCORE SAVED"; PLAY AGAIN and EXIT work as before.
- [ ] `/sign-in` shows the SIGN IN / CREATE ACCOUNT tabs, Username / Email / Password labels, "PLAY AS GUEST" and "OR CONTINUE WITH"; signing in as `px_kai` still stores `{"name":"PX_KAI"}`.
- [ ] `/hall-of-fame` shows "HALL OF FAME", "CHAMPION" on the podium, the RANK / PLAYER / SCORE / DATE headers, and, when signed in, a "▸ YOUR BEST IN <GAME>" row dated `05/11/2026`.
- [ ] Hall-of-fame and detail leaderboards show the same player names and scores as before this spec (only the number and date formats change).
- [ ] An unknown URL shows "SCREEN NOT FOUND" and a "BACK TO LIBRARY" button that goes to `/games`.
- [ ] At 1280px and 375px, no button or heading text wraps or overflows in a way it did not before this spec.

## Decisions

- **Yes:** English-only UI, strings hardcoded where they live. This is the simplest change and matches how the code is written today.
- **No:** a `lib/copy.ts` dictionary. It reshapes every component for no current need.
- **No:** a bilingual UI with `next-intl`. That is a feature of its own and deserves its own spec.
- **Yes:** natural arcade English ("INSERT COIN", "GAME OVER") with lengths kept close to the Spanish.
- **No:** a literal translation. It reads badly ("END OF THE GAME") and gains nothing.
- **Yes:** a fixed glossary in this spec. The same action keeps the same name across screens (PLAY, SCORE, BACK TO …).
- **Yes:** `en-US` formatting for numbers and `MM/DD/2026` dates, through one `formatNumber()` helper. Every number looks the same, and a future locale change touches one place.
- **No:** keeping `es-ES` formats with English words.
- **Yes:** game titles and ids stay as brand names. URLs keep working and the catalogue keeps its identity.
- **No:** translating titles (e.g. CAÍDA → DROP).
- **Yes:** the "TODOS" chip becomes "ALL", including the literal type. Type and label stay the same value, as in SPEC 01.
- **Yes:** SPEC 01, SPEC 02 and `references/templates/**` stay untouched. They are history and design reference, and this spec supersedes their "Spanish copy" decision.
- **Yes:** `localStorage` keys and shapes unchanged. Existing mock sessions and saved scores survive the change.
- **Yes:** verification by grep checks + build + lint + the manual checklist. No Playwright in this spec.

## Risks

| Risk | Mitigation |
| --- | --- |
| A Spanish string without accents slips through (e.g. "Intenta otra búsqueda" has an accent but "PARTIDAS" doesn't) | Step 8 runs both the accent grep and the Spanish-word grep, and the browser walk covers every route and state (pause, game over, signed in/out, empty search). |
| English text is longer than the Spanish and breaks a fixed-width button or heading | Lengths kept close by the style rule; the 1280px / 375px criterion checks for new wraps. |
| `en-US` vs `es-ES` formatting differs between server and client and causes hydration mismatches | `formatNumber` pins `"en-US"` explicitly (never the runtime default locale), and Node ships full ICU. Covered by the "no hydration warnings" criterion. |
| Renaming the `"TODOS"` literal misses a usage and breaks filtering | It's a literal type, so `npm run build` fails on any leftover `"TODOS"` comparison. |
| Changing the date order changes seeded data | Only the template string changes; the `rand()` call order is untouched, so names and scores stay identical (criterion checks it). |

## Implementation notes

- Verified in step 8 on a production build: the three grep checks, `npm run lint`, `npm run build`, and a browser walk of every route at 1280px and 375px, signed in and signed out (pause, game over, save score, empty search, unknown URL). No hydration warnings.
- Besides the home ticker, the accent grep also matches "Caída" in the CLASSIC GAMES feature description on `/`. It is the game's brand name, so it stays.
- Leaderboards on `/games/*` and `/hall-of-fame` show the same player names and scores as before this spec, compared against a `main` build. No button or heading wraps more than before; several English labels are shorter than the Spanish ones.
- Known gap, from SPEC 02: the nav prefetches `/about`, which 404s until the About spec, so every page logs one failed `/about?_rsc=…` request.
- Known gap, from SPEC 01: at 375px the nav still overflows (page width 384px, the ≡ button ends at 384px), same as before this spec.
- `next build` needs `NODE_ENV` unset (or `production`). With `NODE_ENV=development` exported in the shell, prerendering fails with a null hooks error.

## What is **not** in this spec

- Language switcher or i18n tooling.
- Translated game titles or new URLs.
- Edits to earlier specs or reference templates.
- Fixes for the `/about` prefetch 404 or the 375px nav overflow.
- Automated tests.
- Visual redesign.

Each one of those, if it lands, goes in its own spec.
