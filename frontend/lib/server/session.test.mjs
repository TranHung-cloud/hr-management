import { test } from "node:test";
import assert from "node:assert/strict";
import { sealSession, readSession } from "./session.ts";
import { sameOrigin } from "./backend.ts";

const secret = "test-only-session-secret-with-at-least-32-characters";
test("session remains readable until expiry but never contains plaintext credentials", () => {
  const original = { username: "admin", authorization: "Basic test-secret", expiresAt: Date.now() + 60000 };
  const token = sealSession(original, secret);
  assert.deepEqual(readSession(token, secret), original);
  assert.ok(!token.includes(original.authorization));
  assert.ok(!Buffer.from(token, "base64url").toString().includes(original.authorization));
});
test("tampered, expired and wrong-key sessions cannot authenticate", () => {
  const session = { username: "admin", authorization: "Basic secret", expiresAt: Date.now() + 60000 };
  const token = sealSession(session, secret);
  const tampered = Buffer.from(token, "base64url"); tampered[30] ^= 1;
  assert.equal(readSession(tampered.toString("base64url"), secret), null);
  assert.equal(readSession(token, secret + "different"), null);
  assert.equal(readSession(sealSession({ ...session, expiresAt: Date.now() - 1 }, secret), secret), null);
  assert.equal(readSession(undefined, secret), null);
  assert.throws(() => sealSession(session, "short"));
});
test("write requests must originate from the actual request host", () => {
  assert.equal(sameOrigin(new Request("http://localhost:3000/api/session", { headers: { Host: "127.0.0.1:3000", Origin: "http://127.0.0.1:3000" } })), true);
  assert.equal(sameOrigin(new Request("http://localhost:3000/api/session", { headers: { Host: "localhost:3000", Origin: "https://outside.example" } })), false);
  assert.equal(sameOrigin(new Request("http://localhost:3000/api/session")), false);
});
