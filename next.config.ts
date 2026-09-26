import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return [
      // `next start` only picks up files under public/ that existed at boot,
      // so files uploaded at runtime 404 (and get negatively cached) until a
      // restart. Route these through a real dynamic handler instead — see
      // app/api/uploads/[...path]/route.ts.
      { source: '/uploads/:path*', destination: '/api/uploads/:path*' },
    ];
  },
};

export default nextConfig;
