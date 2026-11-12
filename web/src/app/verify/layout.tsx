import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificate check: Quantum Intuition",
  description: "Check a Quantum Intuition certificate of completion.",
  // Certificates carry learners' names: anyone with the link can check one,
  // but search engines should not list them.
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
