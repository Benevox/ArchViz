
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // For client-side bundles, provide a mock for 'async_hooks'
    // This prevents errors when Node.js specific modules are inadvertently pulled in.
    if (!isServer) {
      config.resolve = config.resolve || {}; // Ensure resolve object exists
      config.resolve.fallback = config.resolve.fallback || {}; // Ensure fallback object exists
      
      // Provide a path to an empty module for async_hooks
      // The path is relative to the project root (context for webpack).
      config.resolve.fallback.async_hooks = './src/lib/empty-module.js';
    }
    return config;
  },
};

export default nextConfig;
