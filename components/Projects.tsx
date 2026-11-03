"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { filters, projects, type Project } from "@/lib/data";
import { Txt } from "./Txt";

const HASH_PREFIX = "#p-";

export function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const visible = projects.filter((p) => filter === "all" || p.cats.includes(filter));
  const project = projects.find((p) => p.id === openId) || null;

  const open = useCallback((id: string) => {
    if (!dialogRef.current?.open) lastTrigger.current = document.activeElement as HTMLElement | null;
    setOpenId(id);
    history.replaceState(null, "", `${HASH_PREFIX}${id}`);
  }, []);

  // Open from a link like /#p-shirtify, both on load and when the hash changes later.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash;
      if (h.startsWith(HASH_PREFIX)) {
        const id = h.slice(HASH_PREFIX.length);
        if (projects.some((p) => p.id === id)) setOpenId(id);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Keep the native dialog in step with state.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (openId && !d.open) d.showModal();
    if (!openId && d.open) d.close();
    if (openId) d.scrollTop = 0;
  }, [openId]);

  function onClose() {
    setOpenId(null);
    if (window.location.hash.startsWith(HASH_PREFIX)) history.replaceState(null, "", "#work");
    lastTrigger.current?.focus();
  }

  const idx = project ? projects.findIndex((p) => p.id === project.id) : -1;
  const prev = idx >= 0 ? projects[(idx - 1 + projects.length) % projects.length] : null;
  const next = idx >= 0 ? projects[(idx + 1) % projects.length] : null;

  return (
    <section id="work" aria-labelledby="h-work">
      <div className="head">
        <h2 id="h-work">Selected work</h2>
        <p>Open a project to see the challenge, my role, what I built and how the pieces connect.</p>
      </div>

      <div className="filters" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button key={f.id} type="button" className="chip-btn" aria-pressed={filter === f.id} data-f={f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="cards">
        {visible.map((p) => (
          <ProjectCard key={p.id} p={p} onOpen={() => open(p.id)} />
        ))}
      </div>
      {visible.length === 0 && <p className="empty-note">No projects in this category yet.</p>}
      <p className="sr" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      <dialog ref={dialogRef} id="dlg" aria-labelledby="dlg-title" onClose={onClose} onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}>
        {project && (
          <>
            <div className={`dlg-cover ${project.cover}`}>
              <button className="icon-btn dlg-close" type="button" aria-label="Close project details" onClick={() => dialogRef.current?.close()}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <span className="eyebrow">{project.kicker}</span>
              <h2 id="dlg-title">{project.name}</h2>
            </div>
            <div className="dlg-body">
              <Block title="Challenge">
                <Txt>{project.challenge}</Txt>
              </Block>
              <Block title="My role">
                <Txt>{project.role}</Txt>
              </Block>
              <Block title="What I did">
                <ul>
                  {project.did.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Block>
              <Block title="Outcome">
                <Txt>{project.outcome}</Txt>
              </Block>
              {project.flow && (
                <Block title="How it fits">
                  <ol className="flow">
                    {project.flow.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ol>
                </Block>
              )}
              <Block title="Stack">
                <ul className="tags" style={{ paddingLeft: 0 }}>
                  {project.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </Block>
              {project.shot && (
                <Block title="Interface preview">
                  <img className="shot-image" src={project.shot} alt={`${project.name} interface preview`} />
                </Block>
              )}
              {project.note && (
                <Block title="Note">
                  <Txt>{project.note}</Txt>
                </Block>
              )}
              <div className="dlg-nav">
                {prev && (
                  <button className="btn line" type="button" onClick={() => open(prev.id)}>
                    ← {prev.name}
                  </button>
                )}
                {project.links.map((l) => (
                  <a key={l.href + l.label} className="btn solid" href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                ))}
                {next && (
                  <button className="btn line" type="button" onClick={() => open(next.id)}>
                    {next.name} →
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="block">
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
}

function ProjectCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <button type="button" className="card" data-id={p.id} aria-haspopup="dialog" aria-label={`${p.name}. Open project details.`} onClick={onOpen}>
      <div className={`cover ${p.cover}`}>
        {p.coverImage ? (
          <img className="cover-image" src={p.coverImage} alt="" />
        ) : (
          <>
            <span className="mark">{p.mark}</span>
            <span className="tagline">{p.kicker.split(" · ")[0]}</span>
          </>
        )}
      </div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <p>{p.blurb}</p>
        <div className="mini">
          {p.stack.slice(0, 4).map((s) => (
            <span key={s}>{s}</span>
          ))}
          {p.stack.length > 4 && <span>+{p.stack.length - 4}</span>}
        </div>
        <span className="more">View project →</span>
      </div>
    </button>
  );
}
