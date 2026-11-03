import { filters, projects } from "@/lib/data";

export const dynamic = "force-dynamic";

/** GET /api/projects          -> every project
 *  GET /api/projects?category=web|mobile|ai -> only that category */
export async function GET(req: Request) {
  const category = new URL(req.url).searchParams.get("category");
  const valid = filters.some((f) => f.id === category && f.id !== "all");
  const list = valid ? projects.filter((p) => p.cats.includes(category as "web" | "mobile" | "ai")) : projects;
  return Response.json({ count: list.length, projects: list }, { headers: { "Cache-Control": "public, max-age=300" } });
}
