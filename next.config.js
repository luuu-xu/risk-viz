/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       fs: false,
  //     };
  //   }

  //   return config;
  // },
  // reactStrictMode: false,
}

module.exports = nextConfig
