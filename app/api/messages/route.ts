import { checkAdmin } from "@/lib/auth";
import { deleteMessage, listMessages } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };

function guard(req: Request): Response | null {
  const state = checkAdmin(req);
  if (state === "disabled") return Response.json({ ok: false, error: "Admin is disabled. Set ADMIN_TOKEN (16+ characters)." }, { status: 503, headers: noStore });
  if (state === "denied") return Response.json({ ok: false, error: "Wrong or missing token." }, { status: 401, headers: { ...noStore, "WWW-Authenticate": "Bearer" } });
  return null;
}

/** GET /api/messages  (Authorization: Bearer <ADMIN_TOKEN>) */
export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  try {
    const messages = await listMessages();
    return Response.json({ ok: true, count: messages.length, messages }, { headers: noStore });
  } catch (err) {
    console.error("[messages] read failed:", err instanceof Error ? err.message : err);
    return Response.json({ ok: false, error: "Could not read messages." }, { status: 500, headers: noStore });
  }
}

/** DELETE /api/messages?id=<message id>  (Authorization: Bearer <ADMIN_TOKEN>) */
export async function DELETE(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!id) return Response.json({ ok: false, error: "Missing id." }, { status: 400, headers: noStore });
  try {
    const removed = await deleteMessage(id);
    return Response.json({ ok: removed }, { status: removed ? 200 : 404, headers: noStore });
  } catch (err) {
    console.error("[messages] delete failed:", err instanceof Error ? err.message : err);
    return Response.json({ ok: false, error: "Could not delete the message." }, { status: 500, headers: noStore });
  }
}
