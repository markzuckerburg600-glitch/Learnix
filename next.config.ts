import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ["gsap", "@gsap/react"],
    optimizeServerReact: true,
    serverActions: {
      bodySizeLimit: "100mb"
    }
  },
  turbopack: {
    root: __dirname,
  },
  reactCompiler: true,

};

export default nextConfig;
