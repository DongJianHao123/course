
const withLess = require("next-with-less");
module.exports = withLess({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: 'dist',
  assetPrefix: '/',
  experimental: {
    forceSwcTransforms: true,
  },
  transpilePackages: ['antd-mobile'],
})
