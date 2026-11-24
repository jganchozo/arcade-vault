import { FeatureIcon, type FeatureIconKind } from "@/components/home/feature-icon";
import { FloatingSilhouettes } from "@/components/home/floating-silhouettes";
import { MiniCard } from "@/components/home/mini-card";
import { RevealObserver } from "@/components/home/reveal-observer";
import { NavButton } from "@/components/nav-button";
import { GAMES, type NeonColor } from "@/lib/games";
import { formatNumber } from "@/lib/format";

type Feature = { icon: FeatureIconKind; title: string; desc: string; color: NeonColor };
type Stat = { n: string; u: string; s: string };
type TickerRow = { player: string; game: string; score: number; ago: string; color: NeonColor };
type TopPlayer = { rank: number; player: string; score: number };
type Faq = { q: string; a: string };

const FEATURES: Feature[] = [
  { icon: "GAMEPAD", title: "CLASSIC GAMES", desc: "Block Buster, Drop, Serpentine and many more. The best arcade games of all time in one place.", color: "cyan" },
  { icon: "FREE", title: "100% FREE", desc: "No subscriptions, no hidden fees. Every game is free to play.", color: "yellow" },
  { icon: "TROPHY", title: "LADDER BOARDS", desc: "Compete with players from around the world. Climb the rankings and prove who's the best.", color: "magenta" },
  { icon: "ROCKET", title: "ALWAYS GROWING", desc: "We add new games all the time. Come back often, there's always something new to play.", color: "green" },
];

const STATS: Stat[] = [
  { n: "8+", u: "GAMES", s: "AND COUNTING" },
  { n: "1000s", u: "OF GAMES", s: "PLAYED EVERY DAY" },
  { n: "GLOBAL", u: "RANKING", s: "TAKE ON THE WORLD" },
];

const TICKER: TickerRow[] = [
  { player: "NEONFOX", game: "Drop", score: 184220, ago: "2 min ago", color: "magenta" },
  { player: "PX_KAI", game: "Chomper", score: 96400, ago: "5 min ago", color: "yellow" },
  { player: "Z3R0COOL", game: "Invaders", score: 54190, ago: "8 min ago", color: "green" },
  { player: "VAULT_07", game: "Rocks", score: 41200, ago: "12 min ago", color: "cyan" },
  { player: "GLITCHA", game: "Block Buster", score: 28450, ago: "18 min ago", color: "cyan" },
  { player: "ARKADYA", game: "Serpentine", score: 7820, ago: "24 min ago", color: "green" },
  { player: "CYBER_LU", game: "Lily Hop", score: 18900, ago: "31 min ago", color: "yellow" },
];

const TOP_PLAYERS: TopPlayer[] = [
  { rank: 1, player: "NEONFOX", score: 312840 },
  { rank: 2, player: "PX_KAI", score: 248110 },
  { rank: 3, player: "M00NRYU", score: 196720 },
  { rank: 4, player: "VAULT_07", score: 154300 },
  { rank: 5, player: "GLITCHA", score: 138900 },
];

const PLAN_PERKS = [
  "Access to every game",
  "Global rankings and hall of fame",
  "No ads between games",
  "Save your scores",
  "New games every month",
  "Works in any browser",
];

const FAQS: Faq[] = [
  { q: "IS IT REALLY FREE?", a: "Yes. Arcade Vault is a non-profit project made out of love for the classics. There's no hidden \"premium\" tier." },
  { q: "DO I NEED AN ACCOUNT?", a: "No. You can play as a guest. If you want to save your score and show up in the rankings, sign up in 10 seconds." },
  { q: "HOW DO YOU SURVIVE WITHOUT CHARGING?", a: "It's a community project. If you like it, share it. That's the only currency we accept." },
];

const TOP_CLASS = [" top1", " top2", " top3"];

