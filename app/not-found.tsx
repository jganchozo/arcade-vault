import Link from "next/link";

export default function NotFound() {
  return (
    <section className="av-hero fade-in">
      <h1 className="flicker">404</h1>
      <div className="sub">
        SCREEN NOT FOUND <span className="blink">_</span>
      </div>
      <p style={{ color: "var(--ink-dim)", margin: "24px auto 32px", maxWidth: "48ch" }}>
        This address doesn’t exist in the vault. Head back to the library to pick a game.
      </p>
      <Link href="/games" className="btn lg">
        BACK TO LIBRARY
      </Link>
    </section>
  );
}
