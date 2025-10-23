import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: '/employee',
  assetPrefix: '/employee',
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  /* config options here */
  images: {
    domains: ["letsenhance.io"], // Allow external domains like letsenhance.io
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost", // Allow loading images from localhost using HTTPS
      },
      {
        protocol: "http",
        hostname: "localhost", // Allow loading images from localhost using HTTP
        port: "4000", // Specific port for localhost:4000
      },
      {
        protocol: "http",
        hostname: "192.168.110.253", // Allow loading images from this IP address
        port: "4000", // On port 4000
      }, 
      {
        protocol: "http",
        hostname: "**", // wildcard untuk mengizinkan semua host
      },
      {
        protocol: "https",
        hostname: "**", // https juga
      },
      {
        protocol: "http", 
        hostname: "procurement.rci"
      }
    ],
  },
};

export default nextConfig;
