import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export const SESSION_COOKIE = "recruithr_session";
export const SESSION_SECONDS = 8 * 60 * 60;
interface Session { username: string; authorization: string; expiresAt: number }
function key(secret: string) {
  if (secret.length < 32) throw new Error("SESSION_SECRET phải có ít nhất 32 ký tự.");
  return createHash("sha256").update(secret).digest();
}
export function sealSession(session: Session, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(secret), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}
export function readSession(value: string | undefined, secret: string): Session | null {
  if (!value || !secret) return null;
  try {
    const bytes = Buffer.from(value, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key(secret), bytes.subarray(0, 12));
    decipher.setAuthTag(bytes.subarray(12, 28));
    const session: Session = JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString("utf8"));
    if (typeof session.username !== "string" || typeof session.authorization !== "string" || !session.authorization.startsWith("Bearer ") || !Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) return null;
    return session;
  } catch { return null; }
}
