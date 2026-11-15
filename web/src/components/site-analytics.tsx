"use client";

import { Analytics } from "@vercel/analytics/next";
import { privateUrl } from "@/lib/analytics";

/** Cookie-free visitor counts (Vercel Web Analytics), without query strings. */
export default function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const url = privateUrl(event.url);
        return url ? { ...event, url } : null;
      }}
    />
  );
}
