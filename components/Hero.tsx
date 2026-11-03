import Image from "next/image";
import { profile, projects } from "@/lib/data";

export function Hero() {
  return (
    <section className="hero" id="top" style={{ paddingBlock: "clamp(28px,5vw,64px) 0" }} aria-labelledby="h-hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="status">{profile.status}</span>
          <h1 id="h-hero">
            {profile.headline} <em>{profile.headlineEm}</em>
          </h1>
          <p className="sub">{profile.sub}</p>
          <div className="cta">
            <a className="btn solid" href="#work">
              See my work
            </a>
            <a className="btn ghost-light" href="#contact">
              Let&apos;s talk
            </a>
          </div>
        </div>
        <div className="portrait-col">
          <div className="portrait">
            <Image src="/img/adeen.jpg" alt={`Portrait of ${profile.name}`} width={900} height={1351} priority sizes="(max-width: 820px) 80vw, 380px" />
          </div>
        </div>
      </div>
      <div className="stats hero-bottom" role="list">
        <div role="listitem">
          <b>{projects.length}</b>
          <span>projects written up below</span>
        </div>
        <div role="listitem">
          <b>8 s → &lt;50 ms</b>
          <span>Shirtify forecast time after caching</span>
        </div>
        <div role="listitem">
          <b>2025</b>
          <span>web development internship</span>
        </div>
      </div>
    </section>
  );
}
