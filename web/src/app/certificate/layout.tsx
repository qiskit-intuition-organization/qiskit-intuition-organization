import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your certificate: Qiskit Intuition",
  description: "Your Qiskit Intuition certificate of completion.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
