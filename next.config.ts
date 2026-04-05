import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ["",],
    optimizeServerReact: true,
  },
  turbopack: {
    root: __dirname,
  },

};

export default nextConfig;
