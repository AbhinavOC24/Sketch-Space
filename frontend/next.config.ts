import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Allow cross-origin image sources (extend as needed)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "robohash.org",
      },
    ],
  },
};

export default nextConfig;
