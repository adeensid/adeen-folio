import { services } from "@/lib/data";

export function Services() {
  return (
    <section id="services" aria-labelledby="h-svc" data-reveal>
      <div className="head">
        <h2 id="h-svc">What I can do for you</h2>
        <p>Four areas, each backed by a project above.</p>
      </div>
      <div className="svc">
        {services.map((s) => (
          <article key={s.title}>
            <div className="n">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={s.icon} />
              </svg>
            </div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <p className="tech">{s.tech}</p>
            {s.project && (
              <a className="mini-btn" href={`#p-${s.project}`} style={{ color: "var(--link)", borderColor: "var(--line)", alignSelf: "flex-start", marginTop: 6, textDecoration: "none" }}>
                See the project
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
