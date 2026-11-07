import { test } from "node:test";
import assert from "node:assert/strict";
import { isStaff, loginDestination, safeCandidateReturn } from "./auth-routing.ts";
const candidate = { accountId: "test", username: "candidate@example.test", displayName: "Candidate", roles: ["CANDIDATE"] };
const job = "/jobs/12345678-1234-1234-1234-123456789abc";
test("candidate returns to the selected job while every staff role goes to shared admin", () => {
  assert.equal(loginDestination(candidate, job), job);
  for (const role of ["HR_MANAGER", "RECRUITER", "INTERVIEWER"]) {
    const user = { ...candidate, roles: [role] };
    assert.equal(isStaff(user), true); assert.equal(loginDestination(user, job), "/admin/dashboard");
  }
  assert.equal(isStaff(candidate), false);
});
test("return targets cannot redirect externally or take a candidate into admin", () => {
  for (const value of ["https://evil.test", "//evil.test", "/\\evil.test", "/admin/dashboard", "/jobs/../../admin", "javascript:alert(1)", ""]) assert.equal(safeCandidateReturn(value), "/jobs");
  assert.equal(safeCandidateReturn("/candidate/profile"), "/candidate/profile");
  assert.equal(safeCandidateReturn("/jobs?query=Java"), "/jobs?query=Java");
});
