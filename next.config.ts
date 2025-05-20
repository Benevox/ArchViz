
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
      // Attempt 1: Alias 'async_hooks' to an empty module.
      // This is another way to prevent it from being bundled on the client.
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        // Ensure the path to your empty module is correct from the project root
        'async_hooks': require.resolve('./src/lib/empty-module.js'),
      };

      // Attempt 2: Using 'externals' to treat 'async_hooks' as an external module
      // that resolves to an empty object on the client-side.
      // This effectively replaces require('async_hooks') with {}.
      config.externals = {
        ...(config.externals || {}),
        'async_hooks': 'var {}',
      };
    }
    return config;
  },
};

export default nextConfig;
