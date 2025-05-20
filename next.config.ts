
import type {NextConfig} from 'next';
import path from 'path'; // Import the path module

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
        // Point to the empty module using an absolute path
        // This tells webpack to use an empty module for 'async_hooks' on the client-side
        async_hooks: path.join(__dirname, 'src/lib/empty-module.js'),
      };
    }
    return config;
  },
};

export default nextConfig;
