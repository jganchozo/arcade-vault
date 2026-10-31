"use client";

import { useEffect, useState } from "react";
import { NavButton } from "@/components/nav-button";
import { useSession } from "@/components/session-provider";
import type { Game } from "@/lib/games";
import { formatNumber } from "@/lib/format";

// Simulated run: no real game, the score just ticks up while not paused.
const INITIAL_RUN = { score: 0, lives: 3, level: 1 };

export function GamePlayer({ game }: { game: Game }) {
  const { user, saveScore } = useSession();
  const [run, setRun] = useState(INITIAL_RUN);
  const [paused, setPaused] = useState(false);
  const [over, setOver] = useState(false);
  const [saved, setSaved] = useState(false);
  // null until the player edits it, so the signed-in name shows once the session loads.
  const [nameInput, setNameInput] = useState<string | null>(null);
  const name = nameInput ?? (user ? user.name : "GUEST");

  const restart = () => {
    setRun(INITIAL_RUN);
    setPaused(false);
    setOver(false);
    setSaved(false);
  };

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
            <div className="l">Player</div>
            <div className="v" style={{ color: "var(--ink)" }}>{name}</div>
          </div>
          <div className="hud-stat">
            <div className="l">Score</div>
            <div className="v">{formatNumber(run.score)}</div>
          </div>
          <div className="hud-stat lives">
            <div className="l">Lives</div>
            <div className="v">{"♥ ".repeat(run.lives).trim() || "—"}</div>
          </div>
          <div className="hud-stat level">
            <div className="l">Level</div>
            <div className="v">{String(run.level).padStart(2, "0")}</div>
          </div>
        </div>
        <div className="hud-actions">
          <button className="btn yellow" onClick={() => setPaused((p) => !p)}>{paused ? "RESUME" : "PAUSE"}</button>
          <button className="btn magenta" onClick={() => setOver(true)}>END</button>
          <NavButton href={`/games/${game.id}`} className="btn ghost">EXIT</NavButton>
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
                <div className="pixel neon-yellow" style={{ fontSize: 22 }}>PAUSED</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 10, letterSpacing: "0.16em" }}>
                  PRESS RESUME TO CONTINUE
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="crt-bottom">
          <span className="led">SIGNAL OK</span>
          <span>{game.title} · CRT-83 · 60 HZ</span>
          <span>LOAD · 1MB</span>
        </div>
      </div>

      {over && (
        <div className="modal-bd">
          <div className="modal">
            <h2>GAME OVER</h2>
            <div className="final-label">FINAL SCORE</div>
            <div className="final">{formatNumber(run.score)}</div>
            {!saved ? (
              <div className="input-row">
                <input
                  value={name}
                  onChange={(e) => setNameInput(e.target.value.toUpperCase().slice(0, 10))}
                  placeholder="YOUR INITIALS"
                />
                <button
                  className="btn yellow"
                  onClick={() => {
                    saveScore({ game: game.id, score: run.score, name });
                    setSaved(true);
                  }}
                >
                  SAVE SCORE
                </button>
              </div>
            ) : (
              <div className="toast-saved">▸ SCORE SAVED_</div>
            )}
            <div className="actions">
              <button className="btn" onClick={restart}>PLAY AGAIN</button>
              <NavButton href="/games" className="btn magenta">BACK TO THE VAULT</NavButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