export default function Home() {
  return (
    <div className="home fade-in">
      <RevealObserver />

      {/* HERO */}
      <section className="home-hero">
        <FloatingSilhouettes />
        <div className="home-hero-inner">
          <div className="hero-eyebrow pixel neon-yellow">▸ INSERT COIN<span className="blink">_</span></div>
          <h1 className="home-title">
            <span className="line-1">THE CLASSIC</span>
            <span className="line-2">ARCADE IS</span>
            <span className="line-3">BACK</span>
          </h1>
          <p className="home-sub">
            Play the greatest classics right in your browser.<br />
            No downloads. No cost. Just fun.
          </p>
          <div className="home-ctas">
            <NavButton href="/games" className="btn xl pulse">▶  EXPLORE GAMES</NavButton>
            <NavButton href="/sign-in" className="btn xl magenta">✦  CREATE ACCOUNT</NavButton>
          </div>
          <div className="hero-scroll" aria-hidden="true">
            <span>SCROLL</span>
            <span className="arrow">▼</span>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="home-section reveal">
        <div className="section-head">
          <div className="kicker pixel neon-magenta">{"// 01"}</div>
          <h2 className="section-title">WHY ARCADE VAULT?</h2>
          <div className="section-rule"></div>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <div key={f.icon} className={"feature-card " + f.color} style={{ transitionDelay: (i * 80) + "ms" }}>
              <FeatureIcon kind={f.icon} />
              <div className="ft-title pixel">{f.title}</div>
              <div className="ft-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GAMES PREVIEW */}
      <section className="home-section reveal">
        <div className="section-head">
          <div className="kicker pixel neon-cyan">{"// 02"}</div>
          <h2 className="section-title">GAMES AVAILABLE NOW</h2>
          <div className="section-rule"></div>
        </div>
        <div className="mini-rail">
          {GAMES.slice(0, 6).map((g) => (
            <MiniCard key={g.id} game={g} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <NavButton href="/games" className="btn lg">SEE ALL GAMES →</NavButton>
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats reveal">
        <div className="stats-inner">
          {STATS.map((st, i) => (
            <div key={st.u} className="stat-block" style={{ transitionDelay: (i * 90) + "ms" }}>
              <div className="stat-n neon-yellow">{st.n}</div>
              <div className="stat-u pixel">{st.u}</div>
              <div className="stat-s">{st.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT ACTIVITY / LEADERBOARD */}
      <section className="home-section reveal">
        <div className="section-head">
          <div className="kicker pixel neon-yellow">{"// 03"}</div>
          <h2 className="section-title">LIVE ACTIVITY</h2>
          <div className="section-rule"></div>
        </div>
        <div className="activity-grid">
          <div className="activity-card">
            <div className="ac-head">
              <div className="ac-title pixel">▸ LATEST SCORES</div>
            </div>
            <div className="ticker">
              {TICKER.map((r, i) => (
                <div key={r.player} className="tick-row" style={{ animationDelay: (i * 60) + "ms" }}>
                  <span className={"tk-p neon-" + r.color}>{r.player}</span>
                  <span className="tk-mid">▸ {r.game}</span>
                  <span className="tk-s">+{formatNumber(r.score)}</span>
                  <span className="tk-t">{r.ago}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-card">
            <div className="ac-head">
              <div className="ac-title pixel neon-magenta">▸ TOP PLAYERS · TODAY</div>
              <NavButton href="/hall-of-fame" className="lb-link">VIEW HALL →</NavButton>
            </div>
            <div className="top-list">
              {TOP_PLAYERS.map((r, i) => (
                <div key={r.rank} className={"top-row" + (TOP_CLASS[i] ?? "")}>
                  <span className="tp-rk">#{String(r.rank).padStart(2, "0")}</span>
                  <span className="tp-bar"><span className="tp-fill" style={{ width: (100 - i * 16) + "%" }}></span></span>
                  <span className="tp-p">{r.player}</span>
                  <span className="tp-s">{formatNumber(r.score)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="home-section reveal">
        <div className="section-head">
          <div className="kicker pixel neon-green">{"// 04"}</div>
          <h2 className="section-title">PRICING</h2>
          <div className="section-rule"></div>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <div className="pc-label pixel">ONE PLAN</div>
            <div className="pc-name pixel">VAULT PLAYER</div>
            <div className="pc-amount">
              <span className="pc-amount-n">$0</span>
              <span className="pc-amount-u">/ FOREVER</span>
            </div>
            <div className="pc-tag">NO TRICKS · NO FINE PRINT</div>
            <ul className="pc-list">
              {PLAN_PERKS.map((perk) => (
                <li key={perk}>✔ {perk}</li>
              ))}
            </ul>
            <NavButton href="/sign-in" className="btn xl pulse" style={{ width: "100%" }}>START FREE →</NavButton>
            <div className="pc-foot">We don’t ask for a card. We never will.</div>
            <div className="pc-stamp pixel">FREE<br />PLAY</div>
          </div>

          <div className="pricing-faq">
            {FAQS.map((f) => (
              <div key={f.q} className="faq-item">
                <div className="faq-q pixel">{f.q}</div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-final reveal">
        <h2 className="final-title pixel">READY TO PLAY?</h2>
        <NavButton href="/games" className="btn xl pulse final-cta">INSERT COIN →</NavButton>
        <div className="final-tag">Free. No sign-up required. Start in seconds.</div>
      </section>
    </div>
  );
}
