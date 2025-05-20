
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
  webpack: (config, { isServer, webpack }) => { // Added 'webpack' from the arguments
    // For client-side bundles, prevent 'async_hooks' from being bundled.
    // This prevents errors when Node.js specific modules are inadvertently pulled in.
    if (!isServer) {
      // Attempt 1: Alias 'async_hooks' to an empty module.
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'async_hooks': require.resolve('./src/lib/empty-module.js'),
      };

      // Attempt 2: Using 'externals' to treat 'async_hooks' as an external module
      // that resolves to an empty object on the client-side.
      config.externals = {
        ...(config.externals || {}),
        'async_hooks': 'var {}',
      };

      // Attempt 3: Using IgnorePlugin
      // This tells webpack to ignore any `require` or `import` of 'async_hooks'.
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^async_hooks$/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
