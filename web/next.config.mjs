/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  turbopack: { root: process.cwd() },
  transpilePackages: ["three"],
  // Only the app itself and The Quantum Economy's site may embed these pages.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://thequantumeconomy.com https://*.thequantumeconomy.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
