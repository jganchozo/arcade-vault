import type { Game } from "@/lib/games";

/** Pure-CSS cover art; the drawing lives in the .cover-* classes of globals.css. */
export function GameCover({ cover }: { cover: Game["cover"] }) {
  return <div className={"cover-bg " + cover}></div>;
}
