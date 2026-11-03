import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ContactInput } from "./validate";

export type StoredMessage = ContactInput & { id: string; createdAt: string };

/**
 * Messages go to Supabase when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set,
 * otherwise to data/messages.json (fine for local use or a server with a writable disk).
 */
function supabase() {
  const url = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) return null;
  const table = process.env.SUPABASE_TABLE || "messages";
  return {
    endpoint: `${url}/rest/v1/${encodeURIComponent(table)}`,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" } as Record<string, string>,
  };
}

function filePath() {
  return process.env.MESSAGES_FILE || path.join(process.cwd(), "data", "messages.json");
}

// Serialise file writes so two requests cannot overwrite each other.
let queue: Promise<unknown> = Promise.resolve();
function exclusive<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readFileStore(): Promise<StoredMessage[]> {
  try {
    const parsed = JSON.parse(await readFile(filePath(), "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeFileStore(list: StoredMessage[]) {
  const file = filePath();
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await rename(tmp, file);
}

type Row = { id: string; name: string; email: string; type: string; message: string; created_at: string };
const fromRow = (r: Row): StoredMessage => ({
  id: r.id,
  name: r.name,
  email: r.email,
  type: r.type as StoredMessage["type"],
  message: r.message,
  createdAt: r.created_at,
});

export async function addMessage(input: ContactInput): Promise<StoredMessage> {
  const msg: StoredMessage = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
  const sb = supabase();
  if (sb) {
    const res = await fetch(sb.endpoint, {
      method: "POST",
      headers: { ...sb.headers, Prefer: "return=minimal" },
      body: JSON.stringify({ id: msg.id, name: msg.name, email: msg.email, type: msg.type, message: msg.message, created_at: msg.createdAt }),
    });
    if (!res.ok) throw new Error(`Supabase insert failed with status ${res.status}`);
    return msg;
  }
  await exclusive(async () => {
    const list = await readFileStore();
    list.unshift(msg);
    await writeFileStore(list.slice(0, 2000));
  });
  return msg;
}

export async function listMessages(limit = 200): Promise<StoredMessage[]> {
  const sb = supabase();
  if (sb) {
    const res = await fetch(`${sb.endpoint}?select=*&order=created_at.desc&limit=${limit}`, { headers: sb.headers, cache: "no-store" });
    if (!res.ok) throw new Error(`Supabase read failed with status ${res.status}`);
    return ((await res.json()) as Row[]).map(fromRow);
  }
  return (await readFileStore()).slice(0, limit);
}

export async function deleteMessage(id: string): Promise<boolean> {
  const sb = supabase();
  if (sb) {
    const res = await fetch(`${sb.endpoint}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { ...sb.headers, Prefer: "return=representation" },
    });
    if (!res.ok) throw new Error(`Supabase delete failed with status ${res.status}`);
    return ((await res.json()) as unknown[]).length > 0;
  }
  return exclusive(async () => {
    const list = await readFileStore();
    const next = list.filter((m) => m.id !== id);
    if (next.length === list.length) return false;
    await writeFileStore(next);
    return true;
  });
}
