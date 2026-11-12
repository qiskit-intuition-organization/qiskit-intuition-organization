export type IssuedCertificate = {
  id: string;
  name: string;
  course: string;
  issued_at: number;
};
export type SketchStroke = {
  d: string;
  tone: "ink" | "gold";
  width: number;
  dash?: string;
};
export const CERTIFICATE_NAME: string;
export const ISSUER: string;
export const NAME_RULES: string;
export function normalizeCertificateId(value: unknown): string | null;
/** Exactly one of `name` and `error` is set. */
export function checkPrintedName(value: unknown): {
  name?: string;
  error?: string;
};
export function firstName(name: string): string;
export function formatIssueDate(seconds: number): string;
export function verifyUrl(origin: string, id: string): string;
export function displayUrl(url: string): string;
export function linkedInUrl(input: {
  id: string;
  issuedAt: number;
  url: string;
}): string;
export function blochSketch(): SketchStroke[];
