
const withLess = require("next-with-less");
module.exports = withLess({
  basePath: '/course',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: 'dist',
  // assetPrefix: './',
  experimental: {
    forceSwcTransforms: true,
  },
  transpilePackages: ['antd-mobile'],
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/course',
  //       permanent: true,
  //     },
  //   ];
  // },

})
