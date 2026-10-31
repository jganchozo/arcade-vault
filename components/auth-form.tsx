"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/components/session-provider";

// Mock auth: any submit signs in with the typed username; nothing is checked or sent.
export function AuthForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const [tab, setTab] = useState<"in" | "up">("in");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const enter = (name: string | null) => {
    signIn(name ? { name } : null);
    router.push("/");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    enter((username || "PLAYER1").toUpperCase().slice(0, 10));
  };

  return (
    <div className="av-auth-wrap fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="mark"></div>
          <h2 className="neon-cyan">ARCADE VAULT</h2>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.16em", marginTop: 6 }}>
            SYSTEM ACCESS · v2.6
          </div>
        </div>

        <div className="auth-tabs">
          <button className={tab === "in" ? "on" : ""} onClick={() => setTab("in")}>SIGN IN</button>
          <button className={tab === "up" ? "on" : ""} onClick={() => setTab("up")}>CREATE ACCOUNT</button>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="auth-user">Username</label>
            <input id="auth-user" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="px_kai" />
          </div>
          {tab === "up" && (
            <div className="field slide-in">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@vault.gg"
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="auth-pass">Password</label>
            <input
              id="auth-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="btn lg" type="submit" style={{ width: "100%", marginTop: 8 }}>
            {tab === "in" ? "ENTER THE VAULT" : "CREATE & PLAY"}
          </button>
        </form>

        <button className="btn ghost" style={{ width: "100%", marginTop: 10 }} onClick={() => enter(null)}>
          PLAY AS GUEST
        </button>

        <div className="auth-divider">OR CONTINUE WITH</div>
        <div className="social">
          <button className="btn ghost" type="button">◆  GOOGLE</button>
          <button className="btn ghost" type="button">▣  GITHUB</button>
        </div>

        <div style={{ marginTop: 18, textAlign: "center", fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.1em" }}>
          BY ENTERING YOU ACCEPT THE ARCADE HALL TERMS
        </div>
      </div>
    </div>
  );
}
