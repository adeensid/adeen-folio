import { experience } from "@/lib/data";
import { Txt } from "./Txt";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="h-exp" data-reveal>
      <div className="head">
        <h2 id="h-exp">Experience and education</h2>
      </div>
      <div className="tl">
        {experience.map((x) => (
          <article key={x.title}>
            <p className="eyebrow">{x.when}</p>
            <div>
              <h3>{x.title}</h3>
              <p className="org">{x.org}</p>
              <p className="stk">{x.stack}</p>
              {x.extra && (
                <p style={{ marginTop: 10 }}>
                  <Txt>{x.extra}</Txt>
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
