"use client";

import { useState, type FormEvent } from "react";
import { contactTypes, profile } from "@/lib/data";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "sent" | "failed";

export function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [problem, setProblem] = useState("");
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    setTimeout(() => setCopied(""), 1800);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      type: String(data.get("type") || ""),
      message: String(data.get("message") || ""),
      website: String(data.get("website") || ""),
    };

    // Quick checks in the browser. The server checks everything again.
    const local: Errors = {};
    if (payload.name.trim().length < 2) local.name = "Enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email.trim())) local.email = "Enter an email address like name@company.com.";
    if (payload.message.trim().length < 10) local.message = "Write at least a sentence so I know what you need.";
    setErrors(local);
    setProblem("");
    if (Object.keys(local).length) {
      setStatus("idle");
      // Focus the first field with a problem. Read from `local` because React has not re-rendered yet.
      document.getElementById(local.name ? "f-name" : local.email ? "f-email" : "f-msg")?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
      if (res.status === 422 && body.errors) {
        setErrors(body.errors);
        setStatus("idle");
        return;
      }
      setProblem(body.error || "Something went wrong. Please try again.");
      setStatus("failed");
    } catch {
      setProblem("Could not reach the server. Check your connection or email me directly.");
      setStatus("failed");
    }
  }

  return (
    <section id="contact" aria-labelledby="h-contact">
      <div className="contact-card">
        <div>
          <p className="eyebrow" style={{ color: "var(--hero-muted)" }}>
            Contact
          </p>
          <h2 id="h-contact" style={{ marginTop: 14 }}>
            Have something to <em>build?</em>
          </h2>
          <p className="lead">Send a few lines about the project and your timeline. I&apos;ll reply with whether I&apos;m the right fit.</p>
          <div className="direct">
            <div className="row">
              <span className="k">Email</span>
              <span className="v">{profile.email}</span>
              <button className="mini-btn" type="button" onClick={copyEmail}>
                {copied === "ok" ? "Copied" : copied === "fail" ? "Press Ctrl+C" : "Copy"}
              </button>
            </div>
            <div className="row">
              <span className="k">GitHub</span>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                github.com/adeensid<span className="sr"> (opens in a new tab)</span>
              </a>
            </div>
            <div className="row">
              <span className="k">LinkedIn</span>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                linkedin.com/adeensid<span className="sr"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>

        {status === "sent" ? (
          <div className="form-done" role="status" style={{ background: "var(--surface)", color: "var(--fg)", borderRadius: 24, padding: "clamp(20px,3vw,32px)", display: "grid", gap: 14, alignContent: "start" }}>
            <h3 style={{ fontSize: "1.6rem" }}>Message received.</h3>
            <p>Thanks. I read every message and will reply by email.</p>
            <button className="btn line" type="button" style={{ justifySelf: "start" }} onClick={() => setStatus("idle")}>
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate aria-label="Contact form">
            <div className="field">
              <label htmlFor="f-name">Your name</label>
              <input id="f-name" name="name" autoComplete="name" required aria-invalid={errors.name ? true : undefined} aria-describedby="e-name" />
              <div className="err" id="e-name" aria-live="polite">
                {errors.name}
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-email">Your email</label>
              <input id="f-email" name="email" type="email" autoComplete="email" required aria-invalid={errors.email ? true : undefined} aria-describedby="e-email" />
              <div className="err" id="e-email" aria-live="polite">
                {errors.email}
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-type">I&apos;m reaching out about</label>
              <select id="f-type" name="type" defaultValue={contactTypes[0]}>
                {contactTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-msg">Message</label>
              <textarea id="f-msg" name="message" required aria-invalid={errors.message ? true : undefined} aria-describedby="e-msg" />
              <div className="err" id="e-msg" aria-live="polite">
                {errors.message}
              </div>
            </div>
            {/* Spam trap. People never see or fill this. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
              <label htmlFor="f-web">Leave this empty</label>
              <input id="f-web" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {status === "failed" && (
              <p className="err-banner" role="alert">
                {problem}
              </p>
            )}
            <button className="btn dark" type="submit" disabled={status === "sending"} style={{ justifySelf: "start" }}>
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
      <footer>
        <span>© 2026 {profile.name} · Islamabad</span>
        <a href="#top">Back to top</a>
      </footer>
    </section>
  );
}
