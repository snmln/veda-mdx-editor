const path = require('path');

module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/public/:path*',
        destination: '/:path*',
      },
    ];
  },
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // The following aliases are added to ensure that both the Next.js instance and
      // the `veda-ui` library use the same instances of Jotai for state management.
      // This resolves the issue of "Detected multiple Jotai instances," which can cause
      // unexpected behavior due to multiple instances of Jotai's default store.
      // For more details, refer to the GitHub discussion:
      // https://github.com/pmndrs/jotai/discussions/2044
      jotai: path.resolve(__dirname, 'node_modules', 'jotai'),
      'jotai-devtools': path.resolve(
        __dirname,
        'node_modules',
        'jotai-devtools',
      ),
      'jotai-location': path.resolve(
        __dirname,
        'node_modules',
        'jotai-location',
      ),
      'jotai-optics': path.resolve(__dirname, 'node_modules', 'jotai-optics'),
    };
    
    // Provide fallbacks for Node.js core modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    // Fix issues with next-mdx-remote
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback.fs = false;
    }
    
    // Add next-mdx-remote to transpiled modules
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /next-mdx-remote/,
      use: 'next-swc-loader',
    });
    
    return config;
  },
  // Exclude next-mdx-remote from the server-side bundle
  experimental: {
    serverComponentsExternalPackages: ['next-mdx-remote'],
  },
  sassOptions: {
    includePaths: [
      'node_modules/@uswds/uswds',
      'node_modules/@uswds/uswds/dist',
      'node_modules/@uswds/uswds/packages',
    ]
  }
};
