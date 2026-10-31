// Mock session kept in localStorage, same keys as the reference templates.
// Every access is guarded: when storage is unavailable the app behaves as signed out.

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

export function appendScore(entry: Omit<SavedScore, "at">) {
  try {
    const all = JSON.parse(localStorage.getItem(SCORES_KEY) || "[]") as SavedScore[];
    all.push({ ...entry, at: Date.now() });
    localStorage.setItem(SCORES_KEY, JSON.stringify(all));
  } catch {}
}
