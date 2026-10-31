import Link from "next/link";

export default function NotFound() {
  return (
    <section className="av-hero fade-in">
      <h1 className="flicker">404</h1>
      <div className="sub">
        PANTALLA NO ENCONTRADA <span className="blink">_</span>
      </div>
      <p style={{ color: "var(--ink-dim)", margin: "24px auto 32px", maxWidth: "48ch" }}>
        Esta dirección no existe en el vault. Vuelve a la biblioteca para elegir un juego.
      </p>
      <Link href="/games" className="btn lg">
        VOLVER A LA BIBLIOTECA
      </Link>
    </section>
  );
}
