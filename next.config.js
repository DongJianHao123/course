
const withLess = require("next-with-less");
module.exports = withLess({
  basePath: '/course',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: 'dist',
  // assetPrefix: "./",
  experimental: {
    forceSwcTransforms: true,
  },
  transpilePackages: ['antd-mobile'],
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    console.log(buildId);
    return {
      "/id": { page: "/[id]" },
      "/myCourse": { page: "/myCourse" },
    };
  },
  images: { unoptimized: true },
  trailingSlash: true,
})
