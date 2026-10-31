/** Scores and counts, e.g. 184220 → "184,220". The locale is pinned so server and client render the same string. */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
