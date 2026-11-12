import assert from "node:assert/strict";
import { test } from "node:test";
import {
  blochSketch,
  checkPrintedName,
  displayUrl,
  firstName,
  formatIssueDate,
  linkedInUrl,
  normalizeCertificateId,
  verifyUrl,
} from "../src/lib/certificate.js";

test("certificate IDs are normalised and checked against the unambiguous alphabet", () => {
  assert.equal(normalizeCertificateId(" qe-qi-7k2f-9xmb "), "QE-QI-7K2F-9XMB");
  assert.equal(normalizeCertificateId("QE-QI-7K2F-9XM0"), null); // 0 is not used
  assert.equal(normalizeCertificateId("QE-QI-7K2F-9XMI"), null); // nor I
  assert.equal(normalizeCertificateId("QE-QI-7K2F"), null);
  assert.equal(normalizeCertificateId("<b>QE-QI-7K2F-9XMB</b>"), null);
  assert.equal(normalizeCertificateId(undefined), null);
});

test("printed names are trimmed, spaces collapsed, accents and punctuation allowed", () => {
  assert.deepEqual(checkPrintedName("  Zoë   O’Brien-Smith Jr. "), {
    name: "Zoë O’Brien-Smith Jr.",
  });
  assert.deepEqual(checkPrintedName("D'Angelo"), { name: "D'Angelo" });
  assert.deepEqual(checkPrintedName("José Ñúñez"), { name: "José Ñúñez" });
  // Combining marks with no precomposed form, as the server accepts them.
  assert.deepEqual(checkPrintedName("ध्रुव सचदेवा"), { name: "ध्रुव सचदेवा" });
  assert.deepEqual(checkPrintedName("Adébáyọ̀"), { name: "Adébáyọ̀" });
});

test("combining marks must follow a letter and not pile up", () => {
  for (const bad of [
    "́Ada Lovelace",
    "Ada - ́Lovelace",
    "Ax́́́́da Lovelace",
  ])
    assert.ok(checkPrintedName(bad).error, `should refuse ${JSON.stringify(bad)}`);
});

test("printed names outside the rules are refused", () => {
  for (const bad of [
    "",
    " ",
    "A",
    "A.",
    "--",
    "<script>alert(1)</script>",
    "Alex 2",
    "Alex_Morgan",
    "Alex\nMorgan",
    "x".repeat(81),
  ])
    assert.ok(checkPrintedName(bad).error, `should refuse ${JSON.stringify(bad)}`);
  assert.deepEqual(checkPrintedName("x".repeat(80)), { name: "x".repeat(80) });
});

test("the greeting uses the first word of the printed name", () => {
  assert.equal(firstName("Alex Morgan"), "Alex");
  assert.equal(firstName("Zoë"), "Zoë");
});

test("issue dates are written in full, in UTC", () => {
  // 12 November 2026 23:30 UTC stays the 12th whatever the machine's zone.
  assert.equal(formatIssueDate(Date.UTC(2026, 10, 12, 23, 30) / 1000), "12 November 2026");
});

test("the verify URL follows the serving origin", () => {
  const url = verifyUrl("https://qiskit-intuition.vercel.app/", "QE-QI-7K2F-9XMB");
  assert.equal(url, "https://qiskit-intuition.vercel.app/verify/QE-QI-7K2F-9XMB");
  assert.equal(displayUrl(url), "qiskit-intuition.vercel.app/verify/QE-QI-7K2F-9XMB");
  assert.equal(
    verifyUrl("http://localhost:3000", "QE-QI-7K2F-9XMB"),
    "http://localhost:3000/verify/QE-QI-7K2F-9XMB",
  );
});

test("the LinkedIn link pre-fills the certification", () => {
  const url = new URL(
    linkedInUrl({
      id: "QE-QI-7K2F-9XMB",
      issuedAt: Date.UTC(2026, 10, 12) / 1000,
      url: "https://learn.thequantumeconomy.com/verify/QE-QI-7K2F-9XMB",
    }),
  );
  assert.equal(url.origin + url.pathname, "https://www.linkedin.com/profile/add");
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    startTask: "CERTIFICATION_NAME",
    name: "Quantum Intuition, certificate of completion",
    organizationName: "The Quantum Economy",
    issueYear: "2026",
    issueMonth: "11",
    certUrl: "https://learn.thequantumeconomy.com/verify/QE-QI-7K2F-9XMB",
    certId: "QE-QI-7K2F-9XMB",
  });
});

test("the Bloch sphere sketch is the same on every certificate", () => {
  const first = blochSketch();
  assert.deepEqual(blochSketch(), first);
  assert.equal(first.length, 14); // seven strokes, each drawn twice
  assert.ok(first.every((stroke) => /^M[\d.,L-]+$/.test(stroke.d)));
  assert.deepEqual(new Set(first.map((stroke) => stroke.tone)), new Set(["ink", "gold"]));
});
