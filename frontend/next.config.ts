import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // basePath: '/procurement',
  // assetPrefix: '/procurement',
  images: {
    unoptimized: true, // untuk disable image optimizer sementara
  },
};

export default nextConfig;
