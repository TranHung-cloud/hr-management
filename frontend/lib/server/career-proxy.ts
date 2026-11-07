import { cookies } from "next/headers";
import { backendUrl, problem, sameOrigin } from "./backend";
import { readSession, SESSION_COOKIE } from "./session";

export const UUID_PATH = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
async function limitedBody(request: Request, limit: number) {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array(0);
  const chunks: Uint8Array[] = []; let total = 0;
  while (true) {
    const item = await reader.read(); if (item.done) break;
    total += item.value.byteLength;
    if (total > limit) { await reader.cancel(); throw new Error("too-large"); }
    chunks.push(item.value);
  }
  const body = new Uint8Array(total); let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return body;
}
export async function careerProxy(request: Request, namespace: "public" | "candidate" | "auth", path: string, authenticated: boolean) {
  if (request.method !== "GET" && !sameOrigin(request)) return problem(403, "Nguồn yêu cầu không hợp lệ.");
  const headers = new Headers();
  if (authenticated) {
    const session = readSession((await cookies()).get(SESSION_COOKIE)?.value, process.env.SESSION_SECRET || "");
    if (!session) return problem(401, "Vui lòng đăng nhập.");
    headers.set("Authorization", session.authorization);
  }
  try {
    let body: BodyInit | undefined;
    if (request.method !== "GET") {
      const multipart = request.headers.get("content-type")?.startsWith("multipart/form-data");
      const bytes = await limitedBody(request, multipart ? 6 * 1024 * 1024 : 65536);
      if (multipart) {
        const form = await new Response(bytes, { headers: { "Content-Type": request.headers.get("content-type")! } }).formData();
        const file = form.get("cv");
        if (!(file instanceof File) || !file.size) return problem(400, "Vui lòng chọn CV PDF.");
        if (file.size > 5 * 1024 * 1024) return problem(413, "CV tối đa 5 MB.");
        body = form;
      } else {
        headers.set("Content-Type", "application/json"); body = bytes;
      }
    }
    const url = new URL(`/api/${namespace}/${path}`, backendUrl(""));
    if (request.method === "GET") url.search = new URL(request.url).search;
    const response = await fetch(url, { method: request.method, headers, body, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(20000) });
    const outgoing = new Headers({ "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" });
    outgoing.set("Content-Type", response.headers.get("content-type") || "application/json");
    if (response.headers.has("content-disposition")) outgoing.set("Content-Disposition", response.headers.get("content-disposition")!);
    return new Response(response.body, { status: response.status, headers: outgoing });
  } catch (error) {
    return error instanceof Error && error.message === "too-large" ? problem(413, "Yêu cầu quá lớn. CV tối đa 5 MB.") : problem(502, "Không kết nối được hệ thống tuyển dụng. Vui lòng thử lại.");
  }
}
