// Mock session kept in localStorage, same keys as the reference templates.
// Every access is guarded: when storage is unavailable the app behaves as signed out.

import { LEGACY_GAME_IDS } from "@/lib/legacy-game-ids";

export const USER_KEY = "av_user";
export const SCORES_KEY = "av_scores";

export type MockUser = { name: string };
export type SavedScore = { game: string; score: number; name: string; at: number };

const listeners = new Set<() => void>();

// Cache by raw string so useSyncExternalStore gets a stable snapshot.
let cachedRaw: string | null = null;
let cachedUser: MockUser | null = null;

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeUser(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === USER_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function readUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedUser = raw ? (JSON.parse(raw) as MockUser) : null;
    }
    return cachedUser;
  } catch {
    return null;
  }
}

export function writeUser(user: MockUser | null) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {}
  notify();
}

/** Rewrites av_scores entries saved under a pre-SPEC 04 id. No-op when nothing matches; never throws. */
export function migrateSavedScores() {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    if (!raw) return;
    const all = JSON.parse(raw) as SavedScore[];
    if (!Array.isArray(all)) return;
    let changed = false;
    const migrated = all.map((entry) => {
      const to = entry && Object.hasOwn(LEGACY_GAME_IDS, entry.game) ? LEGACY_GAME_IDS[entry.game] : undefined;
      if (!to) return entry;
      changed = true;
      return { ...entry, game: to };
    });
    if (changed) localStorage.setItem(SCORES_KEY, JSON.stringify(migrated));
  } catch {}
}

export function appendScore(entry: Omit<SavedScore, "at">) {
  try {
    const all = JSON.parse(localStorage.getItem(SCORES_KEY) || "[]") as SavedScore[];
    all.push({ ...entry, at: Date.now() });
    localStorage.setItem(SCORES_KEY, JSON.stringify(all));
  } catch {}
}
