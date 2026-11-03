import { addMessage } from "@/lib/store";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { validateContact } from "@/lib/validate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY = 20_000;

function json(body: unknown, status: number, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}

/** POST /api/contact  { name, email, type, message, website }  ("website" is a hidden spam trap) */
export async function POST(req: Request) {
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return json({ ok: false, error: "Send the message as JSON." }, 415);
  }

  const limit = rateLimit(clientKey(req));
  if (!limit.allowed) {
    return json({ ok: false, error: "Too many messages. Try again later." }, 429, { "Retry-After": String(limit.retryAfter) });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ ok: false, error: "Message is too large." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "That was not valid JSON." }, 400);
  }

  // Bots fill the hidden field. Pretend it worked and drop the message.
  if (body && typeof body === "object" && typeof (body as Record<string, unknown>).website === "string" && (body as Record<string, string>).website.trim() !== "") {
    return json({ ok: true, id: "ignored" }, 201);
  }

  const result = validateContact(body);
  if (!result.ok) return json({ ok: false, errors: result.errors }, 422);

  try {
    const saved = await addMessage(result.value);
    return json({ ok: true, id: saved.id }, 201);
  } catch (err) {
    console.error("[contact] could not save message:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "Could not save your message. Please email me directly." }, 500);
  }
}
