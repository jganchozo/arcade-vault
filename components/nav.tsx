"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/components/session-provider";

type Section = "home" | "library" | "hall-of-fame" | "about" | "sign-in";

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useSession();
  const [open, setOpen] = useState(false);

  // Game detail and player pages belong to the library section.
  const isActive = (section: Section) => {
    if (section === "home") return pathname === "/";
    if (section === "library") return pathname === "/games" || pathname.startsWith("/games/");
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
          <Link href="/" className={activeClass("home")}>Home</Link>
          <Link href="/games" className={activeClass("library")}>Library</Link>
          <Link href="/hall-of-fame" className={activeClass("hall-of-fame")}>Hall of Fame</Link>
          <Link href="/about" className={activeClass("about")}>About</Link>
        </div>
        <div className="spacer"></div>
        <div className="coin-counter">
          <span className="coin"></span>
          <span>CREDITS · 03</span>
        </div>
        {user ? (
          <button className="btn ghost auth-btn" onClick={signOut}>{user.name} ▾</button>
        ) : (
          <button className="btn auth-btn" onClick={() => router.push("/sign-in")}>Sign In</button>
        )}
        <button className="btn ghost hamburger" onClick={() => setOpen(true)} aria-label="Menu">≡</button>
      </nav>

      <div className={"av-mobile-backdrop" + (open ? " open" : "")} onClick={close}></div>
      <aside className={"av-mobile-panel" + (open ? " open" : "")}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>MENU</div>
        <Link href="/" className={activeClass("home")} onClick={close}>Home</Link>
        <Link href="/games" className={activeClass("library")} onClick={close}>Library</Link>
        <Link href="/hall-of-fame" className={activeClass("hall-of-fame")} onClick={close}>Hall of Fame</Link>
        <Link href="/about" className={activeClass("about")} onClick={close}>About</Link>
        <Link href="/sign-in" className={activeClass("sign-in")} onClick={close}>{user ? "Account" : "Sign In"}</Link>
        <div style={{ flex: 1 }}></div>
        <div className="pixel" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>CREDITS · 03</div>
      </aside>
    </>
  );
}
