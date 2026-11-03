"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type Msg = { id: string; name: string; email: string; type: string; message: string; createdAt: string };

const KEY = "as-admin-token";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<Msg[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (t: string) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/messages", { headers: { Authorization: `Bearer ${t}` }, cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessages(null);
        setError(body.error || "Could not load messages.");
        if (res.status === 401) sessionStorage.removeItem(KEY);
        return;
      }
      setMessages(body.messages as Msg[]);
      sessionStorage.setItem(KEY, t);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(KEY);
      if (saved) {
        setToken(saved);
        load(saved);
      }
    } catch {}
  }, [load]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (token.trim()) load(token.trim());
  }

  async function remove(id: string) {
    const res = await fetch(`/api/messages?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setMessages((m) => (m ? m.filter((x) => x.id !== id) : m));
    else setError("Could not delete that message.");
  }

  function signOut() {
    sessionStorage.removeItem(KEY);
    setMessages(null);
    setToken("");
  }

  return (
    <main className="admin" style={{ paddingInline: "max(16px, env(safe-area-inset-left, 0px))" }}>
      <h1>Messages</h1>
      <p style={{ color: "var(--muted)" }}>Everything sent through the contact form, newest first.</p>

      {messages === null ? (
        <form className="bar" onSubmit={onSubmit} style={{ background: "transparent", padding: 0 }}>
          <div className="field">
            <label htmlFor="token">Admin token</label>
            <input id="token" type="password" autoComplete="current-password" value={token} onChange={(e) => setToken(e.target.value)} />
          </div>
          <button className="btn dark" type="submit" disabled={busy}>
            {busy ? "Checking…" : "Open inbox"}
          </button>
        </form>
      ) : (
        <div className="bar">
          <span>
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </span>
          <button className="btn line" type="button" onClick={() => load(token)} disabled={busy}>
            Refresh
          </button>
          <button className="btn line" type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      )}

      {error && (
        <p className="err-banner" role="alert">
          {error}
        </p>
      )}

      {messages?.length === 0 && <p className="empty-note">No messages yet.</p>}
      {messages?.map((m) => (
        <article className="msg" key={m.id}>
          <header>
            <span>{new Date(m.createdAt).toLocaleString()}</span>
            <span>{m.type}</span>
          </header>
          <h3>{m.name}</h3>
          <p style={{ marginBottom: 8 }}>
            <a href={`mailto:${m.email}`}>{m.email}</a>
          </p>
          <pre>{m.message}</pre>
          <div className="acts">
            <a className="btn solid" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}>
              Reply
            </a>
            <button className="btn line" type="button" onClick={() => remove(m.id)}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </main>
  );
}
