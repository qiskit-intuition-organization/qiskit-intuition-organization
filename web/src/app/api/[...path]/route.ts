import { readApiResponse } from "@/lib/api-response";

// Only these backend operations are exposed; the upstream URL stays server-side.
const paths = new Set([
  "health",
  "execute",
  "simulate",
  "export",
  "agent/tutor",
  "course",
  "course/exercise",
  "course/reflect",
  "course/routing",
  "auth/signup",
  "auth/login",
  "auth/logout",
  "auth/me",
  "auth/notebook",
  "auth/profile",
  "auth/avatar",
  "auth/change-password",
  "auth/forgot-password",
  "auth/reset-password",
  "certificate",
  "certificate/status",
]);
// Public certificate lookups; the backend decides whether the ID exists.
const certificateLookup = /^certificate\/verify\/[A-Za-z0-9-]{1,40}$/;
export const runtime = "nodejs";

async function proxy(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const route = path.join("/");
  const lookup = certificateLookup.test(route);
  if (!paths.has(route) && !lookup)
    return Response.json({ detail: "Not found" }, { status: 404 });
  // These routes act for the signed-in learner, so they carry the session cookie.
  const authentication =
    route.startsWith("auth/") ||
    route === "certificate" ||
    route === "certificate/status" ||
    route === "course/exercise";
  if (authentication && request.method === "POST") {
    const origin = request.headers.get("origin");
    // Next's internal URL can use localhost behind a reverse proxy. The browser
    // origin must match the original Host and scheme, not that internal URL.
    const protocol =
      request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ||
      new URL(request.url).protocol.replace(":", "");
    const host = request.headers.get("host") || new URL(request.url).host;
    const expectedOrigin = `${protocol}://${host}`;
    if (
      (origin && origin !== expectedOrigin) ||
      request.headers.get("sec-fetch-site") === "cross-site"
    ) {
      return Response.json(
        { detail: "This request did not come from the application." },
        { status: 403 },
      );
    }
  }
  const readOnly =
    route === "health" ||
    route === "course" ||
    route === "auth/me" ||
    route === "certificate/status" ||
    lookup ||
    (["auth/avatar", "auth/notebook"].includes(route) &&
      request.method === "GET");
  if (request.method !== (readOnly ? "GET" : "POST")) {
    return Response.json({ detail: "Method not allowed" }, { status: 405 });
  }
  const body = request.method === "POST" ? await request.text() : undefined;
  if (
    body &&
    new TextEncoder().encode(body).length >
      (route === "auth/avatar"
        ? 3000000
        : route === "auth/notebook"
          ? 1100000
          : 100000)
  ) {
    return Response.json({ detail: "Request too large" }, { status: 413 });
  }
  try {
    // Browser requests still go through this proxy using the deployed backend URL.
    const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (!configured && process.env.VERCEL === "1") {
      return Response.json(
        {
          detail: "The quantum service is not configured for this deployment.",
        },
        { status: 503 },
      );
    }
    const base = (configured || "http://127.0.0.1:8000").replace(/\/$/, "");
    const target = new URL(base);
    if (
      !["http:", "https:"].includes(target.protocol) ||
      target.origin === new URL(request.url).origin
    ) {
      return Response.json(
        { detail: "The quantum service configuration is invalid." },
        { status: 503 },
      );
    }
    const headers = new Headers({ "Content-Type": "application/json" });
    if (authentication) {
      // Forward only the session cookie, never arbitrary browser cookies or bearer credentials.
      const session = request.headers
        .get("cookie")
        ?.split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith("qi_session="));
      if (session) headers.set("Cookie", session);
      if (request.headers.get("origin"))
        headers.set("Origin", request.headers.get("origin")!);
    }
    const upstream = await fetch(`${base}/${route}`, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(60000),
    });
    const responseHeaders = new Headers({
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    });
    if (authentication) {
      for (const cookie of upstream.headers.getSetCookie())
        responseHeaders.append("Set-Cookie", cookie);
    }
    if (route === "auth/avatar" && request.method === "GET" && upstream.ok) {
      responseHeaders.set("Content-Type", "image/jpeg");
      responseHeaders.set("X-Content-Type-Options", "nosniff");
      return new Response(await upstream.arrayBuffer(), {
        headers: responseHeaders,
      });
    }
    if (
      (route === "auth/notebook" && upstream.status === 409) ||
      (route === "certificate" && upstream.status === 409) ||
      (lookup && upstream.status === 404)
    ) {
      // Keep the notebook snapshot for a merge, the missing lessons, and the
      // clean "not found" answer for a certificate lookup.
      return Response.json(await upstream.json(), {
        status: upstream.status,
        headers: responseHeaders,
      });
    }
    try {
      const data = await readApiResponse(upstream);
      return Response.json(data, {
        status: upstream.status,
        headers: responseHeaders,
      });
    } catch (error) {
      return Response.json(
        {
          detail:
            error instanceof Error
              ? error.message
              : "The quantum service request failed.",
        },
        {
          status: upstream.ok ? 502 : upstream.status,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
  } catch {
    return Response.json(
      {
        detail: "The Qiskit service is unavailable. Please try again shortly.",
      },
      { status: 503 },
    );
  }
}

export { proxy as GET, proxy as POST };
