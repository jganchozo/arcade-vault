"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { GameCover } from "@/components/game-cover";
import type { Game } from "@/lib/games";

const BUTTON_VARIANT: Partial<Record<Game["color"], string>> = { magenta: "magenta", yellow: "yellow" };

export function GameCard({ game }: { game: Game }) {
  const router = useRouter();
  const tiltRef = useRef<HTMLDivElement>(null);
  const open = () => router.push(`/games/${game.id}`);

  // Tilt toward the pointer; inline transform overrides the :hover one in globals.css.
  const onMove = (e: React.MouseEvent) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-6px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg)`;
  };
  const onLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  return (
    <div ref={tiltRef} className="card" onMouseMove={onMove} onMouseLeave={onLeave} onClick={open}>
      <div className="cover">
        <GameCover cover={game.cover} />
        <div className="label">{game.category}</div>
      </div>
      <div className="meta">
        <div className="title">{game.title}</div>
        <div className="desc">{game.short}</div>
        <div className="row">
          <div className="score-badge">
            <span>MEJOR PUNTUACIÓN</span>
            <b>{game.best.toLocaleString("es-ES")}</b>
          </div>
          <button
            className={"btn " + (BUTTON_VARIANT[game.color] ?? "")}
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            JUGAR
          </button>
        </div>
      </div>
    </div>
  );
}
