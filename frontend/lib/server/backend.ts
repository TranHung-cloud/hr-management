export function backendUrl(path: string) {
  const base = new URL(process.env.BACKEND_URL || "http://127.0.0.1:8080");
  if (!["http:", "https:"].includes(base.protocol)) throw new Error("Invalid BACKEND_URL");
  return new URL(`/api/admin/${path}`, base);
}
export function backendIdentityUrl() { return new URL("/api/auth/me", backendUrl("")); }
export function backendLoginUrl() { return new URL("/api/auth/login", backendUrl("")); }
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    return ["http:", "https:"].includes(parsed.protocol) && parsed.host === request.headers.get("host");
  } catch { return false; }
}
export function problem(status: number, detail: string) {
  return Response.json({ status, detail }, { status, headers: { "Cache-Control": "no-store" } });
}
