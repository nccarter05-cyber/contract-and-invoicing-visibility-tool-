import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Prevent duplicate module loading from Windows drive letter casing (c:\ vs C:\)
    config.resolve = {
      ...config.resolve,
      symlinks: false,
    };
    return config;
  },
};

export default nextConfig;
