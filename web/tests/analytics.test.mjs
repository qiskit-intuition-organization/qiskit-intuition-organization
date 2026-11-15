import assert from "node:assert/strict";
import { test } from "node:test";
import { privateUrl } from "../src/lib/analytics.js";

const site = "https://learn.thequantumeconomy.com";

test("password-reset tokens and other query values never leave the browser", () => {
  assert.equal(privateUrl(`${site}/reset-password?token=abc123secret`), `${site}/reset-password`);
  assert.equal(privateUrl(`${site}/login?next=/certificate&email=a@b.c`), `${site}/login`);
});

test("the lesson being read is kept, so we can see which lessons are opened", () => {
  assert.equal(privateUrl(`${site}/?lesson=entanglement&utm_source=x`), `${site}/?lesson=entanglement`);
});

test("odd lesson values and hash routes are dropped", () => {
  assert.equal(privateUrl(`${site}/?lesson=<script>`), `${site}/`);
  assert.equal(privateUrl(`${site}/#signup`), `${site}/`);
});

test("unparseable addresses are not sent at all", () => {
  assert.equal(privateUrl("not a url"), null);
});
