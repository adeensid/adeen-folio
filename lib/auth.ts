import { createHash, timingSafeEqual } from "node:crypto";

function digest(s: string) {
  return createHash("sha256").update(s).digest();
}

/** Returns "disabled" when no usable ADMIN_TOKEN is set, otherwise whether the request is authorised. */
export function checkAdmin(req: Request): "ok" | "denied" | "disabled" {
  const token = process.env.ADMIN_TOKEN || "";
  if (token.length < 16) return "disabled";
  const header = req.headers.get("authorization") || "";
  const given = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!given) return "denied";
  return timingSafeEqual(digest(given), digest(token)) ? "ok" : "denied";
}
