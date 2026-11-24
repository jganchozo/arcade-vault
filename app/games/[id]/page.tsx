import { notFound } from "next/navigation";
import { GameCover } from "@/components/game-cover";
import { Leaderboard } from "@/components/leaderboard";
import { NavButton } from "@/components/nav-button";
import { GAMES, getGame, seededScores } from "@/lib/games";
import { formatNumber } from "@/lib/format";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export default async function GameDetailPage({ params }: PageProps<"/games/[id]">) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  const scores = seededScores(id.length * 17 + 3, 10);

  return (
    <div className="av-detail fade-in">
      <div>
        <div className="detail-cover">
          <GameCover cover={game.cover} />
        </div>
        <div style={{ marginTop: 20 }} className="detail-info">
          <div className="detail-tags">
            <span>{game.category}</span>
            <span>1 PLAYER</span>
            <span>KEYBOARD / TOUCH</span>
            <span>RETRO 1985</span>
          </div>
          <h2 className="neon-cyan">{game.title}</h2>
          <p>{game.long}</p>
          <div className="stat-strip">
            <div>
              <div className="l">Plays</div>
              <div className="v">{game.plays}</div>
            </div>
            <div>
              <div className="l">Global best</div>
              <div className="v" style={{ color: "var(--magenta)", textShadow: "0 0 6px rgba(255,0,110,0.5)" }}>
                {formatNumber(game.best)}
              </div>
            </div>
            <div>
              <div className="l">Difficulty</div>
              <div className="v" style={{ color: "var(--yellow)", textShadow: "0 0 6px rgba(245,255,0,0.5)" }}>
                ★ ★ ★ ☆ ☆
              </div>
            </div>
          </div>
          <div className="detail-actions">
            <NavButton href={`/games/${game.id}/play`} className="btn xl pulse">▶  PLAY NOW</NavButton>
            <NavButton href="/games" className="btn ghost lg">BACK TO THE VAULT</NavButton>
          </div>
        </div>
      </div>

      <aside>
        <Leaderboard rows={scores} />
      </aside>
    </div>
  );
}
