/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API requests in dev so the frontend can call /api/* on the same origin
  // without hardcoding the backend port. Override BACKEND_URL to change target.
  async rewrites() {
    const backend = process.env.BACKEND_URL || "http://localhost:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
