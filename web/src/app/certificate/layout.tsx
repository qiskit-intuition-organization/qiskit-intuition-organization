import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your certificate: Quantum Intuition",
  description: "Your Quantum Intuition certificate of completion.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
