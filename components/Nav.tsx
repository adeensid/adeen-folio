"use client";

import { useEffect, useState } from "react";

const LINKS = [
  ["about", "About"],
  ["work", "Work"],
  ["services", "Services"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["contact", "Contact"],
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const els = ["top", ...LINKS.map(([id]) => id)]
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActive(entry.target.id === "top" ? "" : entry.target.id);
        }),
      { rootMargin: "-35% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const saved = document.documentElement.getAttribute("data-theme");
    setDark(saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  function toggleTheme() {
    const next = dark ? "light" : "dark";
    setDark(next === "dark");
    const root = document.documentElement;
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("as-theme", next);
    } catch {}
  }

  return (
    <header className="nav">
      <div className="pill">
        <a className="logo" href="#top" aria-label="Adeen Siddiqui, home">
          adeen<i>.</i>
        </a>
        <nav className={`links${open ? " open" : ""}`} id="menu" aria-label="Main" onClick={(e) => (e.target as HTMLElement).tagName === "A" && setOpen(false)}>
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="tools">
          <button className="icon-btn" type="button" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} theme`} aria-pressed={dark}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {dark ? <circle cx="12" cy="12" r="4" /> : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />}
              {dark && <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />}
            </svg>
          </button>
          <a className="btn solid hire" href="#contact">
            Hire me
          </a>
          <button
            className="icon-btn burger"
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
