import { careerProxy, UUID_PATH } from "@/lib/server/career-proxy";
import { problem } from "@/lib/server/backend";
async function proxy(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/");
  const allowed = request.method === "GET" ? /^(profile|profile\/cv)$/.test(path) || new RegExp(`^jobs/${UUID_PATH}/application$`).test(path)
    : request.method === "PUT" ? path === "profile/cv" : request.method === "POST" && new RegExp(`^jobs/${UUID_PATH}/applications$`).test(path);
  if (!allowed) return problem(404, "Không tìm thấy API.");
  return careerProxy(request, "candidate", path, true);
}
export { proxy as GET, proxy as POST, proxy as PUT };
