/** @type {import('next').NextConfig} */
interface WebpackConfig {
  resolve: {
    fallback: {
      [key: string]: false;
    };
  };
}

interface WebpackOptions {
  isServer: boolean;
}

interface NextConfig {
  reactStrictMode: boolean;
  webpack: (config: WebpackConfig, options: WebpackOptions) => WebpackConfig;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
        http: false,
        https: false,
        zlib: false,
        querystring: false,
        util: false,
        url: false,
        assert: false,
        constants: false,
        tls: false,
        net: false,
        child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;