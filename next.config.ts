import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8188',
        pathname: '/view/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8188',
        pathname: '/view/**',
      },
    ],
  },
};

export default nextConfig;
