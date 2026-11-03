export function About() {
  return (
    <section id="about" aria-labelledby="h-about">
      <div className="about-grid">
        <div>
          <p className="eyebrow">About</p>
          <h2 id="h-about" className="sr">
            About me
          </h2>
          <p className="big" style={{ marginTop: 14 }}>
            I like work where the interface and the system behind it <em>both have to be right.</em>
          </p>
        </div>
        <div>
          <p>
            I studied software engineering at Capital University of Science and Technology (2022 to 2026) and interned at Empeer DevLab in 2025, building with React, TypeScript, Node.js and MongoDB.
          </p>
          <p>
            My final year project, Shirtify, joins a design editor, an AI try-on, a payments-safe checkout and a demand forecast. Most of the bugs I fixed on it lived where two of those parts met.
          </p>
          <dl className="facts" style={{ marginTop: 24 }}>
            <div>
              <dt>Based in</dt>
              <dd>Islamabad, Pakistan</dd>
            </div>
            <div>
              <dt>Degree</dt>
              <dd>B.S. Software Engineering</dd>
            </div>
            <div>
              <dt>Now</dt>
              <dd>Building a voice sales agent for a client</dd>
            </div>
            <div>
              <dt>Learning</dt>
              <dd>Cloud, CI/CD and test automation</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
