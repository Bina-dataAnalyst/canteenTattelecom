import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Fixes "inferred workspace root" warning when extra lockfiles
    // exist above the project directory.
    root: __dirname,
  },
};

export default nextConfig;
