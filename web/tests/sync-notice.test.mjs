import assert from "node:assert/strict";
import { test } from "node:test";
import { shouldShowSyncNotice } from "../src/lib/notebook-sync.js";

const quiet = { status: "saved", guestAvailable: false, cacheError: false };

test("a signed-in learner with guest work sees the import offer", () => {
  for (const status of ["saved", "saving", "pending"]) {
    assert.equal(
      shouldShowSyncNotice({ ...quiet, status, guestAvailable: true }),
      true,
      status,
    );
  }
});
test("a missing browser backup is always shown", () => {
  assert.equal(shouldShowSyncNotice({ ...quiet, cacheError: true }), true);
});
test("quiet states with nothing to offer stay hidden", () => {
  for (const status of ["guest", "saved", "saving", "pending"]) {
    assert.equal(shouldShowSyncNotice({ ...quiet, status }), false, status);
  }
});
test("sync problems and loading are always shown", () => {
  for (const status of ["loading", "offline", "conflict"]) {
    assert.equal(shouldShowSyncNotice({ ...quiet, status }), true, status);
  }
});
