
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
    // For client-side bundles, prevent 'async_hooks' from being bundled.
    // This prevents errors when Node.js specific modules are inadvertently pulled in.
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        async_hooks: false, // Explicitly prevent bundling of async_hooks on the client
      };
    }
    return config;
  },
};

export default nextConfig;
