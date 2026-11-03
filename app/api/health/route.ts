export const dynamic = "force-dynamic";

/** GET /api/health -> quick check that the server is up and which storage and admin mode are active. */
export async function GET() {
  return Response.json(
    {
      ok: true,
      storage: process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "file",
      adminEnabled: (process.env.ADMIN_TOKEN || "").length >= 16,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
