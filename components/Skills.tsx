"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { skills } from "@/lib/data";

export function Skills() {
  const [index, setIndex] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = skills[index];

  function select(i: number, focus = false) {
    setIndex(i);
    if (focus) refs.current[i]?.focus();
  }

  function onKey(e: KeyboardEvent) {
    const n = skills.length;
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (index + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (index - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    select(next, true);
  }

  return (
    <section id="skills" aria-labelledby="h-skills">
      <div className="head">
        <h2 id="h-skills">Skills and tools</h2>
        <p>Grouped by what I use them for.</p>
      </div>
      <div className="skills">
        <div className="tablist" role="tablist" aria-label="Skill groups" aria-orientation="vertical" onKeyDown={onKey}>
          {skills.map((s, i) => (
            <button
              key={s.group}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`tab-${i}`}
              className="tab"
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls="panel"
              tabIndex={i === index ? 0 : -1}
              onClick={() => select(i)}
            >
              {s.group}
            </button>
          ))}
        </div>
        <div className="panel" id="panel" role="tabpanel" tabIndex={0} aria-labelledby={`tab-${index}`}>
          <h3>{current.group}</h3>
          <p>{current.note}</p>
          <ul className="tags">
            {current.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
