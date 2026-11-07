import { careerProxy, UUID_PATH } from "@/lib/server/career-proxy";
import { problem } from "@/lib/server/backend";
export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/");
  if (!/^(jobs|jobs\/filters)$/.test(path) && !new RegExp(`^jobs/${UUID_PATH}$`).test(path)) return problem(404, "Không tìm thấy API.");
  return careerProxy(request, "public", path, false);
}
