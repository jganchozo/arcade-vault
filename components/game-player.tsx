"use client";

import { useEffect, useState } from "react";
import { NavButton } from "@/components/nav-button";
import { useSession } from "@/components/session-provider";
import type { Game } from "@/lib/games";

// Simulated run: no real game, the score just ticks up while not paused.
const INITIAL_RUN = { score: 0, lives: 3, level: 1 };

export function GamePlayer({ game }: { game: Game }) {
  const { user } = useSession();
  const [run, setRun] = useState(INITIAL_RUN);
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const name = user ? user.name : "INVITADO";

  useEffect(() => {
    if (over || paused) return;
    const t = setInterval(() => {
      setRun((r) => {
        const score = r.score + Math.floor(10 + Math.random() * 90);
        // Level up each time the score passes a multiple of 2500.
        return { ...r, score, level: score % 2500 < 100 ? r.level + 1 : r.level };
      });
    }, 220);
    return () => clearInterval(t);
  }, [over, paused]);

  return (
    <div className="av-player fade-in">
      <div className="player-hud">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div className="hud-stat">
            <div className="l">Jugador</div>
            <div className="v" style={{ color: "var(--ink)" }}>{name}</div>
          </div>
          <div className="hud-stat">
            <div className="l">Puntuación</div>
            <div className="v">{run.score.toLocaleString("es-ES")}</div>
          </div>
          <div className="hud-stat lives">
            <div className="l">Vidas</div>
            <div className="v">{"♥ ".repeat(run.lives).trim() || "—"}</div>
          </div>
          <div className="hud-stat level">
            <div className="l">Nivel</div>
            <div className="v">{String(run.level).padStart(2, "0")}</div>
          </div>
        </div>
        <div className="hud-actions">
          <button className="btn yellow" onClick={() => setPaused((p) => !p)}>{paused ? "REANUDAR" : "PAUSA"}</button>
          <button className="btn magenta" onClick={() => setOver(true)}>FIN</button>
          <NavButton href={`/games/${game.id}`} className="btn ghost">SALIR</NavButton>
        </div>
      </div>

      <div className="crt">
        <div className="crt-screen">
          <div className="game-arena">
            <div className="grid-floor"></div>
            <div className="enemy e1"></div>
            <div className="enemy e2"></div>
            <div className="enemy e3"></div>
            <div className="player-ship"></div>
          </div>
          {paused && (
            <div className="crt-content" style={{ background: "rgba(0,0,0,0.6)", zIndex: 5 }}>
              <div>
                <div className="pixel neon-yellow" style={{ fontSize: 22 }}>EN PAUSA</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 10, letterSpacing: "0.16em" }}>
                  PULSA REANUDAR PARA CONTINUAR
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="crt-bottom">
          <span className="led">SEÑAL OK</span>
          <span>{game.title} · CRT-83 · 60 HZ</span>
          <span>CARGA · 1MB</span>
        </div>
      </div>
    </div>
  );
}
