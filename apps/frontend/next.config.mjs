/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: 'msw/browser', alias: false });
      } else {
        config.resolve.alias['msw/browser'] = false;
      }
    } else {
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: 'msw/node', alias: false });
      } else {
        config.resolve.alias['msw/node'] = false;
      }
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: 'inter-persona.s3.ap-northeast-2.amazonaws.com',
      },
    ],
    loader: 'custom',
    loaderFile: './src/_libs/utils/imageLoader.ts',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/user',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  transpilePackages: [
    // "@repo/ui",
    // '@repo/store',
  ],
};

export default nextConfig;
