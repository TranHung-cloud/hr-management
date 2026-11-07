import { careerProxy } from "@/lib/server/career-proxy";
import { problem } from "@/lib/server/backend";
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) return problem(400, "Đăng ký cần thông tin hồ sơ và CV PDF.");
  return careerProxy(request, "auth", "register-with-cv", false);
}
