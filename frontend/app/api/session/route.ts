import { cookies } from "next/headers";
import { backendIdentityUrl, backendLoginUrl, problem, sameOrigin } from "@/lib/server/backend";
import { readSession, sealSession, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/server/session";

export async function GET() {
  const session = readSession((await cookies()).get(SESSION_COOKIE)?.value, process.env.SESSION_SECRET || "");
  if (!session) return problem(401, "Vui lòng đăng nhập.");
  try {
    const result = await fetch(backendIdentityUrl(), { headers: { Authorization: session.authorization }, cache: "no-store", signal: AbortSignal.timeout(10000), redirect: "error" });
    if (!result.ok) return problem(result.status === 401 || result.status === 403 ? result.status : 502, "Phiên đăng nhập không còn hợp lệ.");
    return Response.json(await result.json(), { headers: { "Cache-Control": "no-store" } });
  } catch { return problem(502, "Không kết nối được backend."); }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return problem(403, "Nguồn yêu cầu không hợp lệ.");
  if ((process.env.SESSION_SECRET || "").length < 32) return problem(503, "Cần cấu hình SESSION_SECRET trên server frontend.");
  let body;
  try { body = await request.json(); } catch { return problem(400, "Dữ liệu đăng nhập không hợp lệ."); }
  if (!body || typeof body.username !== "string" || !/^[^\s@:]+@[^\s@:]+\.[^\s@:]+$/.test(body.username.trim()) || typeof body.password !== "string" || !body.password || body.username.length > 255 || body.password.length > 1024) return problem(400, "Nhập email và mật khẩu hợp lệ.");
  const username = body.username.trim().toLowerCase();
  try {
    const upstream = await fetch(backendLoginUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password: body.password }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
      redirect: "error"
    });
    if (!upstream.ok) return problem(upstream.status === 401 || upstream.status === 403 ? upstream.status : 502, "Email hoặc mật khẩu không đúng, hoặc tài khoản chưa được phân quyền.");
    const data = await upstream.json();
    const authorization = "Bearer " + data.token;
    const identity = data.user;
    const value = sealSession({ username, authorization, expiresAt: Date.now() + SESSION_SECONDS * 1000 }, process.env.SESSION_SECRET!);
    (await cookies()).set(SESSION_COOKIE, value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
    return Response.json(identity, { headers: { "Cache-Control": "no-store" } });
  } catch { return problem(502, "Không kết nối được backend. Kiểm tra BACKEND_URL và server Spring Boot."); }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return problem(403, "Nguồn yêu cầu không hợp lệ.");
  (await cookies()).delete(SESSION_COOKIE);
  return new Response(null, { status: 204 });
}
