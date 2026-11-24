// Mock catalog and fake leaderboards, ported from references/templates/data.jsx.

export type GameCategory = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type NeonColor = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string;
  title: string;
  short: string;
  long: string;
  category: GameCategory;
  cover: `cover-${string}`;
  color: NeonColor;
  best: number;
  plays: string;
  /** Fixed leaderboard seed (the length of the pre-SPEC 04 id), so fake leaderboards don't change. */
  seed: number;
};

export type ScoreRow = { rank: number; name: string; score: number; date: string };

export const GAMES: Game[] = [
  {
    id: "block-buster",
    title: "BLOCK BUSTER",
    short: "Bounce the ball and smash neon walls.",
    long: "Pilot a paddle ship and bounce a plasma core to pulverize walls of chromatic bricks. Every level rearranges the grid into impossible patterns. How far can your streak go?",
    category: "ARCADE",
    cover: "cover-bricks",
    color: "cyan",
    best: 28450,
    plays: "12.4K",
    seed: 13,
  },
  {
    id: "drop",
    title: "DROP",
    short: "Fit the pieces before the ceiling crushes you.",
    long: "Geometric pieces fall out of the darkness. Rotate them, lock them in and clear lines to survive. The speed ramps up mercilessly every 10 lines.",
    category: "PUZZLE",
    cover: "cover-tetro",
    color: "magenta",
    best: 184220,
    plays: "31.8K",
    seed: 5,
  },
  {
    id: "serpentine",
    title: "SERPENTINE",
    short: "Grow without biting your own tail.",
    long: "A serpent of light roams the grid hunting magenta cores. Every bite makes it longer and faster. One wrong move and it devours itself.",
    category: "ARCADE",
    cover: "cover-snake",
    color: "green",
    best: 7820,
    plays: "9.1K",
    seed: 10,
  },
  {
    id: "chomper",
    title: "CHOMPER",
    short: "Gobble dots and escape the ghosts.",
    long: "A hungry circle patrols a maze collecting glowing dots. Four specters chase it, but every so often a pill appears that turns the tables.",
    category: "ARCADE",
    cover: "cover-chomp",
    color: "yellow",
    best: 96400,
    plays: "27.2K",
    seed: 6,
  },
  {
    id: "invaders",
    title: "INVADERS",
    short: "Defend the planet from rows of aliens.",
    long: "Waves of hostile pixels descend formation after formation. Slide your cannon side to side and fire with precision before they reach the surface.",
    category: "SHOOTER",
    cover: "cover-invaders",
    color: "green",
    best: 54190,
    plays: "18.0K",
    seed: 9,
  },
  {
    id: "rocks",
    title: "ROCKS",
    short: "Blast asteroids in zero gravity.",
    long: "Your triangular ship drifts through the void. Shoot and rotate to split rocks into ever smaller fragments. Watch out for UFOs on the horizon.",
    category: "SHOOTER",
    cover: "cover-rocks",
    color: "yellow",
    best: 41200,
    plays: "15.6K",
    seed: 5,
  },
  {
    id: "lily-hop",
    title: "LILY HOP",
    short: "Cross the pixel highway.",
    long: "Hop across lanes of speeding cars and logs drifting down the river. Reach the lily pads before time runs out.",
    category: "ARCADE",
    cover: "cover-lily",
    color: "green",
    best: 18900,
    plays: "6.4K",
    seed: 7,
  },
  {
    id: "pixel-duel",
    title: "PIXEL DUEL",
    short: "Two paddles. One ball. Maximum reflexes.",
    long: "The purest duel: two vertical paddles battle over a glowing ball. Play solo against the CPU or a local two-player match.",
    category: "VERSUS",
    cover: "cover-duel",
    color: "cyan",
    best: 24,
    plays: "4.2K",
    seed: 11,
  },
];

export const CATEGORIES: ("ALL" | GameCategory)[] = ["ALL", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"];

const PLAYERS = [
  "PX_KAI", "NEONFOX", "Z3R0COOL", "M00NRYU", "VAULT_07", "GLITCHA",
  "ATARI_KID", "CYBER_LU", "MAGENTA88", "SCANLINE", "BIT_LORD", "ARKADYA",
  "DROID_X", "RGB_QUEEN", "PIXEL_DAD", "RETROVIRA", "VECTORX", "JOY_STK",
];

export function getGame(id: string): Game | undefined {
  return GAMES.find((g) => g.id === id);
}

/** Deterministic fake leaderboard: the same seed always yields the same rows. */
export function seededScores(seed: number, count = 12): ScoreRow[] {
  let s = seed;
  const rand = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const used = new Set<string>();
  const rows: ScoreRow[] = [];
  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      name = PLAYERS[Math.floor(rand() * PLAYERS.length)];
    } while (used.has(name) && used.size < PLAYERS.length);
    used.add(name);
    const base = Math.floor(50000 + rand() * 250000);
    const score = base - i * Math.floor(2000 + rand() * 4000);
    const day = String(1 + Math.floor(rand() * 28)).padStart(2, "0");
    const mon = String(1 + Math.floor(rand() * 12)).padStart(2, "0");
    rows.push({ rank: i + 1, name, score: Math.max(score, 1000), date: `${mon}/${day}/2026` });
  }
  return rows.sort((a, b) => b.score - a.score).map((r, i) => ({ ...r, rank: i + 1 }));
}
