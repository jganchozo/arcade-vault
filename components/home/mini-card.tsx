import Link from "next/link";
import { GameCover } from "@/components/game-cover";
import type { Game } from "@/lib/games";

export function MiniCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.id}`} className="mini-card">
      <div className="mini-cover"><GameCover cover={game.cover} /></div>
      <div className="mini-meta">
        <div className="mini-title">{game.title}</div>
        <div className="mini-cat">{game.category}</div>
      </div>
    </Link>
  );
}
