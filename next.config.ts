
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
      // Using 'externals' to treat 'async_hooks' as an external module
      // that resolves to an empty object on the client-side.
      // This effectively replaces require('async_hooks') with {}.
      config.externals = {
        ...(config.externals || {}),
        'async_hooks': 'var {}',
      };

      // The previous 'resolve.fallback' approach:
      // config.resolve = config.resolve || {}; 
      // config.resolve.fallback = config.resolve.fallback || {}; 
      // config.resolve.fallback.async_hooks = './src/lib/empty-module.js';
    }
    return config;
  },
};

export default nextConfig;
