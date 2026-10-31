"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/components/session-provider";

type Section = "library" | "hall-of-fame" | "sign-in";

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useSession();
  const [open, setOpen] = useState(false);

  // Game detail and player pages belong to the library section.
  const isActive = (section: Section) => {
    if (section === "library") return pathname === "/" || pathname.startsWith("/games");
    return pathname === `/${section}`;
  };
  const activeClass = (section: Section) => (isActive(section) ? "active" : "");
  const close = () => setOpen(false);

  return (
    <>
      <nav className="av-nav">
        <Link href="/" className="logo" onClick={close}>
          <div className="logo-mark"></div>
          <div className="logo-text neon-cyan">
            ARCADE <span className="neon-magenta">VAULT</span>
          </div>
        </Link>
        <div className="links">
          <Link href="/" className={activeClass("library")}>Biblioteca</Link>
          <Link href="/hall-of-fame" className={activeClass("hall-of-fame")}>Salón de la Fama</Link>
        </div>
        <div className="spacer"></div>
        <div className="coin-counter">
          <span className="coin"></span>
          <span>CRÉDITOS · 03</span>
        </div>
        {user ? (
          <button className="btn ghost auth-btn" onClick={signOut}>{user.name} ▾</button>
        ) : (
          <button className="btn auth-btn" onClick={() => router.push("/sign-in")}>Iniciar Sesión</button>
        )}
        <button className="btn ghost hamburger" onClick={() => setOpen(true)} aria-label="Menú">≡</button>
      </nav>

      <div className={"av-mobile-backdrop" + (open ? " open" : "")} onClick={close}></div>
      <aside className={"av-mobile-panel" + (open ? " open" : "")}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>MENÚ</div>
        <Link href="/" className={activeClass("library")} onClick={close}>Biblioteca</Link>
        <Link href="/hall-of-fame" className={activeClass("hall-of-fame")} onClick={close}>Salón de la Fama</Link>
        <Link href="/sign-in" className={activeClass("sign-in")} onClick={close}>{user ? "Cuenta" : "Iniciar Sesión"}</Link>
        <div style={{ flex: 1 }}></div>
        <div className="pixel" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>CRÉDITOS · 03</div>
      </aside>
    </>
  );
}
