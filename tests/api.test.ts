/**
 * Calls the real route handlers with standard Request objects.
 * Run with: npm test
 */
import assert from "node:assert/strict";
import { createServer, type IncomingMessage, type Server } from "node:http";
import { mkdtempSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

const dir = mkdtempSync(path.join(tmpdir(), "portfolio-test-"));
process.env.MESSAGES_FILE = path.join(dir, "messages.json");
const TOKEN = "test-token-0123456789abcdef";

import * as projectsRoute from "../app/api/projects/route";
import * as contactRoute from "../app/api/contact/route";
import * as messagesRoute from "../app/api/messages/route";
import * as healthRoute from "../app/api/health/route";
import { resetRateLimit } from "../lib/rate-limit";

const url = (p: string) => `http://localhost${p}`;
const post = (body: unknown, headers: Record<string, string> = { "content-type": "application/json" }, ip = "1.2.3.4") =>
  contactRoute.POST(new Request(url("/api/contact"), { method: "POST", headers: { ...headers, "x-forwarded-for": ip }, body: typeof body === "string" ? body : JSON.stringify(body) }));
const auth = (t = TOKEN) => ({ authorization: `Bearer ${t}` });
const valid = { name: "Sara Khan", email: "sara@example.com", type: "A freelance project", message: "We need a small web app built next month." };

beforeEach(() => {
  resetRateLimit();
  process.env.ADMIN_TOKEN = TOKEN;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

describe("GET /api/projects", () => {
  it("returns every project", async () => {
    const body = await (await projectsRoute.GET(new Request(url("/api/projects")))).json();
    assert.equal(body.count, 6);
    assert.equal(body.projects[0].id, "shirtify");
  });
  it("filters by category", async () => {
    const body = await (await projectsRoute.GET(new Request(url("/api/projects?category=mobile")))).json();
    assert.deepEqual(body.projects.map((p: { id: string }) => p.id), ["medicine-app"]);
  });
  it("ignores an unknown category", async () => {
    const body = await (await projectsRoute.GET(new Request(url("/api/projects?category=bogus")))).json();
    assert.equal(body.count, 6);
  });
});

describe("POST /api/contact", () => {
  it("rejects a non-JSON content type with 415", async () => {
    assert.equal((await post("name=x", { "content-type": "text/plain" })).status, 415);
  });
  it("rejects malformed JSON with 400", async () => {
    assert.equal((await post("{oops")).status, 400);
  });
  it("rejects invalid fields with 422 and field errors", async () => {
    const res = await post({ name: "A", email: "nope", message: "short" });
    assert.equal(res.status, 422);
    const body = await res.json();
    assert.ok(body.errors.name && body.errors.email && body.errors.message);
  });
  it("rejects a huge body with 413", async () => {
    assert.equal((await post({ ...valid, message: "x".repeat(25000) })).status, 413);
  });
  it("rejects a message over 4000 characters with 422", async () => {
    const res = await post({ ...valid, message: "x".repeat(4001) });
    assert.equal(res.status, 422);
  });
  it("silently drops honeypot submissions", async () => {
    const before = await (await messagesRoute.GET(new Request(url("/api/messages"), { headers: auth() }))).json();
    const res = await post({ ...valid, website: "http://spam.example" });
    assert.equal(res.status, 201);
    assert.equal((await res.json()).id, "ignored");
    const after = await (await messagesRoute.GET(new Request(url("/api/messages"), { headers: auth() }))).json();
    assert.equal(after.count, before.count);
  });
  it("stores a valid message and strips control characters", async () => {
    const res = await post({ ...valid, name: "Sara\u0000 Khan" }, undefined, "9.9.9.9");
    assert.equal(res.status, 201);
    const { id } = await res.json();
    const list = await (await messagesRoute.GET(new Request(url("/api/messages"), { headers: auth() }))).json();
    const saved = list.messages.find((m: { id: string }) => m.id === id);
    assert.equal(saved.name, "Sara Khan");
    assert.equal(saved.type, "A freelance project");
    assert.ok(existsSync(process.env.MESSAGES_FILE!));
  });
  it("falls back to 'Something else' for an unknown type", async () => {
    const { id } = await (await post({ ...valid, type: "Hack" }, undefined, "8.8.8.8")).json();
    const list = await (await messagesRoute.GET(new Request(url("/api/messages"), { headers: auth() }))).json();
    assert.equal(list.messages.find((m: { id: string }) => m.id === id).type, "Something else");
  });
  it("rate limits the sixth message from one address with 429", async () => {
    for (let i = 0; i < 5; i++) assert.equal((await post(valid, undefined, "7.7.7.7")).status, 201);
    const res = await post(valid, undefined, "7.7.7.7");
    assert.equal(res.status, 429);
    assert.ok(Number(res.headers.get("retry-after")) > 0);
    assert.equal((await post(valid, undefined, "6.6.6.6")).status, 201);
  });
});

describe("/api/messages", () => {
  it("returns 401 without a token", async () => {
    assert.equal((await messagesRoute.GET(new Request(url("/api/messages")))).status, 401);
  });
  it("returns 401 with a wrong token", async () => {
    assert.equal((await messagesRoute.GET(new Request(url("/api/messages"), { headers: auth("wrong-token-wrong-token") }))).status, 401);
  });
  it("returns 503 when ADMIN_TOKEN is not set", async () => {
    delete process.env.ADMIN_TOKEN;
    assert.equal((await messagesRoute.GET(new Request(url("/api/messages"), { headers: auth() }))).status, 503);
  });
  it("returns 503 when ADMIN_TOKEN is too short", async () => {
    process.env.ADMIN_TOKEN = "short";
    assert.equal((await messagesRoute.GET(new Request(url("/api/messages"), { headers: auth("short") }))).status, 503);
  });
  it("lists and deletes messages", async () => {
    const { id } = await (await post(valid, undefined, "5.5.5.5")).json();
    const del = await messagesRoute.DELETE(new Request(url(`/api/messages?id=${id}`), { method: "DELETE", headers: auth() }));
    assert.equal(del.status, 200);
    const again = await messagesRoute.DELETE(new Request(url(`/api/messages?id=${id}`), { method: "DELETE", headers: auth() }));
    assert.equal(again.status, 404);
    const list = await (await messagesRoute.GET(new Request(url("/api/messages"), { headers: auth() }))).json();
    assert.equal(list.messages.some((m: { id: string }) => m.id === id), false);
  });
  it("needs a token and an id to delete", async () => {
    assert.equal((await messagesRoute.DELETE(new Request(url("/api/messages?id=x"), { method: "DELETE" }))).status, 401);
    assert.equal((await messagesRoute.DELETE(new Request(url("/api/messages"), { method: "DELETE", headers: auth() }))).status, 400);
  });
  it("keeps the file valid JSON after many concurrent writes", async () => {
    await Promise.all(Array.from({ length: 20 }, (_, i) => post({ ...valid, name: `Person ${i}` }, undefined, `10.0.0.${i}`)));
    const parsed = JSON.parse(readFileSync(process.env.MESSAGES_FILE!, "utf8"));
    assert.ok(parsed.filter((m: { name: string }) => m.name.startsWith("Person ")).length >= 20);
  });
});

describe("GET /api/health", () => {
  it("reports storage mode and admin state", async () => {
    const body = await (await healthRoute.GET()).json();
    assert.deepEqual(body, { ok: true, storage: "file", adminEnabled: true });
  });
});

describe("Supabase storage (against a local mock of the REST API)", () => {
  let server: Server;
  let rows: Record<string, unknown>[] = [];
  const seen: { method: string; url: string; apikey?: string; auth?: string; prefer?: string; body?: string }[] = [];

  const readBody = (req: IncomingMessage) => new Promise<string>((r) => { let s = ""; req.on("data", (c) => (s += c)); req.on("end", () => r(s)); });

  beforeEach(async () => {
    rows = [];
    seen.length = 0;
    server = createServer(async (req, res) => {
      const body = await readBody(req);
      seen.push({ method: req.method!, url: req.url!, apikey: req.headers.apikey as string, auth: req.headers.authorization, prefer: req.headers.prefer as string, body });
      res.setHeader("content-type", "application/json");
      if (req.method === "POST") { rows.unshift(JSON.parse(body)); res.statusCode = 201; return res.end(); }
      if (req.method === "GET") return res.end(JSON.stringify(rows));
      if (req.method === "DELETE") {
        const id = new URL(req.url!, "http://x").searchParams.get("id")!.replace("eq.", "");
        const hit = rows.filter((r) => r.id === id);
        rows = rows.filter((r) => r.id !== id);
        return res.end(JSON.stringify(hit));
      }
      res.statusCode = 405; res.end();
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    const { port } = server.address() as { port: number };
    process.env.SUPABASE_URL = `http://127.0.0.1:${port}/`;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
  });
  afterEach(() => new Promise<void>((r) => server.close(() => r())));

  it("reports supabase as the storage mode", async () => {
    assert.equal((await (await healthRoute.GET()).json()).storage, "supabase");
  });
  it("inserts, lists and deletes through the REST endpoints with the right headers", async () => {
    const created = await post(valid, undefined, "4.4.4.4");
    assert.equal(created.status, 201);
    const { id } = await created.json();
    assert.equal(seen[0].method, "POST");
    assert.equal(seen[0].url, "/rest/v1/messages");
    assert.equal(seen[0].apikey, "service-key");
    assert.equal(seen[0].auth, "Bearer service-key");
    assert.equal(seen[0].prefer, "return=minimal");
    const sent = JSON.parse(seen[0].body!);
    assert.equal(sent.id, id);
    assert.equal(sent.email, valid.email);
    assert.ok(sent.created_at);

    const list = await (await messagesRoute.GET(new Request(url("/api/messages"), { headers: auth() }))).json();
    assert.equal(list.messages[0].createdAt, sent.created_at);
    assert.match(seen[1].url, /select=\*&order=created_at\.desc&limit=200/);

    const del = await messagesRoute.DELETE(new Request(url(`/api/messages?id=${id}`), { method: "DELETE", headers: auth() }));
    assert.equal(del.status, 200);
    assert.equal(seen[2].url, `/rest/v1/messages?id=eq.${id}`);
  });
  it("answers 500 without leaking details when Supabase fails", async () => {
    await new Promise<void>((r) => server.close(() => r()));
    const res = await post(valid, undefined, "3.3.3.3");
    assert.equal(res.status, 500);
    const body = await res.json();
    assert.equal(body.ok, false);
    assert.ok(!JSON.stringify(body).includes("service-key"));
    server = createServer(); await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  });
});
