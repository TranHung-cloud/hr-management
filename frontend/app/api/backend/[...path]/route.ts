import { cookies } from "next/headers";
import { backendUrl, problem, sameOrigin } from "@/lib/server/backend";
import { readSession, SESSION_COOKIE } from "@/lib/server/session";

const uuid = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
function allowed(method: string, path: string) {
  if (method === "GET") return /^(dashboard|lookups|pipeline|applications|interviews)$/.test(path) || new RegExp(`^interviews/${uuid}/${uuid}/${uuid}$`).test(path);
  if (method === "POST") return new RegExp(`^applications/${uuid}/${uuid}/(stages|interviews)$`).test(path);
  return method === "PUT" && (new RegExp(`^interviews/${uuid}/${uuid}/${uuid}/(schedule|feedback)$`).test(path) || new RegExp(`^applications/${uuid}/${uuid}/status$`).test(path));
}
async function proxy(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (request.method !== "GET" && !sameOrigin(request)) return problem(403, "Nguồn yêu cầu không hợp lệ.");
  const session = readSession((await cookies()).get(SESSION_COOKIE)?.value, process.env.SESSION_SECRET || "");
  if (!session) return problem(401, "Phiên đăng nhập đã hết hạn.");
  const path = (await params).path.join("/");
  if (!allowed(request.method, path)) return problem(404, "API không tồn tại.");
  const body = request.method === "GET" ? undefined : await request.text();
  if (body && Buffer.byteLength(body) > 16384) return problem(413, "Yêu cầu quá lớn.");
  try {
    const url = backendUrl(path); url.search = new URL(request.url).search;
    const upstream = await fetch(url, { method: request.method, headers: { Authorization: session.authorization, "Content-Type": "application/json" }, body, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15000) });
    return new Response(await upstream.text(), { status: upstream.status, headers: { "Content-Type": upstream.headers.get("content-type") || "application/json", "Cache-Control": "no-store" } });
  } catch { return problem(502, "Không kết nối được backend. Vui lòng thử lại."); }
}
export { proxy as GET, proxy as POST, proxy as PUT };
